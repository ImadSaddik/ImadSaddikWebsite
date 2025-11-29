import { mount } from "@vue/test-utils";
import SeparatorImage from "@/components/SeparatorImage.vue";

describe("SeparatorImage", () => {
  const factory = (props = {}) =>
    mount(SeparatorImage, {
      props: {
        imageSrc: "separator.svg",
        altText: "Decorative separator",
        ...props,
      },
    });

  it("renders image with provided src and alt", () => {
    const wrapper = factory({ imageSrc: "divider.png", altText: "Section divider" });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("divider.png");
    expect(img.attributes("alt")).toBe("Section divider");
  });

  it("uses default width and height when not specified", () => {
    const wrapper = factory();
    const img = wrapper.find("img");
    expect(img.attributes("width")).toBe("100%");
    expect(img.attributes("height")).toBe("auto");
  });

  it("applies custom width and height", () => {
    const wrapper = factory({ imageWidth: "50%", imageHeight: "200px" });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("separator.svg");
    expect(img.attributes("alt")).toBe("Decorative separator");
    expect(img.attributes("width")).toBe("50%");
    expect(img.attributes("height")).toBe("200px");
  });
});
