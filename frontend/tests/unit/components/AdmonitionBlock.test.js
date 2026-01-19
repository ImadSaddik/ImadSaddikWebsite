import { mount } from "@vue/test-utils";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";

describe("AdmonitionBlock", () => {
  const factory = (props = {}, slots = {}) =>
    mount(AdmonitionBlock, {
      props: {
        title: "Info",
        type: "info",
        ...props,
      },
      slots: {
        default: "Some helpful information",
        ...slots,
      },
    });

  it("renders title and slot content", () => {
    const wrapper = factory();
    expect(wrapper.find(".admonition-title").text()).toBe("Info");
    expect(wrapper.find(".admonition-content").text()).toContain("Some helpful information");
  });

  it.each(["info", "tip", "warning", "danger"])("applies correct class for type '%s'", (type) => {
    const wrapper = factory({ type, title: type });
    expect(wrapper.find(".admonition").classes()).toContain(`admonition-${type}`);
    expect(wrapper.find(".admonition-content").text()).toContain("Some helpful information");
  });

  it("defaults to info type when none provided", () => {
    const wrapper = mount(AdmonitionBlock, { props: { title: "Default" }, slots: { default: "Default content" } });
    expect(wrapper.find(".admonition").classes()).toContain("admonition-info");
    expect(wrapper.find(".admonition-content").text()).toContain("Default content");
  });
});
