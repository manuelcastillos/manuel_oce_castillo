
document.addEventListener('DOMContentLoaded', () => {
    // Both types of containers (if we use it on home or separate page)
    const postgradoContainer = document.getElementById('tesistas-postgrado');
    const pregradoContainer = document.getElementById('tesistas-pregrado');

    const renderTesistas = (tesistas, container) => {
        if (!container) return;
        container.innerHTML = '';

        tesistas.forEach(t => {
            const item = document.createElement('div');
            item.className = 'tesista-item animate-text';
            
            item.innerHTML = `
                <div class="tesista-year-tag">${t.year}</div>
                <div class="tesista-main-info">
                    <div class="tesista-degree">${t.degree}</div>
                    <h3 class="tesista-name-title"><span class="tesista-name-bold">${t.name}.</span> <span class="tesista-title-normal">${t.title}</span></h3>
                </div>
            `;
            container.appendChild(item);
        });
    };

    fetch('./data/tesistas.json')
        .then(response => response.json())
        .then(data => {
            if (postgradoContainer) renderTesistas(data.postgrado, postgradoContainer);
            if (pregradoContainer) renderTesistas(data.pregrado, pregradoContainer);
        })
        .catch(error => {
            console.error('Error loading tesistas:', error);
            if (postgradoContainer) postgradoContainer.innerHTML = '<p>Error al cargar los datos.</p>';
        });
});
