# Guía de Despliegue y Mantenimiento

Este documento explica cómo subir tu sitio web a internet de forma gratuita y cómo actualizarlo fácilmente en el futuro. He preparado los archivos para que el sitio se llame **manuel-oce-castillo**.

---

## Opción 1: GitHub Pages (Recomendada para académicos)

Esta opción es gratuita, profesional y permanente.

### Paso 1: Crear el Repositorio
1. Ve a [GitHub.com](https://github.com/) e inicia sesión (o crea una cuenta).
2. Haz clic en el botón **"New"** para crear un nuevo repositorio.
3. Nombre del repositorio: `manuel-oce-castillo`
4. Selecciónalo como **Public**.
5. Haz clic en **"Create repository"**.

### Paso 2: Subir los Archivos
1. En la página de tu nuevo repositorio, haz clic en el enlace que dice **"uploading an existing file"**.
2. Arrastra y suelta **TODOS** los archivos de la carpeta `web_personal` (index.html, carpetas scripts, styles, images, etc.).
3. Espera a que se carguen y haz clic en **"Commit changes"**.

### Paso 3: Activar la Web
1. Ve a la pestaña **"Settings"** de tu repositorio.
2. En el menú de la izquierda, haz clic en **"Pages"**.
3. En **"Build and deployment"**, asegúrate de que esté en "Deploy from a branch" y selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. En unos minutos, tu sitio estará vivo en: `https://tu-usuario.github.io/manuel-oce-castillo/`

---

## Opción 2: Netlify Drop (La más rápida)

Si quieres verla online **YA mismo** sin crear repositorios:

1. Ve a [Netlify Drop](https://app.netlify.com/drop).
2. Arrastra la carpeta completa `web_personal` al recuadro.
3. ¡Listo! Te dará una URL aleatoria que puedes cambiar en los ajustes del sitio a `manuel-oce-castillo.netlify.app`.

---

## Cómo Actualizar el Sitio en el Futuro

He creado un archivo llamado `actualizar_sitio.bat` en tu carpeta. Cuando hagas cambios:

1. Ejecuta `actualizar_sitio.bat` haciendo doble clic.
2. Esto creará un archivo llamado `web_actualizada.zip`.
3. Ve a tu repositorio en GitHub o al panel de Netlify y sube ese nuevo archivo (o extrae su contenido allí).

> [!TIP]
> Si en el futuro instalas **Git**, podré automatizar esto para que se actualice con un solo comando. Por ahora, este método manual es el más seguro dado que no tenemos herramientas de comandos instaladas.
