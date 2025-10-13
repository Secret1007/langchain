// --- Helpers: LocalStorage ---
const STORAGE_KEY = "ej_entries";

export const loadEntries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to load entries", e);
    return [];
  }
};

export const saveEntries = (entries) => localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));