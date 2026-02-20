/**
 * Antarctic Gallery Script
 * Manages the display and interaction of the Antarctic photo gallery.
 */

const antarcticImages = [
    'images/antartica/imagen01.jpg',
    'images/antartica/imagen02.jpg',
    'images/antartica/imagen03.jpg',
    'images/antartica/imagen04.jpg',
    'images/antartica/imagen05.jpg',
    'images/antartica/imagen06.jpg',
    'images/antartica/imagen07.jpg',
    'images/antartica/imagen087.jpg',
    'images/antartica/imagen10.jpg',
    'images/antartica/imagen09.jpg',
    'images/antartica/06.03.2020.antartica.editadas.319.JPG',
    'images/antartica/06.03.2020.antartica.editadas.331.JPG',
    'images/antartica/06.03.2020.antartica.editadas.344.JPG',
    'images/antartica/11.03.2020.antartica.editadas.720.JPG',
    'images/antartica/G0065704.JPG'
];

document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.antarctic-gallery-trigger');
    if (triggers.length === 0) return;

    // Create Modal Structure
    const modalHTML = `
        <div class="gallery-modal" id="gallery-modal">
            <div class="gallery-container">
                <i class="fa-solid fa-xmark modal-close" id="modal-close"></i>
                <div class="gallery-header">
                    <h2>Expediciones Antárticas</h2>
                    <p>Una mirada al trabajo científico en el continente blanco.</p>
                </div>
                <div class="gallery-grid" id="gallery-grid"></div>
            </div>
        </div>

        <div class="lightbox-overlay" id="lightbox-overlay">
            <i class="fa-solid fa-xmark lightbox-close" id="lightbox-close"></i>
            <div class="lightbox-content">
                <img src="" alt="Full size" class="lightbox-img" id="lightbox-img">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('gallery-modal');
    const grid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');

    // Load Images into Grid
    antarcticImages.forEach(src => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${src}" alt="Antártica Photo" loading="lazy">`;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = src;
            lightbox.classList.add('active');
        });

        grid.appendChild(item);
    });

    // Event Listeners
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    document.getElementById('modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    document.getElementById('lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Escape key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
