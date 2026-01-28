/* ======================================================
   core/ThinkingEngine.js — REAL BRAIN (KnowledgeStore Connected)
   PURPOSE:
   - KnowledgeStore से सीधे ज्ञान पढ़ना
   - User प्रश्न से best match निकालना
   - कोई guessing नहीं
   - कोई duplicate memory नहीं
   ====================================================== */

(function (global) {
  "use strict";

  if (!global.KnowledgeStore) {
    console.error("❌ KnowledgeStore not loaded");
    return;
  }

  /* ===============================
     NORMALIZATION
     =============================== */

  const WEAK_WORDS = new Set([
    "का","की","के","को","से","में","पर",
    "है","था","थे","और","क्या","कौन","कब","कैसे"
  ]);

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\u0900-\u097F\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(text) {
    return normalize(text)
      .split(" ")
      .filter(w => w.length > 1 && !WEAK_WORDS.has(w));
  }

  /* ===============================
     MATCHING LOGIC
     =============================== */

  function scoreMatch(userTokens, questionTokens) {
    let score = 0;
    for (const w of questionTokens) {
      if (userTokens.includes(w)) score++;
    }
    return score;
  }

  /* ===============================
     MAIN THINK FUNCTION
     =============================== */

  function think(userInput) {
    const userTokens = tokenize(userInput);
    if (!userTokens.length) {
      return { text: "मुझे प्रश्न स्पष्ट नहीं मिला।" };
    }

    const knowledge = KnowledgeStore.all(); // 🔑 असली दिमाग यहाँ है

    let bestItem = null;
    let bestScore = 0;

    for (const item of knowledge) {
      const qTokens = tokenize(item.q);
      const score = scoreMatch(userTokens, qTokens);

      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    // Minimum threshold: कम से कम 2 शब्द match
    if (bestItem && bestScore >= 2) {
      return { text: bestItem.a };
    }

    return {
      text: "इस प्रश्न का उत्तर अभी मेरे पास नहीं है।",
      unknown: true
    };
  }

  /* ===============================
     EXPORT
     =============================== */

  global.ThinkingEngine = {
    think
  };

})(window);
