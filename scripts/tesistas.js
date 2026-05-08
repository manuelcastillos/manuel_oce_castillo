
document.addEventListener('DOMContentLoaded', () => {
    const postgradoContainer = document.getElementById('tesistas-postgrado');
    const pregradoContainer = document.getElementById('tesistas-pregrado');

    fetch('./data/tesistas.json')
        .then(response => response.json())
        .then(data => {
            renderTesistas(data.postgrado, postgradoContainer);
            renderTesistas(data.pregrado, pregradoContainer);
        })
        .catch(error => console.error('Error loading tesistas:', error));

    function renderTesistas(tesistas, container) {
        if (!container) return;
        container.innerHTML = '';

        tesistas.forEach(t => {
            const card = document.createElement('div');
            card.className = 'tesista-card';
            
            let imageHtml = '';
            if (t.image) {
                // If there's an image link (e.g. instagram), we could show a placeholder or try to embed
                // For now, let's use a nice icon/placeholder if no direct image URL is provided
                imageHtml = `<div class="tesista-image-placeholder"><i class="fa-solid fa-user-graduate"></i></div>`;
            } else {
                imageHtml = `<div class="tesista-image-placeholder"><i class="fa-solid fa-user-graduate"></i></div>`;
            }

            card.innerHTML = `
                <div class="tesista-info">
                    <span class="tesista-year">${t.year}</span>
                    <h3 class="tesista-name">${t.name}</h3>
                    <p class="tesista-degree">${t.degree}</p>
                    <p class="tesista-title">"${t.title}"</p>
                </div>
            `;
            container.appendChild(card);
        });
    }
});
