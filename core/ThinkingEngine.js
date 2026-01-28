/* ======================================================
   core/ThinkingEngine.js — UNIVERSAL TEACHER BRAIN
   PURPOSE:
   - Intent-based understanding
   - Topic disambiguation
   - Follow-up support
   - No wrong answer repetition
   - Admin compatible
   ====================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEY = "ANJALI_THINKING_MEMORY_V1";

  /* ===============================
     MEMORY STRUCTURE
     =============================== */
  const Memory = {
    concepts: [
      // {
      //   id,
      //   topic,      // "भारत संविधान"
      //   intent,     // "TIME" | "PERSON" | "DEFINITION"
      //   signals[],  // keywords
      //   answer
      // }
    ],
    lastContext: null // { topic, intent }
  };

  /* ===============================
     LOAD / SAVE
     =============================== */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.concepts))
        Memory.concepts = parsed.concepts;
      if (parsed.lastContext)
        Memory.lastContext = parsed.lastContext;
    } catch {}
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Memory));
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

  /* ===============================
     TOPIC EXTRACTION
     =============================== */
  function extractTopic(tokens) {
    // core topic = longest meaningful phrase
    return tokens.join(" ");
  }

  /* ===============================
     MATCHING LOGIC
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
     LEARNING (ADMIN BRIDGE)
     =============================== */
  function addConcept(id, signals, responder) {
    if (!Array.isArray(signals) || typeof responder !== "function") return;

    const text = signals.join(" ");
    const clean = normalize(text);
    const intent = detectIntent(clean);
    const tokens = tokenize(clean);
    const topic = extractTopic(tokens);
    const answer = String(responder());

    // overwrite only same topic + same intent
    const existing = Memory.concepts.find(
      c => c.topic === topic && c.intent === intent
    );

    if (existing) {
      existing.answer = answer;
      save();
      return;
    }

    Memory.concepts.push({
      id,
      topic,
      intent,
      signals: tokens,
      answer
    });

    save();
  }

  /* ===============================
     THINK (MAIN BRAIN)
     =============================== */
  function think(input) {
    const clean = normalize(input);
    const intent = detectIntent(clean);
    const tokens = tokenize(clean);

    if (!tokens.length) {
      return { text: "मुझे प्रश्न स्पष्ट नहीं मिला।" };
    }

    const topic = extractTopic(tokens);

    // 1. Exact topic + intent
    let concept = findBestConcept(topic, intent, tokens);

    // 2. Follow-up (same intent, previous topic)
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

    // no guessing allowed
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
    addConcept,
    inspect: () => JSON.parse(JSON.stringify(Memory))
  };

})(window);
