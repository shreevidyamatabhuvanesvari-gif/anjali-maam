/* ======================================================
   core/AnjaliCore.js — FRIEND+++ CONSCIOUSNESS (SILENT)
   SCOPE:
   - केवल मित्र मोड
   - Core सोचता है, state संभालता है
   - ❌ बोलता नहीं (silent baseline)
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
    const t = (text || "").trim();
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
     (INTERNAL ONLY)
     =============================== */
  function chooseStrategy(speechType) {
    if (speechType === "question") return "invite_context";
    if (speechType === "statement") {
      return STATE.openness > 0.6 ? "encourage_expression" : "hold_space";
    }
    return "silent_presence";
  }

  /* ===============================
     PUBLIC ENTRY POINT
     =============================== */
  function handleInput(userText) {
    const speechType = classifySpeech(userText);
    evolveState(speechType);

    // Strategy internal रूप से तय होती है,
    // लेकिन Core अब कुछ भी बोलेगा नहीं।
    chooseStrategy(speechType);

    // 🔕 Silent baseline: कोई टेक्स्ट नहीं
    return "";
  }

  /* ===============================
     OPTIONAL: STATE INSPECTION
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
