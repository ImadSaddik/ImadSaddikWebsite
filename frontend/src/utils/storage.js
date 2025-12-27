import { STORAGE_KEYS } from "@/constants";

export function loadUserPreferences() {
  const get = (key) => {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  };

  return {
    starEffect: get(STORAGE_KEYS.STAR_EFFECT),
    meteoriteEffect: get(STORAGE_KEYS.METEORITE_EFFECT),
    customCursor: get(STORAGE_KEYS.CUSTOM_CURSOR),
    wideArticles: get(STORAGE_KEYS.WIDE_ARTICLES),
  };
}

export function saveUserPreference(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
