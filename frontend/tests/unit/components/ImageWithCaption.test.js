import { mount } from "@vue/test-utils";
import ImageWithCaption from "@/components/ImageWithCaption.vue";

describe("ImageWithCaption", () => {
  let openImageModal;

  const factory = (props = {}, slotContent = "A stunning view of M42") => {
    openImageModal = vi.fn();
    return mount(ImageWithCaption, {
      props: {
        imageSrc: "nebula.jpg",
        imageAlt: "Orion Nebula",
        ...props,
      },
      slots: {
        default: slotContent,
      },
      global: {
        provide: { openImageModal },
      },
    });
  };

  it("renders the image with correct src and alt", () => {
    const wrapper = factory();
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("nebula.jpg");
    expect(img.attributes("alt")).toBe("Orion Nebula");
  });

  it("renders the caption as HTML via slot", () => {
    const wrapper = factory({}, "<em>Credits:</em> NASA");
    expect(wrapper.find(".image-caption").html()).toContain("<em>Credits:</em> NASA");
  });

  it("calls openImageModal with the event when the image is clicked", async () => {
    const wrapper = factory();
    await wrapper.find("img").trigger("click");
    expect(openImageModal).toHaveBeenCalledTimes(1);
  });
});
