// ── REEMPLAZA la función registrarRepaso al final de script.js ────────────────
// Borra la función registrarRepaso original y pega esta en su lugar:

async function registrarRepaso(subject, day, level, tema) {
  try {
    await fetch('api.php?action=save_repaso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        day,
        level,
        tema,
        fechaCompletado: getTodayKey(),
        repasosDone: []
      })
    });
  } catch(e) {
    console.error('Error guardando repaso en BD:', e);
  }
}