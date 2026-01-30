/* ======================================================
   voice/anjali_friend_tts.js — FRIEND VOICE ENGINE
   PURPOSE:
   - मित्र मोड के लिए अलग, कोमल आवाज़
   - समय और भाव के अनुसार voice modulation
   - अपनापन और निकटता का अनुभव
   ====================================================== */

(function (global) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("Friend TTS not supported");
    return;
  }

  /* ===============================
     VOICE TONE SELECTOR
     =============================== */
  function getVoiceProfile() {
    const hour = new Date().getHours();

    // default profile
    let profile = {
      rate: 0.9,
      pitch: 1.05,
      volume: 1
    };

    // morning — soft & fresh
    if (hour >= 5 && hour < 12) {
      profile.rate = 0.95;
      profile.pitch = 1.1;
    }
    // day — warm & clear
    else if (hour >= 12 && hour < 17) {
      profile.rate = 1.0;
      profile.pitch = 1.05;
    }
    // evening — gentle & relaxed
    else if (hour >= 17 && hour < 21) {
      profile.rate = 0.85;
      profile.pitch = 1.0;
    }
    // night — intimate & slow
    else {
      profile.rate = 0.75;
      profile.pitch = 0.95;
    }

    return profile;
  }

  /* ===============================
     SPEAK (FRIEND)
     =============================== */
  function speak(text) {
    if (!text) return;

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const tone = getVoiceProfile();

    u.lang = "hi-IN";
    u.rate = tone.rate;
    u.pitch = tone.pitch;
    u.volume = tone.volume;

    speechSynthesis.speak(u);
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliFriendTTS = {
    speak
  };

})(window);
