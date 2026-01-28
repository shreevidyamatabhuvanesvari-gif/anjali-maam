/* ======================================================
   core/KnowledgeStore.js — UNIVERSAL MEMORY CORE
   PURPOSE:
   - Admin से ज्ञान सुरक्षित रखना
   - ThinkingEngine को ज्ञान देना
   - एकमात्र Source of Truth
   ====================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEY = "ANJALI_KNOWLEDGE_STORE_V1";

  let store = [];

  /* ===============================
     LOAD / SAVE
     =============================== */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      store = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(store)) store = [];
    } catch {
      store = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  load();

  /* ===============================
     CORE API
     =============================== */

  function add(question, answer) {
    if (!question || !answer) return false;

    const item = {
      id: Date.now().toString(),
      q: question.trim(),
      a: answer.trim()
    };

    store.push(item);
    save();
    return item;
  }

  function update(id, question, answer) {
    const item = store.find(x => x.id === id);
    if (!item) return false;

    item.q = question.trim();
    item.a = answer.trim();
    save();
    return true;
  }

  function remove(id) {
    store = store.filter(x => x.id !== id);
    save();
  }

  function all() {
    return store.slice(); // copy
  }

  function clear() {
    store = [];
    save();
  }

  /* ===============================
     EXPORT
     =============================== */
  global.KnowledgeStore = {
    add,
    update,
    remove,
    all,
    clear
  };

})(window);
