/* ======================================================
   voice/tts.js — SOFT HUMAN-LIKE TTS CORE (FINAL)
   PURPOSE:
   - अंजली की कोमल, स्थिर, मानवीय आवाज़
   - जो लिखा जाए वही बोला जाए
   ====================================================== */

(function (global) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("TTS not supported in this browser");
    return;
  }

  let currentUtterance = null;

  function speak(text) {
    if (!text || typeof text !== "string") return;

    // पहले से बोल रही हो तो रोक दो
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);

    /* 🔹 अंजली की आवाज़ प्रोफाइल */
    u.lang = "hi-IN";
    u.rate = 0.78;     // थोड़ा धीमा = टीचर जैसा
    u.pitch = 1.08;    // हल्की कोमलता
    u.volume = 1.0;

    // future control के लिए
    currentUtterance = u;

    window.speechSynthesis.speak(u);
  }

  function stop() {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }

  global.AnjaliTTS = {
    speak,
    stop
  };

})(window);
