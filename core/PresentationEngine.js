/* ======================================================
   core/PresentationEngine.js — TEACHER INTELLIGENCE V2
   PURPOSE:
   - जितना पूछा जाए उतना ही पढ़ाना
   - Controlled explanation
   - Digital board format
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     QUESTION INTENT DETECTOR
     =============================== */
  function detectIntent(question) {
    if (/क्या है|परिभाषा/.test(question)) return "DEFINITION";
    if (/समझाइए|व्याख्या/.test(question)) return "EXPLANATION";
    if (/गुण और दोष|विश्लेषण/.test(question)) return "ANALYSIS";
    if (/कौन|कब|कहाँ/.test(question)) return "FACT";
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

    // पूरे उत्तर को वाक्यों में तोड़ो
    const sentences = answerText
      .split("।")
      .map(s => s.trim())
      .filter(Boolean);

    let mainAnswer = "";
    let simpleExplain = "";
    let conclusion = "";

    /* ===============================
       TEACHING LOGIC
       =============================== */

    if (intent === "FACT") {
      // सिर्फ पहला वाक्य
      mainAnswer = sentences[0] + "।";
    }

    else if (intent === "DEFINITION") {
      mainAnswer = sentences.slice(0, 2).join("।") + "।";
    }

    else if (intent === "EXPLANATION") {
      mainAnswer = sentences.slice(0, 4).join("।") + "।";
    }

    else if (intent === "ANALYSIS") {
      mainAnswer = sentences.slice(0, 6).join("।") + "।";
    }

    else {
      // default
      mainAnswer = sentences.slice(0, 3).join("।") + "।";
    }

    /* ===============================
       CONTROLLED SIMPLE EXPLANATION
       =============================== */
    simpleExplain =
      sentences.slice(0, 2).join("।") + "।";

    /* ===============================
       CONCLUSION (अगर लंबा उत्तर है)
       =============================== */
    if (sentences.length > 5) {
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
    present
  };

})(window);
