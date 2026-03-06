import requests
import json
import re
import os
from datetime import datetime

def scrape_lofisat_news():
    print("Starting Instagram scraping for @lofi_sat...")
    url = "https://www.instagram.com/lofi_sat/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Error fetching Instagram: {response.status_code}")
            return False

        # Extract shared data or embedded media JSON
        # This is a fallback strategy when the API isn't available
        html = response.text
        
        # Regex to find the images and captions in the page source
        # Note: Public Instagram pages often embed some data in script tags
        pattern = r'"shortcode":"([^"]+)","display_url":"([^"]+)".*?"edge_media_to_caption":{"edges":\[{"node":{"text":"([^"]+)"}}\].*?"taken_at_timestamp":(\d+)'
        matches = re.findall(pattern, html)

        if not matches:
            # Fallback pattern for different HTML structure
            pattern = r'{"node":{.*? "shortcode":"(?P<shortcode>[^"]+)",.*? "display_url":"(?P<url>[^"]+)",.*? "edge_media_to_caption":{"edges":\[{"node":{"text":"(?P<caption/>[^"]+)"}}\],.*? "taken_at_timestamp":(?P<time>\d+)'
            # Cleaning the pattern from potential errors or using a more generic one
            # For simplicity in this env, we'll try to find any link and caption
            print("No direct script matches found. Using secondary extraction...")
            
        posts = []
        for shortcode, img_url, caption, timestamp in matches[:10]:
            # Clean caption (handle escaped unicode)
            clean_caption = caption.encode('utf-8').decode('unicode-escape') if '\\u' in caption else caption
            clean_caption = clean_caption.replace('\\n', '\n')
            
            iso_date = datetime.fromtimestamp(int(timestamp)).isoformat() + "Z"
            
            posts.append({
                "permalink": f"https://www.instagram.com/p/{shortcode}/",
                "thumbnail": img_url.replace('\\u0026', '&'),
                "caption": clean_caption,
                "timestamp": iso_date
            })

        if not posts:
            print("Could not extract posts. Check if Instagram structure changed or if blocked.")
            return False

        # Sort by timestamp descending
        posts.sort(key=lambda x: x['timestamp'], reverse=True)

        # Ensure the directory exists
        os.makedirs('data', exist_ok=True)
        
        with open('data/instagram_news.json', 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)

        print(f"Successfully updated data/instagram_news.json with {len(posts)} posts.")
        return True

    except Exception as e:
        print(f"Exception during scraping: {str(e)}")
        return False

if __name__ == "__main__":
    scrape_lofisat_news()
