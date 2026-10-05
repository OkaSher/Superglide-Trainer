// --- SUPERGLIDE CORE LOGIC & STATS ENGINE ---
(function() {
  let currentFps = 144;
  let frameDurationMs = 1000 / currentFps;

  let lastJumpTime = null;
  let lastJumpKeyName = '';
  let lastCrouchTime = null;
  let lastCrouchKeyName = '';
  let evalTimeout = null;

  const stats = {
    attempts: 0,
    successes: 0,
    totalDeltaMs: 0,
    currentStreak: 0,
    bestStreak: parseInt(localStorage.getItem('apex_sg_best_streak') || '0', 10)
  };

  function updateTimeline() {
    const zoneTarget = document.getElementById('zone-target');
    if (!zoneTarget) return;

    const totalDisplayRange = 50;
    const pixelPercentPerMs = (100 - 40) / totalDisplayRange;
    const targetWidthPercent = Math.max(4, Math.min(50, frameDurationMs * pixelPercentPerMs));
    zoneTarget.style.width = `${targetWidthPercent}%`;
    zoneTarget.innerText = window.ApexI18n.t('gaugeTarget', frameDurationMs.toFixed(1));
  }

  function setFps(fps) {
    currentFps = Math.max(30, Math.min(500, fps));
    frameDurationMs = 1000 / currentFps;
    updateTimeline();

    const verdictDetail = document.getElementById('verdict-detail');
    if (stats.attempts === 0 && verdictDetail) {
      verdictDetail.innerText = window.ApexI18n.t('defaultVerdictDetail', currentFps, frameDurationMs.toFixed(2));
    }
  }

  function triggerJump(keyName) {
    lastJumpTime = performance.now();
    lastJumpKeyName = keyName;
    scheduleEvaluation();
  }

  function triggerCrouch(keyName) {
    lastCrouchTime = performance.now();
    lastCrouchKeyName = keyName;
    scheduleEvaluation();
  }

  function scheduleEvaluation() {
    clearTimeout(evalTimeout);
    evalTimeout = setTimeout(function() {
      evaluateAttempt();
    }, 70);
  }

  function evaluateAttempt() {
    if (lastJumpTime === null || lastCrouchTime === null) return;

    const deltaMs = lastCrouchTime - lastJumpTime;
    const jumpKey = lastJumpKeyName;
    const crouchKey = lastCrouchKeyName;

    lastJumpTime = null;
    lastCrouchTime = null;

    stats.attempts++;
    stats.totalDeltaMs += Math.abs(deltaMs);
    const frames = deltaMs / frameDurationMs;

    const verdictText = document.getElementById('verdict-text');
    const verdictDetail = document.getElementById('verdict-detail');
    const markerCrouch = document.getElementById('marker-crouch');

    if (markerCrouch) {
      markerCrouch.style.display = 'block';
      let crouchPercent = 40 + (deltaMs * 1.2);
      crouchPercent = Math.max(2, Math.min(98, crouchPercent));
      markerCrouch.style.left = `${crouchPercent}%`;
    }

    let status = '';
    let pillClass = '';

    if (deltaMs < 0) {
      status = window.ApexI18n.t('statusEarly');
      pillClass = 'pill-early';
      stats.currentStreak = 0;

      if (verdictText) {
        verdictText.style.color = '#ff4757';
        verdictText.innerHTML = window.ApexI18n.t('verdictEarlyTitle', deltaMs.toFixed(1));
      }
      if (verdictDetail) {
        verdictDetail.innerHTML = window.ApexI18n.t('verdictEarlyDetail', crouchKey, Math.abs(deltaMs).toFixed(1), jumpKey);
      }
      window.ApexAudio.playFailEarlySound();
    } else if (deltaMs <= frameDurationMs) {
      status = window.ApexI18n.t('statusSuccess');
      pillClass = 'pill-success';
      stats.successes++;
      stats.currentStreak++;

      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
        localStorage.setItem('apex_sg_best_streak', stats.bestStreak.toString());
      }

      if (verdictText) {
        verdictText.style.color = 'var(--success)';
        verdictText.innerHTML = window.ApexI18n.t('verdictSuccessTitle', deltaMs.toFixed(1));
      }
      if (verdictDetail) {
        verdictDetail.innerHTML = window.ApexI18n.t('verdictSuccessDetail', frames.toFixed(2));
      }
      window.ApexAudio.playSuccessSound();
    } else {
      status = window.ApexI18n.t('statusLate');
      pillClass = 'pill-late';
      stats.currentStreak = 0;
      const missedBy = deltaMs - frameDurationMs;

      if (verdictText) {
        verdictText.style.color = 'var(--warning)';
        verdictText.innerHTML = window.ApexI18n.t('verdictLateTitle', deltaMs.toFixed(1));
      }
      if (verdictDetail) {
        verdictDetail.innerHTML = window.ApexI18n.t('verdictLateDetail', missedBy.toFixed(1), frames.toFixed(1));
      }
      window.ApexAudio.playFailLateSound();
    }

    updateStatsDisplay();
    addHistoryRow(stats.attempts, jumpKey, crouchKey, deltaMs, frames, status, pillClass);
  }

  function updateStatsDisplay() {
    const statAttempts = document.getElementById('stat-attempts');
    const statSuccess = document.getElementById('stat-success');
    const statRate = document.getElementById('stat-rate');
    const statAvg = document.getElementById('stat-avg');
    const statStreak = document.getElementById('stat-streak');
    const statBest = document.getElementById('stat-best');
    const streakBanner = document.getElementById('streak-banner');
    const streakBannerText = document.getElementById('streak-banner-text');

    if (statAttempts) statAttempts.innerText = stats.attempts;
    if (statSuccess) statSuccess.innerText = stats.successes;
    if (statRate) {
      const rate = stats.attempts > 0 ? ((stats.successes / stats.attempts) * 100).toFixed(0) : '0';
      statRate.innerText = `${rate}%`;
    }
    if (statAvg) {
      const avg = stats.attempts > 0 ? (stats.totalDeltaMs / stats.attempts).toFixed(1) : '0';
      statAvg.innerText = `${avg} ms`;
    }
    if (statStreak) statStreak.innerText = stats.currentStreak;
    if (statBest) statBest.innerText = stats.bestStreak;

    if (streakBanner && streakBannerText) {
      streakBanner.classList.remove('hot', 'godlike');
      if (stats.currentStreak >= 10) {
        streakBanner.classList.add('godlike');
        streakBannerText.innerText = window.ApexI18n.t('streakGodlike', stats.currentStreak);
      } else if (stats.currentStreak >= 3) {
        streakBanner.classList.add('hot');
        streakBannerText.innerText = window.ApexI18n.t('streakHot', stats.currentStreak);
      } else {
        streakBannerText.innerText = window.ApexI18n.t('streakBanner', stats.currentStreak);
      }
    }
  }

  function addHistoryRow(num, jKey, cKey, deltaMs, frames, status, pillClass) {
    const historyBody = document.getElementById('history-body');
    if (!historyBody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="color:var(--text-muted);">${num}</td>
      <td><span class="key-tag" style="background:#000; padding:2px 6px; border-radius:4px; font-weight:700;">${jKey}</span></td>
      <td><span class="key-tag" style="background:#000; padding:2px 6px; border-radius:4px; font-weight:700;">${cKey}</span></td>
      <td style="font-weight:700;">${deltaMs >= 0 ? '+' : ''}${deltaMs.toFixed(1)} ms</td>
      <td>${frames.toFixed(2)} fr.</td>
      <td><span class="pill ${pillClass}">${status}</span></td>
    `;
    historyBody.insertBefore(row, historyBody.firstChild);

    while (historyBody.children.length > 20) {
      historyBody.removeChild(historyBody.lastChild);
    }
  }

  function resetStats() {
    stats.attempts = 0;
    stats.successes = 0;
    stats.totalDeltaMs = 0;
    stats.currentStreak = 0;

    updateStatsDisplay();

    const historyBody = document.getElementById('history-body');
    if (historyBody) historyBody.innerHTML = '';

    const verdictText = document.getElementById('verdict-text');
    const verdictDetail = document.getElementById('verdict-detail');
    const markerCrouch = document.getElementById('marker-crouch');

    if (verdictText) {
      verdictText.innerText = window.ApexI18n.t('defaultVerdictTitle');
      verdictText.style.color = 'var(--text-muted)';
    }
    if (verdictDetail) {
      verdictDetail.innerText = window.ApexI18n.t('defaultVerdictDetail', currentFps, frameDurationMs.toFixed(2));
    }
    if (markerCrouch) {
      markerCrouch.style.display = 'none';
    }
  }

  window.ApexTrainer = {
    stats: stats,
    setFps: setFps,
    getFps: function() { return currentFps; },
    getFrameDurationMs: function() { return frameDurationMs; },
    updateTimeline: updateTimeline,
    updateStatsDisplay: updateStatsDisplay,
    triggerJump: triggerJump,
    triggerCrouch: triggerCrouch,
    resetStats: resetStats
  };
})();
