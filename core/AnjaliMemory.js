/* ======================================================
   core/AnjaliMemory.js — FRIEND CONVERSATION MEMORY
   PURPOSE:
   - बातचीत का संदर्भ (context) बनाए रखना
   - पिछली बातों से flow समझना
   - जवाब तय नहीं करता, सिर्फ याद रखता है
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     INTERNAL MEMORY STATE
     =============================== */
  const MEMORY = {
    turns: [],          // last few user turns
    topicHint: null,    // vague idea of "what is going on"
    lastAction: null    // accept | reject | propose | silence
  };

  const MAX_TURNS = 5;  // lightweight memory (friend-like)

  /* ===============================
     TURN CLASSIFICATION (LIGHT)
     =============================== */
  function classifyTurn(text) {
    const t = text.trim().toLowerCase();
    if (!t) return "silence";

    if (t === "हाँ" || t === "ठीक है" || t === "चलो") return "accept";
    if (t === "नहीं" || t === "मत" || t === "नहीं चाहिए") return "reject";

    if (t.endsWith("?")) return "question";

    return "statement";
  }

  /* ===============================
     TOPIC HINT EXTRACTION
     (VERY LOOSE, NON-SEMANTIC)
     =============================== */
  function extractTopicHint(text) {
    const words = text
      .split(/\s+/)
      .filter(w => w.length > 3);

    if (!words.length) return null;

    // सिर्फ एक हल्का संकेत
    return words[words.length - 1];
  }

  /* ===============================
     MEMORY UPDATE
     =============================== */
  function remember(userText) {
    const type = classifyTurn(userText);

    MEMORY.turns.push({
      text: userText,
      type
    });

    if (MEMORY.turns.length > MAX_TURNS) {
      MEMORY.turns.shift();
    }

    MEMORY.lastAction = type;

    const hint = extractTopicHint(userText);
    if (hint) MEMORY.topicHint = hint;
  }

  /* ===============================
     PUBLIC READ ACCESS
     =============================== */
  function getContext() {
    return {
      lastAction: MEMORY.lastAction,
      topicHint: MEMORY.topicHint,
      recentTurns: MEMORY.turns.slice()
    };
  }

  /* ===============================
     RESET (OPTIONAL)
     =============================== */
  function clear() {
    MEMORY.turns = [];
    MEMORY.topicHint = null;
    MEMORY.lastAction = null;
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliMemory = {
    remember,
    getContext,
    clear
  };

})(window);
