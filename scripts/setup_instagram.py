"""
setup_instagram.py
==================
Script auxiliar para configurar la autenticación de Instagram.

INSTRUCCIONES PARA OBTENER EL sessionid:
-----------------------------------------
1. Abre tu navegador (Chrome/Edge/Firefox) y entra a https://www.instagram.com
2. Haz login con tu cuenta (la que sigue a @lofi_sat o simplemente cualquier cuenta tuya)
3. Presiona F12 para abrir las DevTools
4. Ve a la pestaña "Application" (Chrome/Edge) o "Storage" (Firefox)
5. En el panel izquierdo: Cookies → https://www.instagram.com
6. Busca la cookie llamada "sessionid"
7. Copia su valor completo (es una cadena larga de caracteres)

Luego ejecuta este script y pega el valor cuando te lo pida.
"""

import os
from pathlib import Path

SESSION_FILE = Path(__file__).parent.parent / "instagram_session.txt"

def main():
    print("=" * 60)
    print("  Configuración de sesión de Instagram para @lofi_sat")
    print("=" * 60)
    print()
    print("PASO 1: Ve a https://www.instagram.com y haz login.")
    print("PASO 2: F12 → Application → Cookies → instagram.com")
    print("PASO 3: Copia el valor de la cookie 'sessionid'")
    print()
    
    sessionid = input("Pega aquí tu sessionid de Instagram: ").strip()
    
    if not sessionid:
        print("❌ No ingresaste ningún valor. Abortando.")
        return
    
    # Guardar en archivo de configuración local
    SESSION_FILE.write_text(sessionid, encoding='utf-8')
    print()
    print(f"✅ sessionid guardado en: {SESSION_FILE}")
    print()
    print("Ahora puedes ejecutar:")
    print("  python scripts/scrape_insta.py")
    print()
    print("NOTA: Este archivo está en .gitignore para proteger tu privacidad.")

if __name__ == "__main__":
    main()
