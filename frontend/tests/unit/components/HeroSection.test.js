import { mount } from "@vue/test-utils";
import HeroSection from "@/components/HeroSection.vue";

describe("HeroSection", () => {
  const factory = (options = {}) =>
    mount(HeroSection, {
      global: {
        mocks: {
          $router: { push: vi.fn() },
        },
        ...options.global,
      },
    });

  it("renders the hero title", () => {
    const wrapper = factory();
    expect(wrapper.find(".hero-title").text()).not.toBe("");
  });

  it("navigates to blogs when 'Explore articles' button is clicked", async () => {
    const push = vi.fn();
    const wrapper = factory({ global: { mocks: { $router: { push } } } });
    await wrapper.find(".primary-button").trigger("click");
    expect(push).toHaveBeenCalledWith({ path: "blogs" });
  });

  it("navigates to courses when 'View courses' button is clicked", async () => {
    const push = vi.fn();
    const wrapper = factory({ global: { mocks: { $router: { push } } } });
    await wrapper.find(".secondary-button").trigger("click");
    expect(push).toHaveBeenCalledWith({ path: "courses" });
  });
});
