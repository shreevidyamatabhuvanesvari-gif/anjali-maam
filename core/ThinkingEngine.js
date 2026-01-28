/* ======================================================
   core/ThinkingEngine.js — REAL WORKING BRAIN
   PURPOSE:
   - KnowledgeStore से ज्ञान लेना
   - प्रश्न से match करना
   - सही उत्तर देना
   ====================================================== */

(function (global) {
  "use strict";

  if (!global.KnowledgeStore) {
    console.error("❌ KnowledgeStore not found");
    return;
  }

  /* ===============================
     NORMALIZATION
     =============================== */
  const WEAK_WORDS = new Set([
    "का","की","के","को","से","में","पर","था","थे","है","और"
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
     CORE MATCH LOGIC
     =============================== */
  function similarity(tokensA, tokensB) {
    let match = 0;
    for (const t of tokensA) {
      if (tokensB.includes(t)) match++;
    }
    return match;
  }

  /* ===============================
     THINK FUNCTION
     =============================== */
  function think(input) {
    const userTokens = tokenize(input);
    if (!userTokens.length) {
      return { text: "मुझे प्रश्न स्पष्ट नहीं मिला।" };
    }

    const knowledge = KnowledgeStore.all(); // 🔥 यही असली missing link था

    let best = null;
    let bestScore = 0;

    for (const item of knowledge) {
      const qTokens = tokenize(item.q);
      const score = similarity(userTokens, qTokens);

      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    // न्यूनतम 2 शब्द match होने चाहिए
    if (best && bestScore >= 2) {
      return { text: best.a };
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
