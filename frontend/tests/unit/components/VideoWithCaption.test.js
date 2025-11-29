import { mount } from "@vue/test-utils";
import VideoWithCaption from "@/components/VideoWithCaption.vue";

describe("VideoWithCaption", () => {
  const factory = (props = {}) =>
    mount(VideoWithCaption, {
      props: {
        videoSrc: "demo.mp4",
        videoCaption: "A demo video",
        ...props,
      },
    });

  it("renders video with correct src", () => {
    const wrapper = factory({ videoSrc: "star-trails.mp4" });
    expect(wrapper.find("video").attributes("src")).toBe("star-trails.mp4");
  });

  it("renders caption as HTML", () => {
    const wrapper = factory({ videoCaption: "<strong>Time-lapse</strong> of the night sky" });
    expect(wrapper.find("figcaption").html()).toContain("<strong>Time-lapse</strong>");
  });

  it("video has autoplay, loop, and playsinline attributes", () => {
    const wrapper = factory();
    const video = wrapper.find("video");
    expect(video.element.muted).toBe(true);
    expect(video.attributes()).toHaveProperty("autoplay");
    expect(video.attributes()).toHaveProperty("loop");
    expect(video.attributes()).toHaveProperty("playsinline");
  });
});
