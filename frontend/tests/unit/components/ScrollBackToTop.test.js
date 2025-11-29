import { mount } from "@vue/test-utils";
import ScrollBackToTop from "@/components/ScrollBackToTop.vue";

describe("ScrollBackToTop", () => {
  let originalScrollTo;

  beforeEach(() => {
    originalScrollTo = window.scrollTo;
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it("is hidden when scrollY is 0", () => {
    const wrapper = mount(ScrollBackToTop);
    expect(wrapper.find(".scroll-back-to-top-button").isVisible()).toBe(false);
  });

  it("becomes visible when scrollY exceeds 500", async () => {
    const wrapper = mount(ScrollBackToTop);
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true });
    wrapper.vm.handleScroll();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".scroll-back-to-top-button").isVisible()).toBe(true);
  });

  it("scrolls to top smoothly when clicked", async () => {
    const wrapper = mount(ScrollBackToTop);
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true });
    wrapper.vm.handleScroll();
    await wrapper.vm.$nextTick();

    await wrapper.find(".scroll-back-to-top-button").trigger("click");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("scrolls to top when Enter key is pressed", async () => {
    const wrapper = mount(ScrollBackToTop);
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true });
    wrapper.vm.handleScroll();
    await wrapper.vm.$nextTick();

    await wrapper.find(".scroll-back-to-top-button").trigger("keydown.enter");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
