import csv
import os

def update_publications():
    csv_file = r'd:\Proyectos_atigravity\web_personal\data\publicaciones.csv'
    js_file = r'd:\Proyectos_atigravity\web_personal\scripts\publications.js'
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found")
        return

    publications = []
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Clean up the data
            title = row.get('Titulo', '').strip()
            authors = row.get('Autores', '').strip()
            journal = row.get('Revista', '').strip()
            year = row.get('Año', '').strip()
            url = row.get('Link', '').strip()
            
            if title:
                publications.append({
                    'authors': authors,
                    'title': title,
                    'journal': journal,
                    'year': year,
                    'url': url
                })

    if not publications:
        print("No publications found in CSV")
        return

    # Generate the JS content
    js_content = "\nconst publicationsData = [\n"
    for i, pub in enumerate(publications):
        comma = "," if i < len(publications) - 1 else ""
        # Escape double quotes in content
        t = pub['title'].replace('"', '\\"')
        a = pub['authors'].replace('"', '\\"')
        j = pub['journal'].replace('"', '\\"')
        y = pub['year']
        u = pub['url']
        
        js_content += f'    {{ authors: "{a}", title: "{t}", journal: "{j}", year: "{y}", url: "{u}" }}{comma}\n'
    
    js_content += "];\n"

    # We need to preserve the rest of the publications.js file (the rendering logic)
    with open(js_file, 'r', encoding='utf-8') as f:
        original_content = f.read()

    # Find where the old array ends
    import re
    new_content = re.sub(r'const publicationsData = \[[\s\S]*?\];', js_content.strip() + ";", original_content)

    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully updated {len(publications)} publications in {js_file}")

if __name__ == "__main__":
    update_publications()
