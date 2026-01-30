/* ======================================================
   core/AnjaliCore.js — CENTRAL CONSCIOUSNESS (v1)
   PURPOSE:
   - अंजली की पहचान और निर्णय केंद्र
   - Friend+++ और Teacher mode को अलग रखना
   - UI से control हटाकर core में लाना
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     CORE STATE
     =============================== */
  const STATE = {
    mode: "friend",   // friend | teacher
    lastUserText: "",
    emotion: "neutral"
  };

  /* ===============================
     MODE MANAGEMENT
     =============================== */
  function setMode(mode) {
    if (mode !== "friend" && mode !== "teacher") return;
    STATE.mode = mode;
    localStorage.setItem("ANJALI_ACTIVE_MODE", mode);
  }

  function getMode() {
    return STATE.mode;
  }

  // init from storage
  const savedMode = localStorage.getItem("ANJALI_ACTIVE_MODE");
  if (savedMode) STATE.mode = savedMode;

  /* ===============================
     EMOTION HEURISTICS (v1 SIMPLE)
     =============================== */
  function detectEmotion(text) {
    if (!text) return "neutral";

    const t = text.toLowerCase();

    if (
      t.includes("परेशान") ||
      t.includes("दुख") ||
      t.includes("उलझ") ||
      t.includes("थक")
    ) return "distress";

    if (
      t.includes("खुश") ||
      t.includes("अच्छा लग")
    ) return "positive";

    return "neutral";
  }

  /* ===============================
     FRIEND+++ RESPONSE (RULE BASED)
     =============================== */
  function friendResponse(text) {
    switch (STATE.emotion) {
      case "distress":
        return "मैं समझ रही हूँ… यह वाकई भारी लग सकता है। मैं यहीं हूँ।";
      case "positive":
        return "यह सुनकर अच्छा लगा 🙂";
      default:
        return "मैं सुन रही हूँ… आप चाहें तो और बता सकते हैं।";
    }
  }

  /* ===============================
     TEACHER RESPONSE (PIPELINE)
     =============================== */
  function teacherResponse(text) {
    if (!global.ThinkingEngine || !global.PresentationEngine) {
      return "अभी मेरा मार्गदर्शन भाग तैयार नहीं है।";
    }

    const result = global.ThinkingEngine.think(text);

    // unknown answer → soft handling
    if (result && result.unknown) {
      return "मैं समझ रही हूँ, लेकिन अभी इसका स्पष्ट उत्तर मेरे पास नहीं है।";
    }

    return global.PresentationEngine.present(
      result.text,
      text
    );
  }

  /* ===============================
     MAIN ENTRY POINT
     =============================== */
  function handleInput(userText) {
    if (!userText) return "";

    STATE.lastUserText = userText;
    STATE.emotion = detectEmotion(userText);

    if (STATE.mode === "friend") {
      return friendResponse(userText);
    }

    // teacher mode
    return teacherResponse(userText);
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliCore = {
    setMode,
    getMode,
    handleInput
  };

})(window);
