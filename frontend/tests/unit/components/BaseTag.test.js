import { mount } from "@vue/test-utils";
import BaseTag from "@/components/BaseTag.vue";
import { ARTICLE_TYPES } from "@/constants";

describe("BaseTag", () => {
  const factory = (props = {}, options = {}) =>
    mount(BaseTag, {
      props: {
        name: "python",
        articleType: ARTICLE_TYPES.BLOG,
        ...props,
      },
      global: {
        mocks: {
          $router: { push: vi.fn() },
        },
        ...options.global,
      },
    });

  it("renders the tag name", () => {
    const wrapper = factory();
    expect(wrapper.text()).toBe("python");
  });

  it("navigates to the correct hub with selectedTag query on click", async () => {
    const push = vi.fn();
    const wrapper = factory(
      { name: "fastapi", articleType: ARTICLE_TYPES.BLOG },
      { global: { mocks: { $router: { push } } } }
    );
    await wrapper.trigger("click");
    expect(push).toHaveBeenCalledWith({ name: "blogs", query: { selectedTag: "fastapi" } });
  });

  it.each([
    [ARTICLE_TYPES.BLOG, "blogs"],
    [ARTICLE_TYPES.COURSE, "courses"],
    [ARTICLE_TYPES.ASTRONOMY, "astronomy"],
  ])("maps articleType '%s' to route '%s'", async (articleType, expectedRoute) => {
    const push = vi.fn();
    const wrapper = factory({ articleType }, { global: { mocks: { $router: { push } } } });
    await wrapper.trigger("click");
    expect(push).toHaveBeenCalledWith({ name: expectedRoute, query: { selectedTag: "python" } });
  });

  it("does not navigate for an unknown articleType", async () => {
    const push = vi.fn();
    const wrapper = factory({ articleType: "unknown" }, { global: { mocks: { $router: { push } } } });
    await wrapper.trigger("click");
    expect(push).not.toHaveBeenCalled();
  });
});
