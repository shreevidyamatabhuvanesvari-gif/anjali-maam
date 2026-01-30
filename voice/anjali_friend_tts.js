/* ======================================================
   voice/anjali_friend_tts.js — FRIEND VOICE (YOUTHFUL)
   PURPOSE:
   - 24 वर्षीय मानवीय लड़की जैसी सुरीली, कोमल आवाज़
   - भारीपन हटाकर हल्कापन + अपनापन
   - समय के अनुसार subtle modulation
   ====================================================== */

(function (global) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("Friend TTS not supported");
    return;
  }

  /* ===============================
     VOICE PROFILE (LIGHT & SWEET)
     =============================== */
  function getVoiceProfile() {
    const hour = new Date().getHours();

    // Base: youthful, light, feminine
    let profile = {
      rate: 1.02,   // natural, alive
      pitch: 1.22,  // lighter, sweeter (reduces heaviness)
      volume: 0.95
    };

    // Morning: fresh & bright
    if (hour >= 5 && hour < 12) {
      profile.rate = 1.05;
      profile.pitch = 1.25;
    }
    // Day: warm & clear
    else if (hour >= 12 && hour < 17) {
      profile.rate = 1.03;
      profile.pitch = 1.22;
    }
    // Evening: gentle & soft
    else if (hour >= 17 && hour < 21) {
      profile.rate = 0.98;
      profile.pitch = 1.18;
    }
    // Night: intimate & tender
    else {
      profile.rate = 0.92;
      profile.pitch = 1.15;
    }

    return profile;
  }

  /* ===============================
     MICRO-PAUSE ENRICHMENT
     (adds softness without heaviness)
     =============================== */
  function soften(text) {
    if (!text) return text;
    // Light pauses after commas/phrases
    return text
      .replace(/, /g, ", … ")
      .replace(/।/g, "… ");
  }

  /* ===============================
     SPEAK (FRIEND)
     =============================== */
  function speak(text) {
    if (!text) return;

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(soften(text));
    const tone = getVoiceProfile();

    u.lang = "hi-IN";
    u.rate = tone.rate;
    u.pitch = tone.pitch;
    u.volume = tone.volume;

    // Prefer a female Hindi voice if available
    const voices = speechSynthesis.getVoices();
    const hiFemale = voices.find(v =>
      v.lang === "hi-IN" && /female|woman|girl/i.test(v.name)
    );
    if (hiFemale) u.voice = hiFemale;

    speechSynthesis.speak(u);
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliFriendTTS = {
    speak
  };

})(window);
