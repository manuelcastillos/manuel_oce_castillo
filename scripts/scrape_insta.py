"""
scrape_insta.py
===============
Extrae los ultimos posts de @lofi_sat en Instagram usando la API privada
con sesion autenticada (sessionid cookie del navegador).

CONFIGURACION INICIAL:
    python scripts/setup_instagram.py

EJECUCION:
    python scripts/scrape_insta.py
"""

import io
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

# Fix encoding Windows
if sys.stdout and hasattr(sys.stdout, 'encoding') and sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import hashlib
import requests

# -- Configuracion --
TARGET_PROFILE = "lofi_sat"
MAX_POSTS      = 12
OUTPUT_FILE    = Path(__file__).parent.parent / "data" / "instagram_news.json"
SESSION_FILE   = Path(__file__).parent.parent / "instagram_session.txt"


def load_session_id() -> str:
    if SESSION_FILE.exists():
        sid = SESSION_FILE.read_text(encoding="utf-8").strip()
        if sid:
            return unquote(sid)
    print("ERROR: No se encontro 'instagram_session.txt'.")
    print("   Ejecuta primero: python scripts/setup_instagram.py")
    sys.exit(1)


def create_session(session_id: str) -> requests.Session:
    """Crea una sesion HTTP autenticada que simula la app movil de Instagram."""
    s = requests.Session()

    # Extraer user_id del sessionid (formato: userid:hash:...)
    ds_user_id = session_id.split(":")[0] if ":" in session_id else ""

    s.cookies.set("sessionid", session_id, domain=".instagram.com")
    if ds_user_id:
        s.cookies.set("ds_user_id", ds_user_id, domain=".instagram.com")

    s.headers.update({
        "User-Agent": (
            "Instagram 317.0.0.34.109 Android (33/13; 420dpi; 1080x2340; "
            "samsung; SM-G991B; o1s; exynos2100; es_CL; 562530828)"
        ),
        "X-IG-App-ID": "936619743392459",
        "X-IG-Connection-Type": "WIFI",
        "Accept": "*/*",
        "Accept-Language": "es-CL,es;q=0.9",
        "X-CSRFToken": "missing",
    })
    return s


def get_user_id_private(session: requests.Session, username: str) -> str | None:
    """Busca el user_id usando el endpoint de busqueda privado."""
    url = f"https://i.instagram.com/api/v1/users/web_profile_info/?username={username}"
    headers_override = {"User-Agent": session.headers.get("User-Agent", "")}

    print(f"   Buscando user_id de @{username} (API privada)...")
    try:
        resp = session.get(url, headers=headers_override, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            user = data.get("data", {}).get("user", {})
            uid = user.get("id")
            if uid:
                print(f"   Encontrado: user_id={uid}")
                return uid
    except Exception:
        pass

    # Fallback: search endpoint 
    print("   Fallback: usando endpoint de busqueda...")
    try:
        search_url = f"https://i.instagram.com/api/v1/users/search/?q={username}"
        resp = session.get(search_url, timeout=15)
        if resp.status_code == 200:
            users = resp.json().get("users", [])
            for u in users:
                if u.get("username", "").lower() == username.lower():
                    uid = str(u.get("pk", ""))
                    if uid:
                        print(f"   Encontrado via busqueda: user_id={uid}")
                        return uid
    except Exception:
        pass

    # Fallback 2: info endpoint directo
    print("   Fallback 2: endpoint /users/...")
    try:
        info_url = f"https://i.instagram.com/api/v1/users/{username}/usernameinfo/"
        resp = session.get(info_url, timeout=15)
        if resp.status_code == 200:
            user = resp.json().get("user", {})
            uid = str(user.get("pk", ""))
            if uid:
                print(f"   Encontrado via usernameinfo: user_id={uid}")
                return uid
    except Exception:
        pass

    return None


def get_posts(session: requests.Session, user_id: str, count: int) -> list:
    """Obtiene posts del feed del usuario via API privada (i.instagram.com)."""
    url = f"https://i.instagram.com/api/v1/feed/user/{user_id}/?count={count}"

    print(f"   Descargando feed (max {count} posts)...")
    try:
        resp = session.get(url, timeout=20)
    except Exception as e:
        print(f"   ERROR de conexion: {e}")
        return []

    if resp.status_code == 429:
        print(f"   Rate limit (429). Esperando 30 segundos y reintentando...")
        time.sleep(30)
        try:
            resp = session.get(url, timeout=20)
        except Exception as e:
            print(f"   ERROR tras reintento: {e}")
            return []

    if resp.status_code != 200:
        print(f"   ERROR HTTP {resp.status_code}")
        try:
            print(f"   Detalle: {resp.text[:300]}")
        except Exception:
            pass
        return []

    data = resp.json()
    items = data.get("items", [])
    print(f"   Recibidos {len(items)} items del feed")

    posts = []
    for item in items[:count]:
        shortcode = item.get("code", "")
        timestamp = item.get("taken_at", 0)

        # Caption
        caption = ""
        cap_obj = item.get("caption")
        if cap_obj and isinstance(cap_obj, dict):
            caption = cap_obj.get("text", "")

        # Imagen: buscar la mejor version
        img_url = ""
        image_versions = item.get("image_versions2", {}).get("candidates", [])
        if image_versions:
            # Primera version suele ser la mas grande
            img_url = image_versions[0].get("url", "")
        
        # Para carousel/album, tomar primer item
        if not img_url:
            carousel = item.get("carousel_media", [])
            if carousel:
                cv = carousel[0].get("image_versions2", {}).get("candidates", [])
                if cv:
                    img_url = cv[0].get("url", "")

        if shortcode:
            iso_date = datetime.fromtimestamp(
                timestamp, tz=timezone.utc
            ).strftime("%Y-%m-%dT%H:%M:%S.000Z")
            posts.append({
                "permalink": f"https://www.instagram.com/p/{shortcode}/",
                "thumbnail": img_url,
                "caption":   caption,
                "timestamp": iso_date,
            })

    return posts


def download_image(url: str, filename: str) -> bool:
    """Descarga una imagen de Instagram a la carpeta local."""
    save_path = Path(__file__).parent.parent / "images" / "news" / filename
    save_path.parent.mkdir(parents=True, exist_ok=True)
    
    if save_path.exists():
        return True # Ya la tenemos

    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            save_path.write_bytes(resp.content)
            return True
    except Exception as e:
        print(f"      Error descargando imagen: {e}")
    return False

def scrape_lofisat_news() -> bool:
    print("=" * 55)
    print(f"  Scraping Instagram @{TARGET_PROFILE}")
    print("=" * 55)

    session_id = load_session_id()
    print(f"   sessionid cargado ({len(session_id)} chars)")

    session = create_session(session_id)

    # Obtener user_id
    user_id = get_user_id_private(session, TARGET_PROFILE)
    if not user_id:
        print("ERROR: No se pudo obtener el user_id.")
        print("   Verifica tu sessionid o espera unos minutos si hay rate-limit.")
        return False

    time.sleep(2)

    # Obtener posts
    posts = get_posts(session, user_id, MAX_POSTS)
    if not posts:
        print("ERROR: No se pudieron extraer posts.")
        return False

    # --- DESCARGAR IMÁGENES LOCALMENTE ---
    print("   Descargando imágenes a images/news/...")
    for p in posts:
        # Crear un nombre único basado en el permalink
        img_id = hashlib.md5(p['permalink'].encode()).hexdigest()
        filename = f"ig_{img_id}.jpg"
        
        if download_image(p['thumbnail'], filename):
            # Cambiamos la URL remota por la ruta local
            p['thumbnail'] = f"images/news/{filename}"
        else:
            # Fallback al logo si falla la descarga
            p['thumbnail'] = "images/logo_lofisat.jpg"

    # Ordenar por fecha descendente
    posts.sort(key=lambda x: x["timestamp"], reverse=True)

    # Guardar JSON de Noticias
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    # --- Actualizar Field Work ---
    field_file = OUTPUT_FILE.parent / "field_posts.json"
    include_keywords = [
        'terreno', 'campaña', 'antártica', 'oceanografía', 'muestreo',
        'expedición', 'buque', 'embarque', 'mediciones', 'lanzamiento',
        'instrumento', 'malla', 'estación', 'fiordos', 'patagonia',
        'seals', 'falkor', 'lofisat', 'costar', 'ciencia'
    ]
    
    field_posts = []
    for p in posts:
        text = p['caption'].lower()
        if any(kw in text for kw in include_keywords):
            field_posts.append({
                "id": hashlib.md5(p['permalink'].encode()).hexdigest(),
                "thumbnail": p['thumbnail'],
                "permalink": p['permalink'],
                "caption": p['caption']
            })
    
    with open(field_file, "w", encoding="utf-8") as f:
        json.dump(field_posts[:5], f, ensure_ascii=False, indent=2)

    print()
    print(f"OK! Se actualizaron Noticias ({len(posts)}) e imágenes locales.")
    return True


if __name__ == "__main__":
    success = scrape_lofisat_news()
    sys.exit(0 if success else 1)
