/**
 * calendar.js — Manuel I. Castillo Calendar
 * Loads events from /data/calendar_events.json (auto-synced from Outlook).
 * Sends contact form via EmailJS (no mail client required).
 */

// ======= STATE =======
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let eventsByDate = {};  // 'YYYY-MM-DD' → [{summary, start, end, location}]

// ======= LOCALIZATION =======
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// ======= HELPERS =======
const toDateStr = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ======= LOAD EVENTS =======
async function loadEvents() {
    try {
        const res = await fetch(`../data/calendar_events.json?v=${Date.now()}`);
        if (!res.ok) throw new Error('Not found');
        const events = await res.json();
        eventsByDate = {};
        events.forEach(ev => {
            const key = ev.start.slice(0, 10);
            if (!eventsByDate[key]) eventsByDate[key] = [];
            eventsByDate[key].push(ev);
        });
        console.log(`Loaded ${events.length} events`);
    } catch (e) {
        console.warn('Could not load events:', e.message);
    }
    renderCalendar(currentYear, currentMonth);
}

// ======= RENDER CALENDAR =======
function renderCalendar(year, month) {
    document.getElementById('cal-month-title').innerHTML = `${MONTHS_ES[month]} <span>${year}</span>`;

    document.getElementById('cal-weekdays').innerHTML = WEEKDAYS_ES
        .map((d, i) => `<div class="cal-weekday ${i >= 5 ? 'weekend' : ''}">${d}</div>`)
        .join('');

    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = toDateStr(currentDate);

    let html = '';
    for (let i = 0; i < offset; i++) html += `<div class="cal-day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const ds = toDateStr(new Date(year, month, d));
        const dow = new Date(year, month, d).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isToday = ds === todayStr;
        const isPast = new Date(year, month, d) < new Date(todayStr);
        const evs = eventsByDate[ds] || [];
        const hasEvent = evs.length > 0;

        let cls = 'cal-day';
        if (isToday) cls += ' today';
        else if (isPast) cls += ' past';
        else cls += ' future';
        if (isWeekend) cls += ' weekend-day';
        if (hasEvent) cls += ' has-event';

        const tip = hasEvent ? `title="${evs.map(e => e.summary).join('\n')}"` : '';
        const label = hasEvent ? `<span class="event-label">${evs[0].summary.length > 14 ? evs[0].summary.slice(0, 13) + '…' : evs[0].summary}</span>` : '';
        const more = evs.length > 1 ? `<span class="more-badge">+${evs.length - 1}</span>` : '';

        html += `<div class="${cls}" ${tip} data-date="${ds}"><span class="day-num">${d}</span>${label}${more}</div>`;
    }

    const daysEl = document.getElementById('cal-days');
    daysEl.innerHTML = html;

    daysEl.querySelectorAll('.cal-day.has-event').forEach(el =>
        el.addEventListener('click', () => showDayEvents(el.dataset.date))
    );
}

// ======= DAY POPUP =======
function showDayEvents(dateStr) {
    const evs = eventsByDate[dateStr] || [];
    if (!evs.length) return;

    const list = evs.map(ev => {
        const isAllDay = ev.start.length === 10;
        const time = isAllDay ? 'Todo el día'
            : new Date(ev.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const endTime = (!isAllDay && ev.end)
            ? ` – ${new Date(ev.end).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}` : '';
        const loc = ev.location ? `<span class="ev-loc"><i class="fa-solid fa-location-dot"></i> ${ev.location}</span>` : '';
        return `<div class="day-event-item">
                  <div class="ev-time">${time}${endTime}</div>
                  <div class="ev-summary">${ev.summary}</div>
                  ${loc}
                </div>`;
    }).join('');

    const d = new Date(dateStr + 'T00:00:00');
    document.getElementById('day-popup-title').textContent =
        d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('day-popup-list').innerHTML = list;
    document.getElementById('day-popup').classList.add('active');
}

function closeDayPopup() { document.getElementById('day-popup').classList.remove('active'); }

// ======= NAVIGATION =======
function prevMonth() {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; } else currentMonth--;
    renderCalendar(currentYear, currentMonth);
}
function nextMonth() {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; } else currentMonth++;
    renderCalendar(currentYear, currentMonth);
}

// ======= CONTACT MODAL =======
const overlay = document.getElementById('contact-overlay');
const formEl = document.getElementById('contact-form');

function openModal() { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        formEl.reset();
        const st = document.getElementById('form-status');
        st.className = 'form-status';
        st.textContent = '';
    }, 350);
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDayPopup(); } });

// ======= EMAILJS SUBMIT =======
formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    const status = document.getElementById('form-status');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    status.className = 'form-status';
    status.textContent = '';

    try {
        await emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formEl);
        status.className = 'form-status success';
        status.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado exitosamente! Recibirás respuesta pronto.';
        formEl.reset();
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Enviado';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
        }, 5000);
    } catch (err) {
        console.error('EmailJS error:', err);
        status.className = 'form-status error';
        status.innerHTML = 'Error al enviar. Escribe directamente a <a href="mailto:manuel.castillo@uv.cl">manuel.castillo@uv.cl</a>';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensaje';
    }
});

// ======= INIT =======
document.addEventListener('DOMContentLoaded', () => {
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
    loadEvents();
});
