// --- AUDIO SYNTHESIS MODULE (ZERO EXTERNAL ASSETS) ---
(function() {
  let audioCtx = null;
  let soundProfile = localStorage.getItem('apex_sg_sound_profile') || 'sound1';
  let soundVolume = parseFloat(localStorage.getItem('apex_sg_volume') || '0.8');

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playNote(freq, duration, type, gainMultiplier) {
    if (soundProfile === 'mute' || soundVolume <= 0) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const mult = gainMultiplier || 1;
      const targetGain = 0.15 * soundVolume * mult;
      gain.gain.setValueAtTime(targetGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  window.ApexAudio = {
    playSuccessSound: function() {
      if (soundProfile === 'mute' || soundVolume <= 0) return;

      if (soundProfile === 'sound1') {
        playNote(587.33, 0.14, 'sine', 1.0);
        setTimeout(function() { playNote(880.00, 0.25, 'sine', 1.1); }, 50);
      } else if (soundProfile === 'sound2') {
        playNote(1200, 0.05, 'square', 0.6);
      } else if (soundProfile === 'sound3') {
        playNote(440, 0.10, 'triangle', 1.2);
        setTimeout(function() { playNote(660, 0.18, 'triangle', 1.0); }, 40);
      }
    },

    playFailLateSound: function() {
      if (soundProfile === 'mute' || soundVolume <= 0) return;
      playNote(180, 0.15, 'sawtooth', 0.8);
    },

    playFailEarlySound: function() {
      if (soundProfile === 'mute' || soundVolume <= 0) return;
      playNote(130, 0.12, 'square', 0.7);
    },

    setSoundProfile: function(profile) {
      soundProfile = profile;
      localStorage.setItem('apex_sg_sound_profile', profile);
    },

    getSoundProfile: function() {
      return soundProfile;
    },

    setVolume: function(vol) {
      soundVolume = Math.max(0, Math.min(1, vol));
      localStorage.setItem('apex_sg_volume', soundVolume.toString());
    },

    getVolume: function() {
      return soundVolume;
    }
  };
})();
