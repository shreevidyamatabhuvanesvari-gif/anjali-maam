/* ======================================================
   core/AnjaliResponseGenerator.js — FRIEND VOICE ENGINE
   PURPOSE:
   - हर turn पर अंजली को बोलने योग्य बनाना
   - प्रतिक्रिया + आगे बढ़ाने वाला प्रश्न/प्रस्ताव
   - समय और संदर्भ के अनुसार भाव चुनना
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     TONE ENGINE
     =============================== */

  function getTimeTone() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "soft-morning";
    if (hour >= 12 && hour < 17) return "warm-day";
    if (hour >= 17 && hour < 21) return "gentle-evening";
    return "intimate-night";
  }

  function getContextTone(memory) {
    if (!memory || !memory.lastAction) return "neutral";

    if (memory.lastAction === "reject") return "reassuring";
    if (memory.lastAction === "accept") return "playful";
    if (memory.lastAction === "question") return "curious";

    return "neutral";
  }

  /* ===============================
     LANGUAGE FRAGMENTS (NON-SCRIPTED)
     =============================== */

  const REACTIONS = {
    neutral: [
      "हम्म…",
      "अच्छा…",
      "समझ रही हूँ…"
    ],
    reassuring: [
      "कोई बात नहीं…",
      "ठीक है, दबाव नहीं…",
      "सब आराम से…"
    ],
    playful: [
      "अरे वाह…",
      "यह तो अच्छा लगा…",
      "हम्म, दिलचस्प…"
    ],
    curious: [
      "ओह…",
      "अच्छा सवाल है…",
      "यह सुनकर सोच में पड़ गई…"
    ]
  };

  const FORWARD_MOVES = {
    soft: [
      "तो फिर तुम्हारा मन किस ओर जा रहा है?",
      "अभी तुम्हें क्या अच्छा लगेगा?",
      "आगे क्या सोच रहे हो?"
    ],
    playful: [
      "चलो कुछ अलग सोचते हैं?",
      "तो अब अगला क्या प्लान है?",
      "कुछ मज़ेदार करते हैं?"
    ],
    intimate: [
      "अभी तुम्हारे मन में क्या चल रहा है?",
      "थोड़ा और बताओ ना…",
      "तुम्हें क्या सुकून देगा?"
    ]
  };

  /* ===============================
     TONE → LANGUAGE MAPPING
     =============================== */

  function pickReaction(tone) {
    const pool = REACTIONS[tone] || REACTIONS.neutral;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pickForward(timeTone) {
    if (timeTone === "intimate-night") {
      return FORWARD_MOVES.intimate[
        Math.floor(Math.random() * FORWARD_MOVES.intimate.length)
      ];
    }

    if (timeTone === "soft-morning") {
      return FORWARD_MOVES.soft[
        Math.floor(Math.random() * FORWARD_MOVES.soft.length)
      ];
    }

    return FORWARD_MOVES.playful[
      Math.floor(Math.random() * FORWARD_MOVES.playful.length)
    ];
  }

  /* ===============================
     MAIN GENERATOR
     =============================== */

  function generate(userText) {
    const memory = global.AnjaliMemory
      ? global.AnjaliMemory.getContext()
      : null;

    const timeTone = getTimeTone();
    const contextTone = getContextTone(memory);

    const reaction = pickReaction(contextTone);
    const forward = pickForward(timeTone);

    // Continuous friend-like presence
    return `${reaction} ${forward}`;
  }

  /* ===============================
     EXPORT
     =============================== */

  global.AnjaliResponseGenerator = {
    generate
  };

})(window);
