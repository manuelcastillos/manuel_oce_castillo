/**
 * calendar.js
 * Custom interactive calendar for Manuel I. Castillo
 * Events are loaded from /data/calendar_events.json (auto-synced from Outlook via GitHub Actions).
 */

// ========= STATE =========
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// Events map: 'YYYY-MM-DD' → [{ summary, start, end, location }]
let eventsByDate = {};

// ========= LOCALIZATION =========
const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ========= DATE HELPERS =========
function toDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function eventDateStr(isoStr) {
    // Handles both 'YYYY-MM-DD' and full ISO strings
    return isoStr.slice(0, 10);
}

// ========= LOAD EVENTS FROM JSON =========
async function loadEvents() {
    try {
        const res = await fetch(`../data/calendar_events.json?v=${Date.now()}`);
        if (!res.ok) throw new Error('Not found');
        const events = await res.json();

        // Group by date
        eventsByDate = {};
        events.forEach(ev => {
            const key = eventDateStr(ev.start);
            if (!eventsByDate[key]) eventsByDate[key] = [];
            eventsByDate[key].push(ev);
        });

        console.log(`Loaded ${events.length} events from calendar_events.json`);
    } catch (e) {
        console.warn('Could not load calendar events:', e.message);
        eventsByDate = {};
    }
    renderCalendar(currentYear, currentMonth);
}

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

    // Monday-start offset
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = toDateStr(currentDate);

    let html = '';

    for (let i = 0; i < offset; i++) html += `<div class="cal-day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = toDateStr(new Date(year, month, d));
        const dow = new Date(year, month, d).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isToday = dateStr === todayStr;
        const isPast = new Date(year, month, d) < new Date(todayStr);
        const evs = eventsByDate[dateStr] || [];
        const hasEvent = evs.length > 0;

        let classes = 'cal-day';
        if (isToday) classes += ' today';
        else if (isPast) classes += ' past';
        else classes += ' future';
        if (isWeekend) classes += ' weekend-day';
        if (hasEvent) classes += ' has-event';

        // Tooltip: first event title
        const tip = hasEvent ? `title="${evs.map(e => e.summary).join('\n')}"` : '';

        // Event label (first 18 chars) for non-mobile
        const eventLabel = hasEvent
            ? `<span class="event-label">${evs[0].summary.length > 15 ? evs[0].summary.slice(0, 14) + '…' : evs[0].summary}</span>`
            : '';
        const moreBadge = evs.length > 1 ? `<span class="more-badge">+${evs.length - 1}</span>` : '';

        html += `
          <div class="${classes}" ${tip} data-date="${dateStr}">
            <span class="day-num">${d}</span>
            ${eventLabel}
            ${moreBadge}
          </div>`;
    }

    daysEl.innerHTML = html;

    // Click on a day with events → show popup
    daysEl.querySelectorAll('.cal-day.has-event').forEach(el => {
        el.addEventListener('click', () => showDayEvents(el.dataset.date));
    });
}

// ========= DAY EVENTS POPUP =========
function showDayEvents(dateStr) {
    const evs = eventsByDate[dateStr] || [];
    if (!evs.length) return;

    const list = evs.map(ev => {
        const time = ev.start.length > 10
            ? new Date(ev.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
            : 'Todo el día';
        const loc = ev.location ? `<span class="ev-loc"><i class="fa-solid fa-location-dot"></i> ${ev.location}</span>` : '';
        return `
          <div class="day-event-item">
            <div class="ev-time">${time}</div>
            <div class="ev-summary">${ev.summary}</div>
            ${loc}
          </div>`;
    }).join('');

    const d = new Date(dateStr + 'T00:00:00');
    const label = d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });

    document.getElementById('day-popup-title').textContent = label;
    document.getElementById('day-popup-list').innerHTML = list;
    document.getElementById('day-popup').classList.add('active');
}

function closeDayPopup() {
    document.getElementById('day-popup').classList.remove('active');
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

// ========= CONTACT MODAL =========
const overlay = document.getElementById('contact-overlay');
const formEl = document.getElementById('contact-form');
const okEl = document.getElementById('success-state');

function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        formEl.style.display = 'block';
        okEl.style.display = 'none';
        ['cf-name', 'cf-email', 'cf-msg'].forEach(id => document.getElementById(id).value = '');
    }, 350);
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDayPopup(); } });

document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const msg = document.getElementById('cf-msg').value.trim();
    const sub = encodeURIComponent(`Solicitud de reunión - ${name}`);
    const body = encodeURIComponent(`Hola Manuel,\n\n${msg}\n\nPuedes contactarme en: ${email}\n\nSaludos,\n${name}`);
    window.location.href = `mailto:manuel.castillo@uv.cl?subject=${sub}&body=${body}`;
    setTimeout(() => { formEl.style.display = 'none'; okEl.style.display = 'block'; }, 600);
});

// ========= PARTICLES =========
function createParticles() {
    const c = document.querySelector('.particles');
    if (!c) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${10 + Math.random() * 20}s;animation-delay:${Math.random() * 10}s;`;
        c.appendChild(p);
    }
}

// ========= INIT =========
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    document.getElementById('prev-btn').addEventListener('click', prevMonth);
    document.getElementById('next-btn').addEventListener('click', nextMonth);
    document.getElementById('contact-btn').addEventListener('click', openModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('day-popup-close').addEventListener('click', closeDayPopup);
    document.getElementById('today-btn').addEventListener('click', () => {
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth();
        renderCalendar(currentYear, currentMonth);
    });

    loadEvents();  // Fetch from JSON and render
});
