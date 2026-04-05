import axios from "axios";
import ArticlesHub from "@/components/ArticlesHub.vue";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DEFAULT_BATCH_SIZE, ARTICLE_TYPES } from "@/constants";
import * as utils from "@/utils";

vi.mock("axios");
vi.mock("@/utils", async () => {
  const actual = await vi.importActual("@/utils");
  return {
    ...actual,
    getCardsDataFromDocumentHits: vi.fn(),
  };
});

describe("ArticlesHub", () => {
  const props = {
    articleTitle: "Blog",
    articleType: ARTICLE_TYPES.BLOG,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.post.mockResolvedValue({
      data: {
        hits: [],
        total_hits: 0,
        facet_distribution: { tags: {}, year: {} },
        processing_time_ms: 1,
      },
    });
    utils.getCardsDataFromDocumentHits.mockReturnValue([]);
  });

  const factory = (options = {}) =>
    mount(ArticlesHub, {
      props,
      global: {
        stubs: {
          SearchBar: true,
          DropDownMenu: true,
          CheckboxGroup: true,
          BaseCard: true,
        },
        mocks: {
          $route: {
            query: {},
          },
        },
      },
      ...options,
    });

  const formatHit = (title) => ({
    imageSrc: "image.jpg",
    altText: "alt",
    title,
    creationDate: "2024-01-01",
    articleType: ARTICLE_TYPES.BLOG,
    articleId: "some-id",
  });

  it("initializes with default pagination values", async () => {
    const wrapper = factory();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.limit).toBe(DEFAULT_BATCH_SIZE);
    expect(wrapper.vm.offset).toBe(0);
  });

  it("resets offset to 0 when performSearchRequest is called without isLoadMore", async () => {
    const wrapper = factory();
    await wrapper.vm.$nextTick();
    wrapper.vm.offset = 20;

    await wrapper.vm.performSearchRequest();

    expect(wrapper.vm.offset).toBe(0);
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ offset: 0 }),
      expect.any(Object)
    );
  });

  it("increments offset and appends data when loadMoreArticles is called", async () => {
    utils.getCardsDataFromDocumentHits.mockReturnValueOnce([]);

    const wrapper = factory();
    await wrapper.vm.$nextTick();

    const initialHits = [formatHit("Article 1")];
    utils.getCardsDataFromDocumentHits.mockReturnValueOnce(initialHits);
    await wrapper.vm.performSearchRequest();
    expect(wrapper.vm.cardData).toHaveLength(1);

    const moreHits = [formatHit("Article 2")];
    utils.getCardsDataFromDocumentHits.mockReturnValueOnce(moreHits);

    await wrapper.vm.loadMoreArticles();

    expect(wrapper.vm.offset).toBe(DEFAULT_BATCH_SIZE);
    expect(wrapper.vm.cardData).toHaveLength(2);
    expect(wrapper.vm.cardData).toEqual([formatHit("Article 1"), formatHit("Article 2")]);

    expect(axios.post).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({ offset: DEFAULT_BATCH_SIZE }),
      expect.any(Object)
    );
  });

  it("sets isSearchResponseEmpty correctly based on cardData length", async () => {
    const wrapper = factory();
    await wrapper.vm.$nextTick();

    utils.getCardsDataFromDocumentHits.mockReturnValueOnce([]);
    await wrapper.vm.performSearchRequest();
    expect(wrapper.vm.isSearchResponseEmpty).toBe(true);

    utils.getCardsDataFromDocumentHits.mockReturnValueOnce([formatHit("Art 1")]);
    await wrapper.vm.performSearchRequest();
    expect(wrapper.vm.isSearchResponseEmpty).toBe(false);
  });
});
