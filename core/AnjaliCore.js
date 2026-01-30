/* ======================================================
   core/AnjaliCore.js — FRIEND+++ CONSCIOUSNESS (REAL)
   SCOPE:
   - केवल मित्र मोड
   - कोई शिक्षक / ज्ञान / उत्तर तय नहीं
   - बातचीत का प्रवाह और स्पेस संभालता है
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     INTERNAL CONVERSATION STATE
     =============================== */
  const STATE = {
    turnCount: 0,
    lastSpeechType: null,     // question | statement | silence
    openness: 0.5,            // 0..1 (बात खोलने की readiness)
    trust: 0.5                // 0..1 (धीरे-धीरे बढ़ता)
  };

  /* ===============================
     SPEECH ACT CLASSIFICATION
     (NO MEANING, ONLY FORM)
     =============================== */
  function classifySpeech(text) {
    const t = text.trim();
    if (!t) return "silence";

    if (
      t.endsWith("?") ||
      t.startsWith("क्या") ||
      t.startsWith("क्यों") ||
      t.startsWith("कैसे") ||
      t.startsWith("कौन")
    ) {
      return "question";
    }

    return "statement";
  }

  /* ===============================
     STATE EVOLUTION
     (CONVERSATION DYNAMICS)
     =============================== */
  function evolveState(speechType) {
    STATE.turnCount++;

    // हर turn पर थोड़ा trust बढ़ता है
    STATE.trust = Math.min(1, STATE.trust + 0.05);

    // openness धीरे-धीरे adjust होती है
    if (speechType === "statement") {
      STATE.openness = Math.min(1, STATE.openness + 0.1);
    }
    if (speechType === "question") {
      STATE.openness = Math.max(0.2, STATE.openness - 0.05);
    }

    STATE.lastSpeechType = speechType;
  }

  /* ===============================
     FRIEND STRATEGY SELECTION
     (NO ANSWERS, ONLY INTENT)
     =============================== */
  function chooseStrategy(speechType) {
    /*
      Strategy तय करती है:
      - जवाब देना है या नहीं
      - जगह खोलनी है या चुप रहना है
      - बातचीत आगे कैसे बढ़े
    */

    if (speechType === "question") {
      return "invite_context";
    }

    if (speechType === "statement") {
      if (STATE.openness > 0.6) {
        return "encourage_expression";
      }
      return "hold_space";
    }

    return "silent_presence";
  }

  /* ===============================
     RESPONSE REALIZATION
     (MINIMAL, NON-SCRIPTED)
     =============================== */
  function realizeResponse(strategy) {
    /*
      यहाँ कोई ज्ञान नहीं,
      कोई तथ्य नहीं,
      कोई hard-coded उत्तर नहीं।

      सिर्फ मित्र की उपस्थिति।
    */

    switch (strategy) {
      case "invite_context":
        return "यह सवाल अपने आप में कुछ कह रहा है। अगर ठीक लगे, तो इसके पीछे की बात बताओ।";

      case "encourage_expression":
        return "लगता है तुम थोड़ा खुल रहे हो। जो भी मन में आ रहा है, कह सकते हो।";

      case "hold_space":
        return "मैं सुन रही हूँ। जल्दी नहीं है।";

      case "silent_presence":
      default:
        return "मैं यहीं हूँ।";
    }
  }

  /* ===============================
     PUBLIC ENTRY POINT
     =============================== */
  function handleInput(userText) {
    const speechType = classifySpeech(userText);
    evolveState(speechType);

    const strategy = chooseStrategy(speechType);
    return realizeResponse(strategy);
  }

  /* ===============================
     OPTIONAL: STATE INSPECTION
     (DEBUG / FUTURE MEMORY)
     =============================== */
  function getState() {
    return { ...STATE };
  }

  /* ===============================
     EXPORT (FRIEND MODE ONLY)
     =============================== */
  global.AnjaliCore = {
    handleInput,
    getState
  };

})(window);
