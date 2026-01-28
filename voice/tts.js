/* ======================================================
   voice/tts.js — SIMPLE WORKING TTS CORE
   ====================================================== */

(function (global) {
  "use strict";

  if (!("speechSynthesis" in window)) {
    console.warn("TTS not supported in this browser");
    return;
  }

  function speak(text) {
    if (!text || typeof text !== "string") return;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "hi-IN";
    u.rate = 0.9;
    u.pitch = 1.0;

    window.speechSynthesis.cancel(); // पहले की आवाज़ रोकें
    window.speechSynthesis.speak(u);
  }

  global.AnjaliTTS = {
    speak
  };

})(window);
