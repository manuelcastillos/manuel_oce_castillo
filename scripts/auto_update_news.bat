@echo off
:: Navegar a la carpeta del proyecto
cd /d "d:\Proyectos_atigravity\web_personal"

echo [%DATE% %TIME%] Iniciando actualizacion automatica...

:: 1. Ejecutar el script de captura de noticias
python scripts/update_news.py

:: 2. Verificar si hubo cambios y subirlos a GitHub
:: Añadimos solo el archivo de noticias para no subir trabajos en progreso de otros archivos
git add data/news.json

:: Hacemos el commit con una marca de tiempo
git commit -m "Auto-update oceanography news (ScienceDaily) - %DATE%"

:: 3. Empujar los cambios al servidor
:: Esto asume que tienes tus credenciales guardadas (SSH o Cache)
git push origin main

echo [%DATE% %TIME%] Proceso completado exitosamente.
