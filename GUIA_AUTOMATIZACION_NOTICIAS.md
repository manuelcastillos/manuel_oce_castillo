# 🤖 Guía de Automatización de Noticias (Instagram -> Web)

He configurado un sistema para que tu página web se actualice sola cada vez que publiques algo en Instagram con la cuenta **@lofi_sat**.

## ¿Cómo funciona?

1.  **Publicas en Instagram**: Subes una foto o video a `@lofi_sat`.
2.  **GitHub Action (El Robot)**: Una vez al día (o cuando tú lo actives manualmente), un proceso en GitHub revisa tu cuenta.
3.  **Sincronización**: El robot descarga la imagen y el texto de tu último post y lo guarda en el archivo `data/instagram_news.json` de tu repositorio.
4.  **Actualización Web**: Al entrar a tu página, el script `scripts/news.js` lee ese archivo y genera automáticamente las tarjetas de noticias.

## Cómo activarlo por primera vez

Para que funcione de forma totalmente automática y sin errores de "acceso denegado" por parte de Instagram, te recomiendo usar un **Token de Acceso** o un servicio de **RSS Feed**.

### Opción A (Recomendada y Fácil): RSS Feed
1. Crea un feed gratuito de tu Instagram en [RSS.app](https://rss.app/).
2. Copia la URL del feed (ej: `https://rss.app/feeds/xyz.xml`).
3. Avisame y actualizaré el script para que lea directamente de ahí. Es la forma más estable.

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
