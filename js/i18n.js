// --- INTERNATIONALIZATION (EN / RU) ---
(function() {
  const translations = {
    en: {
      title: "⚡ Apex Superglide Trainer",
      subtitle: "Custom keybind configuration & 1-frame timing validator",
      statusReady: "Ready",
      compactBtn: "Mini-HUD",
      fullBtn: "Full View",
      soundpackLabel: "🔊 Sound Profile:",
      volumeLabel: "Volume:",
      keybindsTitle: "Keybind Settings",
      btnResetBinds: "Default",
      jumpLabel: "🔼 JUMP:",
      crouchLabel: "🔽 CROUCH:",
      btnAddKey: "+ Add Key",
      fpsTitle: "Frame Rate (Apex FPS)",
      fpsHint: "💡 Set this to match your in-game <code>fps_max</code>. Higher FPS means a tighter timing window.",
      defaultVerdictTitle: "Perform a superglide",
      defaultVerdictDetail: (fps, ms) => `Press Jump then Crouch. Window at ${fps} FPS: ${ms} ms`,
      gaugeEarly: "Crouch First",
      gaugeTarget: (ms) => `${ms} ms (1 frame)`,
      gaugeLate: "Too late",
      statAttempts: "Attempts",
      statSuccess: "Success",
      statRate: "Winrate",
      statAvg: "Avg Delta",
      statStreak: "Streak",
      statBest: "Best",
      streakBanner: (streak) => `Streak: ${streak}`,
      streakHot: (streak) => `🔥 ${streak} IN A ROW!`,
      streakGodlike: (streak) => `👑 ${streak} STREAK! (GODLIKE)`,
      mantleTitle: "Mantle Peak Simulator",
      mantleStart: "Start Simulation (Space to start)",
      mantleStop: "Stop Simulation",
      mantleClimbing: "Climbing wall...",
      mantleZone: "RED ZONE = MANTLE PEAK (HIT SUPERGLIDE!)",
      historyTitle: "Recent Attempts History",
      historyClear: "Reset Stats",
      btnShare: "📋 Share Stats",
      colNum: "#",
      colJump: "Jump Key",
      colCrouch: "Crouch Key",
      colDelta: "Delta (ms)",
      colFrames: "Window (frames)",
      colResult: "Result",
      footerHint: "💡 <b>Tip:</b> Use <b>Mini-HUD mode</b> while in the Firing Range to keep the trainer visible in a compact window.",
      modalWaiting: (action) => `Binding Key: ${action}`,
      modalDesc: "Press <b>any key</b> on keyboard, scroll <b>mouse wheel</b>, or click a <b>mouse button</b> (LMB, RMB, MMB, Mouse 4/5).<br><span style='color:#747d8c'>Press Esc to cancel.</span>",
      modalCancel: "Cancel (Esc)",
      statusEarly: "Crouch before jump",
      statusSuccess: "PERFECT SUPERGLIDE",
      statusLate: "Too late",
      verdictEarlyTitle: (ms) => `❌ FAILED (${ms} ms)`,
      verdictEarlyDetail: (crouch, ms, jump) => `You pressed <b>${crouch}</b> <b>${ms} ms</b> before <b>${jump}</b>. Jump MUST be first!`,
      verdictSuccessTitle: (ms) => `🔥 SUPERGLIDE! (+${ms} ms)`,
      verdictSuccessDetail: (frames) => `Frame-perfect hit in 1st frame (${frames} frames). In-game speed: <b>~650+ u/s!</b>`,
      verdictLateTitle: (ms) => `⚠️ TOO LATE (+${ms} ms)`,
      verdictLateDetail: (missed, frames) => `Crouch was pressed <b>${missed} ms</b> after the allowed window (${frames} frames). Result: normal jump.`,
      cannotDeleteLast: (action) => `Cannot delete the last key for "${action}"!`,
      copiedToast: "Report copied to clipboard!",
      mouseNames: {
        'Mouse0': 'LMB (Left)',
        'Mouse1': 'MMB (Wheel)',
        'Mouse2': 'RMB (Right)',
        'Mouse3': 'MOUSE 4 (Back)',
        'Mouse4': 'MOUSE 5 (Forward)'
      }
    },
    ru: {
      title: "⚡ Apex Superglide Trainer",
      subtitle: "Индивидуальная настройка любых клавиш и проверка 1-кадрового тайминга",
      statusReady: "Готов",
      compactBtn: "Мини-HUD",
      fullBtn: "Полный вид",
      soundpackLabel: "🔊 Звуковой профиль:",
      volumeLabel: "Громкость:",
      keybindsTitle: "Настройка клавиш ввода",
      btnResetBinds: "По умолчанию",
      jumpLabel: "🔼 ПРЫЖОК (JUMP):",
      crouchLabel: "🔽 ПРИСЯД (CROUCH):",
      btnAddKey: "+ Добавить",
      fpsTitle: "Частота кадров (FPS в Apex)",
      fpsHint: "💡 Установите FPS равным значению <code>fps_max</code> в игре. Чем выше FPS — тем уже допустимое окно ввода.",
      defaultVerdictTitle: "Сделайте суперглайд",
      defaultVerdictDetail: (fps, ms) => `Нажмите Прыжок, затем сразу Присяд. Окно при ${fps} FPS: ${ms} мс`,
      gaugeEarly: "Присяд раньше",
      gaugeTarget: (ms) => `${ms} мс (1 кадр)`,
      gaugeLate: "Слишком поздно",
      statAttempts: "Попыток",
      statSuccess: "Успешно",
      statRate: "Винрейт",
      statAvg: "Средняя дельта",
      statStreak: "Серия",
      statBest: "Рекорд",
      streakBanner: (streak) => `Серия: ${streak}`,
      streakHot: (streak) => `🔥 ${streak} ПОДРЯД!`,
      streakGodlike: (streak) => `👑 ${streak} В СЕРИИ! (БОЖЕСТВЕННО)`,
      mantleTitle: "Симулятор анимации карабкания (Mantle Peak)",
      mantleStart: "Запустить симуляцию (Space для старта)",
      mantleStop: "Остановить симуляцию",
      mantleClimbing: "Подъем по стене...",
      mantleZone: "КРАСНАЯ ЗОНА = ПИК МАНТЛА (ЖМИ СУПЕРГЛАЙД!)",
      historyTitle: "История последних попыток",
      historyClear: "Сбросить статистику",
      btnShare: "📋 Поделиться",
      colNum: "#",
      colJump: "Кнопка прыжка",
      colCrouch: "Кнопка приседа",
      colDelta: "Дельта (мс)",
      colFrames: "Окно (кадры)",
      colResult: "Результат",
      footerHint: "💡 <b>Совет:</b> Используйте <b>режим Мини-HUD</b> во время игры на Стрельбище (Firing Range), чтобы тренажер занимал минимум места.",
      modalWaiting: (action) => `Привязка клавиши: ${action}`,
      modalDesc: "Нажмите <b>любую клавишу</b> на клавиатуре, прокрутите <b>колесико мыши</b> или нажмите <b>кнопку мыши</b> (ЛКМ, ПКМ, СКМ, боковые Mouse 4/5).<br><span style='color:#747d8c'>Для отмены нажмите Esc.</span>",
      modalCancel: "Отмена (Esc)",
      statusEarly: "Присяд раньше прыжка",
      statusSuccess: "ИДЕАЛЬНЫЙ СУПЕРГЛАЙД",
      statusLate: "Слишком поздно",
      verdictEarlyTitle: (ms) => `❌ ОШИБКА (${ms} мс)`,
      verdictEarlyDetail: (crouch, ms, jump) => `Вы нажали <b>${crouch}</b> на <b>${ms} мс</b> раньше, чем <b>${jump}</b>. Первым ДОЛЖЕН идти прыжок!`,
      verdictSuccessTitle: (ms) => `🔥 СУПЕРГЛАЙД! (+${ms} мс)`,
      verdictSuccessDetail: (frames) => `Идеальное попадание в 1-й кадр (${frames} кадра). Скорость в игре: <b>~650+ u/s!</b>`,
      verdictLateTitle: (ms) => `⚠️ ПОЗДНО (+${ms} мс)`,
      verdictLateDetail: (missed, frames) => `Присяд нажат на <b>${missed} мс</b> позже допустимого окна (${frames} кадров). Получится обычный прыжок.`,
      cannotDeleteLast: (action) => `Нельзя удалить последнюю клавишу для действия "${action}"!`,
      copiedToast: "Отчет скопирован в буфер обмена!",
      mouseNames: {
        'Mouse0': 'ЛКМ (Левая)',
        'Mouse1': 'СКМ (Колесико)',
        'Mouse2': 'ПКМ (Правая)',
        'Mouse3': 'MOUSE 4 (Назад)',
        'Mouse4': 'MOUSE 5 (Вперед)'
      }
    }
  };

  let currentLang = localStorage.getItem('apex_sg_lang') || 'en';

  window.ApexI18n = {
    translations: translations,
    getLang: function() {
      return currentLang;
    },
    t: function(key, ...args) {
      const dict = translations[currentLang] || translations.en;
      const val = dict[key];
      if (typeof val === 'function') {
        return val(...args);
      }
      return val || key;
    },
    setLang: function(lang) {
      if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('apex_sg_lang', lang);
        document.documentElement.lang = lang;
      }
    }
  };
})();
