import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CodeBlock from "@/components/CodeBlock.vue";

describe("CodeBlock", () => {
  let showToast;

  const factory = (props = {}) => {
    showToast = vi.fn();
    return mount(CodeBlock, {
      props: {
        code: "const greeting = 'hello';",
        language: "javascript",
        ...props,
      },
      global: {
        provide: { showToast },
      },
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the language label", () => {
    const wrapper = factory({ language: "python" });
    const label = wrapper.find(".language-label");
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("python");
  });

  it("highlights code and renders the output HTML", async () => {
    const wrapper = factory({ code: "const x = 10;", language: "javascript" });
    await wrapper.vm.$nextTick();
    await vi.waitFor(() => {
      expect(wrapper.find("pre.shiki").exists()).toBe(true);
    });

    const pre = wrapper.find("pre.shiki");
    expect(pre.attributes("class")).toContain("github-dark-default");
    expect(pre.text()).toContain("const x = 10;");
  });

  it("toggles hover classes on mouseenter and mouseleave", async () => {
    const wrapper = factory();
    const container = wrapper.find(".code-container");

    await container.trigger("mouseenter");
    expect(wrapper.find(".language-label").classes()).toContain("hidden");
    expect(wrapper.find(".code-copy-button").classes()).toContain("visible");

    await container.trigger("mouseleave");
    expect(wrapper.find(".language-label").classes()).not.toContain("hidden");
    expect(wrapper.find(".code-copy-button").classes()).not.toContain("visible");
  });

  it("copies code to clipboard and displays success toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory({ code: "print('hello')" });
    const button = wrapper.find(".code-copy-button");

    await button.trigger("click");
    expect(writeText).toHaveBeenCalledWith("print('hello')");
    expect(showToast).toHaveBeenCalledWith({
      message: "Code copied to clipboard",
      type: "success",
    });

    expect(wrapper.find("i").classes()).toContain("fa-check");

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("i").classes()).toContain("fa-clipboard");
  });

  it("displays error toast and error icon when copying fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard access denied"));
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = factory({ code: "echo test" });
    const button = wrapper.find(".code-copy-button");

    await button.trigger("click");
    expect(showToast).toHaveBeenCalledWith({
      message: "Failed to copy code",
      type: "error",
    });

    expect(wrapper.find("i").classes()).toContain("fa-xmark");

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("i").classes()).toContain("fa-clipboard");
  });

  it("re-highlights code when code or language props change", async () => {
    const wrapper = factory({ code: "const a = 1;", language: "javascript" });
    await vi.waitFor(() => {
      expect(wrapper.find("pre.shiki").exists()).toBe(true);
    });
    expect(wrapper.find("pre.shiki").text()).toContain("const a = 1;");

    await wrapper.setProps({ code: "const b = 2;" });
    await vi.waitFor(() => {
      expect(wrapper.find("pre.shiki").text()).toContain("const b = 2;");
    });

    await wrapper.setProps({ code: "val = 42", language: "python" });
    await vi.waitFor(() => {
      expect(wrapper.find(".language-label").text()).toBe("python");
      expect(wrapper.find("pre.shiki").text()).toContain("val = 42");
    });
  });
});
