/**
 * OFMC 2026 - Mobile Web App Logic
 * Real-Time Engine, Schedule Filter, Offline Favorites & PWA Support
 */

(function () {
  'use strict';

  // 1. DATA SOURCE CHECK
  const data = window.CONGRESO_DATA;
  if (!data) {
    console.error('CONGRESO_DATA no encontrado. Verifica la carga de data.js.');
    return;
  }

  // 2. STATE
  const state = {
    activeView: 'view-ahora',
    simDay: 1, // 1 to 4
    simMinutes: 695, // 11:35 in minutes from midnight (11*60 + 35)
    isRealTime: false,
    favorites: JSON.parse(localStorage.getItem('ofmc2026_favorites') || '[]'),
    programDay: 1,
    programTrack: 'all',
    posterDay: 'all',
    posterSearch: '',
    authorSearch: '',
    globalSearch: ''
  };

  // 3. TIME UTILITIES
  function timeStringToMinutes(tStr) {
    if (!tStr) return 0;
    const clean = tStr.trim().split(' ')[0];
    const parts = clean.split(':');
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function minutesToTimeString(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function getCurrentConferenceTime() {
    if (!state.isRealTime) {
      return {
        dayNum: state.simDay,
        minutes: state.simMinutes,
        timeStr: minutesToTimeString(state.simMinutes),
        isSimulated: true
      };
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const date = now.getDate();
    const curMins = now.getHours() * 60 + now.getMinutes();

    // Check if within Nov 24-27, 2026
    let dayNum = 1;
    if (year === 2026 && month === 11) {
      if (date === 24) dayNum = 1;
      else if (date === 25) dayNum = 2;
      else if (date === 26) dayNum = 3;
      else if (date === 27) dayNum = 4;
    }

    return {
      dayNum: dayNum,
      minutes: curMins,
      timeStr: minutesToTimeString(curMins),
      isSimulated: false
    };
  }

  // 4. FAVORITES (LOCAL STORAGE)
  function isFavorite(id) {
    return state.favorites.includes(id);
  }

  function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.push(id);
    }
    localStorage.setItem('ofmc2026_favorites', JSON.stringify(state.favorites));
    updateFavoritesBadge();
    
    // Update all heart icons currently in DOM
    document.querySelectorAll(`[data-favid="${id}"]`).forEach(btn => {
      btn.classList.toggle('active', isFavorite(id));
      btn.innerHTML = isFavorite(id) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
    });

    if (state.activeView === 'view-agenda') {
      renderAgendaView();
    }
  }

  function updateFavoritesBadge() {
    const badge = document.getElementById('navAgendaBadge');
    if (!badge) return;
    const count = state.favorites.length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  // 5. VIEW NAVIGATION
  function switchView(viewId) {
    state.activeView = viewId;
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh specific view data on switch
    if (viewId === 'view-ahora') renderLiveView();
    else if (viewId === 'view-programa') renderProgramView();
    else if (viewId === 'view-posters') renderPostersView();
    else if (viewId === 'view-agenda') renderAgendaView();
    else if (viewId === 'view-autores') renderAuthorsView();
  }

  // =========================================================================
  // 6. REAL-TIME ENGINE ("EN VIVO / AHORA")
  // =========================================================================
  function renderLiveView() {
    const timeInfo = getCurrentConferenceTime();
    const dayData = data.dias.find(d => d.dia_num === timeInfo.dayNum) || data.dias[0];

    // Header label
    const timeLabel = document.getElementById('liveTimeLabel');
    if (timeLabel) {
      const modeStr = timeInfo.isSimulated ? ' · Modo Simulado' : ' · Tiempo Real';
      timeLabel.textContent = `${dayData.fecha_larga} · ${timeInfo.timeStr} hrs${modeStr}`;
    }

    const curMins = timeInfo.minutes;
    const dayNum = timeInfo.dayNum;

    // A) Check for Plenary or Special Events first
    const activeEvent = data.eventos_especiales.find(ev => {
      if (ev.dia_num !== dayNum) return false;
      const start = timeStringToMinutes(ev.start_time);
      const end = timeStringToMinutes(ev.end_time);
      return curMins >= start && curMins < end;
    });

    // B) Check for Oral Presentations in Sala 2.5 and Sala 3.7
    const activeOral25 = data.orales.find(o => {
      if (o.dia_num !== dayNum || !o.sala.includes('2.5')) return false;
      const start = timeStringToMinutes(o.start_time);
      const end = timeStringToMinutes(o.end_time);
      return curMins >= start && curMins < end;
    });

    const activeOral37 = data.orales.find(o => {
      if (o.dia_num !== dayNum || !o.sala.includes('3.7')) return false;
      const start = timeStringToMinutes(o.start_time);
      const end = timeStringToMinutes(o.end_time);
      return curMins >= start && curMins < end;
    });

    // C) Check for Active Poster Session
    const isPosterTime = (dayNum in {2:1, 3:1} && curMins >= 17*60 && curMins < 19*60) ||
                         (dayNum === 4 && curMins >= 13*60 + 30 && curMins < 15*60);

    const card25 = document.getElementById('liveCardRoom25');
    const card37 = document.getElementById('liveCardRoom37');
    const cardEvent = document.getElementById('liveCardEvent');

    // Case 1: Plenary Event (Inauguration, Keynote, Coffee Break, Lunch, DOCA assembly, Closing)
    if (activeEvent && (activeEvent.categoria === 'Plenaria' || activeEvent.categoria === 'Ceremonia' || activeEvent.categoria === 'Coffee Break' || activeEvent.categoria === 'Almuerzo' || activeEvent.categoria === 'DOCA' || activeEvent.categoria === 'Social' || activeEvent.categoria === 'Clausura' || activeEvent.categoria === 'Acreditación')) {
      card25.style.display = 'none';
      card37.style.display = 'none';
      cardEvent.style.display = 'block';

      const tagEl = document.getElementById('eventRoomTag');
      const timeBadgeEl = document.getElementById('eventTimeBadge');
      const bodyEl = document.getElementById('cardBodyEvent');

      timeBadgeEl.textContent = activeEvent.horario;
      
      let icon = 'fa-star';
      let tagClass = 'tag-gold';
      if (activeEvent.categoria === 'Coffee Break') { icon = 'fa-mug-hot'; tagClass = 'tag-ocean'; }
      else if (activeEvent.categoria === 'Almuerzo') { icon = 'fa-utensils'; tagClass = 'tag-gold'; }
      else if (activeEvent.categoria === 'Social') { icon = 'fa-champagne-glasses'; tagClass = 'tag-gold'; }
      else if (activeEvent.categoria === 'Plenaria') { icon = 'fa-microphone-lines'; tagClass = 'tag-gold'; }

      tagEl.className = `room-tag ${tagClass}`;
      tagEl.innerHTML = `<i class="fa-solid ${icon}"></i> ${activeEvent.sala} · ${activeEvent.categoria.toUpperCase()}`;

      bodyEl.innerHTML = `
        <div class="live-card-title">${activeEvent.titulo}</div>
        ${activeEvent.autor ? `<div class="live-card-author"><i class="fa-solid fa-user-tie"></i> ${activeEvent.autor}</div>` : ''}
        ${activeEvent.inst ? `<div class="live-card-inst">${activeEvent.inst}</div>` : ''}
        <div class="live-card-session">${activeEvent.descripcion}</div>
      `;
    } 
    // Case 2: Active Poster Session
    else if (isPosterTime) {
      card25.style.display = 'none';
      card37.style.display = 'none';
      cardEvent.style.display = 'block';

      const tagEl = document.getElementById('eventRoomTag');
      const timeBadgeEl = document.getElementById('eventTimeBadge');
      const bodyEl = document.getElementById('cardBodyEvent');

      timeBadgeEl.textContent = dayNum === 4 ? '13:30 - 15:00 hrs' : '17:00 - 19:00 hrs';
      tagEl.className = 'room-tag tag-purple';
      tagEl.innerHTML = `<i class="fa-solid fa-images"></i> Sectores Comunes Pisos 2 y 3 · SESIÓN DE PÓSTERS`;

      const dayPosters = data.posters.filter(p => p.dia_num === dayNum);
      bodyEl.innerHTML = `
        <div class="live-card-title">Sesión Oficial de Paneles Póster — Día ${dayNum} (${dayPosters.length} trabajos)</div>
        <div class="live-card-session">Visita los paneles en exhibición en los halls comunes de los pisos 2 y 3. Los autores están presentes junto a sus trabajos para responder dudas e interactuar.</div>
        <div class="live-card-actions">
          <button class="btn-card-action" onclick="window.OFMC_APP.viewPostersDay(${dayNum})">
            <i class="fa-solid fa-arrow-right"></i> Ver los ${dayPosters.length} pósters de hoy
          </button>
        </div>
      `;
    }
    // Case 3: Parallel Oral Sessions (Rooms 2.5 and 3.7)
    else {
      cardEvent.style.display = 'none';
      card25.style.display = 'block';
      card37.style.display = 'block';

      // Render Room 2.5
      renderActiveRoomCard(activeOral25, '25', curMins, dayNum, 'Sala 2.5');
      // Render Room 3.7
      renderActiveRoomCard(activeOral37, '37', curMins, dayNum, 'Sala 3.7');
    }

    // Render Next Upcoming Talks
    renderNextTalks(curMins, dayNum);
  }

  function renderActiveRoomCard(oralItem, suffix, curMins, dayNum, roomName) {
    const timeBadge = document.getElementById(`timeBadge${suffix}`);
    const bodyEl = document.getElementById(`cardBody${suffix}`);
    const progressEl = document.getElementById(`progress${suffix}`);

    if (oralItem) {
      timeBadge.textContent = oralItem.horario;
      const startM = timeStringToMinutes(oralItem.start_time);
      const endM = timeStringToMinutes(oralItem.end_time);
      const totalDur = Math.max(1, endM - startM);
      const elapsed = Math.max(0, Math.min(totalDur, curMins - startM));
      const pct = Math.round((elapsed / totalDur) * 100);
      progressEl.style.width = `${pct}%`;

      const favClass = isFavorite(oralItem.id) ? 'active' : '';
      const favIcon = isFavorite(oralItem.id) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';

      bodyEl.innerHTML = `
        <span class="live-card-code">${oralItem.id}</span>
        <div class="live-card-title">${oralItem.titulo}</div>
        <div class="live-card-author"><i class="fa-solid fa-microphone"></i> ${oralItem.autor}</div>
        <div class="live-card-inst">${oralItem.inst}</div>
        <div class="live-card-session">${oralItem.sesion}</div>
        <div class="live-card-actions">
          <button class="btn-card-action" onclick="window.OFMC_APP.showDetail('${oralItem.id}')">
            <i class="fa-solid fa-circle-info"></i> Ver Detalles y Moderación
          </button>
          <button class="btn-fav ${favClass}" data-favid="${oralItem.id}" onclick="window.OFMC_APP.toggleFav('${oralItem.id}')" title="Guardar">
            ${favIcon}
          </button>
        </div>
      `;
    } else {
      // No active oral talk right now in this room
      timeBadge.textContent = 'Sin sesión activa';
      progressEl.style.width = '0%';
      bodyEl.innerHTML = `
        <div class="live-card-title" style="color: var(--text-dim); font-size: 0.9rem;">
          No hay ponencia oral en desarrollo en este momento en ${roomName}.
        </div>
        <div class="live-card-inst">Revisa el programa completo o consulta las charlas próximas más abajo.</div>
      `;
    }
  }

  function renderNextTalks(curMins, dayNum) {
    const container = document.getElementById('nextCardsContainer');
    if (!container) return;

    // Find upcoming orals starting after curMins on this day
    const upcomingOrals = data.orales
      .filter(o => o.dia_num === dayNum && timeStringToMinutes(o.start_time) >= curMins)
      .sort((a, b) => timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time));

    // Next for 2.5
    const next25 = upcomingOrals.find(o => o.sala.includes('2.5'));
    // Next for 3.7
    const next37 = upcomingOrals.find(o => o.sala.includes('3.7'));

    let html = '';
    if (next25) {
      const waitMins = timeStringToMinutes(next25.start_time) - curMins;
      const waitStr = waitMins > 0 ? `Comienza en ${waitMins} min` : 'Comienza pronto';
      html += `
        <div class="next-card" onclick="window.OFMC_APP.showDetail('${next25.id}')">
          <div class="next-card-top">
            <span class="room-tag tag-ocean"><i class="fa-solid fa-water"></i> Sala 2.5</span>
            <span style="color: var(--ocean-light); font-weight: 700;">${next25.start_time} (${waitStr})</span>
          </div>
          <div class="next-card-title">${next25.id}: ${next25.titulo}</div>
          <div class="next-card-author"><i class="fa-solid fa-user"></i> ${next25.autor}</div>
        </div>
      `;
    }
    if (next37) {
      const waitMins = timeStringToMinutes(next37.start_time) - curMins;
      const waitStr = waitMins > 0 ? `Comienza en ${waitMins} min` : 'Comienza pronto';
      html += `
        <div class="next-card" onclick="window.OFMC_APP.showDetail('${next37.id}')">
          <div class="next-card-top">
            <span class="room-tag tag-meteo"><i class="fa-solid fa-cloud-sun"></i> Sala 3.7</span>
            <span style="color: var(--meteo-sky); font-weight: 700;">${next37.start_time} (${waitStr})</span>
          </div>
          <div class="next-card-title">${next37.id}: ${next37.titulo}</div>
          <div class="next-card-author"><i class="fa-solid fa-user"></i> ${next37.autor}</div>
        </div>
      `;
    }

    if (!html) {
      html = `
        <div class="next-card" style="grid-column: 1 / -1; text-align: center; color: var(--text-dim); padding: 18px;">
          No hay más charlas orales programadas para el resto del día de hoy.
        </div>
      `;
    }
    container.innerHTML = html;
  }

  // =========================================================================
  // 7. PROGRAM VIEW (PROGRAMA DÍA POR DÍA)
  // =========================================================================
  function renderProgramView() {
    const listContainer = document.getElementById('programTimelineList');
    if (!listContainer) return;

    const dayNum = state.programDay;
    const track = state.programTrack;

    // Collect all items for this day
    const dayEvents = data.eventos_especiales.filter(e => e.dia_num === dayNum);
    const dayOrales = data.orales.filter(o => o.dia_num === dayNum);
    
    // Day poster summary item if day has posters
    const dayPosters = data.posters.filter(p => p.dia_num === dayNum);
    let posterSummary = null;
    if (dayPosters.length > 0) {
      const timeStr = dayNum === 4 ? '13:30 - 15:00' : '17:00 - 19:00';
      posterSummary = {
        id: `POSTERS-D${dayNum}`,
        dia_num: dayNum,
        start_time: timeStr.split('-')[0].trim(),
        end_time: timeStr.split('-')[1].trim(),
        horario: timeStr,
        sala: 'Sectores Comunes Pisos 2 y 3',
        titulo: `Sesión Oficial de Paneles Póster — Día ${dayNum} (${dayPosters.length} pósters)`,
        autor: `Exhibición de paneles P-${dayPosters[0].id.replace('P-','')} a P-${dayPosters[dayPosters.length-1].id.replace('P-','')}`,
        sesion: 'Evaluación y exhibición con autores presentes frente a sus paneles',
        tipo: 'PósterSummary',
        count: dayPosters.length
      };
    }

    let combined = [...dayEvents, ...dayOrales];
    if (posterSummary) combined.push(posterSummary);

    // Apply Track Filter
    if (track === '2.5') {
      combined = combined.filter(item => item.sala && item.sala.includes('2.5'));
    } else if (track === '3.7') {
      combined = combined.filter(item => item.sala && item.sala.includes('3.7'));
    } else if (track === 'posters') {
      combined = combined.filter(item => item.tipo === 'PósterSummary' || (item.sala && item.sala.includes('Pisos 2 y 3') && item.titulo && item.titulo.includes('Póster')));
    } else if (track === 'events') {
      combined = combined.filter(item => item.tipo === 'Evento' || item.tipo === 'Magistral' || item.tipo === 'Pausa');
    }

    // Sort chronologically
    combined.sort((a, b) => timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time));

    if (combined.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-filter"></i></div>
          <div class="empty-state-title">No hay actividades para este filtro</div>
          <div class="empty-state-desc">Prueba seleccionando "Todas las salas" para ver el cronograma completo de este día.</div>
        </div>
      `;
      return;
    }

    let html = '';
    combined.forEach(item => {
      const isOral = item.tipo === 'Oral';
      const isPostSum = item.tipo === 'PósterSummary';
      const isEv = !isOral && !isPostSum;

      let roomClass = 'room-event';
      let tagClass = 'tag-gold';
      let roomIcon = 'fa-star';

      if (item.sala && item.sala.includes('2.5')) {
        roomClass = 'room-25'; tagClass = 'tag-ocean'; roomIcon = 'fa-water';
      } else if (item.sala && item.sala.includes('3.7')) {
        roomClass = 'room-37'; tagClass = 'tag-meteo'; roomIcon = 'fa-wind';
      } else if (isPostSum || (item.sala && item.sala.includes('Pisos 2 y 3') && item.tipo !== 'Pausa')) {
        roomClass = 'room-poster'; tagClass = 'tag-purple'; roomIcon = 'fa-images';
      } else if (item.tipo === 'Pausa') {
        roomClass = 'room-event'; tagClass = 'tag-ocean'; roomIcon = 'fa-mug-hot';
      }

      const favActive = isFavorite(item.id) ? 'active' : '';
      const favIcon = isFavorite(item.id) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';

      html += `
        <div class="talk-card ${roomClass}" onclick="window.OFMC_APP.handleProgramCardClick('${item.id}')">
          <div class="talk-card-top">
            <span class="room-tag ${tagClass}"><i class="fa-solid ${roomIcon}"></i> ${item.sala}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="time-badge">${item.horario}</span>
              ${isOral ? `<button class="btn-fav ${favActive}" data-favid="${item.id}" onclick="event.stopPropagation(); window.OFMC_APP.toggleFav('${item.id}')">${favIcon}</button>` : ''}
            </div>
          </div>
          <div class="talk-card-title">
            ${isOral ? `<span class="talk-code-badge">${item.id}</span> ` : ''}
            ${item.titulo}
          </div>
          <div class="talk-card-meta">
            ${item.autor ? `<div class="talk-card-author"><i class="fa-solid fa-user"></i> ${item.autor}</div>` : ''}
            ${item.inst ? `<div>${item.inst}</div>` : ''}
          </div>
          <div class="talk-card-bottom">
            <span class="talk-session-label">${item.sesion || item.descripcion || ''}</span>
            ${isPostSum ? `<span style="color: var(--purple-poster); font-weight: 700; font-size: 0.75rem;">Ver lista <i class="fa-solid fa-chevron-right"></i></span>` : ''}
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  }

  // =========================================================================
  // 8. POSTERS VIEW (PÓSTERS)
  // =========================================================================
  function renderPostersView() {
    const grid = document.getElementById('postersGridContainer');
    const badge = document.getElementById('postersCountBadge');
    if (!grid) return;

    let filtered = [...data.posters];

    // Day filter
    if (state.posterDay !== 'all') {
      const dNum = parseInt(state.posterDay, 10);
      filtered = filtered.filter(p => p.dia_num === dNum);
    }

    // Search filter
    if (state.posterSearch.trim()) {
      const q = strip_accents(state.posterSearch.toLowerCase());
      filtered = filtered.filter(p => {
        return strip_accents(p.id.toLowerCase()).includes(q) ||
               strip_accents(p.autor.toLowerCase()).includes(q) ||
               strip_accents(p.titulo.toLowerCase()).includes(q) ||
               strip_accents(p.inst.toLowerCase()).includes(q) ||
               strip_accents(p.eje.toLowerCase()).includes(q);
      });
    }

    if (badge) badge.textContent = `${filtered.length} paneles`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <div class="empty-state-title">No se encontraron pósters</div>
          <div class="empty-state-desc">Prueba con otro término de búsqueda o selecciona otro día.</div>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const favActive = isFavorite(p.id) ? 'active' : '';
      const favIcon = isFavorite(p.id) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';

      html += `
        <div class="poster-card" onclick="window.OFMC_APP.showDetail('${p.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="poster-panel-badge">${p.id}</span>
              <span class="room-tag tag-purple">Día ${p.dia_num} · ${p.horario}</span>
            </div>
            <button class="btn-fav ${favActive}" data-favid="${p.id}" onclick="event.stopPropagation(); window.OFMC_APP.toggleFav('${p.id}')">${favIcon}</button>
          </div>
          <div class="talk-card-title" style="font-size: 0.9rem;">${p.titulo}</div>
          <div class="talk-card-author"><i class="fa-solid fa-user"></i> ${p.autor}</div>
          <div class="talk-card-meta" style="margin-top: 4px;">
            <div>${p.inst}</div>
            <div style="color: var(--text-dim); font-size: 0.72rem; margin-top: 2px;">Eje: ${p.eje}</div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  // =========================================================================
  // 9. MI AGENDA VIEW (FAVORITOS Y CONFLICTOS)
  // =========================================================================
  function renderAgendaView() {
    const container = document.getElementById('agendaListContainer');
    const countSub = document.getElementById('agendaCountSubtitle');
    const conflictAlert = document.getElementById('agendaConflictAlert');
    if (!container) return;

    if (state.favorites.length === 0) {
      if (countSub) countSub.textContent = '0 presentaciones guardadas';
      if (conflictAlert) conflictAlert.style.display = 'none';
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-regular fa-heart"></i></div>
          <div class="empty-state-title">Aún no tienes charlas guardadas</div>
          <div class="empty-state-desc">Toca el icono de corazón en cualquier charla oral o panel póster para armar tu cronograma personalizado sin conexión.</div>
        </div>
      `;
      return;
    }

    // Retrieve full items for favorites
    const favItems = [];
    state.favorites.forEach(fid => {
      const oral = data.orales.find(o => o.id === fid);
      if (oral) favItems.push(oral);
      else {
        const post = data.posters.find(p => p.id === fid);
        if (post) favItems.push(post);
      }
    });

    if (countSub) countSub.textContent = `${favItems.length} presentaciones guardadas`;

    // Sort chronologically by dia_num then start_time
    favItems.sort((a, b) => {
      if (a.dia_num !== b.dia_num) return a.dia_num - b.dia_num;
      return timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time);
    });

    // Detect Conflicts (same day and overlapping times in different rooms)
    let hasConflict = false;
    for (let i = 0; i < favItems.length; i++) {
      for (let j = i + 1; j < favItems.length; j++) {
        const itemA = favItems[i];
        const itemB = favItems[j];
        if (itemA.dia_num === itemB.dia_num && itemA.sala !== itemB.sala) {
          const sA = timeStringToMinutes(itemA.start_time);
          const eA = timeStringToMinutes(itemA.end_time);
          const sB = timeStringToMinutes(itemB.start_time);
          const eB = timeStringToMinutes(itemB.end_time);
          if (Math.max(sA, sB) < Math.min(eA, eB)) {
            hasConflict = true;
            itemA.isConflict = true;
            itemB.isConflict = true;
          }
        }
      }
    }

    if (conflictAlert) {
      conflictAlert.style.display = hasConflict ? 'flex' : 'none';
    }

    let html = '';
    let currentDayHeader = 0;

    favItems.forEach(item => {
      if (item.dia_num !== currentDayHeader) {
        currentDayHeader = item.dia_num;
        html += `
          <div class="section-divider" style="margin-top: 18px;">
            <div class="divider-line"></div>
            <span class="divider-text"><i class="fa-solid fa-calendar-day"></i> Día ${currentDayHeader} · ${data.dias[currentDayHeader-1].fecha_larga}</span>
            <div class="divider-line"></div>
          </div>
        `;
      }

      const isOral = item.tipo === 'Oral';
      let roomClass = isOral ? (item.sala.includes('2.5') ? 'room-25' : 'room-37') : 'room-poster';
      let tagClass = isOral ? (item.sala.includes('2.5') ? 'tag-ocean' : 'tag-meteo') : 'tag-purple';

      html += `
        <div class="talk-card ${roomClass}" onclick="window.OFMC_APP.showDetail('${item.id}')">
          <div class="talk-card-top">
            <span class="room-tag ${tagClass}"><i class="fa-solid fa-map-pin"></i> ${item.sala}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="time-badge">${item.horario}</span>
              <button class="btn-fav active" data-favid="${item.id}" onclick="event.stopPropagation(); window.OFMC_APP.toggleFav('${item.id}')"><i class="fa-solid fa-heart"></i></button>
            </div>
          </div>
          ${item.isConflict ? `<div style="color: #F87171; font-size: 0.74rem; font-weight: 700; margin-bottom: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> Coincide en horario con otra charla guardada</div>` : ''}
          <div class="talk-card-title">
            <span class="talk-code-badge">${item.id}</span>
            ${item.titulo}
          </div>
          <div class="talk-card-author"><i class="fa-solid fa-user"></i> ${item.autor}</div>
          <div class="talk-card-meta">
            <div>${item.inst}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // =========================================================================
  // 10. AUTHORS DIRECTORY VIEW
  // =========================================================================
  function renderAuthorsView() {
    const container = document.getElementById('authorsListContainer');
    const alphaBar = document.getElementById('alphaQuickBar');
    const countBadge = document.getElementById('authorsCountBadge');
    if (!container) return;

    let filtered = [...data.autores];

    if (state.authorSearch.trim()) {
      const q = strip_accents(state.authorSearch.toLowerCase());
      filtered = filtered.filter(a => {
        return strip_accents(a.nombre.toLowerCase()).includes(q) ||
               strip_accents(a.inst.toLowerCase()).includes(q);
      });
    }

    if (countBadge) countBadge.textContent = `${filtered.length} autores`;

    // Render Alphabet Bar
    if (alphaBar && !alphaBar.hasChildNodes()) {
      const letters = ['A','B','C','D','E','F','G','H','I','J','L','M','N','O','P','Q','R','S','T','V','W','Z'];
      let abHtml = '';
      letters.forEach(l => {
        abHtml += `<button class="alpha-letter-btn" onclick="window.OFMC_APP.jumpToLetter('${l}')">${l}</button>`;
      });
      alphaBar.innerHTML = abHtml;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-user-xmark"></i></div>
          <div class="empty-state-title">No se encontraron autores</div>
          <div class="empty-state-desc">Prueba con otro nombre o apellido.</div>
        </div>
      `;
      return;
    }

    let html = '';
    let currentLetter = '';

    filtered.forEach(auth => {
      const firstLetter = strip_accents(auth.nombre[0]);
      if (firstLetter !== currentLetter && !state.authorSearch.trim()) {
        currentLetter = firstLetter;
        html += `<div id="letter-${currentLetter}" class="section-divider" style="margin-top: 14px;"><span class="divider-text" style="color: var(--ocean-light); font-size: 0.95rem;">— ${currentLetter} —</span><div class="divider-line"></div></div>`;
      }

      let worksHtml = '';
      auth.trabajos.forEach(w => {
        const isO = w.tipo === 'Oral';
        worksHtml += `
          <span class="work-mini-pill" onclick="event.stopPropagation(); window.OFMC_APP.showDetail('${w.id}')">
            ${w.id} (${w.tipo}) · ${w.dia} · ${w.horario} · ${w.sala}
          </span>
        `;
      });

      html += `
        <div class="author-item-card">
          <div class="author-item-name">${auth.nombre}</div>
          <div class="author-item-inst">${auth.inst || ''}</div>
          <div class="author-item-works">${worksHtml}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // =========================================================================
  // 11. DETAIL MODAL & UNIVERSAL SEARCH
  // =========================================================================
  function showDetail(id) {
    let item = data.orales.find(o => o.id === id);
    if (!item) item = data.posters.find(p => p.id === id);
    if (!item) item = data.eventos_especiales.find(e => e.id === id);
    if (!item) return;

    const modal = document.getElementById('detailModal');
    const roomBadge = document.getElementById('detailRoomBadge');
    const content = document.getElementById('detailModalContent');
    if (!modal || !content) return;

    roomBadge.textContent = `${item.sala} · ${item.horario}`;
    if (item.sala.includes('2.5')) roomBadge.style.background = 'var(--ocean-blue)';
    else if (item.sala.includes('3.7')) roomBadge.style.background = 'var(--meteo-cyan)';
    else if (item.tipo === 'Póster') roomBadge.style.background = 'var(--purple-poster)';
    else roomBadge.style.background = 'var(--gold-accent)';

    const isFav = isFavorite(item.id);
    const favText = isFav ? 'Quitar de Mi Agenda' : 'Agregar a Mi Agenda';
    const favIcon = isFav ? '<i class="fa-solid fa-heart" style="color: #F43F5E;"></i>' : '<i class="fa-regular fa-heart"></i>';

    let modHtml = '';
    if (item.pres || item.sec || item.sup) {
      modHtml = `
        <div class="detail-section-block">
          <div class="detail-label">Comité de Moderación de este Bloque</div>
          <div class="detail-value">
            ${item.pres ? `<div><strong>Presidente/a:</strong> ${item.pres}</div>` : ''}
            ${item.sec ? `<div><strong>Secretario/a:</strong> ${item.sec}</div>` : ''}
            ${item.sup ? `<div><strong>Suplente:</strong> ${item.sup}</div>` : ''}
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="detail-code-row">
        <span class="detail-id">${item.id}</span>
        <span class="detail-time">${item.dia_label || ('Día ' + item.dia_num)} · ${item.horario}</span>
      </div>
      <div class="detail-title">${item.titulo}</div>

      <div class="detail-section-block">
        <div class="detail-label">Autor/a Principal y Filiación</div>
        <div class="detail-value">
          <strong style="color: #FFF; font-size: 0.95rem;">${item.autor || item.conferencista || ''}</strong>
          ${item.inst ? `<div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 2px;">${item.inst}</div>` : ''}
          ${item.email ? `<div style="color: var(--ocean-light); font-size: 0.8rem; margin-top: 4px;"><i class="fa-solid fa-envelope"></i> ${item.email}</div>` : ''}
        </div>
      </div>

      <div class="detail-section-block">
        <div class="detail-label">Sesión Temática / Eje</div>
        <div class="detail-value">
          <strong>${item.sesion || ''}</strong>
          ${item.eje ? `<div style="color: var(--text-dim); font-size: 0.78rem; margin-top: 2px;">Eje científico: ${item.eje}</div>` : ''}
          ${item.descripcion ? `<div style="font-size: 0.82rem; margin-top: 4px;">${item.descripcion}</div>` : ''}
        </div>
      </div>

      ${modHtml}

      <div class="detail-actions-row">
        <button class="btn-primary-action" onclick="window.OFMC_APP.toggleFav('${item.id}'); window.OFMC_APP.showDetail('${item.id}');">
          ${favIcon} <span>${favText}</span>
        </button>
      </div>
    `;

    modal.classList.add('open');
  }

  function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('open');
  }

  // Universal Search
  function performGlobalSearch(query) {
    const resultsContainer = document.getElementById('globalSearchResults');
    if (!resultsContainer) return;

    const q = strip_accents(query.trim().toLowerCase());
    if (q.length < 2) {
      resultsContainer.innerHTML = `<div class="search-hint">Escribe al menos 2 letras para buscar entre las 212 presentaciones...</div>`;
      return;
    }

    const matches = [];
    // Search orales
    data.orales.forEach(o => {
      if (strip_accents(o.id.toLowerCase()).includes(q) ||
          strip_accents(o.autor.toLowerCase()).includes(q) ||
          strip_accents(o.titulo.toLowerCase()).includes(q) ||
          strip_accents(o.inst.toLowerCase()).includes(q) ||
          strip_accents(o.sesion.toLowerCase()).includes(q)) {
        matches.push(o);
      }
    });

    // Search posters
    data.posters.forEach(p => {
      if (strip_accents(p.id.toLowerCase()).includes(q) ||
          strip_accents(p.autor.toLowerCase()).includes(q) ||
          strip_accents(p.titulo.toLowerCase()).includes(q) ||
          strip_accents(p.inst.toLowerCase()).includes(q)) {
        matches.push(p);
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-hint">No se encontraron resultados para "${query}".</div>`;
      return;
    }

    let html = '';
    matches.slice(0, 30).forEach(m => {
      const isO = m.tipo === 'Oral';
      html += `
        <div class="talk-card" style="padding: 10px 12px; margin-bottom: 6px;" onclick="window.OFMC_APP.closeSearchModal(); window.OFMC_APP.showDetail('${m.id}')">
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 3px;">
            <span class="talk-code-badge">${m.id} (${m.tipo})</span>
            <span style="color: var(--text-muted);">${m.dia_label || ('Día ' + m.dia_num)} · ${m.horario} · ${m.sala}</span>
          </div>
          <div style="font-size: 0.88rem; font-weight: 700; color: #FFF; line-height: 1.3;">${m.titulo}</div>
          <div style="font-size: 0.78rem; color: #E2E8F0; margin-top: 3px;"><i class="fa-solid fa-user"></i> ${m.autor}</div>
        </div>
      `;
    });
    resultsContainer.innerHTML = html;
  }

  // =========================================================================
  // 12. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function initEvents() {
    // Nav bar items
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.dataset.view;
        switchView(targetView);
      });
    });

    // Simulator Drawer Toggle
    const simDrawer = document.getElementById('simDrawer');
    const btnToggleSim = document.getElementById('btnToggleSim');
    const btnCloseSim = document.getElementById('btnCloseSim');

    if (btnToggleSim) {
      btnToggleSim.addEventListener('click', () => {
        simDrawer.classList.toggle('open');
      });
    }
    if (btnCloseSim) {
      btnCloseSim.addEventListener('click', () => {
        simDrawer.classList.remove('open');
      });
    }

    // Quick Simulation Chips
    document.querySelectorAll('.sim-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        if (chip.dataset.now === 'true') {
          state.isRealTime = true;
        } else {
          state.isRealTime = false;
          state.simDay = parseInt(chip.dataset.day, 10);
          state.simMinutes = timeStringToMinutes(chip.dataset.time);
          
          // Update slider & day buttons
          const slider = document.getElementById('timeSlider');
          if (slider) slider.value = state.simMinutes;
          const timeDisp = document.getElementById('simTimeDisplay');
          if (timeDisp) timeDisp.textContent = chip.dataset.time;

          document.querySelectorAll('.sim-day-btn').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.d, 10) === state.simDay);
          });
        }
        renderLiveView();
      });
    });

    // Simulator Manual Day Buttons
    document.querySelectorAll('.sim-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sim-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.isRealTime = false;
        state.simDay = parseInt(btn.dataset.d, 10);
        document.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
        renderLiveView();
      });
    });

    // Simulator Slider
    const timeSlider = document.getElementById('timeSlider');
    const simTimeDisp = document.getElementById('simTimeDisplay');
    if (timeSlider) {
      timeSlider.addEventListener('input', (e) => {
        state.isRealTime = false;
        state.simMinutes = parseInt(e.target.value, 10);
        const tStr = minutesToTimeString(state.simMinutes);
        if (simTimeDisp) simTimeDisp.textContent = tStr;
        document.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
        renderLiveView();
      });
    }

    // Program Day Pills
    document.querySelectorAll('#programDayPills .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#programDayPills .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.programDay = parseInt(btn.dataset.day, 10);
        renderProgramView();
      });
    });

    // Program Track Filters
    document.querySelectorAll('#programTrackFilters .filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#programTrackFilters .filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.programTrack = btn.dataset.track;
        renderProgramView();
      });
    });

    // Poster Day Pills
    document.querySelectorAll('#posterDayPills .pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#posterDayPills .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.posterDay = btn.dataset.pday;
        renderPostersView();
      });
    });

    // Poster Search Input
    const pInput = document.getElementById('posterSearchInput');
    const pClear = document.getElementById('btnClearPosterSearch');
    if (pInput) {
      pInput.addEventListener('input', (e) => {
        state.posterSearch = e.target.value;
        if (pClear) pClear.style.display = e.target.value ? 'block' : 'none';
        renderPostersView();
      });
    }
    if (pClear) {
      pClear.addEventListener('click', () => {
        if (pInput) pInput.value = '';
        state.posterSearch = '';
        pClear.style.display = 'none';
        renderPostersView();
      });
    }

    // Author Search Input
    const aInput = document.getElementById('authorSearchInput');
    const aClear = document.getElementById('btnClearAuthorSearch');
    if (aInput) {
      aInput.addEventListener('input', (e) => {
        state.authorSearch = e.target.value;
        if (aClear) aClear.style.display = e.target.value ? 'block' : 'none';
        renderAuthorsView();
      });
    }
    if (aClear) {
      aClear.addEventListener('click', () => {
        if (aInput) aInput.value = '';
        state.authorSearch = '';
        aClear.style.display = 'none';
        renderAuthorsView();
      });
    }

    // Global Search Modal
    const btnOpenSearch = document.getElementById('btnOpenSearch');
    const searchModal = document.getElementById('searchModal');
    const btnCloseSearchModal = document.getElementById('btnCloseSearchModal');
    const globalSearchInput = document.getElementById('globalSearchInput');

    if (btnOpenSearch) {
      btnOpenSearch.addEventListener('click', () => {
        if (searchModal) {
          searchModal.classList.add('open');
          if (globalSearchInput) {
            globalSearchInput.value = '';
            globalSearchInput.focus();
            performGlobalSearch('');
          }
        }
      });
    }
    if (btnCloseSearchModal) {
      btnCloseSearchModal.addEventListener('click', () => {
        if (searchModal) searchModal.classList.remove('open');
      });
    }
    if (globalSearchInput) {
      globalSearchInput.addEventListener('input', (e) => {
        performGlobalSearch(e.target.value);
      });
    }

    // Detail Modal Close
    const btnCloseDetailModal = document.getElementById('btnCloseDetailModal');
    if (btnCloseDetailModal) {
      btnCloseDetailModal.addEventListener('click', closeDetailModal);
    }

    // Close modals on clicking backdrop
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });

    // Share Agenda Button
    const btnShare = document.getElementById('btnShareAgenda');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        if (state.favorites.length === 0) {
          alert('Tu agenda aún no tiene charlas guardadas.');
          return;
        }
        let txt = `*Mi Agenda OFMC 2026 (VIII Congreso de Oceanografía Física, Meteorología y Clima)*\n\n`;
        state.favorites.forEach(fid => {
          const item = data.orales.find(o => o.id === fid) || data.posters.find(p => p.id === fid);
          if (item) {
            txt += `• [${item.id}] ${item.dia_label || ('Día ' + item.dia_num)} (${item.horario}) en ${item.sala}:\n  "${item.titulo}" - ${item.autor}\n\n`;
          }
        });
        txt += `Consúltala en la App Oficial: https://manuelcastillos.github.io/manuel_oce_castillo/app_congreso/`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(() => {
            alert('¡Tu agenda ha sido copiada al portapapeles! Puedes pegarla en WhatsApp, notas o compartirla con tus colegas.');
          });
        } else {
          alert('Agenda generada:\n\n' + txt);
        }
      });
    }

    // Auto-refresh live view every 30 seconds
    setInterval(() => {
      if (state.activeView === 'view-ahora') {
        renderLiveView();
      }
    }, 30000);
  }

  // Helper jump to alphabet letter
  function jumpToLetter(letter) {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleProgramCardClick(id) {
    if (id.startsWith('POSTERS-D')) {
      const dNum = id.replace('POSTERS-D', '');
      viewPostersDay(dNum);
    } else {
      showDetail(id);
    }
  }

  function viewPostersDay(dNum) {
    state.posterDay = String(dNum);
    switchView('view-posters');
    document.querySelectorAll('#posterDayPills .pill-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.pday === String(dNum));
    });
    renderPostersView();
  }

  // PWA Service Worker Registration
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Service Worker registrado:', reg.scope))
          .catch(err => console.log('Error registro SW:', err));
      });
    }

    // Handle install prompt toast
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const toast = document.getElementById('installToast');
      if (toast && !localStorage.getItem('ofmc_install_dismissed')) {
        toast.style.display = 'flex';
      }

      const btnInstall = document.getElementById('btnInstallPwa');
      if (btnInstall) {
        btnInstall.addEventListener('click', () => {
          if (toast) toast.style.display = 'none';
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
              deferredPrompt = null;
            });
          }
        });
      }

      const btnDismiss = document.getElementById('btnDismissInstall');
      if (btnDismiss) {
        btnDismiss.addEventListener('click', () => {
          if (toast) toast.style.display = 'none';
          localStorage.setItem('ofmc_install_dismissed', 'true');
        });
      }
    });
  }

  // GLOBAL EXPORTS
  window.OFMC_APP = {
    toggleFav: toggleFavorite,
    showDetail: showDetail,
    closeDetailModal: closeDetailModal,
    closeSearchModal: () => {
      const m = document.getElementById('searchModal');
      if (m) m.classList.remove('open');
    },
    jumpToLetter: jumpToLetter,
    handleProgramCardClick: handleProgramCardClick,
    viewPostersDay: viewPostersDay
  };

  // INITIALIZE ON DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    updateFavoritesBadge();
    renderLiveView();
    initPWA();
    console.log('OFMC 2026 Mobile App inicializada exitosamente.');
  });

})();
