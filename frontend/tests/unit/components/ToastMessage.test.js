import { mount } from "@vue/test-utils";
import ToastMessage from "@/components/ToastMessage.vue";

describe("ToastMessage", () => {
  const factory = (props = {}) =>
    mount(ToastMessage, {
      props: {
        message: "Operation completed",
        type: "success",
        ...props,
      },
    });

  it("renders the message text", () => {
    const wrapper = factory({ message: "File saved successfully" });
    expect(wrapper.find(".toast-text").text()).toBe("File saved successfully");
  });

  it.each([
    ["success", "toast-success", "fa-solid fa-check-circle"],
    ["error", "toast-error", "fa-solid fa-exclamation-circle"],
    ["warning", "toast-warning", "fa-solid fa-exclamation-triangle"],
    ["info", "toast-info", "fa-solid fa-info-circle"],
  ])("applies correct class and icon for type '%s'", (type, expectedClass, expectedIcon) => {
    const wrapper = factory({ type });
    expect(wrapper.find(".toast-message").classes()).toContain(expectedClass);
    const icon = wrapper.find(".toast-icon");
    expectedIcon.split(" ").forEach((className) => {
      expect(icon.classes()).toContain(className);
    });
  });
});
