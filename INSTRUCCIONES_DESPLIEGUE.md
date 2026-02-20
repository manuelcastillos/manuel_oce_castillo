# Guía de Despliegue y Mantenimiento

Este documento explica cómo subir tu sitio web a internet de forma gratuita y cómo actualizarlo fácilmente en el futuro.

---

## Opción 1: GitHub Pages (Recomendada)

### Paso 1: Configurar el Repositorio Local
Abre una terminal (**Git Bash** o PowerShell) y ejecuta estos comandos uno por uno para subir tus archivos al repositorio que creaste (`manuel_oce_castillo` con guiones bajos):

```bash
# Entrar a la carpeta
cd /d/Proyectos_atigravity/web_personal

# 1. Quitar configuración previa por si el nombre era distinto
git remote remove origin

# 2. Configurar el repositorio con el nombre exacto (con guiones bajos)
git remote add origin https://github.com/manuelcastillos/manuel_oce_castillo.git

# 3. Asegurar que la rama se llame main
git branch -M main

# 4. Subir los archivos
git push -u origin main
```

### Paso 2: Activar la Web en GitHub
1. Ve a tu repositorio: `https://github.com/manuelcastillos/manuel_oce_castillo`
2. Ve a la pestaña **"Settings"**.
3. En el menú de la izquierda, haz clic en **"Pages"**.
4. En **"Build and deployment"**, selecciona la rama `main` y la carpeta `/(root)`.
5. Haz clic en **Save**.
6. Tu sitio estará vivo en: `https://manuelcastillos.github.io/manuel_oce_castillo/`

---

## Cómo Actualizar el Sitio en el Futuro

Cada vez que hagas cambios, abre la terminal y ejecuta:
```bash
git add .
git commit -m "Mis nuevos cambios"
git push origin main
```
