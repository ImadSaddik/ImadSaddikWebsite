import { ref } from "vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CodeContainer from "@/components/CodeContainer.vue";

describe("CodeContainer", () => {
  it("renders label, slot content, and both action buttons", () => {
    const wrapper = mount(CodeContainer, {
      props: { label: "python", copyText: "print(1)" },
      slots: { default: "<pre><code>print(1)</code></pre>" },
    });

    expect(wrapper.find(".code-label").text()).toBe("python");
    expect(wrapper.find(".code-wrap-button").exists()).toBe(true);
    expect(wrapper.find(".code-copy-button").exists()).toBe(true);
    expect(wrapper.find("pre code").text()).toBe("print(1)");
  });

  it("toggles wrap state and hides controls on mouseleave after pointer click", async () => {
    const wrapCodeEnabled = ref(false);
    const wrapper = mount(CodeContainer, {
      props: { label: "bash", copyText: "ls -la" },
      global: { provide: { wrapCodeEnabled } },
    });

    const container = wrapper.find(".code-container");
    const wrapButton = wrapper.find(".code-wrap-button");

    await container.trigger("mouseenter");
    expect(wrapper.find(".code-label").classes()).toContain("hidden");
    expect(wrapButton.classes()).toContain("visible");

    await container.trigger("pointerdown");
    await wrapButton.trigger("focusin");
    await wrapButton.trigger("click");
    expect(container.classes()).toContain("wrapped");

    await container.trigger("mouseleave");
    expect(wrapper.find(".code-label").classes()).not.toContain("hidden");
    expect(wrapButton.classes()).not.toContain("visible");
  });

  it("copies copyText using provided toast messages", async () => {
    const showToast = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(CodeContainer, {
      props: {
        label: "output",
        copyText: "done",
        copySuccessMessage: "Output copied to clipboard",
      },
      global: { provide: { showToast } },
    });

    await wrapper.find(".code-copy-button").trigger("click");
    expect(writeText).toHaveBeenCalledWith("done");
    expect(showToast).toHaveBeenCalledWith({
      message: "Output copied to clipboard",
      type: "success",
    });
  });
});
