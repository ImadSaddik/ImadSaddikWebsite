import { mount } from "@vue/test-utils";
import AboutMeSection from "@/components/AboutMeSection.vue";

describe("AboutMeSection", () => {
  const factory = (options = {}) =>
    mount(AboutMeSection, {
      global: {
        mocks: {
          $router: { push: vi.fn() },
        },
        ...options.global,
      },
    });

  it("renders the title and paragraph", () => {
    const wrapper = factory();
    expect(wrapper.find(".about-me-title").text()).toBe("About me");
    expect(wrapper.find(".about-me-paragraph").text()).not.toBe("");
  });

  it("navigates to about-me page when button is clicked", async () => {
    const push = vi.fn();
    const wrapper = factory({ global: { mocks: { $router: { push } } } });
    await wrapper.find(".about-me-button").trigger("click");
    expect(push).toHaveBeenCalledWith({ path: "about-me" });
  });
});
