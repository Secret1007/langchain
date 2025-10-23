// --- Helpers: LocalStorage ---
const STORAGE_KEY = "ej_entries";

export interface Entry {
  id: string;
  title?: string;
  category?: string;
  content: string;
  revised?: string;
  media?: string[];
  created_at?: string;
  date?: string;
  [key: string]: any;
}

export const loadEntries = (): Entry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to load entries", e);
    return [];
  }
};

export const saveEntries = (entries: Entry[]): void => 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

