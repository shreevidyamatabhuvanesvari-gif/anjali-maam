/* ======================================================
   core/ThinkingEngine.js — UNIVERSAL TEACHER BRAIN (V2)
   NOW CONNECTED WITH KnowledgeStore
   ====================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEY = "ANJALI_THINKING_MEMORY_V2";

  const Memory = {
    concepts: [],
    lastContext: null
  };

  /* ===============================
     LOAD / SAVE (internal stats only)
     =============================== */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.lastContext)
        Memory.lastContext = parsed.lastContext;
    } catch {}
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lastContext: Memory.lastContext })
    );
  }

  load();

  /* ===============================
     INTENT DETECTION
     =============================== */
  function detectIntent(text) {
    if (/कब|वर्ष|साल|तारीख/.test(text)) return "TIME";
    if (/कौन|किसने/.test(text)) return "PERSON";
    if (/क्या|अर्थ|तात्पर्य|समझाइए/.test(text)) return "DEFINITION";
    if (/कैसे|प्रभाव|कारण/.test(text)) return "EXPLANATION";
    return "UNKNOWN";
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

  function extractTopic(tokens) {
    return tokens.join(" ");
  }

  /* ===============================
     🔑 CRITICAL: SYNC FROM KnowledgeStore
     =============================== */
  function syncFromKnowledgeStore() {
    if (!global.KnowledgeStore) return;

    const data = KnowledgeStore.all();
    Memory.concepts = data.map(item => {
      const clean = normalize(item.q);
      const intent = detectIntent(clean);
      const tokens = tokenize(clean);
      const topic = extractTopic(tokens);

      return {
        id: item.id,
        topic,
        intent,
        signals: tokens,
        answer: item.a
      };
    });
  }

  // हर load पर sync
  syncFromKnowledgeStore();

  /* ===============================
     MATCHING
     =============================== */
  function matchScore(tokens, concept) {
    let score = 0;
    for (const s of concept.signals) {
      if (tokens.includes(s)) score++;
    }
    return score;
  }

  function findBestConcept(topic, intent, tokens) {
    let best = null;
    let bestScore = 0;

    for (const c of Memory.concepts) {
      if (c.intent !== intent) continue;
      if (c.topic !== topic) continue;

      const score = matchScore(tokens, c);
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }

    return bestScore >= 1 ? best : null;
  }

  /* ===============================
     THINK (MAIN BRAIN)
     =============================== */
  function think(input) {
    // हर प्रश्न पर fresh sync (real brain)
    syncFromKnowledgeStore();

    const clean = normalize(input);
    const intent = detectIntent(clean);
    const tokens = tokenize(clean);

    if (!tokens.length) {
      return { text: "मुझे प्रश्न स्पष्ट नहीं मिला।" };
    }

    const topic = extractTopic(tokens);

    let concept = findBestConcept(topic, intent, tokens);

    // follow-up
    if (!concept && Memory.lastContext) {
      if (Memory.lastContext.intent === intent) {
        concept = findBestConcept(
          Memory.lastContext.topic,
          intent,
          tokens
        );
      }
    }

    if (concept) {
      Memory.lastContext = {
        topic: concept.topic,
        intent: concept.intent
      };
      save();
      return { text: concept.answer };
    }

    Memory.lastContext = null;
    save();
    return {
      text: "इस प्रश्न का उत्तर अभी मेरे पास नहीं है।",
      unknown: true
    };
  }

  /* ===============================
     EXPORT
     =============================== */
  global.ThinkingEngine = {
    think,
    inspect: () => JSON.parse(JSON.stringify(Memory))
  };

})(window);
