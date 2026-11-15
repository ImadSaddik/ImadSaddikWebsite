import { defineComponent, ref } from "vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { useCodeWrap } from "@/composables/useCodeWrap";

const TestHost = defineComponent({
  setup() {
    return useCodeWrap();
  },
  template: "<div />",
});

describe("useCodeWrap", () => {
  it("defaults to unwrapped when wrapCodeEnabled is not provided", () => {
    const wrapper = mount(TestHost);
    expect(wrapper.vm.isWrapped).toBe(false);
    expect(wrapper.vm.controlsVisible).toBe(false);
  });

  it("follows global wrapCodeEnabled and resets local override when global changes", async () => {
    const wrapCodeEnabled = ref(true);
    const wrapper = mount(TestHost, {
      global: { provide: { wrapCodeEnabled } },
    });

    expect(wrapper.vm.isWrapped).toBe(true);

    wrapper.vm.toggleWrap();
    expect(wrapper.vm.isWrapped).toBe(false);

    wrapCodeEnabled.value = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isWrapped).toBe(false);

    wrapCodeEnabled.value = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isWrapped).toBe(true);
  });

  it("keeps controlsVisible true for keyboard focus and hides on mouseleave after pointer click", () => {
    const wrapper = mount(TestHost);
    const container = document.createElement("div");
    const childButton = document.createElement("button");
    container.appendChild(childButton);

    wrapper.vm.handleMouseEnter();
    wrapper.vm.handlePointerDown();
    wrapper.vm.handleFocusIn();
    expect(wrapper.vm.controlsVisible).toBe(true);

    wrapper.vm.handleMouseLeave();
    expect(wrapper.vm.controlsVisible).toBe(false);

    wrapper.vm.handleKeyDown();
    wrapper.vm.handleFocusIn();
    expect(wrapper.vm.controlsVisible).toBe(true);

    wrapper.vm.handleFocusOut({ currentTarget: container, relatedTarget: childButton });
    expect(wrapper.vm.controlsVisible).toBe(true);

    wrapper.vm.handleFocusOut({ currentTarget: container, relatedTarget: document.body });
    expect(wrapper.vm.controlsVisible).toBe(false);
  });
});
