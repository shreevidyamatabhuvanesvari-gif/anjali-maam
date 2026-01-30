/* ======================================================
   core/AnjaliInitiative.js — FRIEND INITIATIVE ENGINE
   PURPOSE:
   - अंजली को खुद से बोलने की पहल देना
   - जवाब नहीं, अगला conversational कदम तय करना
   - स्वतंत्र मित्र बातचीत की पहली ईंट
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     INTERNAL STATE (INITIATIVE ONLY)
     =============================== */
  const STATE = {
    lastUserTurnType: null,   // open | closed | accept | reject
    silenceCount: 0
  };

  /* ===============================
     TURN TYPE DETECTION
     =============================== */
  function detectTurnType(text) {
    const t = text.trim().toLowerCase();
    if (!t) return "silence";

    // acceptance / rejection (generic, not content-based)
    if (t === "हाँ" || t === "ठीक है" || t === "चलो") return "accept";
    if (t === "नहीं" || t === "मत" || t === "नहीं चाहिए") return "reject";

    // question usually keeps conversation open
    if (t.endsWith("?")) return "open";

    // short statements often close a turn
    if (t.length < 8) return "closed";

    return "open";
  }

  /* ===============================
     INITIATIVE DECISION
     =============================== */
  function shouldInitiate(turnType) {
    if (turnType === "silence") {
      STATE.silenceCount++;
      return STATE.silenceCount >= 1;
    }

    STATE.silenceCount = 0;

    if (turnType === "accept") return true;
    if (turnType === "reject") return true;
    if (turnType === "closed") return true;

    return false; // open turn → wait, don't interrupt
  }

  /* ===============================
     INITIATIVE REALIZATION
     (NO SCRIPTED CONTENT)
     =============================== */
  function generateInitiative() {
    /*
      यहाँ कोई तय जवाब नहीं है।
      सिर्फ conversational nudges हैं।
    */

    const nudges = [
      "तो फिर आगे क्या करें?",
      "क्यों न कुछ और सोचें?",
      "ठीक है… अब अगला कदम क्या हो?",
      "चलो, कुछ और तय करें।",
      "तो फिर?"
    ];

    return nudges[Math.floor(Math.random() * nudges.length)];
  }

  /* ===============================
     PUBLIC API
     =============================== */
  function maybeInitiate(userText) {
    const turnType = detectTurnType(userText);
    STATE.lastUserTurnType = turnType;

    if (shouldInitiate(turnType)) {
      return generateInitiative();
    }

    return null; // अभी अंजली चुप रहे
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliInitiative = {
    maybeInitiate
  };

})(window);
