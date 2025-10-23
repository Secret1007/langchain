import { useState } from 'react';
import { loadEntries, saveEntries, Entry } from '../utils/storage';

interface UseLocalStorageReturn {
  entries: Entry[];
  addEntry: (newEntry: Entry) => void;
  removeEntry: (id: string) => void;
  updateEntry: (updatedEntry: Entry) => void;
}

export const useLocalStorage = (): UseLocalStorageReturn => {
  const [entries, setEntries] = useState<Entry[]>(loadEntries());

  const addEntry = (newEntry: Entry): void => {
    const next = [newEntry, ...entries];
    setEntries(next);
    saveEntries(next);
  };

  const removeEntry = (id: string): void => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const updateEntry = (updatedEntry: Entry): void => {
    const next = entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
    setEntries(next);
    saveEntries(next);
  };

  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
  };
};

