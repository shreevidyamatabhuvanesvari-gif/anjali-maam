/* ======================================================
   core/PresentationEngine.js — TEACHER INTELLIGENCE V3
   PURPOSE:
   - प्रश्न का intent पहचानना (Hindi + English)
   - जितना पूछा जाए उतना ही पढ़ाना
   - Controlled explanation
   - Digital board जैसा structured output
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     QUESTION INTENT DETECTOR
     =============================== */
  function detectIntent(question) {
    question = question.toLowerCase();

    if (/क्या|kya|परिभाषा|definition/.test(question)) 
      return "DEFINITION";

    if (/समझाइए|samjhaiye|व्याख्या|explain/.test(question)) 
      return "EXPLANATION";

    if (/गुण और दोष|analysis|विश्लेषण/.test(question)) 
      return "ANALYSIS";

    if (/कौन|who|कब|kab|when|where|कहाँ/.test(question)) 
      return "FACT";

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
       TEACHING LOGIC (Length Control)
       =============================== */

    if (intent === "FACT") {
      // सिर्फ 1 लाइन
      mainAnswer = sentences[0] + "।";
    }

    else if (intent === "DEFINITION") {
      // 2–3 लाइन
      mainAnswer = sentences.slice(0, 2).join("।") + "।";
    }

    else if (intent === "EXPLANATION") {
      // 4–5 लाइन
      mainAnswer = sentences.slice(0, 4).join("।") + "।";
    }

    else if (intent === "ANALYSIS") {
      // पूरा लेख
      mainAnswer = sentences.join("।") + "।";
    }

    else {
      // GENERAL
      mainAnswer = sentences.slice(0, 3).join("।") + "।";
    }

    /* ===============================
       CONTROLLED SIMPLE EXPLANATION
       =============================== */
    simpleExplain =
      sentences.slice(0, 2).join("।") + "।";

    /* ===============================
       CONCLUSION (अगर उत्तर लंबा है)
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
