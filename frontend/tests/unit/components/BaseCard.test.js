import { mount, RouterLinkStub } from "@vue/test-utils";
import BaseCard from "@/components/BaseCard.vue";
import { ARTICLE_TYPES } from "@/constants";

describe("BaseCard", () => {
  const baseProps = {
    imageSrc: "cover.png",
    altText: "Cover alt",
    title: "Understanding Infrared Telescopes",
    creationDate: "2024-10-20",
    articleType: ARTICLE_TYPES.BLOG,
    articleId: "infrared-telescopes",
  };

  const factory = (props = {}) =>
    mount(BaseCard, {
      props: { ...baseProps, ...props },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

  it("computes RouterLink target from articleType and articleId", () => {
    const wrapper = factory();
    const routerLink = wrapper.findComponent(RouterLinkStub);
    expect(routerLink.props("to")).toEqual({
      name: baseProps.articleType,
      params: { slug: baseProps.articleId },
    });
  });

  it("shows dot separator and stat icons when counts exist", () => {
    const wrapper = factory({ viewCount: 10, readCount: 5, clapsCount: 2 });
    expect(wrapper.find(".card-dot-separator").exists()).toBe(true);
    const statItems = wrapper.findAll(".stat-item");
    expect(statItems).toHaveLength(3);
    expect(statItems[0].text()).toContain("10");
    expect(statItems[1].text()).toContain("5");
    expect(statItems[2].text()).toContain("2");
  });

  it("hides dot separator when all counters are zero", () => {
    const wrapper = factory({ viewCount: 0, readCount: 0, clapsCount: 0 });
    expect(wrapper.find(".card-dot-separator").exists()).toBe(false);
    expect(wrapper.findAll(".stat-item")).toHaveLength(0);
  });
});
