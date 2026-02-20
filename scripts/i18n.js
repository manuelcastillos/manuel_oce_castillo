/**
 * i18n Localization Engine
 * Handles language switching and content updates.
 */

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('pref_lang') || this.getBrowserLang();
        this.init();
    }

    getBrowserLang() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('en') ? 'en' : 'es';
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateDOM();
            this.createSwitcher();
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('pref_lang', lang);
        this.updateDOM();

        // Trigger custom event for dynamic scripts like projects.js and publications.js
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

        // Update language indicator in UI
        this.updateSwitcherUI();
    }

    updateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getTranslation(key);

            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.hasAttribute('placeholder')) {
                        el.placeholder = translation;
                    }
                } else if (el.tagName === 'IMG') {
                    if (el.hasAttribute('alt')) {
                        el.alt = translation;
                    }
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', this.currentLang);
    }

    getTranslation(path) {
        try {
            return path.split('.').reduce((obj, key) => obj[key], translations[this.currentLang]);
        } catch (e) {
            console.warn(`Translation not found for: ${path}`);
            return null;
        }
    }

    createSwitcher() {
        const navbar = document.querySelector('.nav-links');
        if (!navbar) return;

        const li = document.createElement('li');
        li.className = 'lang-switcher-container';
        li.innerHTML = `
            <div class="lang-switcher">
                <span class="lang-btn ${this.currentLang === 'es' ? 'active' : ''}" data-lang="es">ES</span>
                <span class="lang-divider">|</span>
                <span class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
            </div>
        `;

        navbar.appendChild(li);

        li.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLanguage(btn.getAttribute('data-lang'));
            });
        });
    }

    updateSwitcherUI() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

const i18n = new I18n();
window.i18n = i18n; // Global access
