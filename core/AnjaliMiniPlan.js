/* ======================================================
   core/AnjaliMiniPlan.js — SOFT CONVERSATION INCLINATION
   PURPOSE:
   - बातचीत की दिशा (inclination) महसूस करना
   - कोई निर्णय नहीं, कोई finality नहीं
   - सिर्फ़ context देना ताकि flow बना रहे
   ====================================================== */

(function (global) {
  "use strict";

  /* ===============================
     SOFT STATE (NON-FINAL)
     =============================== */

  const STATE = {
    inclination: null,   // travel / food / movie / study / casual
    mood: null,          // playful / serious / imagining
    hints: [],           // recent soft hints
    turns: []            // last 2–3 turns (light memory)
  };

  const MAX_TURNS = 3;
  const MAX_HINTS = 3;

  /* ===============================
     DETECT INCLINATION (VERY LIGHT)
     =============================== */
  function detectInclination(text) {
    const t = text.toLowerCase();

    if (/घूम|हिल स्टेशन|यात्रा/.test(t)) return "travel";
    if (/फिल्म|मूवी|सिनेमा/.test(t)) return "movie";
    if (/खाना|डिनर|लंच/.test(t)) return "food";
    if (/पढ़|पेपर|यूनिवर्सिटी/.test(t)) return "study";

    return null;
  }

  /* ===============================
     DETECT MOOD (SOFT)
     =============================== */
  function detectMood(text) {
    const t = text.toLowerCase();

    if (/चलो|क्या कहती हो|क्यों न/.test(t)) return "imagining";
    if (/नहीं|पर|लेकिन/.test(t)) return "thinking";
    if (/🙂|😊|मज़ा|हाहा/.test(t)) return "playful";

    return null;
  }

  /* ===============================
     REMEMBER (NON-BINDING)
     =============================== */
  function remember(text) {
    if (!text) return;

    const inc = detectInclination(text);
    const mood = detectMood(text);

    if (inc) STATE.inclination = inc;
    if (mood) STATE.mood = mood;

    STATE.turns.push(text);
    if (STATE.turns.length > MAX_TURNS) {
      STATE.turns.shift();
    }

    if (inc) {
      STATE.hints.push(inc);
      if (STATE.hints.length > MAX_HINTS) {
        STATE.hints.shift();
      }
    }
  }

  /* ===============================
     READ CONTEXT (OPEN)
     =============================== */
  function getContext() {
    return {
      inclination: STATE.inclination,
      mood: STATE.mood,
      recentTurns: STATE.turns.slice(),
      hints: STATE.hints.slice()
    };
  }

  /* ===============================
     SOFT RESET (AUTO-ADAPT)
     =============================== */
  function soften() {
    // inclination fades naturally
    STATE.inclination = null;
    STATE.mood = null;
    STATE.hints = [];
  }

  /* ===============================
     EXPORT
     =============================== */
  global.AnjaliMiniPlan = {
    remember,
    getContext,
    soften
  };

})(window);
