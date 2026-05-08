
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('tesistas-main-container');

    const renderTesistasGrouped = (data) => {
        if (!mainContainer) return;
        mainContainer.innerHTML = '';

        // Combine all students
        const allTesistas = [...data.postgrado, ...data.pregrado];
        
        // Group by year
        const grouped = allTesistas.reduce((acc, t) => {
            if (!acc[t.year]) acc[t.year] = [];
            acc[t.year].push(t);
            return acc;
        }, {});

        // Sort years descending
        const sortedYears = Object.keys(grouped).sort((a, b) => b - a);

        sortedYears.forEach(year => {
            const yearSection = document.createElement('div');
            yearSection.className = 'year-group animate-text';
            
            let html = `
                <div class="year-header">
                    <h2 class="year-title">${year}</h2>
                    <div class="year-line"></div>
                </div>
                <div class="tesistas-list-full">
            `;

            grouped[year].forEach(t => {
                const links = [];
                if (t.pdf) links.push(`<a href="${t.pdf}" target="_blank" class="tesista-link pdf-link" title="Descargar Tesis PDF"><i class="fa-solid fa-file-pdf"></i> PDF</a>`);
                if (t.doi) links.push(`<a href="https://doi.org/${t.doi}" target="_blank" class="tesista-link doi-link" title="Ver Publicación"><i class="fa-solid fa-link"></i> DOI</a>`);
                
                const hasImage = t.image && t.image.trim() !== "";
                const imageHtml = hasImage 
                    ? `<div class="tesista-photo-container"><img src="${t.image}" alt="${t.name}" class="tesista-photo"></div>`
                    : `<div class="tesista-photo-container placeholder-photo"><i class="fa-solid fa-user-graduate"></i></div>`;

                html += `
                    <div class="tesista-item">
                        ${imageHtml}
                        <div class="tesista-main-info">
                            <div class="tesista-degree">${t.degree}</div>
                            <h3 class="tesista-name-title">
                                <span class="tesista-name-bold">${t.name}.</span> 
                                <span class="tesista-title-normal">${t.title}</span>
                            </h3>
                        </div>
                        ${links.length > 0 ? `<div class="tesista-links">${links.join('')}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
            yearSection.innerHTML = html;
            mainContainer.appendChild(yearSection);
        });
    };

    fetch('./data/tesistas.json')
        .then(response => response.json())
        .then(data => {
            renderTesistasGrouped(data);
        })
        .catch(error => {
            console.error('Error loading tesistas:', error);
            if (mainContainer) mainContainer.innerHTML = '<p>Error al cargar los datos.</p>';
        });
});
