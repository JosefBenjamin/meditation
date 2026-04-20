import type { SavedProgress } from '../types';

const STORAGE_KEY = 'meditation-quiz:v1';

export const loadProgress = (): SavedProgress | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveProgress = (data: Partial<SavedProgress>) => {
  try {
    const payload = { v: 1, ts: Date.now(), ...data };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* silent */
  }
};

export const clearProgress = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silent */
  }
};
