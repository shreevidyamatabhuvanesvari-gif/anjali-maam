/* ======================================================
   voice/stt.js — REAL MIC LISTENER (PHASE 2)
   PURPOSE:
   - Browser mic permission लेना
   - User की आवाज़ सुनना
   - बोला हुआ text JS में देना
   - अभी सिर्फ testing के लिए (no AI)
   ====================================================== */

(function (global) {
  "use strict";

  const SpeechRecognition =
    global.SpeechRecognition || global.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("❌ आपका ब्राउज़र Speech Recognition सपोर्ट नहीं करता");
    global.AnjaliSTT = { available: false };
    return;
  }

  let recognition = null;
  let listening = false;

  function startListening() {
    if (listening) return;

    recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;   // एक बार बोले, फिर रुके
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎤 Mic चालू हो गया");
      listening = true;
    };

    recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      console.log("🗣 आपने कहा:", text);

      // अभी सिर्फ test output
      alert("आपने कहा: " + text);

      listening = false;
    };

    recognition.onerror = err => {
      console.error("Mic Error:", err);
      listening = false;
    };

    recognition.onend = () => {
      console.log("🎤 Mic बंद हो गया");
      listening = false;
    };

    recognition.start(); // यही line mic permission trigger करती है
  }

  function stopListening() {
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
    start: startListening,
    stop: stopListening,
    isListening: () => listening
  };

})(window);
