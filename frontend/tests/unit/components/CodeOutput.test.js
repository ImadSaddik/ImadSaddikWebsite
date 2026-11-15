import { ref } from "vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import CodeOutput from "@/components/CodeOutput.vue";

describe("CodeOutput", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the code output in a pre/code block", () => {
    const output = "Hello, World!\nLine 2";
    const wrapper = mount(CodeOutput, { props: { codeOutput: output } });
    expect(wrapper.find("pre.code-output-container").exists()).toBe(true);
    expect(wrapper.find("code").text()).toBe(output);
    expect(wrapper.find(".code-label").text()).toBe("output");
  });

  it("toggles wrap class locally and responds to global wrap preference", async () => {
    const wrapCodeEnabled = ref(false);
    const wrapper = mount(CodeOutput, {
      props: { codeOutput: "very long line" },
      global: { provide: { wrapCodeEnabled } },
    });

    const container = wrapper.find(".code-container");
    expect(container.classes()).not.toContain("wrapped");

    await container.trigger("mouseenter");
    expect(wrapper.find(".code-label").classes()).toContain("hidden");
    expect(wrapper.find(".code-wrap-button").classes()).toContain("visible");
    expect(wrapper.find(".code-copy-button").classes()).toContain("visible");

    await wrapper.find(".code-wrap-button").trigger("click");
    expect(container.classes()).toContain("wrapped");

    wrapCodeEnabled.value = true;
    await wrapper.vm.$nextTick();
    expect(container.classes()).toContain("wrapped");

    await wrapper.find(".code-wrap-button").trigger("click");
    expect(container.classes()).not.toContain("wrapped");
  });

  it("copies output to clipboard and shows output toast", async () => {
    const showToast = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(CodeOutput, {
      props: { codeOutput: "line 1\nline 2" },
      global: { provide: { showToast } },
    });

    await wrapper.find(".code-copy-button").trigger("click");
    expect(writeText).toHaveBeenCalledWith("line 1\nline 2");
    expect(showToast).toHaveBeenCalledWith({
      message: "Output copied to clipboard",
      type: "success",
    });
  });

  it("warns when no code output is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(CodeOutput);
    expect(warn).toHaveBeenCalled();
    const warningMessage = warn.mock.calls.flat().join(" ");
    expect(warningMessage).toContain('Missing required prop: "codeOutput"');
    warn.mockRestore();
  });
});
