// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Burger Animation
    burger.classList.toggle('toggle');
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.project-card, .about-text, .gallery-item, .section-title');

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    element.classList.add('hidden'); // Add initial hidden state via JS to avoid checking CSS
    revealOnScroll.observe(element);
});

// Create Realistic Ocean Currents
const currentsContainer = document.querySelector('.ocean-currents');

function createCurrent() {
    if (!currentsContainer) return;

    const current = document.createElement('span');
    current.classList.add('current-line');

    // Varied and realistic properties
    const width = Math.random() * 400 + 200 + 'px';
    const height = Math.random() * 4 + 1 + 'px';
    const top = Math.random() * 100 + '%';
    const duration = Math.random() * 12 + 8 + 's';
    const delay = Math.random() * 5 + 's';
    const swayDur = Math.random() * 4 + 3 + 's';
    const opacity = Math.random() * 0.4 + 0.3;

    current.style.width = width;
    current.style.height = height;
    current.style.top = top;
    current.style.opacity = opacity;
    current.style.animationDuration = `${duration}, ${swayDur}`;
    current.style.animationDelay = delay;

    currentsContainer.appendChild(current);

    setTimeout(() => {
        current.remove();
    }, 25000);
}

// Generate currents periodically
setInterval(createCurrent, 200);

// Initialize with currents
for (let i = 0; i < 30; i++) {
    setTimeout(() => createCurrent(), i * 100);
}


// Add CSS class for hidden elements dynamically
const style = document.createElement('style');
style.innerHTML = `
    .hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Mobile Nav Active State */
    .nav-active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        right: 0;
        top: 80px;
        background-color: var(--color-bg-dark);
        width: 100%;
        text-align: center;
        padding-bottom: 20px;
        animation: navSlide 0.5s ease forwards;
        border-bottom: 1px solid var(--color-primary);
    }
    
    @keyframes navSlide {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Burger Animation */
    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .toggle .line2 {
        opacity: 0;
    }
    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Profile Image Modal Functionality
const profileImg = document.getElementById('profileImg');
const profileModal = document.getElementById('profileModal');
const modalClose = document.querySelector('.modal-close');

if (profileImg && profileModal) {
    profileImg.addEventListener('click', () => {
        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal.classList.contains('active')) {
            profileModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Expedition Modal Functionality
const expeditionModal = document.getElementById('expeditionModal');
const clickableCards = document.querySelectorAll('.clickable-card');
const expeditionImg = document.getElementById('expeditionModalImg');
const expeditionTitle = document.getElementById('expeditionModalTitle');
const expeditionCaption = document.getElementById('expeditionModalCaption');

if (expeditionModal && clickableCards.length > 0) {
    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const caption = card.getAttribute('data-caption');
            const img = card.querySelector('img');

            expeditionTitle.textContent = title;
            expeditionCaption.textContent = caption;

            if (img) {
                expeditionImg.src = img.src;
                expeditionImg.style.display = 'block';
            } else {
                // FALLBACK: If no img tag, try to get background image from CSS or show nothing
                const style = window.getComputedStyle(card);
                const bg = style.backgroundImage;
                if (bg && bg !== 'none') {
                    const url = bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    expeditionImg.src = url;
                    expeditionImg.style.display = 'block';
                } else {
                    expeditionImg.style.display = 'none';
                }
            }

            expeditionModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const expeditionClose = expeditionModal.querySelector('.modal-close');
    if (expeditionClose) {
        expeditionClose.addEventListener('click', () => {
            expeditionModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    expeditionModal.addEventListener('click', (e) => {
        if (e.target === expeditionModal) {
            expeditionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && expeditionModal.classList.contains('active')) {
            expeditionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
