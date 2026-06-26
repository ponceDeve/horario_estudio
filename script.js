// ── Datos: ahora cada día solo define SUS CURSOS (sin horario fijo) ──────────
// El orden en que se estudian ya no importa: el usuario elige el curso que quiere.
// Dentro de cada curso, los pomodoros sí siguen en orden con descansos cortos.
// scheduleData y REPASO_INTERVALOS vienen de data.js

const POMODORO_MIN = 25;
const REST_MIN = 5;

let currentDay = 'lunes';
let currentCourseIndex = null;   // null = viendo la lista de cursos del día
let currentTaskIndex = 0;        // posición dentro del curso abierto (pomodoro o descanso)
let timerInterval = null;
let timerTimeRemaining = 1500;
let timerTotalDuration = 1500;
let timerIsPaused = true;
let soundLoopInterval = null;
let timerMode = 'course';        // 'course' | 'manual' (descanso/cena manual)
let manualBreakLabel = '';
let allowAnyDay = false;         // true cuando se "activa el horario" un domingo para recuperar un pomodoro

// ── Construcción de tareas de un curso (pomodoros + descansos cortos) ────────

function buildCourseTasks(course) {
  const tasks = [];
  for (let i = 1; i <= course.pomodoros; i++) {
    tasks.push({ type: "course", subject: course.subject, level: course.level, detail: `Pomodoro ${i} de ${course.pomodoros}`, duration: POMODORO_MIN });
    if (i < course.pomodoros) {
      tasks.push({ type: "rest", duration: REST_MIN });
    }
  }
  return tasks;
}

function getCourseTasks(day, courseIndex) {
  return buildCourseTasks(scheduleData[day][courseIndex]);
}

function levelClasses(level) {
  if (level === 'easy') return { box: 'bg-amber-50 border-amber-100 text-amber-800', badge: 'bg-amber-500' };
  if (level === 'medium') return { box: 'bg-emerald-50 border-emerald-100 text-emerald-800', badge: 'bg-emerald-500' };
  return { box: 'bg-rose-50 border-rose-100 text-rose-800', badge: 'bg-rose-500' };
}

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

// ── Progreso/cronómetro guardado por curso ────────────────────────────────────
// Cada curso guarda su propio punto exacto (tarea + segundos restantes), así que
// si cambias de curso a la mitad de un pomodoro, ese tiempo queda guardado y lo
// retomas justo donde lo dejaste.

function getCourseProgress(day, courseIndex) {
  const tasks = getCourseTasks(day, courseIndex);
  const raw = localStorage.getItem(`pomodoro_progress_${day}_${courseIndex}`);
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (typeof p.taskIndex === 'number' && typeof p.timeRemaining === 'number' && typeof p.totalDuration === 'number') {
        return p;
      }
    } catch (e) {}
  }
  const firstDuration = (tasks[0] ? tasks[0].duration : POMODORO_MIN) * 60;
  return { taskIndex: 0, timeRemaining: firstDuration, totalDuration: firstDuration };
}

function saveCourseProgress(day, courseIndex) {
  if (courseIndex === null || courseIndex === undefined) return;
  localStorage.setItem(`pomodoro_progress_${day}_${courseIndex}`, JSON.stringify({
    taskIndex: currentTaskIndex,
    timeRemaining: timerTimeRemaining,
    totalDuration: timerTotalDuration
  }));
}

// ── Sonidos ────────────────────────────────────────────────────────────────

function playBeepPattern(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let notes = [];
    if (type === 'course' || type === 'study') {
      notes = [
        { freq: 659.25, start: 0.0, duration: 0.15, oscType: 'sine' },
        { freq: 523.25, start: 0.15, duration: 0.20, oscType: 'sine' },
        { freq: 659.25, start: 0.45, duration: 0.15, oscType: 'sine' },
        { freq: 523.25, start: 0.60, duration: 0.20, oscType: 'sine' }
      ];
    } else {
      notes = [
        { freq: 1000.00, start: 0.0, duration: 0.08, oscType: 'triangle' },
        { freq: 1000.00, start: 0.5, duration: 0.08, oscType: 'triangle' }
      ];
    }
    notes.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = note.oscType;
      osc.frequency.setValueAtTime(note.freq, audioCtx.currentTime + note.start);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime + note.start);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.start + note.duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + note.start);
      osc.stop(audioCtx.currentTime + note.start + note.duration);
    });
  } catch (err) {}
}

function startAlarmLoop(type) {
  stopAlarmLoop();
  playBeepPattern(type);
  soundLoopInterval = setInterval(() => { playBeepPattern(type); }, 2200);
}

function stopAlarmLoop() {
  if (soundLoopInterval) { clearInterval(soundLoopInterval); soundLoopInterval = null; }
}

// ── Render: lista de cursos del día ───────────────────────────────────────────

function renderCourseList(day) {
  document.getElementById('btn-back-course').classList.add('hidden');
  document.getElementById('day-subtitle').innerText = 'Elige un curso para empezar';

  const container = document.getElementById('timeline-list');
  container.classList.remove('timeline-line');
  container.innerHTML = '';

  const courses = scheduleData[day];

  courses.forEach((course, idx) => {
    const tasks = buildCourseTasks(course);
    const progress = getCourseProgress(day, idx);
    const done = progress.taskIndex >= tasks.length;
    const completedPomodoros = done
      ? course.pomodoros
      : tasks.slice(0, progress.taskIndex).filter(t => t.type === 'course').length;
    const pct = Math.round((completedPomodoros / course.pomodoros) * 100);
    const lc = levelClasses(course.level);
    const midPomodoro = !done && progress.timeRemaining > 0 && progress.timeRemaining < progress.totalDuration;

    let statusText;
    if (done) statusText = 'Completado';
    else if (midPomodoro) statusText = `En pausa · ${formatMMSS(progress.timeRemaining)} restantes`;
    else if (completedPomodoros > 0) statusText = 'En curso';
    else statusText = 'No iniciado';

    const card = document.createElement('div');
    card.onclick = () => openCourse(day, idx);
    card.className = `cursor-pointer border border-slate-200 rounded-xl p-3 transition-all duration-150 hover:shadow-md hover:border-slate-300 ${done ? 'opacity-70' : ''}`;
    card.innerHTML = `
      <div class="flex justify-between items-start gap-2 mb-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-medium text-white px-2 py-0.5 rounded-md ${lc.badge}">${course.level}</span>
          <h4 class="font-medium text-slate-900 text-sm">${course.subject}</h4>
        </div>
        ${done
          ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-emerald-500 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-slate-300 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`}
      </div>
      <div class="flex items-center gap-3">
        <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="course-progress-bar h-full ${lc.badge} rounded-full transition-all duration-300"></div>
        </div>
        <span class="text-[11px] font-semibold text-slate-500 whitespace-nowrap">${completedPomodoros}/${course.pomodoros} 🍅</span>
      </div>
      <p class="text-[11px] text-slate-400 mt-2">${statusText}</p>
    `;
    card.querySelector('.course-progress-bar').setAttribute('data-pct', pct);
    container.appendChild(card);
  });

  const breaksWrap = document.createElement('div');
  breaksWrap.className = 'flex gap-2 mt-2';

  const shortBreakBtn = document.createElement('button');
  shortBreakBtn.type = 'button';
  shortBreakBtn.onclick = () => startManualBreak(10, 'Descanso');
  shortBreakBtn.className = 'flex-1 py-3 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs font-semibold hover:border-slate-300 hover:text-slate-700 transition-colors duration-150 flex items-center justify-center gap-2';
  shortBreakBtn.innerHTML = `Desc. 10`;
  breaksWrap.appendChild(shortBreakBtn);

  const dinnerBtn = document.createElement('button');
  dinnerBtn.type = 'button';
  dinnerBtn.onclick = () => startManualBreak(30, 'Cena');
  dinnerBtn.className = 'flex-1 py-3 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs font-semibold hover:border-slate-300 hover:text-slate-700 transition-colors duration-150 flex items-center justify-center gap-2';
  dinnerBtn.innerHTML = `Desc. 30`;
  breaksWrap.appendChild(dinnerBtn);

  container.appendChild(breaksWrap);
}

// ── Render: detalle de un curso (su propia mini-timeline) ────────────────────

function renderCourseDetail(day, courseIndex) {
  document.getElementById('btn-back-course').classList.remove('hidden');

  const course = scheduleData[day][courseIndex];
  const tasks = buildCourseTasks(course);
  const done = currentTaskIndex >= tasks.length;
  const completedPomodoros = done
    ? course.pomodoros
    : tasks.slice(0, currentTaskIndex).filter(t => t.type === 'course').length;

  document.getElementById('day-subtitle').innerText = done
    ? `${course.subject} · Completado ✅`
    : `${course.subject} · ${completedPomodoros}/${course.pomodoros} pomodoros`;

  const container = document.getElementById('timeline-list');
  container.classList.add('timeline-line');
  container.innerHTML = '';

  tasks.forEach((item, index) => {
    const taskKey = `${day}-${courseIndex}-${index}`;
    const isChecked = localStorage.getItem(taskKey) === 'true';
    const isActive = index === currentTaskIndex;
    const isPast = index < currentTaskIndex;
    const stateClass = isActive ? 'ring-2 ring-slate-900 shadow-md' : (isPast ? 'opacity-60' : 'opacity-40');

    const row = document.createElement('div');
    row.className = `relative flex gap-4 pl-4 items-start ${isActive ? 'z-10' : ''}`;

    if (item.type === 'course') {
      const lc = levelClasses(item.level);
      const justFinished = isActive && timerMode === 'course' && timerTimeRemaining === 0;
      let boxColor;
      if (justFinished || isPast) {
        boxColor = 'bg-emerald-50 border-emerald-100 text-emerald-800';
      } else if (isActive) {
        boxColor = 'bg-rose-50 border-rose-100 text-rose-800';
      } else {
        boxColor = 'bg-slate-50 border-slate-200 text-slate-500';
      }
      const ringClass = isActive ? 'ring-2 ring-slate-900 shadow-md' : '';
      const lockOpacity = (!isActive && !isPast) ? 'opacity-60' : '';
      row.innerHTML = `
        <div class="z-10 mt-1.5 flex-shrink-0">
          <button onclick="toggleCheck('${taskKey}', event)" ${!isActive && !isPast ? 'disabled' : ''}
            class="w-8 h-8 rounded-full border-2 ${isChecked ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200'} flex items-center justify-center">
            <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="m4.5 12.75 6 6 9-13.5"/></svg>
          </button>
        </div>
        <div class="flex-1 border p-3 rounded-xl shadow-sm transition-colors duration-500 ${boxColor} ${ringClass} ${lockOpacity}">
          <div class="flex justify-between items-start gap-2 mb-1">
            <h4 class="font-medium text-sm">${item.subject}</h4>
            <span class="text-[10px] font-medium text-white px-2 py-0.5 rounded-md ${lc.badge}">${item.level}</span>
          </div>
          <p class="text-xs opacity-75">${item.detail}</p>
        </div>`;
    } else {
      row.innerHTML = `
        <div class="z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs flex-shrink-0">☕</div>
        <div class="flex-1 border bg-slate-50 border-slate-200 text-slate-700 p-2.5 rounded-xl ${stateClass}">
          <span class="font-medium text-xs">Descanso (${item.duration} min)</span>
        </div>`;
    }
    container.appendChild(row);
  });
}

function renderCurrentView() {
  if (currentCourseIndex === null) renderCourseList(currentDay);
  else renderCourseDetail(currentDay, currentCourseIndex);
}

// ── Navegación entre lista de cursos y detalle de un curso ───────────────────

function openCourse(day, courseIndex) {
  // Si había otro curso (o un descanso manual) corriendo, lo pausamos y guardamos
  if (currentCourseIndex !== null) {
    if (!timerIsPaused) pauseTimer();
    else saveCourseProgress(currentDay, currentCourseIndex);
  } else if (timerMode === 'manual' && !timerIsPaused) {
    pauseTimer();
  }

  timerMode = 'course';
  currentDay = day;
  currentCourseIndex = courseIndex;
  localStorage.setItem(`pomodoro_open_course_${day}`, courseIndex);

  const tasks = getCourseTasks(day, courseIndex);
  const progress = getCourseProgress(day, courseIndex);
  currentTaskIndex = progress.taskIndex;
  timerTotalDuration = progress.totalDuration;
  timerTimeRemaining = progress.timeRemaining;
  timerIsPaused = true;
  clearInterval(timerInterval);
  updateTimerDisplay();

  const done = currentTaskIndex >= tasks.length;
  document.getElementById('btn-start').disabled = done;
  document.getElementById('btn-pause').disabled = true;

  renderCourseDetail(day, courseIndex);
}

function backToCourseList() {
  if (currentCourseIndex !== null) {
    if (!timerIsPaused) pauseTimer();
    else saveCourseProgress(currentDay, currentCourseIndex);
  }
  currentCourseIndex = null;
  localStorage.removeItem(`pomodoro_open_course_${currentDay}`);
  renderCourseList(currentDay);
}

function switchTab(day) {
  if (currentCourseIndex !== null) {
    if (!timerIsPaused) pauseTimer();
    else saveCourseProgress(currentDay, currentCourseIndex);
  }
  currentCourseIndex = null;
  currentDay = day;

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('bg-slate-900', 'text-white', 'active-tab'));
  document.getElementById(`tab-${day}`).classList.add('bg-slate-900', 'text-white', 'active-tab');
  document.getElementById('day-title').innerText = day;

  const openIdx = localStorage.getItem(`pomodoro_open_course_${day}`);
  if (openIdx !== null && scheduleData[day][parseInt(openIdx, 10)]) {
    openCourse(day, parseInt(openIdx, 10));
  } else {
    renderCourseList(day);
  }
}

// Domingo es día de descanso por defecto, pero esto permite entrar de todas
// formas a elegir un curso (por ejemplo, para recuperar un pomodoro que quedó pendiente).
function activateScheduleOnSunday() {
  allowAnyDay = true;
  document.getElementById('sunday-view').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  switchTab('sabado');
}

// ── Cronómetro ────────────────────────────────────────────────────────────────

function setTimer(minutes) {
  clearInterval(timerInterval);
  timerIsPaused = true;
  timerTotalDuration = minutes * 60;
  timerTimeRemaining = timerTotalDuration;
  updateTimerDisplay();
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-pause').disabled = true;
}

function updateTimerDisplay() {
  const mins = Math.floor(timerTimeRemaining / 60);
  const secs = timerTimeRemaining % 60;
  document.getElementById('timer-display').innerText = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  document.getElementById('timer-progress').style.setProperty('--timer-pct', `${(timerTimeRemaining / timerTotalDuration) * 100}%`);
}

function startManualBreak(minutes, label) {
  if (currentCourseIndex !== null && !timerIsPaused) pauseTimer();
  timerMode = 'manual';
  manualBreakLabel = label;
  setTimer(minutes);
}

function startTimer() {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = dias[new Date().getDay()];
  if (!allowAnyDay && currentDay !== hoy) {
    document.getElementById('day-error-modal').classList.remove('opacity-0', 'pointer-events-none');
    return;
  }
  if (timerMode === 'course') {
    if (currentCourseIndex === null) return;
    const tasks = getCourseTasks(currentDay, currentCourseIndex);
    if (currentTaskIndex >= tasks.length) return;
  }
  if (!timerIsPaused) return;

  timerIsPaused = false;
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-pause').disabled = false;

  timerInterval = setInterval(() => {
    if (timerTimeRemaining > 0) {
      timerTimeRemaining--;
      updateTimerDisplay();
      if (timerMode === 'course' && currentCourseIndex !== null) {
        saveCourseProgress(currentDay, currentCourseIndex);
      }
      if (timerTimeRemaining === 0) {
        clearInterval(timerInterval);
        timerIsPaused = true;
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        const soundType = timerMode === 'manual' ? 'rest' : getCourseTasks(currentDay, currentCourseIndex)[currentTaskIndex].type;
        if (timerMode === 'course' && currentCourseIndex !== null) {
          renderCourseDetail(currentDay, currentCourseIndex);
        }
        startAlarmLoop(soundType);
        showAlarmModal();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerIsPaused = true;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-pause').disabled = true;
  if (timerMode === 'course' && currentCourseIndex !== null) {
    saveCourseProgress(currentDay, currentCourseIndex);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerIsPaused = true;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-pause').disabled = true;
  timerTimeRemaining = timerTotalDuration;
  updateTimerDisplay();
  if (timerMode === 'course' && currentCourseIndex !== null) {
    saveCourseProgress(currentDay, currentCourseIndex);
  }
}

// ── Voz: lee en voz alta los mensajes de los modales ──────────────────────────

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  } catch (e) {}
}

// Frases cortas que rotan al azar cada vez que terminas un pomodoro de estudio
const POMODORO_REWARD_MESSAGES = [
  "Uno menos, seguimos",
  "25 minutos bien invertidos",
  "Tu yo del futuro te lo agradece",
  "Otra neurona puesta a trabajar",
  "Eso ya no te lo quita nadie",
  "Vas pisando fuerte"
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showAlarmModal() {
  let msg;
  if (timerMode === 'manual') {
    msg = `Tu ${manualBreakLabel.toLowerCase()} ha finalizado.`;
  } else {
    const tasks = getCourseTasks(currentDay, currentCourseIndex);
    const finishedItem = tasks[currentTaskIndex];
    if (finishedItem && finishedItem.type === 'course') {
      msg = pickRandom(POMODORO_REWARD_MESSAGES);
    } else {
      msg = 'Tu descanso terminó, ¡seguimos!';
    }
  }
  document.getElementById('modal-alarm-message').innerText = msg;
  document.getElementById('custom-alarm-modal').classList.remove('opacity-0', 'pointer-events-none');
  speak(msg);
}

function showCourseCompleteModal(subject, day, level) {
  const subtitle = `Completaste el curso de ${subject}`;
  document.getElementById('course-complete-subject').innerText = subtitle;
  document.getElementById('course-complete-modal').classList.remove('opacity-0', 'pointer-events-none');
  speak(`¡Felicidades! ${subtitle}. Así es como entran a la UNMSM: curso por curso.`);
  // Guardar en localStorage para repetición espaciada
  _pendingRepasoData = { subject, day, level };
}

let _pendingRepasoData = null;

function closeCourseCompleteModal() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('course-complete-modal').classList.add('opacity-0', 'pointer-events-none');
  currentCourseIndex = null;
  renderCourseList(currentDay);
  // Abrir modal de tema para repetición espaciada
  if (_pendingRepasoData) {
    const { subject, day, level } = _pendingRepasoData;
    _pendingRepasoData = null;
    openTemaModal(subject, day, level);
  }
}

function dismissAlarmAndContinue() {
  stopAlarmLoop();
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('custom-alarm-modal').classList.add('opacity-0', 'pointer-events-none');

  if (timerMode === 'manual') {
    timerMode = 'course';
    if (currentCourseIndex !== null) {
      const progress = getCourseProgress(currentDay, currentCourseIndex);
      const tasks = getCourseTasks(currentDay, currentCourseIndex);
      currentTaskIndex = progress.taskIndex;
      timerTotalDuration = progress.totalDuration;
      timerTimeRemaining = progress.timeRemaining;
      document.getElementById('btn-start').disabled = currentTaskIndex >= tasks.length;
    } else {
      timerTotalDuration = 1500;
      timerTimeRemaining = 1500;
      document.getElementById('btn-start').disabled = false;
    }
    document.getElementById('btn-pause').disabled = true;
    updateTimerDisplay();
    return;
  }

  const tasks = getCourseTasks(currentDay, currentCourseIndex);
  if (currentTaskIndex + 1 < tasks.length) {
    currentTaskIndex++;
    const item = tasks[currentTaskIndex];
    timerTotalDuration = item.duration * 60;
    timerTimeRemaining = timerTotalDuration;
    saveCourseProgress(currentDay, currentCourseIndex);
    updateTimerDisplay();
    document.getElementById('btn-start').disabled = false;
    document.getElementById('btn-pause').disabled = true;
    renderCourseDetail(currentDay, currentCourseIndex);
  } else {
    currentTaskIndex = tasks.length;
    saveCourseProgress(currentDay, currentCourseIndex);
    localStorage.removeItem(`pomodoro_open_course_${currentDay}`);
    const finishedSubject = scheduleData[currentDay][currentCourseIndex].subject;
    const finishedLevel = scheduleData[currentDay][currentCourseIndex].level;
    showCourseCompleteModal(finishedSubject, currentDay, finishedLevel);
  }
}

function toggleCheck(key, e) {
  e.stopPropagation();
  localStorage.setItem(key, localStorage.getItem(key) === 'true' ? 'false' : 'true');
  renderCurrentView();
}

function resetDayCheckboxes() {
  clearInterval(timerInterval);
  scheduleData[currentDay].forEach((course, idx) => {
    localStorage.removeItem(`pomodoro_progress_${currentDay}_${idx}`);
    buildCourseTasks(course).forEach((_, tIdx) => localStorage.removeItem(`${currentDay}-${idx}-${tIdx}`));
  });
  localStorage.removeItem(`pomodoro_open_course_${currentDay}`);
  currentCourseIndex = null;
  timerMode = 'course';
  timerIsPaused = true;
  timerTimeRemaining = 1500;
  timerTotalDuration = 1500;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-pause').disabled = true;
  updateTimerDisplay();
  renderCourseList(currentDay);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const knob = document.getElementById('theme-knob');
  const toggle = document.getElementById('theme-toggle');
  knob.classList.toggle('theme-knob-dark', isDark);
  toggle.classList.toggle('theme-toggle-dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  renderCurrentView();
}

// ── Detección de cambio de día ────────────────────────────────────────────────

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function checkAndResetIfNewDay() {
  const lastDate = localStorage.getItem('pomodoro_last_date');
  const today = getTodayKey();
  if (lastDate && lastDate !== today) {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    dias.forEach(dia => {
      (scheduleData[dia] || []).forEach((course, idx) => {
        localStorage.removeItem(`pomodoro_progress_${dia}_${idx}`);
        buildCourseTasks(course).forEach((_, tIdx) => localStorage.removeItem(`${dia}-${idx}-${tIdx}`));
      });
      localStorage.removeItem(`pomodoro_open_course_${dia}`);
    });
  }
  localStorage.setItem('pomodoro_last_date', today);
}


window.onload = () => {
  checkAndResetIfNewDay();

  const hoyIdx = new Date().getDay();
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-knob').classList.add('theme-knob-dark');
    document.getElementById('theme-toggle').classList.add('theme-toggle-dark');
  }

  if (hoyIdx === 0) {
    document.getElementById('sunday-view').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
  } else {
    const todayName = dias[hoyIdx];
    switchTab(todayName);
  }
};

// ── Modal de tema para repetición espaciada ───────────────────────────────────

let _temaModalData = null;

function openTemaModal(subject, day, level) {
  _temaModalData = { subject, day, level };
  document.getElementById('modal-tema-curso').textContent = `${subject} · ${day}`;
  document.getElementById('input-tema').value = '';
  document.getElementById('modal-tema').classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => document.getElementById('input-tema').focus(), 100);
}

function guardarTema() {
  if (!_temaModalData) return;
  const tema = document.getElementById('input-tema').value.trim();
  registrarRepaso(_temaModalData.subject, _temaModalData.day, _temaModalData.level, tema);
  cerrarTemaModal();
}

function cancelarTema() {
  if (!_temaModalData) return;
  registrarRepaso(_temaModalData.subject, _temaModalData.day, _temaModalData.level, '');
  cerrarTemaModal();
}

function cerrarTemaModal() {
  _temaModalData = null;
  document.getElementById('modal-tema').classList.add('opacity-0', 'pointer-events-none');
}

function registrarRepaso(subject, day, level, tema) {
  const hoy = getTodayKey();
  let log = [];
  try { log = JSON.parse(localStorage.getItem('repaso_log') || '[]'); } catch {}
  const existe = log.find(e => e.subject === subject && e.day === day && e.fechaCompletado === hoy);
  if (existe) {
    if (tema) existe.tema = tema;
  } else {
    log.push({ subject, day, level, tema, fechaCompletado: hoy, repasosDone: [] });
  }
  localStorage.setItem('repaso_log', JSON.stringify(log));
}