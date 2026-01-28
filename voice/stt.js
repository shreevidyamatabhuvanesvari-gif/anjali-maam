/* ==========================================================
   voice/stt.js — Mic Listener (UI Connected FINAL)
   ========================================================== */

(function (global) {
  "use strict";

  const SpeechRecognition =
    global.SpeechRecognition || global.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    global.AnjaliSTT = { available: false };
    return;
  }

  let recognition = null;
  let listening = false;
  let unlocked = false;

  function normalize(t) {
    return typeof t === "string" ? t.trim() : "";
  }

  function startRecognition() {
    if (!unlocked || listening) return;

    recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = true;     // 🔥 2 मिनट तक खुला रहेगा
    recognition.interimResults = false;

    recognition.onresult = e => {
      const text = normalize(
        e.results[e.results.length - 1][0].transcript
      );

      if (text && typeof global.AnjaliSTT.onText === "function") {
        // 🔑 यही bridge है
        global.AnjaliSTT.onText(text);
      }
    };

    recognition.onerror = () => {
      listening = false;
    };

    recognition.onend = () => {
      listening = false;
    };

    recognition.start();
    listening = true;
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    listening = false;
  }

  /* ===============================
     PUBLIC API
     =============================== */
  global.AnjaliSTT = {
    available: true,

    unlock() {
      unlocked = true;
    },

    start() {
      startRecognition();
    },

    stop() {
      stopRecognition();
    },

    isListening() {
      return listening;
    },

    // यही UI से जुड़ता है
    onText: null
  };

})(window);
