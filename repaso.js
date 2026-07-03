const API_URL = 'api.php';

// ── Utilidades de fecha ────────────────────────────────────────────────────────

function fechaHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fechaMasN(fechaStr, n) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function diffDias(fechaStr) {
  const hoy = new Date(fechaHoy());
  const fecha = new Date(fechaStr);
  return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
}

function formatearFecha(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ── API: obtener todos los repasos ────────────────────────────────────────────

async function getLog() {
  try {
    const res = await fetch(`${API_URL}?action=get_repasos`);
    return await res.json();
  } catch { return []; }
}

// ── API: guardar repaso nuevo ─────────────────────────────────────────────────

async function registrarCursoCompletado(subject, day, level, tema) {
  try {
    await fetch(`${API_URL}?action=save_repaso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, day, level, tema, fechaCompletado: fechaHoy(), repasosDone: [] })
    });
  } catch(e) { console.error('Error guardando repaso:', e); }
}

// ── API: marcar repaso como hecho ─────────────────────────────────────────────

async function marcarRepasoAPI(id, repasosDone) {
  try {
    await fetch(`${API_URL}?action=marcar_repaso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, repasosDone })
    });
  } catch(e) { console.error('Error marcando repaso:', e); }
}

// ── Calcular próximas fechas de repaso ────────────────────────────────────────

function proximoRepaso(entrada) {
  const done = entrada.repasosDone || [];
  for (let i = 0; i < REPASO_INTERVALOS.length; i++) {
    if (!done.includes(i)) {
      const fecha = fechaMasN(entrada.fechaCompletado, REPASO_INTERVALOS[i]);
      return { intervaloIdx: i, fecha };
    }
  }
  return null;
}

// ── Render principal ──────────────────────────────────────────────────────────

function levelClasses(level) {
  if (level === 'easy') return { badge: 'bg-amber-500', box: 'border-amber-100 bg-amber-50', text: 'text-amber-800' };
  if (level === 'medium') return { badge: 'bg-emerald-500', box: 'border-emerald-100 bg-emerald-50', text: 'text-emerald-800' };
  return { badge: 'bg-rose-500', box: 'border-rose-100 bg-rose-50', text: 'text-rose-800' };
}

async function render() {
  const hoy = fechaHoy();
  const log = await getLog();

  document.getElementById('fecha-hoy').textContent = formatearFecha(hoy);

  const repasosHoy = [];
  const proximos = [];

  log.forEach((entrada) => {
    const prox = proximoRepaso(entrada);
    if (!prox) return;

    const diff = diffDias(prox.fecha);

    if (diff <= 0) {
      repasosHoy.push({ entrada, intervaloIdx: prox.intervaloIdx, vencido: diff < 0 });
    } else if (diff <= 14) {
      proximos.push({ entrada, fecha: prox.fecha, diff });
    }
  });

  // ── Tarjetas de hoy ──
  const contenedorHoy = document.getElementById('repasos-hoy');
  const sinRepasos = document.getElementById('sin-repasos');
  contenedorHoy.innerHTML = '';

  if (repasosHoy.length === 0) {
    sinRepasos.classList.remove('hidden');
  } else {
    sinRepasos.classList.add('hidden');
    repasosHoy.forEach(({ entrada, intervaloIdx, vencido }) => {
      const lc = levelClasses(entrada.level);
      const numRepaso = intervaloIdx + 1;
      const card = document.createElement('div');
      card.className = `border rounded-xl p-4 flex items-start gap-4 transition-all duration-150 ${lc.box}`;
      card.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${lc.badge}">${entrada.level}</span>
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">${entrada.day}</span>
            ${vencido ? `<span class="text-[10px] font-bold text-rose-500">Vencido</span>` : ''}
          </div>
          <h3 class="font-bold text-slate-900 text-base leading-tight">${entrada.subject}</h3>
          ${entrada.tema ? `<p class="text-xs text-slate-500 mt-0.5">Tema: ${entrada.tema}</p>` : ''}
          <p class="text-xs text-slate-400 mt-1">Repaso ${numRepaso} de ${REPASO_INTERVALOS.length} · Intervalo ${REPASO_INTERVALOS[intervaloIdx]} día${REPASO_INTERVALOS[intervaloIdx] > 1 ? 's' : ''}</p>
        </div>
        <button onclick="marcarRepaso(${entrada.id}, ${intervaloIdx}, ${JSON.stringify(entrada.repasosDone || [])})"
          class="flex-shrink-0 w-9 h-9 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-150 text-slate-300">
          <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
        </button>
      `;
      contenedorHoy.appendChild(card);
    });
  }

  // ── Próximos repasos ──
  const contenedorProximos = document.getElementById('proximos-repasos');
  contenedorProximos.innerHTML = '';

  if (proximos.length === 0) {
    contenedorProximos.innerHTML = `<p class="text-sm text-slate-400">No hay repasos programados en los próximos 14 días.</p>`;
  } else {
    const porFecha = {};
    proximos.forEach(item => {
      if (!porFecha[item.fecha]) porFecha[item.fecha] = [];
      porFecha[item.fecha].push(item);
    });

    Object.keys(porFecha).sort().forEach(fecha => {
      const grupo = porFecha[fecha];
      const diff = diffDias(fecha);
      const etiqueta = diff === 1 ? 'Mañana' : `En ${diff} días`;

      const wrap = document.createElement('div');
      wrap.className = 'border border-slate-200 rounded-xl overflow-hidden';
      wrap.innerHTML = `
        <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <span class="text-xs font-bold text-slate-700">${formatearFecha(fecha)}</span>
          <span class="text-[11px] text-slate-400">${etiqueta}</span>
        </div>
        <div class="divide-y divide-slate-100">
          ${grupo.map(({ entrada }) => `
            <div class="px-4 py-2.5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full flex-shrink-0 ${levelClasses(entrada.level).badge}"></span>
              <span class="text-sm font-semibold text-slate-800">${entrada.subject}</span>
              ${entrada.tema ? `<span class="text-xs text-slate-400 truncate">— ${entrada.tema}</span>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      contenedorProximos.appendChild(wrap);
    });
  }
}

// ── Marcar repaso como hecho ──────────────────────────────────────────────────

async function marcarRepaso(id, intervaloIdx, repasosDoneActual) {
  const repasosDone = Array.isArray(repasosDoneActual) ? repasosDoneActual : [];
  if (!repasosDone.includes(intervaloIdx)) repasosDone.push(intervaloIdx);
  await marcarRepasoAPI(id, repasosDone);
  render();
}

// ── Modal: guardar tema ───────────────────────────────────────────────────────

let _pendingTemaData = null;

function abrirModalTema(subject, day, level) {
  _pendingTemaData = { subject, day, level };
  document.getElementById('modal-tema-curso').textContent = `${subject} · ${day}`;
  document.getElementById('input-tema').value = '';
  document.getElementById('modal-tema').classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => document.getElementById('input-tema').focus(), 100);
}

async function guardarTema() {
  if (!_pendingTemaData) return;
  const tema = document.getElementById('input-tema').value.trim();
  await registrarCursoCompletado(_pendingTemaData.subject, _pendingTemaData.day, _pendingTemaData.level, tema);
  cerrarModalTema();
}

async function cancelarTema() {
  if (!_pendingTemaData) return;
  await registrarCursoCompletado(_pendingTemaData.subject, _pendingTemaData.day, _pendingTemaData.level, '');
  cerrarModalTema();
}

function cerrarModalTema() {
  _pendingTemaData = null;
  document.getElementById('modal-tema').classList.add('opacity-0', 'pointer-events-none');
  render();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  document.getElementById('theme-knob').classList.toggle('theme-knob-dark', isDark);
  document.getElementById('theme-toggle').classList.toggle('theme-toggle-dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ── Init ──────────────────────────────────────────────────────────────────────

window.onload = () => {
  render();
};
