/* ======================================================
   core/PresentationEngine.js — TEACHER LAYER
   PURPOSE:
   - ThinkingEngine के उत्तर को
   - मानव-टीचर जैसी प्रस्तुति में बदलना
   ====================================================== */

(function (global) {
  "use strict";

  function present(answerText, questionText) {
    if (!answerText) {
      return "मुझे इस प्रश्न का उत्तर नहीं मिला।";
    }

    // 1. छोटा उत्तर
    let short = answerText.split("।")[0] + "।";

    // 2. टीचर स्टाइल समझाना
    let explanation =
      "सरल शब्दों में समझें तो — " + answerText;

    // 3. बोर्ड जैसा फॉर्मेट
    let finalOutput = 
      "प्रश्न: " + questionText + "\n\n" +
      "उत्तर: " + short + "\n\n" +
      explanation;

    return finalOutput;
  }

  global.PresentationEngine = {
    present
  };

})(window);
