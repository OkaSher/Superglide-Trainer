// --- CUSTOM KEYBINDS MODULE ---
(function() {
  const DEFAULT_BINDS = {
    jump: [
      { code: 'Space', label: 'SPACE', type: 'keyboard' },
      { code: 'MWheelDown', label: 'MWHEEL DOWN', type: 'wheel' }
    ],
    crouch: [
      { code: 'KeyC', label: 'C', type: 'keyboard' },
      { code: 'CapsLock', label: 'CAPS LOCK', type: 'keyboard' }
    ]
  };

  let userBinds = loadBinds();
  let recordingAction = null;
  let onBindsChangedCallback = null;

  function loadBinds() {
    try {
      const saved = localStorage.getItem('apex_sg_binds_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.jump) && Array.isArray(parsed.crouch)) {
          return parsed;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_BINDS));
  }

  function saveBinds() {
    try {
      localStorage.setItem('apex_sg_binds_v2', JSON.stringify(userBinds));
    } catch (e) {}
  }

  function getFriendlyLabel(code, type) {
    const lang = window.ApexI18n.getLang();
    const dict = window.ApexI18n.translations[lang] || window.ApexI18n.translations.en;

    if (type === 'wheel') {
      return code === 'MWheelDown' ? 'MWHEEL DOWN' : 'MWHEEL UP';
    }
    if (type === 'mouse') {
      return dict.mouseNames[code] || code.toUpperCase();
    }

    const cleanups = {
      'Space': 'SPACE',
      'CapsLock': 'CAPS LOCK',
      'ShiftLeft': 'L-SHIFT',
      'ShiftRight': 'R-SHIFT',
      'ControlLeft': 'L-CTRL',
      'ControlRight': 'R-CTRL',
      'AltLeft': 'L-ALT',
      'AltRight': 'R-ALT',
      'Tab': 'TAB',
      'Enter': 'ENTER',
      'Backspace': 'BACKSPACE'
    };

    if (cleanups[code]) return cleanups[code];
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Numpad')) return 'NUM ' + code.slice(6);
    return code.toUpperCase();
  }

  function renderBinds() {
    const lang = window.ApexI18n.getLang();
    const dict = window.ApexI18n.translations[lang] || window.ApexI18n.translations.en;

    const jumpChipsRow = document.getElementById('jump-chips-row');
    const crouchChipsRow = document.getElementById('crouch-chips-row');

    if (!jumpChipsRow || !crouchChipsRow) return;

    // Jump Chips
    jumpChipsRow.innerHTML = '';
    userBinds.jump.forEach((bind, idx) => {
      const label = getFriendlyLabel(bind.code, bind.type);
      const chip = document.createElement('div');
      chip.className = 'bind-chip jump-chip';
      chip.id = `chip-jump-${bind.code}`;
      chip.innerHTML = `
        <span class="chip-key">${label}</span>
        <span class="chip-remove" title="Remove" data-action="jump" data-idx="${idx}">✕</span>
      `;
      jumpChipsRow.appendChild(chip);
    });

    const addJumpBtn = document.createElement('button');
    addJumpBtn.className = 'btn-add-key';
    addJumpBtn.innerHTML = `<span>${dict.btnAddKey}</span>`;
    addJumpBtn.addEventListener('click', () => startRecording('jump'));
    jumpChipsRow.appendChild(addJumpBtn);

    // Crouch Chips
    crouchChipsRow.innerHTML = '';
    userBinds.crouch.forEach((bind, idx) => {
      const label = getFriendlyLabel(bind.code, bind.type);
      const chip = document.createElement('div');
      chip.className = 'bind-chip crouch-chip';
      chip.id = `chip-crouch-${bind.code}`;
      chip.innerHTML = `
        <span class="chip-key">${label}</span>
        <span class="chip-remove" title="Remove" data-action="crouch" data-idx="${idx}">✕</span>
      `;
      crouchChipsRow.appendChild(chip);
    });

    const addCrouchBtn = document.createElement('button');
    addCrouchBtn.className = 'btn-add-key';
    addCrouchBtn.innerHTML = `<span>${dict.btnAddKey}</span>`;
    addCrouchBtn.addEventListener('click', () => startRecording('crouch'));
    crouchChipsRow.appendChild(addCrouchBtn);

    document.querySelectorAll('.chip-remove').forEach(rm => {
      rm.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = rm.getAttribute('data-action');
        const idx = parseInt(rm.getAttribute('data-idx'), 10);
        removeBind(action, idx);
      });
    });
  }

  function startRecording(action) {
    const lang = window.ApexI18n.getLang();
    const dict = window.ApexI18n.translations[lang] || window.ApexI18n.translations.en;
    recordingAction = action;

    const modal = document.getElementById('recording-modal');
    const title = document.getElementById('modal-action-title');
    const desc = document.getElementById('modal-desc');

    const actName = action === 'jump' ? dict.jumpLabel : dict.crouchLabel;
    title.innerText = dict.modalWaiting(actName);
    desc.innerHTML = dict.modalDesc;
    modal.classList.add('active');
  }

  function stopRecording() {
    recordingAction = null;
    const modal = document.getElementById('recording-modal');
    if (modal) modal.classList.remove('active');
  }

  function removeBind(action, index) {
    const lang = window.ApexI18n.getLang();
    const dict = window.ApexI18n.translations[lang] || window.ApexI18n.translations.en;

    if (userBinds[action].length <= 1) {
      const actName = action === 'jump' ? dict.jumpLabel : dict.crouchLabel;
      alert(dict.cannotDeleteLast(actName));
      return;
    }
    userBinds[action].splice(index, 1);
    saveBinds();
    renderBinds();
    if (onBindsChangedCallback) onBindsChangedCallback();
  }

  window.ApexBinds = {
    initBinds: function(onChange) {
      onBindsChangedCallback = onChange;
      renderBinds();
    },
    getBinds: function() {
      return userBinds;
    },
    resetBinds: function() {
      userBinds = JSON.parse(JSON.stringify(DEFAULT_BINDS));
      saveBinds();
      renderBinds();
      if (onBindsChangedCallback) onBindsChangedCallback();
    },
    removeBind: removeBind,
    getFriendlyLabel: getFriendlyLabel,
    renderBinds: renderBinds,
    startRecording: startRecording,
    stopRecording: stopRecording,
    isRecording: function() {
      return recordingAction !== null;
    },
    registerRecordedKey: function(code, type) {
      if (!recordingAction) return;

      const action = recordingAction;
      const label = getFriendlyLabel(code, type);

      const exists = userBinds[action].some(b => b.code === code);
      if (!exists) {
        userBinds[action].push({ code, label, type });
        saveBinds();
        renderBinds();
        if (onBindsChangedCallback) onBindsChangedCallback();
      }

      stopRecording();
    }
  };
})();
