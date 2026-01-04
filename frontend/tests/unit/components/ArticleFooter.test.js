import { mount, RouterLinkStub } from "@vue/test-utils";
import ArticleFooter from "@/components/ArticleFooter.vue";
import BaseCard from "@/components/BaseCard.vue";
import { ARTICLE_TYPES } from "@/constants";

describe("ArticleFooter", () => {
  const sampleCards = [
    {
      imageSrc: "cover1.png",
      altText: "Cover 1",
      title: "Introduction to Kubernetes",
      creationDate: "March 2024",
      articleType: ARTICLE_TYPES.BLOG,
      articleId: "intro-kubernetes",
      viewCount: 100,
      readCount: 50,
      clapsCount: 25,
    },
    {
      imageSrc: "cover2.png",
      altText: "Cover 2",
      title: "Advanced Python",
      creationDate: "April 2024",
      articleType: "course",
      articleId: "advanced-python",
      viewCount: 200,
      readCount: 100,
      clapsCount: 80,
    },
  ];

  const factory = (props = {}) =>
    mount(ArticleFooter, {
      props: {
        cardData: sampleCards,
        ...props,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

  it("renders the 'You might also like' header", () => {
    const wrapper = factory();
    expect(wrapper.find(".article-footer-header").text()).toBe("You might also like");
  });

  it("renders a BaseCard for each item in cardData", () => {
    const wrapper = factory();
    const cards = wrapper.findAllComponents(BaseCard);
    expect(cards).toHaveLength(sampleCards.length);
  });

  it("passes correct props to BaseCard components", () => {
    const wrapper = factory();
    const cards = wrapper.findAllComponents(BaseCard);
    cards.forEach((card, index) => {
      expect(card.props()).toMatchObject({
        imageSrc: sampleCards[index].imageSrc,
        altText: sampleCards[index].altText,
        title: sampleCards[index].title,
        creationDate: sampleCards[index].creationDate,
        articleType: sampleCards[index].articleType,
        articleId: sampleCards[index].articleId,
        viewCount: sampleCards[index].viewCount,
        readCount: sampleCards[index].readCount,
        clapsCount: sampleCards[index].clapsCount,
      });
    });
  });

  it("renders empty grid when cardData is empty", () => {
    const wrapper = factory({ cardData: [] });
    expect(wrapper.findAllComponents(BaseCard)).toHaveLength(0);
  });
});
