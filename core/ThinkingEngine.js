/* ======================================================
   core/ThinkingEngine.js — ARTICLE AWARE BRAIN
   PURPOSE:
   - KnowledgeStore से पूरा लेख लेना
   - लेख के हर वाक्य से match करना
   - सबसे relevant वाक्य से उत्तर बनाना
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
      .replace(/[^\u0900-\u097Fa-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(text) {
    return normalize(text)
      .split(" ")
      .filter(w => w.length > 1 && !WEAK_WORDS.has(w));
  }

  /* ===============================
     SIMILARITY LOGIC
     =============================== */
  function similarity(tokensA, tokensB) {
    let match = 0;
    for (const t of tokensA) {
      if (tokensB.includes(t)) match++;
    }
    return match;
  }

  /* ===============================
     THINK FUNCTION (ARTICLE LEVEL)
     =============================== */
  function think(input) {
    const userTokens = tokenize(input);
    if (!userTokens.length) {
      return { text: "मुझे प्रश्न स्पष्ट नहीं मिला।" };
    }

    const knowledge = KnowledgeStore.all();

    let bestSentence = null;
    let bestScore = 0;

    for (const item of knowledge) {
      // पूरे लेख को वाक्यों में तोड़ो
      const sentences = item.a
        .split("।")
        .map(s => s.trim())
        .filter(Boolean);

      for (const sentence of sentences) {
        const sTokens = tokenize(sentence);
        const score = similarity(userTokens, sTokens);

        if (score > bestScore) {
          bestScore = score;
          bestSentence = sentence;
        }
      }
    }

    // न्यूनतम 2 शब्द match जरूरी
    if (bestSentence && bestScore >= 2) {
      return { text: bestSentence + "।" };
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
