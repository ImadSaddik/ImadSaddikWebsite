import { mount } from "@vue/test-utils";
import ImageWithCaption from "@/components/ImageWithCaption.vue";

describe("ImageWithCaption", () => {
  const factory = (props = {}) =>
    mount(ImageWithCaption, {
      props: {
        imageSrc: "nebula.jpg",
        imageAlt: "Orion Nebula",
        imageCaption: "A stunning view of M42",
        ...props,
      },
    });

  it("renders the image with correct src and alt", () => {
    const wrapper = factory();
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("nebula.jpg");
    expect(img.attributes("alt")).toBe("Orion Nebula");
  });

  it("renders the caption as HTML", () => {
    const wrapper = factory({ imageCaption: "<em>Credits:</em> NASA" });
    expect(wrapper.find("figcaption").html()).toContain("<em>Credits:</em> NASA");
  });

  it("emits open-image-modal with the event when the image is clicked", async () => {
    const wrapper = factory();
    await wrapper.find("img").trigger("click");
    expect(wrapper.emitted("open-image-modal")).toHaveLength(1);
  });
});
