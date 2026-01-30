/* ======================================================
   core/AnjaliResponseGenerator.js — INPUT AWARE + NO REPEAT
   PURPOSE:
   - Input Type Guard: identity / statement / question
   - Single Forward Rule (exactly one, when appropriate)
   - lastForward cache: back-to-back repeat रोकना
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     INTERNAL MICRO MEMORY
     =============================== */
  let LAST_FORWARD = "";   // last asked forward (string)

  /* ===============================
     HELPERS
     =============================== */
  function pick(arr, avoid) {
    if (!arr || !arr.length) return "";
    if (!avoid) return arr[Math.floor(Math.random() * arr.length)];

    const filtered = arr.filter(x => x !== avoid);
    if (!filtered.length) return arr[Math.floor(Math.random() * arr.length)];
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function normalize(t) {
    return (t || "").toLowerCase().trim();
  }

  /* ===============================
     INPUT TYPE GUARD
     =============================== */
  function detectInputType(text) {
    const t = normalize(text);

    if (
      t.includes("आप कौन") ||
      t.includes("तुम कौन") ||
      t.includes("नाम") ||
      t === "अंजली"
    ) {
      return "identity";
    }

    if (
      t.endsWith("?") ||
      t.startsWith("क्या") ||
      t.startsWith("क्यों") ||
      t.startsWith("कैसे")
    ) {
      return "question";
    }

    return "statement";
  }

  /* ===============================
     SHORT REACTIONS
     =============================== */
  const REACTIONS = {
    neutral: ["हम्म…", "अच्छा…", "समझ रही हूँ…"],
    warm: ["ठीक है…", "अच्छा लगा सुनकर…"]
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
     IDENTITY RESPONSE
     =============================== */
  function identityResponse() {
    return "मैं अंजली हूँ। यहीं तुम्हारे साथ, बातें करने के लिए।";
  }

  /* ===============================
     MAIN GENERATOR
     =============================== */
  function generate(userText) {
    const type = detectInputType(userText);

    // Identity → direct, no forward
    if (type === "identity") {
      LAST_FORWARD = ""; // reset to avoid weird repeats later
      return identityResponse();
    }

    // Statement → acknowledge only (no forced question)
    if (type === "statement") {
      LAST_FORWARD = ""; // acknowledge resets pressure
      return pick(REACTIONS.warm);
    }

    // Question → exactly ONE forward (Single Forward Rule)
    const reaction = pick(REACTIONS.neutral);

    const miniPlan = global.AnjaliMiniPlan
      ? global.AnjaliMiniPlan.getContext()
      : null;

    let pool;
    if (
      miniPlan &&
      miniPlan.inclination &&
      FORWARD_BY_INCLINATION[miniPlan.inclination]
    ) {
      pool = FORWARD_BY_INCLINATION[miniPlan.inclination];
    } else {
      pool = GENERIC_FORWARD;
    }

    const forward = pick(pool, LAST_FORWARD);
    LAST_FORWARD = forward; // cache

    return `${reaction} ${forward}`;
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliResponseGenerator = {
    generate
  };

})(window);
