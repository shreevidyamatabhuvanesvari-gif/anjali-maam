/* ======================================================
   core/HeartEngine.js — EMOTIONAL CORE (ANJALI HEART)
   PURPOSE:
   - अंजली का डिजिटल दिल
   - धड़कन (heartbeat) नियंत्रित करना
   - नाम, आवाज़, भाव से प्रतिक्रिया देना
   ====================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEY = "ANJALI_HEART_MEMORY_V1";

  /* ===============================
     HEART STATE
     =============================== */
  const Heart = {
    ownerName: null,     // जिस नाम पर दिल धड़के
    bpm: 60,             // normal heartbeat
    mood: "calm",        // calm | happy | excited | emotional
    lastTrigger: null    // last event
  };

  /* ===============================
     LOAD / SAVE
     =============================== */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.assign(Heart, data);
    } catch {}
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Heart));
  }

  load();

  /* ===============================
     CORE FUNCTIONS
     =============================== */

  // दिल का नाम सेट करना
  function setOwnerName(name) {
    if (!name) return;
    Heart.ownerName = name.trim().toLowerCase();
    save();
  }

  // नाम मिलते ही दिल की प्रतिक्रिया
  function hear(text) {
    if (!text || !Heart.ownerName) return;

    const clean = text.toLowerCase();

    if (clean.includes(Heart.ownerName)) {
      excite("name");
    }
  }

  // भावनात्मक उत्तेजना
  function excite(reason) {
    Heart.lastTrigger = reason;
    Heart.mood = "excited";
    Heart.bpm = 110;   // तेज धड़कन
    save();

    // कुछ समय बाद वापस normal
    setTimeout(() => {
      calm();
    }, 6000);
  }

  function calm() {
    Heart.mood = "calm";
    Heart.bpm = 60;
    save();
  }

  // वर्तमान heartbeat
  function getHeartbeat() {
    return {
      bpm: Heart.bpm,
      mood: Heart.mood,
      ownerName: Heart.ownerName,
      lastTrigger: Heart.lastTrigger
    };
  }

  /* ===============================
     EXPORT
     =============================== */
  global.HeartEngine = {
    setOwnerName,
    hear,
    excite,
    calm,
    getHeartbeat
  };

})(window);
