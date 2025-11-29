import { mount } from "@vue/test-utils";
import AdmonitionBlock from "@/components/AdmonitionBlock.vue";

describe("AdmonitionBlock", () => {
  const factory = (props = {}, slots = {}) =>
    mount(AdmonitionBlock, {
      props: {
        title: "Note",
        type: "note",
        ...props,
      },
      slots: {
        default: "Some helpful information",
        ...slots,
      },
    });

  it("renders title and slot content", () => {
    const wrapper = factory();
    expect(wrapper.find(".admonition-title").text()).toBe("Note");
    expect(wrapper.find(".admonition-content").text()).toContain("Some helpful information");
  });

  it.each(["note", "tip", "info", "warning", "danger"])("applies correct class for type '%s'", (type) => {
    const wrapper = factory({ type, title: type });
    expect(wrapper.find(".admonition").classes()).toContain(`admonition-${type}`);
    expect(wrapper.find(".admonition-content").text()).toContain("Some helpful information");
  });

  it("defaults to note type when none provided", () => {
    const wrapper = mount(AdmonitionBlock, { props: { title: "Default" }, slots: { default: "Default content" } });
    expect(wrapper.find(".admonition").classes()).toContain("admonition-note");
    expect(wrapper.find(".admonition-content").text()).toContain("Default content");
  });
});
