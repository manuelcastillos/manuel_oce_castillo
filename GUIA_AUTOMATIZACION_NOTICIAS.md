# 🤖 Guía de Automatización de Noticias (Instagram -> Web)

¡Ya está todo configurado! Tu página web ahora se actualiza sola cada vez que publicas en Instagram (**@lofi_sat**) usando el feed de RSS.app que me proporcionaste.

## Estado Actual
- **Feed vinculado**: `https://rss.app/feeds/Izc71vq3Wly9kcqV.xml`
- **Frecuencia**: Se sincroniza automáticamente una vez al día.

## ¿Qué hace el sistema?
1. **GitHub Action**: Un "robot" en GitHub revisa tu feed de Instagram diariamente.
2. **Procesamiento**: El script `scripts/update_news.js` extrae la foto y el texto de tus últimos 3-5 posts.
3. **Persistencia**: Los datos se guardan en `data/instagram_news.json`.
4. **Visualización**: Tu web carga estos datos dinámicamente en la sección "Noticias del Laboratorio".

## Cómo forzar una actualización ahora mismo
Si acabas de publicar algo y no quieres esperar a mañana:
1. Ve a la pestaña **Actions** en tu repositorio de GitHub.
2. Selecciona **Sync Instagram News** en el menú de la izquierda.
3. Haz clic en el botón gris **Run workflow** -> **Run workflow**.

---
*El sistema ya es 100% autónomo. ¡Solo preocúpate de publicar en @lofi_sat!*

### Opción B: Ejecución Manual
Si prefieres actualizarlo tú mismo:
1. Ve a tu repositorio en GitHub.
2. Haz clic en la pestaña **Actions**.
3. Selecciona **Sync Instagram News** a la izquierda.
4. Haz clic en **Run workflow**.

## Archivos clave del sistema
- `index.html`: Contiene el contenedor de noticias (`#news-container`).
- `scripts/news.js`: El motor que dibuja las noticias en la web.
- `data/instagram_news.json`: Donde se guarda la información de los posts.
- `.github/workflows/sync_instagram.yml`: La configuración del robot que automatiza todo.

---
*Cualquier duda con la configuración del feed, no dudes en preguntarme.*
