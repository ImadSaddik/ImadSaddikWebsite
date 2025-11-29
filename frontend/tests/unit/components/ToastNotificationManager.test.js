import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ToastNotificationManager from "@/components/ToastNotificationManager.vue";

describe("ToastNotificationManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const mountComponent = () =>
    mount(ToastNotificationManager, {
      attachTo: document.body,
    });

  it("ignores empty toasts", () => {
    const wrapper = mountComponent();
    wrapper.vm.showToast({});
    expect(wrapper.vm.toasts).toHaveLength(0);
  });

  it("adds toast and auto removes it", async () => {
    const wrapper = mountComponent();
    wrapper.vm.showToast({ message: "Saved", type: "success" });
    expect(wrapper.vm.toasts).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(wrapper.vm.autoRemoveIntervalInMilliseconds);
    await vi.advanceTimersByTimeAsync(wrapper.vm.fadeOutAnimationDurationInMilliseconds);

    expect(wrapper.vm.toasts).toHaveLength(0);
  });
});
