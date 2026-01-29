/* ======================================================
   voice/tts.js — HUMAN TTS + WORD TRACKING CORE
   PURPOSE:
   - अंजली की कोमल आवाज़
   - बोलते समय हर शब्द का live callback
   - Digital Board के लिए Teacher Sync
   ====================================================== */

(function (global) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("TTS not supported in this browser");
    return;
  }

  let currentUtterance = null;
  let wordCallback = null;   // बाहर से सेट होगा

  /* ===============================
     MAIN SPEAK FUNCTION
     =============================== */
  function speak(text, onWord) {
    if (!text || typeof text !== "string") return;

    // पहले की आवाज़ बंद
    window.speechSynthesis.cancel();

    wordCallback = onWord || null;

    const u = new SpeechSynthesisUtterance(text);

    /* 🔹 अंजली की आवाज़ प्रोफाइल */
    u.lang = "hi-IN";
    u.rate = 0.78;   // teacher speed
    u.pitch = 1.08;  // soft tone
    u.volume = 1.0;

    currentUtterance = u;

    // पूरा टेक्स्ट शब्दों में तोड़ना
    const words = text.split(/\s+/);
    let index = 0;

    /* ===============================
       WORD TRACKING ENGINE
       =============================== */
    const approxWordTime = 60000 / (150 * u.rate); 
    // 150 WPM teacher average

    function tick() {
      if (!currentUtterance || index >= words.length) return;

      if (wordCallback) {
        wordCallback(words[index], index);
      }

      index++;
      setTimeout(tick, approxWordTime);
    }

    u.onstart = () => {
      index = 0;
      tick();
    };

    u.onend = () => {
      currentUtterance = null;
    };

    window.speechSynthesis.speak(u);
  }

  function stop() {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliTTS = {
    speak,
    stop
  };

})(window);
