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

  it("renders video with controls, playsinline, and preload='metadata' by default", () => {
    const wrapper = factory();
    const video = wrapper.find("video");
    expect(video.attributes()).toHaveProperty("controls");
    expect(video.attributes()).toHaveProperty("playsinline");
    expect(video.attributes("preload")).toBe("metadata");
    expect(video.attributes()).not.toHaveProperty("autoplay");
    expect(video.attributes()).not.toHaveProperty("loop");
  });

  it("renders video with autoplay, loop, muted, and preload='auto' when loop is true", () => {
    const wrapper = factory({ loop: true });
    const video = wrapper.find("video");
    expect(video.attributes()).toHaveProperty("controls");
    expect(video.attributes()).toHaveProperty("playsinline");
    expect(video.attributes()).toHaveProperty("autoplay");
    expect(video.attributes()).toHaveProperty("loop");
    expect(video.element.muted).toBe(true);
    expect(video.attributes("preload")).toBe("auto");
  });
});
