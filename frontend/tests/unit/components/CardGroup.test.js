import { mount, RouterLinkStub } from "@vue/test-utils";
import CardGroup from "@/components/CardGroup.vue";
import BaseCard from "@/components/BaseCard.vue";
import { ARTICLE_TYPES } from "@/constants";

describe("CardGroup", () => {
  const sampleCards = [
    {
      imageSrc: "cover-a.png",
      altText: "Cover A",
      title: "Kubernetes tips",
      creationDate: "Jan 2024",
      articleType: ARTICLE_TYPES.BLOG,
      articleId: "kubernetes-tips",
      viewCount: 3,
      readCount: 2,
      clapsCount: 1,
    },
    {
      imageSrc: "cover-b.png",
      altText: "Cover B",
      title: "Python pipelines",
      creationDate: "Feb 2024",
      articleType: ARTICLE_TYPES.BLOG,
      articleId: "python-pipelines",
      viewCount: 30,
      readCount: 10,
      clapsCount: 8,
    },
  ];

  const factory = (props = {}, options = {}) =>
    mount(CardGroup, {
      props: {
        title: "Recent Reads",
        cardsData: sampleCards,
        buttonText: "Explore all",
        path: "/articles",
        ...props,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        ...options.global,
      },
    });

  it("renders a BaseCard for each card entry", () => {
    const wrapper = factory();
    const cards = wrapper.findAllComponents(BaseCard);
    expect(cards).toHaveLength(sampleCards.length);
    cards.forEach((card, index) => {
      expect(card.props()).toMatchObject({
        imageSrc: sampleCards[index].imageSrc,
        altText: sampleCards[index].altText,
        title: sampleCards[index].title,
        creationDate: sampleCards[index].creationDate,
        articleId: sampleCards[index].articleId,
        articleType: sampleCards[index].articleType,
        viewCount: sampleCards[index].viewCount,
        readCount: sampleCards[index].readCount,
        clapsCount: sampleCards[index].clapsCount,
      });
    });
  });

  it("navigates to provided path when the button is clicked", async () => {
    const push = vi.fn();
    const wrapper = factory({}, { global: { mocks: { $router: { push } } } });
    await wrapper.find(".cards-group-button").trigger("click");
    expect(push).toHaveBeenCalledWith({ path: "/articles" });
  });

  it("renders the provided title and button label", () => {
    const wrapper = factory({ title: "Featured Articles", buttonText: "View archive" });
    expect(wrapper.find(".cards-group-title").text()).toBe("Featured Articles");
    expect(wrapper.find(".cards-group-button").text()).toBe("View archive");
  });

  it("renders empty grid when cardsData is empty", () => {
    const wrapper = factory({ cardsData: [] });
    expect(wrapper.findAllComponents(BaseCard)).toHaveLength(0);
  });

  it("uses default empty array for cardsData prop", () => {
    const wrapper = mount(CardGroup, {
      props: {
        path: "/test-path",
      },
    });
    expect(wrapper.findAllComponents(BaseCard)).toHaveLength(0);
  });
});
