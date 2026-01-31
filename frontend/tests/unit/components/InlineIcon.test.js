import { mount } from "@vue/test-utils";
import InlineIcon from "@/components/InlineIcon.vue";
import { describe, it, expect } from "vitest";

describe("InlineIcon", () => {
  const defaultProps = {
    icon: "/assets/test-icon.svg",
  };

  const factory = (props = {}) =>
    mount(InlineIcon, {
      props: {
        ...defaultProps,
        ...props,
      },
    });

  it("renders the image with the correct src", () => {
    const wrapper = factory();
    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(defaultProps.icon);
  });

  it("renders with default alt text", () => {
    const wrapper = factory();
    const img = wrapper.find("img");

    expect(img.attributes("alt")).toBe("icon");
  });

  it("renders with custom alt text", () => {
    const customAlt = "Custom description";
    const wrapper = factory({ alt: customAlt });
    const img = wrapper.find("img");

    expect(img.attributes("alt")).toBe(customAlt);
  });

  it("has the correct class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("inline-icon");
  });
});
