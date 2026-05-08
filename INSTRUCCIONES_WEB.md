# Guía de Mantenimiento: Página de Tesistas

Para asegurar que las fotos y enlaces funcionen siempre correctamente, sigue estas "Reglas de Oro":

### 1. Nomenclatura de Fotos
Cuando subas una foto nueva a la carpeta `images/tesistas/`:
*   **Todo en minúsculas**: Usa siempre letras minúsculas (ej. `juan_perez.jpg`).
*   **Sin espacios ni acentos**: Usa guiones bajos `_` en lugar de espacios.
*   **Formato**: Usa preferiblemente `.jpg`.

### 2. Actualización de Datos (`scripts/tesistas.js`)
Al añadir un nuevo tesista en el objeto `tesistasData`:
*   La ruta de la imagen debe empezar con `./images/tesistas/`.
*   Ejemplo: `"image": "./images/tesistas/juan_perez.jpg"`

### 3. Forzar Cambios (Bust Cache)
Después de hacer cualquier cambio en los datos o fotos, abre `tesistas.html` y aumenta el número de versión al final del archivo:
*   Busca: `<script src="./scripts/tesistas.js?v=2.0"></script>`
*   Cambia el `2.0` por `2.1`, `2.2`, etc. Esto obliga a los navegadores de tus visitantes a cargar la información más reciente.

### 4. Sistema Anti-Errores
He programado un sistema de seguridad. Si una foto no se encuentra o tiene un error de nombre, el sitio **no mostrará un icono roto**. Automáticamente mostrará el icono genérico de graduado, manteniendo la estética profesional del sitio.

---
*Cualquier duda, puedes pedirme que revise la consistencia de los archivos.*
