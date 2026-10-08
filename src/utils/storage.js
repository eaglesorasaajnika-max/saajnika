/**
 * Safe localStorage wrapper with JSON serialization and memory fallback.
 */

const memoryStorage = new Map();

export const storage = {
  get(key, defaultValue = null) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return memoryStorage.get(key) ?? defaultValue;
      }
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Storage get error for key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        memoryStorage.set(key, value);
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for key "${key}":`, e);
      memoryStorage.set(key, value);
    }
  },

  remove(key) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        memoryStorage.delete(key);
        return;
      }
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Storage remove error for key "${key}":`, e);
      memoryStorage.delete(key);
    }
  },

  clear() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        memoryStorage.clear();
        return;
      }
      window.localStorage.clear();
    } catch (e) {
      console.warn('Storage clear error:', e);
      memoryStorage.clear();
    }
  },
};
