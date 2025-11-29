import { mount } from "@vue/test-utils";
import ImageEnlarger from "@/components/ImageEnlarger.vue";

describe("ImageEnlarger", () => {
  const factory = (props = {}) =>
    mount(ImageEnlarger, {
      props: {
        enlargedImageSrc: "galaxy.png",
        isVisible: true,
        ...props,
      },
    });

  it("renders the overlay and image when isVisible is true", () => {
    const wrapper = factory();
    expect(wrapper.find(".image-modal-overlay").exists()).toBe(true);
    expect(wrapper.find("img").attributes("src")).toBe("galaxy.png");
  });

  it("does not render when isVisible is false", () => {
    const wrapper = factory({ isVisible: false });
    expect(wrapper.find(".image-modal-overlay").exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("emits close-image-modal when the overlay is clicked", async () => {
    const wrapper = factory();
    await wrapper.find(".image-modal-overlay").trigger("click");
    expect(wrapper.emitted("close-image-modal")).toHaveLength(1);
  });
});
