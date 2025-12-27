import { describe, it, expect, vi, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";

vi.mock("@/assetRegistry.js", () => ({
  blogCoverImages: {},
  courseCoverImages: {},
  astronomyCoverImages: {
    "/src/astronomy/existing-slug/coverImage.svg": "astronomy-cover.svg",
  },
}));

vi.mock("@/assets/fallbackCoverImage.svg", () => ({
  default: "fallback-cover.svg",
}));

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

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

import axios from "axios";
import {
  calculateReadingTime,
  convertUnixTimestampToReadableFormat,
  getCardsDataFromDocumentHits,
  trackVisitorData,
  loadUserPreferences,
  saveUserPreference,
} from "@/utils";

const getRefs = (text) => ({ articleContent: { $el: { innerText: text } } });

describe("calculateReadingTime", () => {
  it("rounds up reading time based on words per minute", () => {
    const text = "word ".repeat(250);
    expect(calculateReadingTime(text)).toBe(2);
  });
});

describe("convertUnixTimestampToReadableFormat", () => {
  it("formats timestamps using locale rules", () => {
    const timestamp = 1732838400;
    expect(convertUnixTimestampToReadableFormat(timestamp)).toBe("November 29, 2024");
  });
});

describe("getCardsDataFromDocumentHits", () => {
  const buildHit = (additionalProperties = {}) => ({
    name: "existing-slug",
    title: faker.lorem.words(2),
    creation_date: 1732838400,
    view_count: faker.number.int({ min: 0, max: 50 }),
    read_count: faker.number.int({ min: 0, max: 50 }),
    claps_count: faker.number.int({ min: 0, max: 50 }),
    ...additionalProperties,
  });

  it("returns hydrated card data when image exists", () => {
    const hit = buildHit();
    const cards = getCardsDataFromDocumentHits({
      hits: [hit],
      articleType: "astronomy-post",
    });

    expect(cards).toEqual([
      expect.objectContaining({
        imageSrc: "astronomy-cover.svg",
        altText: `Cover image for the astronomy-post titled ${hit.title}`,
        title: hit.title,
        creationDate: "November 29, 2024",
        articleType: "astronomy-post",
        articleId: "existing-slug",
        viewCount: hit.view_count,
        readCount: hit.read_count,
        clapsCount: hit.claps_count,
      }),
    ]);
  });

  it("falls back to default cover when image is missing", () => {
    const cards = getCardsDataFromDocumentHits({
      hits: [buildHit({ name: "missing" })],
      articleType: "astronomy-post",
    });

    expect(cards[0].imageSrc).toBe("fallback-cover.svg");
  });
});

describe("trackVisitorData", () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  it("posts payload to visitors API", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    await trackVisitorData("home");
    expect(axios.post).toHaveBeenCalledWith("/api/visitors/track", { visited_page: "home" });
  });

  it("swallows errors", async () => {
    axios.post.mockRejectedValue(new Error("Bot bot bot!"));
    await expect(trackVisitorData("home")).resolves.toBeUndefined();
  });
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
