/**
 * Dynamic Gallery Script
 * Manages multiple photo galleries (Antarctica, Seals, Falkor).
 */

const galleriesData = {
    antartica: {
        titleKey: 'modals.gallery_ant_title',
        descKey: 'modals.gallery_ant_desc',
        images: [
            'images/antartica/05.03.2020.antartica.editadas.253.JPG',
            'images/antartica/06.03.2020.antartica.editadas.319.JPG',
            'images/antartica/06.03.2020.antartica.editadas.331.JPG',
            'images/antartica/06.03.2020.antartica.editadas.344.JPG',
            'images/antartica/11.03.2020.antartica.editadas.720.JPG',
            'images/antartica/20200229104653_IMG_2875.jpg',
            'images/antartica/20200310182031_IMG_3166.JPG',
            'images/antartica/20220302163909_IMG_9099.JPG',
            'images/antartica/G0065704.JPG',
            'images/antartica/IMG-20220205-WA0004.jpg',
            'images/antartica/IMG_20200319_130943_490.jpg',
            'images/antartica/IMG_20200320_130356_927.jpg',
            'images/antartica/IMG_20200321_234723_156.jpg',
            'images/antartica/IMG_swgbcp.jpg',
            'images/antartica/imagen01.jpg',
            'images/antartica/imagen02.jpg',
            'images/antartica/imagen03.jpg',
            'images/antartica/imagen04.jpg',
            'images/antartica/imagen05.jpg',
            'images/antartica/imagen06.jpg',
            'images/antartica/imagen07.jpg',
            'images/antartica/imagen087.jpg',
            'images/antartica/imagen09.jpg',
            'images/antartica/imagen10.jpg'
        ]
    },
    seals: {
        titleKey: 'modals.gallery_seals_title',
        descKey: 'modals.gallery_seals_desc',
        images: [
            'images/anillo_seals/IMG_20250126_081128.jpg',
            'images/anillo_seals/IMG_20240125_082416.jpg',
            'images/anillo_seals/IMG_20240128_072501.jpg',
            'images/anillo_seals/IMG_20240625_172424.jpg',
            'images/anillo_seals/IMG_20240626_125639.jpg',
            'images/anillo_seals/IMG_20250121_090519.jpg',
            'images/anillo_seals/IMG_20250122_093135.jpg',
            'images/anillo_seals/IMG_20250122_125309.jpg',
            'images/anillo_seals/IMG_20250122_142021.jpg',
            'images/anillo_seals/IMG_20250123_142340.jpg',
            'images/anillo_seals/IMG_20250124_123101.jpg',
            'images/anillo_seals/IMG_20250125_061657.jpg',
            'images/anillo_seals/IMG_20250126_081215.jpg',
            'images/anillo_seals/IMG_20250126_123325.jpg',
            'images/anillo_seals/PANO_2025-01-16_15-15-41.jpg'
        ]
    },
    falkor: {
        titleKey: 'modals.gallery_falkor_title',
        descKey: 'modals.gallery_falkor_desc',
        images: [
            'images/falkor/IMG_20241102_202352.jpg',
            'images/falkor/Captura de pantalla 2026-02-24 155758.jpg',
            'images/falkor/IMG_20241012_191426.jpg',
            'images/falkor/IMG_20241020_143809.jpg',
            'images/falkor/IMG_20241030_130549.jpg',
            'images/falkor/IMG_20241102_202346.jpg',
            'images/falkor/falkor_bg.jpg'
        ]
    },
    fiordos: {
        titleKey: 'modals.gallery_fiordos_title',
        descKey: 'modals.gallery_fiordos_desc',
        images: [
            'images/fiordos/IMG_5687.JPG',
            'images/fiordos/IMG_5685.JPG',
            'images/fiordos/IMG_5690.JPG',
            'images/fiordos/cochamo 137.jpg',
            'images/fiordos/S4300181.JPG',
            'images/fiordos/S4300119.JPG',
            'images/fiordos/S4300175.JPG',
            'images/fiordos/S4300185.JPG',
            'images/fiordos/S4300192.JPG',
            'images/fiordos/DSCN0031.jpg',
            'images/fiordos/3personalSHOA.JPG',
            'images/fiordos/100_1189.JPG',
            'images/fiordos/PDRM5158.JPG',
            'images/fiordos/PDRM5170.JPG',
            'images/fiordos/PDRM5227.JPG',
            'images/fiordos/foto11.jpg'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Create Modal Structure if not exists
    if (!document.getElementById('gallery-modal')) {
        const modalHTML = `
            <div class="gallery-modal" id="gallery-modal">
                <div class="gallery-container">
                    <i class="fa-solid fa-xmark modal-close" id="modal-close"></i>
                    <div class="gallery-header">
                        <h2 id="gallery-title" data-i18n="">Galería</h2>
                        <p id="gallery-description" data-i18n=""></p>
                    </div>
                    <div class="gallery-grid" id="gallery-grid"></div>
                </div>
            </div>

            <div class="lightbox-overlay" id="lightbox-overlay">
                <i class="fa-solid fa-xmark lightbox-close" id="lightbox-close"></i>
                
                <button class="lightbox-nav prev" id="lightbox-prev">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                
                <div class="lightbox-content">
                    <img src="" alt="Full size" class="lightbox-img" id="lightbox-img">
                    <div class="lightbox-watermark" id="lightbox-watermark"></div>
                </div>

                <button class="lightbox-nav next" id="lightbox-next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('gallery-modal');
    const grid = document.getElementById('gallery-grid');
    const titleEl = document.getElementById('gallery-title');
    const descEl = document.getElementById('gallery-description');
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const watermarkEl = document.getElementById('lightbox-watermark');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGalleryKey = null;
    let currentImageIndex = 0;

    const showImage = (index) => {
        const data = galleriesData[currentGalleryKey];
        if (!data || !data.images[index]) return;

        currentImageIndex = index;
        lightboxImg.src = data.images[index];

        // Watermark: Use the translated title of the project
        const title = window.i18n ? window.i18n.getTranslation(data.titleKey) : "Investigación";
        watermarkEl.textContent = title;

        // Visual opacity fade-in
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.style.opacity = '1';
        }, 50);
    };

    const nextImage = () => {
        const data = galleriesData[currentGalleryKey];
        if (!data) return;
        const nextIdx = (currentImageIndex + 1) % data.images.length;
        showImage(nextIdx);
    };

    const prevImage = () => {
        const data = galleriesData[currentGalleryKey];
        if (!data) return;
        const prevIdx = (currentImageIndex - 1 + data.images.length) % data.images.length;
        showImage(prevIdx);
    };

    const openGallery = (galleryKey) => {
        const data = galleriesData[galleryKey];
        if (!data) return;

        currentGalleryKey = galleryKey;

        // Set Title & Description with i18n
        titleEl.setAttribute('data-i18n', data.titleKey);
        descEl.setAttribute('data-i18n', data.descKey);

        // Update content immediately if i18n is available
        if (window.i18n) {
            window.i18n.updateDOM();
        }

        // Clear and fill grid
        grid.innerHTML = '';
        data.images.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${src}" alt="Gallery Photo" loading="lazy">`;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(index);
                lightbox.classList.add('active');
            });

            grid.appendChild(item);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Event Delegation for triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.gallery-trigger');
        if (trigger) {
            const galleryKey = trigger.getAttribute('data-gallery');
            if (galleryKey) openGallery(galleryKey);
        }
    });

    // Close buttons
    document.getElementById('modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    document.getElementById('lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Navigation buttons
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Lightbox click outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
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
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });
});
