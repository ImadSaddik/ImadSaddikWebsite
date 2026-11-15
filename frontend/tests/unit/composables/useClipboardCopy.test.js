import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useClipboardCopy } from "@/composables/useClipboardCopy";

const TestHost = defineComponent({
  props: {
    successMessage: { type: String, default: undefined },
    errorMessage: { type: String, default: undefined },
  },
  setup(props) {
    return useClipboardCopy({
      successMessage: props.successMessage,
      errorMessage: props.errorMessage,
    });
  },
  template: "<div />",
});

describe("useClipboardCopy", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("copies text, shows success toast, and resets icon state after timeout", async () => {
    const showToast = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(TestHost, {
      global: { provide: { showToast } },
    });

    expect(wrapper.vm.iconClass).toContain("fa-clipboard");

    await wrapper.vm.copy("hello world");
    expect(writeText).toHaveBeenCalledWith("hello world");
    expect(wrapper.vm.copied).toBe(true);
    expect(wrapper.vm.iconClass).toContain("fa-check");
    expect(showToast).toHaveBeenCalledWith({
      message: "Code copied to clipboard",
      type: "success",
    });

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.copied).toBe(false);
    expect(wrapper.vm.iconClass).toContain("fa-clipboard");
  });

  it("shows custom error toast and resets error state on clipboard failure", async () => {
    const showToast = vi.fn();
    const writeText = vi.fn().mockRejectedValue(new Error("Denied"));
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(TestHost, {
      props: {
        successMessage: "Output copied to clipboard",
        errorMessage: "Failed to copy output",
      },
      global: { provide: { showToast } },
    });

    await wrapper.vm.copy("some output");
    expect(wrapper.vm.errorOccured).toBe(true);
    expect(wrapper.vm.iconClass).toContain("fa-xmark");
    expect(showToast).toHaveBeenCalledWith({
      message: "Failed to copy output",
      type: "error",
    });

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.errorOccured).toBe(false);
    expect(wrapper.vm.iconClass).toContain("fa-clipboard");
  });

  it("works safely when showToast is not provided", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const wrapper = mount(TestHost);
    await expect(wrapper.vm.copy("no toast")).resolves.toBeUndefined();
    expect(writeText).toHaveBeenCalledWith("no toast");
  });
});
