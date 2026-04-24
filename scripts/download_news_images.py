import json
import os
import requests
import hashlib
from pathlib import Path

def download_news_images():
    base_dir = Path(r'd:\Proyectos_atigravity\web_personal')
    
    configs = [
        {
            'json': base_dir / 'data' / 'instagram_news.json',
            'img_dir': base_dir / 'images' / 'news',
            'prefix': 'news'
        },
        {
            'json': base_dir / 'data' / 'field_posts.json',
            'img_dir': base_dir / 'images' / 'field',
            'prefix': 'field'
        }
    ]

    for config in configs:
        json_path = config['json']
        images_dir = config['img_dir']
        prefix = config['prefix']
        
        if not images_dir.exists():
            images_dir.mkdir(parents=True, exist_ok=True)
            
        if not json_path.exists():
            print(f"Skipping: {json_path} not found.")
            continue

        with open(json_path, 'r', encoding='utf-8') as f:
            posts = json.load(f)

        updated_posts = []
        print(f"\nProcessing images for {json_path.name}...")

        for post in posts:
            url = post.get('thumbnail')
            permalink = post.get('permalink', '')
            
            # Clean url from weserv proxy if present in JSON
            if url and 'weserv.nl/?url=' in url:
                import urllib.parse
                parsed = urllib.parse.urlparse(url)
                params = urllib.parse.parse_qs(parsed.query)
                if 'url' in params:
                    url = params['url'][0]

            if not url or not url.startswith('http'):
                updated_posts.append(post)
                continue
                
            # Create a stable filename based on permalink
            hash_id = hashlib.md5(permalink.encode()).hexdigest()
            filename = f"ig_{prefix}_{hash_id}.jpg"
            filepath = images_dir / filename
            
            # Download if not exists
            if not filepath.exists():
                try:
                    import time
                    time.sleep(1)  # Delay to avoid 429
                    print(f"  Downloading {url[:50]}...")
                    response = requests.get(url, timeout=15)
                    if response.status_code == 200:
                        with open(filepath, 'wb') as f:
                            f.write(response.content)
                        print(f"  Saved to {filename}")
                    else:
                        print(f"  Failed to download: HTTP {response.status_code}")
                except Exception as e:
                    print(f"  Error downloading: {e}")
            
            # Update path to local
            if filepath.exists():
                post['thumbnail'] = f"images/{prefix}/{filename}"
            
            updated_posts.append(post)

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(updated_posts, f, ensure_ascii=False, indent=2)
            
    print("\nAll JSONs updated with local image paths.")

if __name__ == "__main__":
    download_news_images()
