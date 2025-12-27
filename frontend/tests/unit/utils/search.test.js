import { describe, it, expect, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { getCardsDataFromDocumentHits } from "@/utils";

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
