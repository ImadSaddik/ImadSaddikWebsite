import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import WrapToggleButton from "@/components/WrapToggleButton.vue";

describe("WrapToggleButton", () => {
  it("renders accessible labels and classes for unwrapped state", () => {
    const wrapper = mount(WrapToggleButton, {
      props: { isWrapped: false, visible: false },
    });

    const button = wrapper.find("button.code-wrap-button");
    expect(button.attributes("aria-label")).toBe("Wrap lines");
    expect(button.attributes("aria-pressed")).toBe("false");
    expect(button.classes()).not.toContain("visible");
    expect(button.classes()).not.toContain("active");
  });

  it("renders active state and emits toggle on click", async () => {
    const wrapper = mount(WrapToggleButton, {
      props: { isWrapped: true, visible: true },
    });

    const button = wrapper.find("button.code-wrap-button");
    expect(button.attributes("aria-label")).toBe("Unwrap lines");
    expect(button.attributes("aria-pressed")).toBe("true");
    expect(button.classes()).toContain("visible");
    expect(button.classes()).toContain("active");

    await button.trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
  });
});
