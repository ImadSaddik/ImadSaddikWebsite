import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CopyCodeButton from "@/components/CopyCodeButton.vue";

describe("CopyCodeButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders default labels and visibility class", () => {
    const wrapper = mount(CopyCodeButton, {
      props: { text: "echo hi", visible: false },
    });

    const button = wrapper.find("button.code-copy-button");
    expect(button.attributes("aria-label")).toBe("Copy code");
    expect(button.attributes("title")).toBe("Copy code");
    expect(button.classes()).not.toContain("visible");
  });

  it("copies text on click and updates labels to Copied!", async () => {
    const showToast = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(CopyCodeButton, {
      props: {
        text: "npm test",
        visible: true,
        copyLabel: "Copy output",
        successMessage: "Output copied to clipboard",
      },
      global: { provide: { showToast } },
    });

    const button = wrapper.find("button.code-copy-button");
    expect(button.classes()).toContain("visible");
    expect(button.attributes("aria-label")).toBe("Copy output");

    await button.trigger("click");
    expect(writeText).toHaveBeenCalledWith("npm test");
    expect(showToast).toHaveBeenCalledWith({
      message: "Output copied to clipboard",
      type: "success",
    });
    expect(button.attributes("aria-label")).toBe("Copied!");
    expect(button.attributes("disabled")).toBeDefined();

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();
    expect(button.attributes("aria-label")).toBe("Copy output");
    expect(button.attributes("disabled")).toBeUndefined();
  });
});
