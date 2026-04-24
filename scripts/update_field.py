import requests
import json
import os
from pathlib import Path

def sync_field_work():
    json_url = 'https://rss.app/feeds/v1.1/G9mWxuK3iJIoFhIA.json'
    print(f"Fetching JSON feed from {json_url}...")
    
    try:
        response = requests.get(json_url, timeout=15)
        if response.status_code != 200:
            print(f"Error: HTTP {response.status_code}")
            return
            
        data = response.json()
        if not data or 'items' not in data:
            print("No items found in the feed.")
            return

        # Keywords to include (Field Work)
        include_keywords = [
            'terreno', 'campaña', 'antártica', 'oceanografía', 'muestreo',
            'expedición', 'buque', 'embarque', 'mediciones', 'lanzamiento',
            'instrumento', 'malla', 'estación', 'fiordos', 'patagonia',
            'seals', 'falkor', 'lofisat', 'costar', 'ciencia'
        ]

        # Keywords to exclude (Personal/Family)
        exclude_keywords = [
            'familia', 'cumpleaños', 'vacaciones', 'niño', 'hijo',
            'asado', 'playa', 'almuerzo', 'descanso', 'personal'
        ]

        filtered_items = []
        for item in data['items']:
            text = (item.get('content_text', '') or item.get('title', '') or '').lower()
            
            has_include = any(kw in text for kw in include_keywords)
            has_exclude = any(kw in text for kw in exclude_keywords)
            
            if has_include and not has_exclude:
                filtered_items.append(item)

        filtered_items = filtered_items[:5] # Limit to 5

        if filtered_items:
            simplified_items = []
            for item in filtered_items:
                thumbnail = item.get('image', '')
                if not thumbnail and item.get('attachments'):
                    thumbnail = item['attachments'][0].get('url', '')
                
                simplified_items.append({
                    "id": item.get('id'),
                    "thumbnail": thumbnail,
                    "permalink": item.get('url'),
                    "caption": item.get('content_text', '') or item.get('title', '') or '',
                    "timestamp": item.get('date_published')
                })

            base_dir = Path(r'd:\Proyectos_atigravity\web_personal')
            output_path = base_dir / 'data' / 'field_posts.json'
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(simplified_items, f, ensure_ascii=False, indent=2)
            
            print(f"Successfully synced {len(simplified_items)} field work items.")
        else:
            print("No items matched the filtering criteria.")

    except Exception as e:
        print(f"Error syncing Field Work: {e}")

if __name__ == "__main__":
    sync_field_work()
