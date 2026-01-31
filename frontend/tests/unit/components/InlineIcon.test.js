import { mount } from "@vue/test-utils";
import InlineIcon from "@/components/InlineIcon.vue";
import { describe, it, expect, beforeEach } from "vitest";

describe("InlineIcon", () => {
  let wrapper;
  let image;

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

  beforeEach(() => {
    wrapper = factory();
    image = wrapper.find("img");
  });

  it("renders the image with the correct src", () => {
    expect(image.exists()).toBe(true);
    expect(image.attributes("src")).toBe(defaultProps.icon);
  });

  it("renders with default alt text", () => {
    expect(image.attributes("alt")).toBe("");
  });

  it("has the correct class", () => {
    expect(wrapper.classes()).toContain("inline-icon");
  });

  it("renders with custom alt text", () => {
    const customAlt = "Custom description";
    wrapper = factory({ alt: customAlt });
    image = wrapper.find("img");

    expect(image.attributes("alt")).toBe(customAlt);
  });
});
