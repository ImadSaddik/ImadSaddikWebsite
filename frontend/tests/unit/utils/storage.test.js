import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadUserPreferences, saveUserPreference } from "@/utils";

vi.mock("@/constants", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    STORAGE_KEYS: {
      STAR_EFFECT: "mock-star-key",
      METEORITE_EFFECT: "mock-meteorite-key",
      CUSTOM_CURSOR: "mock-cursor-key",
      WIDE_ARTICLES: "mock-wide-key",
    },
  };
});

describe("loadUserPreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null for all keys when local storage is empty", () => {
    const preferences = loadUserPreferences();
    expect(preferences).toEqual({
      starEffect: null,
      meteoriteEffect: null,
      customCursor: null,
      wideArticles: null,
    });
  });

  it("parses and returns values from local storage", () => {
    localStorage.setItem("mock-star-key", "true");
    localStorage.setItem("mock-wide-key", "false");

    const preferences = loadUserPreferences();

    expect(preferences.starEffect).toBe(true);
    expect(preferences.wideArticles).toBe(false);
    expect(preferences.customCursor).toBeNull();
    expect(preferences.meteoriteEffect).toBeNull();
  });
});

describe("saveUserPreference", () => {
  it("serializes and saves value to local storage", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    saveUserPreference("test-key", true);
    expect(setItemSpy).toHaveBeenCalledWith("test-key", "true");

    saveUserPreference("test-key-2", { foo: "bar" });
    expect(setItemSpy).toHaveBeenCalledWith("test-key-2", JSON.stringify({ foo: "bar" }));
  });
});
