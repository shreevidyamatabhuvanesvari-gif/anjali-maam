/* ======================================================
   core/AnjaliResponseGenerator.js — FRIEND FLOW ENGINE
   PURPOSE:
   - हर turn पर अंजली को बोलने योग्य बनाना
   - Soft MiniPlan (inclination / mood) के आधार पर
     स्वाभाविक सवाल/प्रस्ताव खोलना
   - कोई निर्णय नहीं, सिर्फ़ flow
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     TIME-BASED TONE
     =============================== */
  function getTimeTone() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "soft-morning";
    if (hour >= 12 && hour < 17) return "warm-day";
    if (hour >= 17 && hour < 21) return "gentle-evening";
    return "intimate-night";
  }

  /* ===============================
     BASIC REACTIONS (NON-SCRIPTED)
     =============================== */
  const REACTIONS = [
    "हम्म…",
    "अच्छा…",
    "समझ रही हूँ…",
    "ठीक है…",
    "यह सुनकर अच्छा लगा…"
  ];

  /* ===============================
     SOFT FORWARD MOVES (BY INCLINATION)
     =============================== */
  const FORWARD_BY_INCLINATION = {
    travel: [
      "तो अभी घूमने की कल्पना अच्छी लग रही है या बस यूँ ही?",
      "अगर अभी बदलना चाहो तो किस तरह की जगह सोचोगे?",
      "तुम्हें सफ़र का कौन-सा हिस्सा ज़्यादा अच्छा लगता है?"
    ],
    movie: [
      "फिल्म का मूड है या कहानी ज़्यादा मायने रखती है?",
      "आज हल्की फिल्म देखनी है या कुछ सोचने वाली?",
      "तुम किस तरह की फिल्म से ज़्यादा जुड़ते हो?"
    ],
    food: [
      "अभी कुछ हल्का अच्छा लगेगा या पेट भरकर?",
      "खाने में स्वाद ज़्यादा ज़रूरी है या साथ?",
      "तुम्हारा comfort food क्या है?"
    ],
    study: [
      "अभी पढ़ाई भारी लग रही है या manageable?",
      "तुम किस हिस्से से शुरू करना पसंद करते हो?",
      "पढ़ते वक्त तुम्हें क्या चीज़ सबसे ज़्यादा परेशान करती है?"
    ],
    casual: [
      "अभी बस बातें करने का मन है या कुछ सोचें?",
      "तुम्हें किस तरह की बातचीत सुकून देती है?",
      "अभी तुम्हारा मन किस तरफ़ है?"
    ]
  };

  /* ===============================
     GENERIC FORWARD (FALLBACK)
     =============================== */
  const GENERIC_FORWARD = [
    "तो अभी तुम्हारा मन किस ओर जा रहा है?",
    "अभी तुम्हें क्या अच्छा लगेगा?",
    "आगे क्या सोच रहे हो?"
  ];

  /* ===============================
     HELPERS
     =============================== */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ===============================
     MAIN GENERATOR
     =============================== */
  function generate(userText) {
    const miniPlan = global.AnjaliMiniPlan
      ? global.AnjaliMiniPlan.getContext()
      : null;

    const reaction = pick(REACTIONS);

    let forward;

    if (
      miniPlan &&
      miniPlan.inclination &&
      FORWARD_BY_INCLINATION[miniPlan.inclination]
    ) {
      // Soft use of inclination (NOT final)
      forward = pick(FORWARD_BY_INCLINATION[miniPlan.inclination]);
    } else {
      // Open-ended fallback
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
