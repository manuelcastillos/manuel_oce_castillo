import re
import csv
import json
import os

def extract_publications():
    # Use absolute paths for Windows
    input_file = r'd:\Proyectos_atigravity\web_personal\scripts\publications.js'
    output_file = r'd:\Proyectos_atigravity\web_personal\data\publicaciones.csv'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find the array content
    match = re.search(r'const publicationsData = (\[[\s\S]*?\]);', content)
    if not match:
        print("Could not find publicationsData")
        return

    # Extract objects manually to handle trailing commas and non-JSON JS format
    items = []
    # Find each object { ... }
    item_matches = re.findall(r'\{[\s\S]*?\}', match.group(1))
    
    for item_str in item_matches:
        # Extract fields using regex, handling both double and single quotes
        def get_field(field_name):
            regex = fr'{field_name}:\s*["\'](.*?)["\']'
            m = re.search(regex, item_str)
            return m.group(1) if m else ""

        title = get_field('title')
        if title:
            items.append({
                'Titulo': title,
                'Autores': get_field('authors'),
                'Revista': get_field('journal'),
                'Año': get_field('year'),
                'Link': get_field('url')
            })

    if items:
        with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
            # Using commas as delimiter per instructions
            writer = csv.DictWriter(f, fieldnames=['Titulo', 'Autores', 'Revista', 'Año', 'Link'])
            writer.writeheader()
            writer.writerows(items)
        print(f"Successfully extracted {len(items)} publications to {output_file}")
    else:
        print("No items extracted")

if __name__ == "__main__":
    extract_publications()
