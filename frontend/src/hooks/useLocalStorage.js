import { useState, useEffect } from 'react';
import { loadEntries, saveEntries } from '../utils/storage';

export const useLocalStorage = () => {
  const [entries, setEntries] = useState(loadEntries());

  const addEntry = (newEntry) => {
    const next = [newEntry, ...entries];
    setEntries(next);
    saveEntries(next);
  };

  const removeEntry = (id) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const updateEntry = (updatedEntry) => {
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