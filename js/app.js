// --- MAIN APPLICATION CONTROLLER ---
(function() {
  let isCompact = localStorage.getItem('apex_sg_compact') === 'true';

  let mantleActive = false;
  let mantleProgress = 0;
  let mantleInterval = null;

  document.addEventListener('DOMContentLoaded', function() {
    initUI();
    initEventListeners();
  });

  function initUI() {
    applyLanguage(window.ApexI18n.getLang());
    setCompactMode(isCompact);
    window.ApexBinds.initBinds();
    window.ApexTrainer.setFps(144);
    window.ApexTrainer.updateStatsDisplay();

    const soundSelect = document.getElementById('sound-profile-select');
    if (soundSelect) soundSelect.value = window.ApexAudio.getSoundProfile();

    const volumeSlider = document.getElementById('volume-slider');
    const volumeValText = document.getElementById('volume-val-text');
    if (volumeSlider) {
      const volPct = Math.round(window.ApexAudio.getVolume() * 100);
      volumeSlider.value = volPct;
      if (volumeValText) volumeValText.innerText = volPct + '%';
    }
  }

  function applyLanguage(lang) {
    window.ApexI18n.setLang(lang);
    const dict = window.ApexI18n.translations[lang] || window.ApexI18n.translations.en;

    const langBtnEn = document.getElementById('lang-en');
    const langBtnRu = document.getElementById('lang-ru');
    if (lang === 'en') {
      if (langBtnEn) langBtnEn.classList.add('active');
      if (langBtnRu) langBtnRu.classList.remove('active');
    } else {
      if (langBtnRu) langBtnRu.classList.add('active');
      if (langBtnEn) langBtnEn.classList.remove('active');
    }

    setText('i18n-title', dict.title);
    setText('i18n-subtitle', dict.subtitle);
    setText('i18n-status-ready', dict.statusReady);
    setText('i18n-compact-btn', isCompact ? dict.fullBtn : dict.compactBtn);
    setText('i18n-soundpack-label', dict.soundpackLabel);
    setText('i18n-volume-label', dict.volumeLabel);
    setText('i18n-keybinds-title', dict.keybindsTitle);
    setText('btn-reset-binds', dict.btnResetBinds);
    setText('i18n-jump-label', dict.jumpLabel);
    setText('i18n-crouch-label', dict.crouchLabel);
    setText('i18n-fps-title', dict.fpsTitle);
    setHtml('i18n-fps-hint', dict.fpsHint);

    setText('gauge-early-label', dict.gaugeEarly);
    setText('gauge-late-label', dict.gaugeLate);

    setText('i18n-stat-attempts', dict.statAttempts);
    setText('i18n-stat-success', dict.statSuccess);
    setText('i18n-stat-rate', dict.statRate);
    setText('i18n-stat-avg', dict.statAvg);
    setText('i18n-stat-streak', dict.statStreak);
    setText('i18n-stat-best', dict.statBest);

    setText('i18n-mantle-title', dict.mantleTitle);
    const toggleMantleBtn = document.getElementById('toggle-mantle-btn');
    if (toggleMantleBtn) {
      toggleMantleBtn.innerText = mantleActive ? dict.mantleStop : dict.mantleStart;
    }
    setText('i18n-mantle-climbing', dict.mantleClimbing);
    setText('i18n-mantle-zone', dict.mantleZone);

    setText('i18n-history-title', dict.historyTitle);
    setText('btn-clear-history', dict.historyClear);
    setText('btn-share-report', dict.btnShare);

    setText('i18n-col-num', dict.colNum);
    setText('i18n-col-jump', dict.colJump);
    setText('i18n-col-crouch', dict.colCrouch);
    setText('i18n-col-delta', dict.colDelta);
    setText('i18n-col-frames', dict.colFrames);
    setText('i18n-col-result', dict.colResult);
    setHtml('i18n-footer-hint', dict.footerHint);

    const btnCancelRecord = document.getElementById('btn-cancel-record');
    if (btnCancelRecord) btnCancelRecord.innerText = dict.modalCancel;

    window.ApexBinds.renderBinds();
    window.ApexTrainer.updateTimeline();
    window.ApexTrainer.updateStatsDisplay();
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.innerText = text;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
  }

  function setCompactMode(active) {
    isCompact = active;
    localStorage.setItem('apex_sg_compact', isCompact);

    const compactBtnIcon = document.getElementById('compact-btn-icon');
    const i18nCompactBtn = document.getElementById('i18n-compact-btn');

    if (isCompact) {
      document.body.classList.add('compact-mode');
      if (compactBtnIcon) compactBtnIcon.innerText = '🗗';
      if (i18nCompactBtn) i18nCompactBtn.innerText = window.ApexI18n.t('fullBtn');
    } else {
      document.body.classList.remove('compact-mode');
      if (compactBtnIcon) compactBtnIcon.innerText = '🗖';
      if (i18nCompactBtn) i18nCompactBtn.innerText = window.ApexI18n.t('compactBtn');
    }
  }

  function flashChip(chipId, className) {
    const el = document.getElementById(chipId);
    if (!el) return;
    el.classList.add(className);
    setTimeout(function() { el.classList.remove(className); }, 180);
  }

  let toastTimeout = null;
  function showToast(msg) {
    const toastMsg = document.getElementById('toast-msg');
    if (!toastMsg) return;
    toastMsg.innerText = msg;
    toastMsg.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      toastMsg.classList.remove('show');
    }, 2500);
  }

  function initEventListeners() {
    const langBtnEn = document.getElementById('lang-en');
    const langBtnRu = document.getElementById('lang-ru');
    if (langBtnEn) langBtnEn.addEventListener('click', function() { applyLanguage('en'); });
    if (langBtnRu) langBtnRu.addEventListener('click', function() { applyLanguage('ru'); });

    const btnToggleCompact = document.getElementById('btn-toggle-compact');
    if (btnToggleCompact) {
      btnToggleCompact.addEventListener('click', function() { setCompactMode(!isCompact); });
    }

    const soundSelect = document.getElementById('sound-profile-select');
    if (soundSelect) {
      soundSelect.addEventListener('change', function(e) {
        window.ApexAudio.setSoundProfile(e.target.value);
      });
    }

    const volumeSlider = document.getElementById('volume-slider');
    const volumeValText = document.getElementById('volume-val-text');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', function(e) {
        const val = parseInt(e.target.value, 10);
        window.ApexAudio.setVolume(val / 100);
        if (volumeValText) volumeValText.innerText = val + '%';
      });
    }

    const btnResetBinds = document.getElementById('btn-reset-binds');
    if (btnResetBinds) {
      btnResetBinds.addEventListener('click', window.ApexBinds.resetBinds);
    }

    const btnCancelRecord = document.getElementById('btn-cancel-record');
    if (btnCancelRecord) {
      btnCancelRecord.addEventListener('click', window.ApexBinds.stopRecording);
    }

    document.querySelectorAll('.fps-btn[data-fps]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.fps-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const customInput = document.getElementById('custom-fps-input');
        if (customInput) customInput.value = '';
        window.ApexTrainer.setFps(parseInt(btn.getAttribute('data-fps'), 10));
      });
    });

    const customFpsInput = document.getElementById('custom-fps-input');
    if (customFpsInput) {
      customFpsInput.addEventListener('input', function(e) {
        const val = parseInt(e.target.value, 10);
        if (val >= 30 && val <= 500) {
          document.querySelectorAll('.fps-btn').forEach(function(b) { b.classList.remove('active'); });
          window.ApexTrainer.setFps(val);
        }
      });
    }

    const btnClearHistory = document.getElementById('btn-clear-history');
    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', window.ApexTrainer.resetStats);
    }

    const btnShareReport = document.getElementById('btn-share-report');
    if (btnShareReport) {
      btnShareReport.addEventListener('click', function() {
        const curStats = window.ApexTrainer.stats;
        const winrate = curStats.attempts > 0 ? ((curStats.successes / curStats.attempts) * 100).toFixed(0) : '0';
        const avg = curStats.attempts > 0 ? (curStats.totalDeltaMs / curStats.attempts).toFixed(1) : '0';
        const userBinds = window.ApexBinds.getBinds();
        const jumpKeys = userBinds.jump.map(function(b) { return b.label; }).join(' / ');
        const crouchKeys = userBinds.crouch.map(function(b) { return b.label; }).join(' / ');

        const reportText = [
          '⚡ Apex Legends Superglide Trainer Report',
          '🎯 Winrate: ' + winrate + '% (' + curStats.successes + '/' + curStats.attempts + ')',
          '🔥 Best Streak: ' + curStats.bestStreak + ' in a row',
          '⏱️ Avg Delta: ' + avg + ' ms at ' + window.ApexTrainer.getFps() + ' FPS (' + window.ApexTrainer.getFrameDurationMs().toFixed(2) + ' ms window)',
          '🎮 Keybinds: [' + jumpKeys + '] -> [' + crouchKeys + ']',
          'Tested at: Apex Superglide Trainer'
        ].join('\n');

        navigator.clipboard.writeText(reportText).then(function() {
          showToast(window.ApexI18n.t('copiedToast'));
        }).catch(function() {
          alert(reportText);
        });
      });
    }

    const toggleMantleBtn = document.getElementById('toggle-mantle-btn');
    const mantleContainer = document.getElementById('mantle-container');
    const mantleFill = document.getElementById('mantle-fill');

    if (toggleMantleBtn) {
      toggleMantleBtn.addEventListener('click', function() {
        mantleActive = !mantleActive;
        if (mantleActive) {
          if (mantleContainer) mantleContainer.style.display = 'flex';
          toggleMantleBtn.innerText = window.ApexI18n.t('mantleStop');
          toggleMantleBtn.classList.add('active');
          startMantleLoop();
        } else {
          if (mantleContainer) mantleContainer.style.display = 'none';
          toggleMantleBtn.innerText = window.ApexI18n.t('mantleStart');
          toggleMantleBtn.classList.remove('active');
          clearInterval(mantleInterval);
        }
      });
    }

    function startMantleLoop() {
      clearInterval(mantleInterval);
      mantleProgress = 0;
      mantleInterval = setInterval(function() {
        mantleProgress += 2.5;
        if (mantleProgress > 100) {
          mantleProgress = 0;
        }
        if (mantleFill) mantleFill.style.width = mantleProgress + '%';
      }, 30);
    }

    // Input router (Keyboard, Wheel, Mouse Buttons)
    window.addEventListener('keydown', function(e) {
      if (window.ApexBinds.isRecording()) {
        e.preventDefault();
        e.stopPropagation();
        if (e.code === 'Escape') {
          window.ApexBinds.stopRecording();
          return;
        }
        window.ApexBinds.registerRecordedKey(e.code, 'keyboard');
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
      }

      const userBinds = window.ApexBinds.getBinds();

      const matchedJump = userBinds.jump.find(function(b) { return b.code === e.code; });
      if (matchedJump) {
        flashChip('chip-jump-' + matchedJump.code, 'active-jump');
        window.ApexTrainer.triggerJump(window.ApexBinds.getFriendlyLabel(matchedJump.code, matchedJump.type));
      }

      const matchedCrouch = userBinds.crouch.find(function(b) { return b.code === e.code; });
      if (matchedCrouch) {
        flashChip('chip-crouch-' + matchedCrouch.code, 'active-crouch');
        window.ApexTrainer.triggerCrouch(window.ApexBinds.getFriendlyLabel(matchedCrouch.code, matchedCrouch.type));
      }
    });

    window.addEventListener('wheel', function(e) {
      const code = e.deltaY > 0 ? 'MWheelDown' : 'MWheelUp';

      if (window.ApexBinds.isRecording()) {
        e.preventDefault();
        e.stopPropagation();
        window.ApexBinds.registerRecordedKey(code, 'wheel');
        return;
      }

      const userBinds = window.ApexBinds.getBinds();

      const matchedJump = userBinds.jump.find(function(b) { return b.code === code; });
      if (matchedJump) {
        e.preventDefault();
        flashChip('chip-jump-' + matchedJump.code, 'active-jump');
        window.ApexTrainer.triggerJump(window.ApexBinds.getFriendlyLabel(matchedJump.code, matchedJump.type));
      }

      const matchedCrouch = userBinds.crouch.find(function(b) { return b.code === code; });
      if (matchedCrouch) {
        e.preventDefault();
        flashChip('chip-crouch-' + matchedCrouch.code, 'active-crouch');
        window.ApexTrainer.triggerCrouch(window.ApexBinds.getFriendlyLabel(matchedCrouch.code, matchedCrouch.type));
      }
    }, { passive: false });

    window.addEventListener('mousedown', function(e) {
      const code = 'Mouse' + e.button;

      if (window.ApexBinds.isRecording()) {
        const btnCancelRecord = document.getElementById('btn-cancel-record');
        if (e.target === btnCancelRecord || (btnCancelRecord && btnCancelRecord.contains(e.target))) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        window.ApexBinds.registerRecordedKey(code, 'mouse');
        return;
      }

      const userBinds = window.ApexBinds.getBinds();

      const matchedJump = userBinds.jump.find(function(b) { return b.code === code; });
      if (matchedJump) {
        flashChip('chip-jump-' + matchedJump.code, 'active-jump');
        window.ApexTrainer.triggerJump(window.ApexBinds.getFriendlyLabel(matchedJump.code, matchedJump.type));
      }

      const matchedCrouch = userBinds.crouch.find(function(b) { return b.code === code; });
      if (matchedCrouch) {
        flashChip('chip-crouch-' + matchedCrouch.code, 'active-crouch');
        window.ApexTrainer.triggerCrouch(window.ApexBinds.getFriendlyLabel(matchedCrouch.code, matchedCrouch.type));
      }
    });

    window.addEventListener('contextmenu', function(e) {
      const userBinds = window.ApexBinds.getBinds();
      const isBound = userBinds.jump.some(function(b) { return b.code === 'Mouse2'; }) || 
                      userBinds.crouch.some(function(b) { return b.code === 'Mouse2'; });
      if (isBound) {
        e.preventDefault();
      }
    });
  }
})();
