/* ======================================================
   core/AnjaliToneLayer.js — FRIEND INTIMACY & TONE
   PURPOSE:
   - भाषा में अपनापन, मधुरता और निकटता लाना
   - playful / romantic / caring flavour जोड़ना
   - friend-mode बातचीत को गहराई देना
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     TONE SELECTION
     =============================== */

  function selectTone(memory) {
    if (!memory) return "warm";

    if (memory.lastAction === "reject") return "caring";
    if (memory.lastAction === "accept") return "playful";
    if (memory.lastAction === "question") return "engaging";

    return "warm";
  }

  /* ===============================
     TONE PHRASE POOLS
     =============================== */

  const PREFIX = {
    warm: [
      "सुनो…",
      "अच्छा…",
      "हम्म…"
    ],
    playful: [
      "अरे वाह…",
      "हाय…",
      "तो फिर सुनो…"
    ],
    caring: [
      "कोई बात नहीं…",
      "मैं समझ रही हूँ…",
      "आराम से…"
    ],
    engaging: [
      "रुको ज़रा…",
      "सच?",
      "ओह…"
    ]
  };

  const SUFFIX = {
    warm: [
      "तुम्हें क्या ठीक लगेगा?",
      "अब आगे क्या सोचें?",
      "बताओ…"
    ],
    playful: [
      "तो अब क्या सीन है?",
      "कुछ मज़ेदार करें?",
      "चलो कुछ नया सोचते हैं?"
    ],
    caring: [
      "तुम ठीक तो हो?",
      "थोड़ा और बताओ ना…",
      "मैं यहीं हूँ।"
    ],
    engaging: [
      "फिर?",
      "और क्या?",
      "आगे बताओ।"
    ]
  };

  /* ===============================
     MAIN TONE APPLIER
     =============================== */

  function applyTone(baseText) {
    const memory = global.AnjaliMemory
      ? global.AnjaliMemory.getContext()
      : null;

    const tone = selectTone(memory);

    const pre =
      PREFIX[tone][Math.floor(Math.random() * PREFIX[tone].length)];

    const post =
      SUFFIX[tone][Math.floor(Math.random() * SUFFIX[tone].length)];

    // subtle, not overpowering
    return `${pre} ${baseText} ${post}`;
  }

  /* ===============================
     EXPORT
     =============================== */

  global.AnjaliToneLayer = {
    applyTone
  };

})(window);
