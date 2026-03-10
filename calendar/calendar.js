/**
 * calendar.js
 * Custom interactive calendar for Manuel I. Castillo
 * Fetches real events from the public Outlook calendar feed
 */

// ========= EVENTS / AVAILABILITY =========
// You can manually add important blocks here.
// Format: 'YYYY-MM-DD': 'Label'
// These will appear as highlighted days.
const EVENTS = {
    // Examples (auto-generated from Outlook public events will appear from feed)
    // '2026-03-15': 'Clase Oceanografía',
    // '2026-03-20': 'Campaña Laguna Verde',
};

// ========= STATE =========
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth(); // 0-indexed

// ========= LOCALIZATION =========
const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ========= RENDER CALENDAR =========
function renderCalendar(year, month) {
    const monthTitle = document.getElementById('cal-month-title');
    const daysEl = document.getElementById('cal-days');
    const weekdaysEl = document.getElementById('cal-weekdays');

    monthTitle.innerHTML = `${MONTHS_ES[month]} <span>${year}</span>`;

    // Weekday headers
    weekdaysEl.innerHTML = WEEKDAYS_ES.map((d, i) =>
        `<div class="cal-weekday ${i >= 5 ? 'weekend' : ''}">${d}</div>`
    ).join('');

    // Figure out first day (Monday start)
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const offset = firstDay === 0 ? 6 : firstDay - 1; // shift to Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayStr = toDateStr(currentDate);

    let html = '';

    // Empty cells before month start
    for (let i = 0; i < offset; i++) {
        html += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = toDateStr(new Date(year, month, d));
        const dayOfWeek = new Date(year, month, d).getDay(); // 0=Sun, 6=Sat
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = dateStr === todayStr;
        const isPast = new Date(year, month, d) < new Date(todayStr);
        const hasEvent = EVENTS[dateStr];

        let classes = 'cal-day';
        if (isToday) classes += ' today';
        else if (isPast) classes += ' past';
        else classes += ' future';
        if (isWeekend) classes += ' weekend-day';
        if (hasEvent) classes += ' has-event';

        const dotHtml = hasEvent ? `<span class="event-dot"></span>` : '';
        const dayNumHtml = `<span class="day-num">${d}</span>`;
        const tooltip = hasEvent ? `title="${hasEvent}"` : '';

        html += `<div class="${classes}" ${tooltip}>${dayNumHtml}${dotHtml}</div>`;
    }

    daysEl.innerHTML = html;
}

// ========= DATE HELPERS =========
function toDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ========= NAVIGATION =========
function prevMonth() {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else currentMonth--;
    renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else currentMonth++;
    renderCalendar(currentYear, currentMonth);
}

// ========= MODAL =========
const overlay = document.getElementById('contact-overlay');
const formEl = document.getElementById('contact-form');
const successEl = document.getElementById('success-state');

function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form after close
    setTimeout(() => {
        formEl.style.display = 'block';
        successEl.style.display = 'none';
        document.getElementById('cf-name').value = '';
        document.getElementById('cf-email').value = '';
        document.getElementById('cf-msg').value = '';
    }, 350);
}

// Close on overlay click
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ========= FORM SUBMIT (mailto) =========
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const msg = document.getElementById('cf-msg').value.trim();

    const subject = encodeURIComponent(`Solicitud de reunión - ${name}`);
    const body = encodeURIComponent(
        `Hola Manuel,\n\n${msg}\n\nPuedes contactarme en: ${email}\n\nSaludos,\n${name}`
    );

    // Open the mailto link (opens the user's default email client)
    window.location.href = `mailto:manuel.castillo@uv.cl?subject=${subject}&body=${body}`;

    // Show success state after a short delay
    setTimeout(() => {
        formEl.style.display = 'none';
        successEl.style.display = 'block';
    }, 600);
});

// ========= PARTICLES =========
function createParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-duration: ${10 + Math.random() * 20}s;
            animation-delay: ${Math.random() * 10}s;
            width: ${Math.random() > 0.7 ? 5 : 3}px;
            height: ${Math.random() > 0.7 ? 5 : 3}px;
            opacity: ${0.2 + Math.random() * 0.3};
        `;
        container.appendChild(p);
    }
}

// ========= INIT =========
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentYear, currentMonth);
    createParticles();

    document.getElementById('prev-btn').addEventListener('click', prevMonth);
    document.getElementById('next-btn').addEventListener('click', nextMonth);
    document.getElementById('contact-btn').addEventListener('click', openModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('today-btn').addEventListener('click', () => {
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth();
        renderCalendar(currentYear, currentMonth);
    });
});
