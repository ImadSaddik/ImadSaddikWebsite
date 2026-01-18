import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useImageModal } from "@/composables/useImageModal";

const TestComponent = {
  setup() {
    return useImageModal();
  },
  template: "<div></div>",
};

describe("useImageModal", () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with default values", () => {
    const wrapper = mount(TestComponent);
    expect(wrapper.vm.enlargedImageSrc).toBe("");
    expect(wrapper.vm.isImageModalVisible).toBe(false);
  });

  it("opens the modal and sets the image source", () => {
    const wrapper = mount(TestComponent);
    const mockEvent = { target: { src: "http://example.com/image.jpg" } };

    wrapper.vm.handleOpenImageModal(mockEvent);

    expect(wrapper.vm.enlargedImageSrc).toBe("http://example.com/image.jpg");
    expect(wrapper.vm.isImageModalVisible).toBe(true);
    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("closes the modal and resets the image source", () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.handleOpenImageModal({ target: { src: "test.jpg" } });
    wrapper.vm.handleCloseImageModal();

    expect(wrapper.vm.isImageModalVisible).toBe(false);
    expect(wrapper.vm.enlargedImageSrc).toBe("");
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("closes the modal on Escape key press", () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.handleOpenImageModal({ target: { src: "test.jpg" } });

    const event = new KeyboardEvent("keydown", { key: "Escape" });
    window.dispatchEvent(event);

    expect(wrapper.vm.isImageModalVisible).toBe(false);
    expect(wrapper.vm.enlargedImageSrc).toBe("");
  });

  it("does not close the modal on other key presses", () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.handleOpenImageModal({ target: { src: "test.jpg" } });

    const event = new KeyboardEvent("keydown", { key: "Enter" });
    window.dispatchEvent(event);

    expect(wrapper.vm.isImageModalVisible).toBe(true);
    expect(wrapper.vm.enlargedImageSrc).toBe("test.jpg");
  });

  it("removes event listener on unmount", () => {
    const wrapper = mount(TestComponent);

    wrapper.vm.handleOpenImageModal({ target: { src: "test.jpg" } });

    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
