import requests
from bs4 import BeautifulSoup
import json
import os

def update_oceanography_news():
    url = "https://www.sciencedaily.com/news/earth_climate/oceanography/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    print(f"Conectando con ScienceDaily...")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # ScienceDaily suele listar noticias en divs con id 'headlines' o clases similares
        # Basado en la estructura común de ScienceDaily:
        news_items = []
        
        # Buscamos los links de noticias principales
        # Nota: La estructura puede variar, pero usualmente están en h3 o divs específicos
        for link in soup.find_all('a', href=True):
            href = link['href']
            title = link.get_text().strip()
            
            # Filtramos solo los releases reales y evitamos duplicados o links cortos
            if "/releases/" in href and len(title) > 20:
                full_url = "https://www.sciencedaily.com" + href if href.startswith("/") else href
                
                # Evitar duplicados
                if not any(item['url'] == full_url for item in news_items):
                    news_items.append({
                        "title": title,
                        "url": full_url
                    })
            
            if len(news_items) >= 10:
                break

        if not news_items:
            print("No se pudieron encontrar noticias. Es posible que la estructura de la página haya cambiado.")
            return

        # Ruta al archivo JSON
        json_path = os.path.join(os.path.dirname(__file__), "..", "data", "news.json")
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(news_items, f, ensure_ascii=False, indent=4)
            
        print(f"¡Éxito! Se han actualizado {len(news_items)} noticias en data/news.json")

    except Exception as e:
        print(f"Error al actualizar las noticias: {e}")

if __name__ == "__main__":
    update_oceanography_news()
