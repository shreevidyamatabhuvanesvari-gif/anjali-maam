/* ======================================================
   core/PresentationEngine.js — REAL TEACHER INTELLIGENCE
   PURPOSE:
   - हिंदी/English semantic intent पहचानना
   - जितना पूछा जाए उतना ही पढ़ाना
   - Digital Board के लिए सही format
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     SEMANTIC INTENT DICTIONARY
     =============================== */
  const HINDI_INTENT_MAP = {
    DEFINITION: [
      "क्या", "परिभाषा", "अर्थ", "मतलब", "कहते हैं"
    ],
    EXPLANATION: [
      "समझाइए", "वर्णन", "व्याख्या", "स्पष्ट करें", "बताइए"
    ],
    ANALYSIS: [
      "गुण और दोष", "विश्लेषण", "तुलना", "आलोचना"
    ],
    FACT: [
      "कौन", "कब", "कहाँ", "किसने", "कितना", "when", "where", "who"
    ]
  };

  /* ===============================
     INTENT DETECTOR (SEMANTIC)
     =============================== */
  function detectIntent(question) {
    if (!question) return "GENERAL";
    question = question.toLowerCase();

    for (const intent in HINDI_INTENT_MAP) {
      for (const word of HINDI_INTENT_MAP[intent]) {
        if (question.includes(word)) {
          return intent;
        }
      }
    }

    return "GENERAL";
  }

  /* ===============================
     CORE PRESENT FUNCTION
     =============================== */
  function present(answerText, questionText) {
    if (!answerText) {
      return "मुझे इस प्रश्न का उत्तर नहीं मिला।";
    }

    const intent = detectIntent(questionText);

    // वाक्यों में तोड़ना
    const sentences = answerText
      .split("।")
      .map(s => s.trim())
      .filter(Boolean);

    let mainAnswer = "";

    /* ===============================
       TEACHER CONTROL LOGIC
       =============================== */

    if (intent === "FACT") {
      // सिर्फ 1 लाइन
      mainAnswer = sentences[0] + "।";
    }

    else if (intent === "DEFINITION") {
      // 2–3 लाइन
      mainAnswer = sentences.slice(0, 3).join("।") + "।";
    }

    else if (intent === "EXPLANATION") {
      // मध्यम व्याख्या
      mainAnswer = sentences.slice(0, 5).join("।") + "।";
    }

    else if (intent === "ANALYSIS") {
      // पूरा लेख
      mainAnswer = answerText;
    }

    else {
      // GENERAL
      mainAnswer = sentences.slice(0, 4).join("।") + "।";
    }

    /* ===============================
       CONTROLLED SIMPLE EXPLANATION
       =============================== */
    let simpleExplain =
      sentences.slice(0, 2).join("।") + "।";

    /* ===============================
       CONCLUSION (अगर लंबा हो)
       =============================== */
    let conclusion = "";
    if (sentences.length > 6) {
      conclusion = sentences[sentences.length - 1] + "।";
    }

    /* ===============================
       DIGITAL BOARD FORMAT
       =============================== */
    let finalOutput =
      "प्रश्न:\n" + questionText + "\n\n" +
      "उत्तर:\n" + mainAnswer + "\n\n" +
      "सरल शब्दों में:\n" + simpleExplain;

    if (conclusion) {
      finalOutput += "\n\nनिष्कर्ष:\n" + conclusion;
    }

    return finalOutput;
  }

  /* ===============================
     EXPORT
     =============================== */
  global.PresentationEngine = {
    present,
    detectIntent   // debugging/inspection के लिए
  };

})(window);
