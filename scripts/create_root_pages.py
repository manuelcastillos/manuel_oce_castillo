# -*- coding: utf-8 -*-
"""
Genera las versiones de buscador.html y estadisticas.html en la raíz del repositorio
ajustando las rutas relativas hacia app_congreso/
"""
import os
import re

base_dir = r"d:\Proyectos_atigravity\web_personal"
app_dir = os.path.join(base_dir, "app_congreso")

for filename in ["buscador.html", "estadisticas.html"]:
    src_path = os.path.join(app_dir, filename)
    dest_path = os.path.join(base_dir, filename)

    with open(src_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Reemplazar rutas relativas para que funcionen desde la raíz
    content = content.replace('src="logos/', 'src="app_congreso/logos/')
    content = content.replace('src="data.js"', 'src="app_congreso/data.js"')
    content = content.replace('href="index.html"', 'href="app_congreso/index.html"')
    content = content.replace('href="Programa_Detallado_OFMC2026.pdf"', 'href="app_congreso/Programa_Detallado_OFMC2026.pdf"')

    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Creado con éxito: {dest_path} ({len(content)} bytes)")
