const scheduleData = {
  lunes: [
    { type: "course", subject: "Aritmética", level: "hard", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Aritmética", level: "hard", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "4:25 PM - 4:30 PM", duration: 5 },
    { type: "course", subject: "Aritmética", level: "hard", time: "4:30 PM - 4:55 PM", detail: "Pomodoro 3 de 4" },
    { type: "rest", time: "4:55 PM - 5:00 PM", duration: 5 },
    { type: "course", subject: "Aritmética", level: "hard", time: "5:00 PM - 5:25 PM", detail: "Pomodoro 4 de 4" },
    { type: "rest", time: "5:25 PM - 5:40 PM", duration: 15 },
    { type: "course", subject: "Razonamiento Verbal", level: "medium", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Razonamiento Verbal", level: "medium", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 2 de 2 (Continuación)" },
    { type: "rest", time: "7:05 PM - 7:20 PM", duration: 15 },
    { type: "course", subject: "Economía", level: "easy", time: "7:20 PM - 7:45 PM", detail: "Pomodoro 1 de 3" },
    { type: "rest", time: "7:45 PM - 7:50 PM", duration: 5 },
    { type: "course", subject: "Economía", level: "easy", time: "7:50 PM - 8:15 PM", detail: "Pomodoro 2 de 3" },
    { type: "rest", time: "8:15 PM - 8:20 PM", duration: 5 },
    { type: "course", subject: "Economía", level: "easy", time: "8:20 PM - 8:45 PM", detail: "Pomodoro 3 de 3" }
  ],
  martes: [
    { type: "course", subject: "Geografía", level: "medium", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 3" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Geografía", level: "medium", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 3" },
    { type: "rest", time: "4:25 PM - 4:30 PM", duration: 5 },
    { type: "course", subject: "Geografía", level: "medium", time: "4:30 PM - 4:55 PM", detail: "Pomodoro 3 de 3" },
    { type: "rest", time: "4:55 PM - 5:10 PM", duration: 15 },
    { type: "course", subject: "Trigonometría", level: "hard", time: "5:10 PM - 5:35 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "5:35 PM - 5:40 PM", duration: 5 },
    { type: "course", subject: "Trigonometría", level: "hard", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Trigonometría", level: "hard", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 3 de 4 (Continuación)" },
    { type: "rest", time: "7:05 PM - 7:10 PM", duration: 5 },
    { type: "course", subject: "Trigonometría", level: "hard", time: "7:10 PM - 7:35 PM", detail: "Pomodoro 4 de 4 (Continuación)" },
    { type: "rest", time: "7:35 PM - 7:50 PM", duration: 15 },
    { type: "course", subject: "Razonamiento Matemático", level: "easy", time: "7:50 PM - 8:15 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "8:15 PM - 8:20 PM", duration: 5 },
    { type: "course", subject: "Razonamiento Matemático", level: "easy", time: "8:20 PM - 8:45 PM", detail: "Pomodoro 2 de 2" }
  ],
  miercoles: [
    { type: "course", subject: "Educación Cívica", level: "medium", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Educación Cívica", level: "medium", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 2" },
    { type: "rest", time: "4:25 PM - 4:40 PM", duration: 15 },
    { type: "course", subject: "Historia", level: "easy", time: "4:40 PM - 5:05 PM", detail: "Pomodoro 1 de 3" },
    { type: "rest", time: "5:05 PM - 5:10 PM", duration: 5 },
    { type: "course", subject: "Historia", level: "easy", time: "5:10 PM - 5:35 PM", detail: "Pomodoro 2 de 3" },
    { type: "rest", time: "5:35 PM - 5:40 PM", duration: 5 },
    { type: "course", subject: "Historia", level: "easy", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 3 de 3" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Geometría", level: "hard", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "7:05 PM - 7:10 PM", duration: 5 },
    { type: "course", subject: "Geometría", level: "hard", time: "7:10 PM - 7:35 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "7:35 PM - 7:40 PM", duration: 5 },
    { type: "course", subject: "Geometría", level: "hard", time: "7:40 PM - 8:05 PM", detail: "Pomodoro 3 de 4" },
    { type: "rest", time: "8:05 PM - 8:10 PM", duration: 5 },
    { type: "course", subject: "Geometría", level: "hard", time: "8:10 PM - 8:35 PM", detail: "Pomodoro 4 de 4" }
  ],
  jueves: [
    { type: "course", subject: "Literatura", level: "easy", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Literatura", level: "easy", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 2" },
    { type: "rest", time: "4:25 PM - 4:40 PM", duration: 15 },
    { type: "course", subject: "Química", level: "hard", time: "4:40 PM - 5:05 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "5:05 PM - 5:10 PM", duration: 5 },
    { type: "course", subject: "Química", level: "hard", time: "5:10 PM - 5:35 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "5:35 PM - 5:40 PM", duration: 5 },
    { type: "course", subject: "Química", level: "hard", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 3 de 4" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Química", level: "hard", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 4 de 4 (Continuación)" },
  ],
  viernes: [
    { type: "course", subject: "Física", level: "hard", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Física", level: "hard", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "4:25 PM - 4:30 PM", duration: 5 },
    { type: "course", subject: "Física", level: "hard", time: "4:30 PM - 4:55 PM", detail: "Pomodoro 3 de 4" },
    { type: "rest", time: "4:55 PM - 5:00 PM", duration: 5 },
    { type: "course", subject: "Física", level: "hard", time: "5:00 PM - 5:25 PM", detail: "Pomodoro 4 de 4" },
    { type: "rest", time: "5:25 PM - 5:40 PM", duration: 15 },
    { type: "course", subject: "Filosofía", level: "medium", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Filosofía", level: "medium", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 2 de 2 (Continuación)" },
    { type: "rest", time: "7:05 PM - 7:20 PM", duration: 15 },
    { type: "course", subject: "Biología", level: "easy", time: "7:20 PM - 7:45 PM", detail: "Pomodoro 1 de 3" },
    { type: "rest", time: "7:45 PM - 7:50 PM", duration: 5 },
    { type: "course", subject: "Biología", level: "easy", time: "7:50 PM - 8:15 PM", detail: "Pomodoro 2 de 3" },
    { type: "rest", time: "8:15 PM - 8:20 PM", duration: 5 },
    { type: "course", subject: "Biología", level: "easy", time: "8:20 PM - 8:45 PM", detail: "Pomodoro 3 de 3" }
  ],
  sabado: [
    { type: "course", subject: "Lenguaje", level: "easy", time: "3:30 PM - 3:55 PM", detail: "Pomodoro 1 de 3" },
    { type: "rest", time: "3:55 PM - 4:00 PM", duration: 5 },
    { type: "course", subject: "Lenguaje", level: "easy", time: "4:00 PM - 4:25 PM", detail: "Pomodoro 2 de 3" },
    { type: "rest", time: "4:25 PM - 4:30 PM", duration: 5 },
    { type: "course", subject: "Lenguaje", level: "easy", time: "4:30 PM - 4:55 PM", detail: "Pomodoro 3 de 3" },
    { type: "rest", time: "4:55 PM - 5:10 PM", duration: 15 },
    { type: "course", subject: "Álgebra", level: "hard", time: "5:10 PM - 5:35 PM", detail: "Pomodoro 1 de 4" },
    { type: "rest", time: "5:35 PM - 5:40 PM", duration: 5 },
    { type: "course", subject: "Álgebra", level: "hard", time: "5:40 PM - 6:05 PM", detail: "Pomodoro 2 de 4" },
    { type: "rest", time: "6:05 PM - 6:10 PM", duration: 5 },
    { type: "dinner", time: "6:10 PM - 6:40 PM", duration: 30 },
    { type: "course", subject: "Álgebra", level: "hard", time: "6:40 PM - 7:05 PM", detail: "Pomodoro 3 de 4 (Continuación)" },
    { type: "rest", time: "7:05 PM - 7:10 PM", duration: 5 },
    { type: "course", subject: "Álgebra", level: "hard", time: "7:10 PM - 7:35 PM", detail: "Pomodoro 4 de 4 (Continuación)" },
    { type: "rest", time: "7:35 PM - 7:50 PM", duration: 15 },
    { type: "course", subject: "Psicología", level: "medium", time: "7:50 PM - 8:15 PM", detail: "Pomodoro 1 de 2" },
    { type: "rest", time: "8:15 PM - 8:20 PM", duration: 5 },
    { type: "course", subject: "Psicología", level: "medium", time: "8:20 PM - 8:45 PM", detail: "Pomodoro 2 de 2" }
  ]
};

let currentDay = 'lunes';
let timerInterval = null;
let timerTimeRemaining = 1500;
let timerTotalDuration = 1500;
let timerIsPaused = true;
let currentTaskIndex = 0;
let soundLoopInterval = null;

function playBeepPattern(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let notes = [];
    if (type === 'course' || type === 'study') {
      notes = [
        { freq: 659.25, start: 0.0,  duration: 0.15, oscType: 'sine' },
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

function renderTimeline(day) {
  const listElement = document.getElementById('timeline-list');
  listElement.innerHTML = '';
  const dayData = scheduleData[day];
  dayData.forEach((item, index) => {
    const taskKey = `${day}-${index}`;
    const isChecked = localStorage.getItem(taskKey) === 'true';
    const isActive = index === currentTaskIndex;
    const isPast = index < currentTaskIndex;
    const cursorClass = isActive
      ? "cursor-pointer ring-2 ring-slate-900 shadow-md transform scale-[1.01]"
      : (isPast ? "cursor-default opacity-60" : "cursor-not-allowed opacity-40 pointer-events-none");
    const onclickHandler = isActive ? `selectTask('${day}', ${index})` : "";
    const isDark = document.body.classList.contains('dark');

    const timelineItem = document.createElement('div');
    timelineItem.className = `relative flex gap-4 pl-4 items-start transition-all duration-100 ${isActive ? 'z-10' : ''}`;

    if (item.type === 'course') {
      let bgClass, badgeClass;
      if (isDark) {
        bgClass = item.level === 'easy'
          ? "border-yellow-800 text-yellow-300"
          : (item.level === 'medium' ? "border-emerald-800 text-emerald-300" : "border-rose-900 text-rose-300");
        const bgStyle = item.level === 'easy'
          ? "background-color:#451a03"
          : (item.level === 'medium' ? "background-color:#022c22" : "background-color:#4c0519");
        badgeClass = item.level === 'easy' ? "bg-amber-500" : (item.level === 'medium' ? "bg-emerald-500" : "bg-rose-500");
        timelineItem.innerHTML = `
          <div class="z-10 mt-1.5 flex-shrink-0">
            <button onclick="toggleCheck('${taskKey}', event)" ${!isActive && !isPast ? 'disabled' : ''}
              class="w-8 h-8 rounded-full border-2 ${isChecked ? 'border-slate-400 text-slate-200' : 'border-slate-600'} flex items-center justify-center"
              style="background-color:${isChecked ? '#f1f5f9' : '#1e293b'}; color:${isChecked ? '#0f172a' : 'inherit'}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="m4.5 12.75 6 6 9-13.5"/></svg>
            </button>
          </div>
          <div onclick="${onclickHandler}" class="flex-1 border p-4 rounded-xl shadow-sm ${bgClass} ${cursorClass}" style="${bgStyle}">
            <div class="flex justify-between items-start gap-2 mb-1">
              <h4 class="font-bold text-base">${item.subject}</h4>
              <span class="text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${badgeClass}">${item.level}</span>
            </div>
            <p class="text-xs opacity-75">${item.detail}</p>
            <div class="text-xs font-semibold mt-2">${item.time}</div>
          </div>`;
      } else {
        bgClass = item.level === 'easy'
          ? "bg-amber-50 border-amber-100 text-amber-800"
          : (item.level === 'medium' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800");
        badgeClass = item.level === 'easy' ? "bg-amber-500" : (item.level === 'medium' ? "bg-emerald-500" : "bg-rose-500");
        timelineItem.innerHTML = `
          <div class="z-10 mt-1.5 flex-shrink-0">
            <button onclick="toggleCheck('${taskKey}', event)" ${!isActive && !isPast ? 'disabled' : ''}
              class="w-8 h-8 rounded-full border-2 ${isChecked ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200'} flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="m4.5 12.75 6 6 9-13.5"/></svg>
            </button>
          </div>
          <div onclick="${onclickHandler}" class="flex-1 border p-4 rounded-xl shadow-sm ${bgClass} ${cursorClass}">
            <div class="flex justify-between items-start gap-2 mb-1">
              <h4 class="font-bold text-base">${item.subject}</h4>
              <span class="text-[10px] font-bold text-white px-2 py-0.5 rounded-md ${badgeClass}">${item.level}</span>
            </div>
            <p class="text-xs opacity-75">${item.detail}</p>
            <div class="text-xs font-semibold mt-2">${item.time}</div>
          </div>`;
      }
    } else {
      const restBg = isDark ? 'style="background-color:#1e293b; border-color:#334155; color:#94a3b8"' : '';
      const dotBg  = isDark ? 'style="background-color:#334155; color:#94a3b8"' : '';
      timelineItem.innerHTML = `
        <div class="z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center" ${dotBg}>...</div>
        <div onclick="${onclickHandler}" class="flex-1 border p-3 rounded-xl ${cursorClass}" ${restBg}>
          <span class="font-bold text-sm">${item.type === 'dinner' ? '🍽️ Cena' : '☕ Descanso'}</span>
        </div>`;
    }
    listElement.appendChild(timelineItem);
  });
}

function switchTab(day) {
  currentDay = day;
  localStorage.setItem('pomodoro_current_day', day);
  currentTaskIndex = parseInt(localStorage.getItem(`pomodoro_task_index_${day}`) || 0);
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('bg-slate-900', 'text-white', 'active-tab'));
  const activeBtn = document.getElementById(`tab-${day}`);
  activeBtn.classList.add('bg-slate-900', 'text-white', 'active-tab');
  document.getElementById('day-title').innerText = day;
  renderTimeline(day);
  selectTask(day, currentTaskIndex, true);
}

function selectTask(day, index, restore = false) {
  currentTaskIndex = index;
  if (!restore) {
    const item = scheduleData[day][index];
    setTimer(item.duration || 25);
  }
  renderTimeline(day);
}

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
  document.getElementById('timer-progress').style.width = `${(timerTimeRemaining / timerTotalDuration) * 100}%`;
}

function startTimer() {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = dias[new Date().getDay()];
  if (currentDay !== hoy) {
    document.getElementById('day-error-modal').classList.remove('opacity-0', 'pointer-events-none');
    return;
  }
  if (!timerIsPaused) return;
  clearInterval(timerInterval);
  timerIsPaused = false;
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-pause').disabled = false;
  timerInterval = setInterval(() => {
    if (timerTimeRemaining > 0) {
      timerTimeRemaining--;
      updateTimerDisplay();
      saveTimerState();
      if (timerTimeRemaining === 0) {
        clearInterval(timerInterval);
        timerIsPaused = true;
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        clearTimerState();
        startAlarmLoop(scheduleData[currentDay][currentTaskIndex].type);
        showAlarmModal(scheduleData[currentDay][currentTaskIndex]);
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerIsPaused = true;
  document.getElementById('btn-start').disabled = false;
  document.getElementById('btn-pause').disabled = true;
  saveTimerState();
}

function resetTimer() {
  pauseTimer();
  timerTimeRemaining = timerTotalDuration;
  updateTimerDisplay();
  clearTimerState();
}

function showAlarmModal(task) {
  document.getElementById('modal-alarm-message').innerText = "Tu bloque ha finalizado.";
  document.getElementById('custom-alarm-modal').classList.remove('opacity-0', 'pointer-events-none');
}

function dismissAlarmAndContinue() {
  stopAlarmLoop();
  document.getElementById('custom-alarm-modal').classList.add('opacity-0', 'pointer-events-none');
  if (currentTaskIndex + 1 < scheduleData[currentDay].length) {
    currentTaskIndex++;
    localStorage.setItem(`pomodoro_task_index_${currentDay}`, currentTaskIndex);
    selectTask(currentDay, currentTaskIndex);
  }
}

function toggleCheck(key, e) {
  e.stopPropagation();
  localStorage.setItem(key, localStorage.getItem(key) === 'true' ? 'false' : 'true');
  renderTimeline(currentDay);
}

function resetDayCheckboxes() {
  scheduleData[currentDay].forEach((_, i) => localStorage.removeItem(`${currentDay}-${i}`));
  renderTimeline(currentDay);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const knob = document.getElementById('theme-knob');
  const toggle = document.getElementById('theme-toggle');
  knob.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
  toggle.style.backgroundColor = isDark ? '#6366f1' : '';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  renderTimeline(currentDay);
}


// ── Persistencia del cronómetro ──────────────────────────────────────────────

function saveTimerState() {
  localStorage.setItem('pomodoro_timer_state', JSON.stringify({
    day: currentDay,
    taskIndex: currentTaskIndex,
    timeRemaining: timerTimeRemaining,
    totalDuration: timerTotalDuration,
    savedAt: Date.now()
  }));
}

function loadTimerState() {
  try { return JSON.parse(localStorage.getItem('pomodoro_timer_state')); }
  catch (e) { return null; }
}

function clearTimerState() {
  localStorage.removeItem('pomodoro_timer_state');
}

// ── Detección de cambio de día ────────────────────────────────────────────────

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function checkAndResetIfNewDay() {
  const lastDate = localStorage.getItem('pomodoro_last_date');
  const today = getTodayKey();
  if (lastDate && lastDate !== today) {
    const dias = ['lunes','martes','miercoles','jueves','viernes','sabado'];
    dias.forEach(dia => {
      localStorage.removeItem(`pomodoro_task_index_${dia}`);
      (scheduleData[dia] || []).forEach((_, i) => localStorage.removeItem(`${dia}-${i}`));
    });
    clearTimerState();
  }
  localStorage.setItem('pomodoro_last_date', today);
}

window.onload = () => {
  window.scheduleData = scheduleData;
  checkAndResetIfNewDay();

  const hoyIdx = new Date().getDay();
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-knob').style.transform = 'translateX(24px)';
    document.getElementById('theme-toggle').style.backgroundColor = '#6366f1';
  }

  if (hoyIdx === 0) {
    document.getElementById('sunday-view').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
  } else {
    const todayName = dias[hoyIdx];
    switchTab(todayName);

    const saved = loadTimerState();
    if (saved && saved.day === todayName) {
      currentTaskIndex = saved.taskIndex;
      timerTotalDuration = saved.totalDuration;
      timerTimeRemaining = saved.timeRemaining;
      timerIsPaused = true;
      updateTimerDisplay();
      document.getElementById('btn-start').disabled = false;
      document.getElementById('btn-pause').disabled = true;
      renderTimeline(todayName);
    }
  }
};