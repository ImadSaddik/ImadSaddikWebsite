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

import axios from "axios";
import {
  calculateReadingTime,
  convertUnixTimestampToReadableFormat,
  getCardsDataFromDocumentHits,
  trackVisitorData,
} from "@/utils.js";

const getRefs = (text) => ({ articleContent: { $el: { innerText: text } } });

describe("calculateReadingTime", () => {
  it("rounds up reading time based on words per minute", () => {
    const refs = getRefs("word ".repeat(250));
    expect(calculateReadingTime(refs)).toBe(2);
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
