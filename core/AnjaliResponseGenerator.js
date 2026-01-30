/* ======================================================
   core/AnjaliResponseGenerator.js — INPUT TYPE AWARE
   PURPOSE:
   - Input Type Guard: identity / statement / question
   - Single Forward Rule (exactly one, when appropriate)
   - Friend-like, non-intrusive flow
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     HELPERS
     =============================== */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function normalize(t) {
    return (t || "").toLowerCase().trim();
  }

  /* ===============================
     INPUT TYPE GUARD
     =============================== */
  function detectInputType(text) {
    const t = normalize(text);

    // Identity / name / who-are-you
    if (
      t.includes("कौन") ||
      t.includes("नाम") ||
      t.includes("आप कौन") ||
      t.includes("तुम कौन")
    ) {
      return "identity";
    }

    // Question (open)
    if (t.endsWith("?") || t.startsWith("क्या") || t.startsWith("क्यों") || t.startsWith("कैसे")) {
      return "question";
    }

    // Statement / declaration
    return "statement";
  }

  /* ===============================
     SHORT REACTIONS
     =============================== */
  const REACTIONS = {
    neutral: ["हम्म…", "अच्छा…", "समझ रही हूँ…"],
    warm: ["ठीक है…", "अच्छा लगा सुनकर…"],
  };

  /* ===============================
     FORWARD BY INCLINATION (ONE ONLY)
     =============================== */
  const FORWARD_BY_INCLINATION = {
    travel: [
      "अभी घूमने का ख्याल सच में आ रहा है या बस यूँ ही?",
      "अगर अभी बदलना चाहो तो किस तरह की जगह सोचोगे?"
    ],
    movie: [
      "आज फिल्म का मूड हल्का है या कुछ सोचने वाला?"
    ],
    food: [
      "अभी कुछ हल्का अच्छा लगेगा या पेट भरकर?"
    ],
    study: [
      "अभी पढ़ाई manageable लग रही है या भारी?"
    ],
    casual: [
      "अभी तुम्हारा मन किस तरफ़ है?"
    ]
  };

  const GENERIC_FORWARD = [
    "अभी तुम्हारा मन किस ओर जा रहा है?",
    "अभी तुम्हें क्या ठीक लगेगा?"
  ];

  /* ===============================
     IDENTITY RESPONSE (FRIENDLY)
     =============================== */
  function identityResponse() {
    return "मैं अंजली हूँ। यहीं तुम्हारे साथ, बातें करने के लिए।";
  }

  /* ===============================
     MAIN GENERATOR
     =============================== */
  function generate(userText) {
    const type = detectInputType(userText);

    // 1) Identity → direct, no forward
    if (type === "identity") {
      return identityResponse();
    }

    // 2) Statement → acknowledge, no forced question
    if (type === "statement") {
      return pick(REACTIONS.warm);
    }

    // 3) Question → exactly ONE forward (Single Forward Rule)
    const reaction = pick(REACTIONS.neutral);

    const miniPlan = global.AnjaliMiniPlan
      ? global.AnjaliMiniPlan.getContext()
      : null;

    let forward;
    if (
      miniPlan &&
      miniPlan.inclination &&
      FORWARD_BY_INCLINATION[miniPlan.inclination]
    ) {
      forward = pick(FORWARD_BY_INCLINATION[miniPlan.inclination]);
    } else {
      forward = pick(GENERIC_FORWARD);
    }

    return `${reaction} ${forward}`;
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliResponseGenerator = {
    generate
  };

})(window);
