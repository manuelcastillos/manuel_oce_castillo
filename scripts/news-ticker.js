/**
 * news-ticker.js - Carga noticias desde news.json y maneja la animación de la cinta.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const track = document.getElementById('news-ticker-track');
    if (!track) return;

    try {
        // Cargar las noticias desde el archivo JSON
        const response = await fetch('./data/news.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo de noticias.');
        
        const newsData = await response.json();
        const displayNews = newsData.slice(0, 6); // Mostrar las 6 más recientes

        // Crear los elementos de la cinta
        const renderNews = (items) => {
            return items.map(item => `
                <a href="${item.url}" target="_blank" class="news-ticker-item">
                    ${item.title}
                </a>
            `).join(''); 
        };

        // Duplicamos el contenido para que el scroll sea infinito y fluido
        const content = renderNews(displayNews);
        track.innerHTML = content + content;

    } catch (error) {
        console.error('Error al cargar las noticias:', error);
        track.innerHTML = '<span class="news-ticker-item">Ciencia al día: Conectando con ScienceDaily...</span>';
    }
});
