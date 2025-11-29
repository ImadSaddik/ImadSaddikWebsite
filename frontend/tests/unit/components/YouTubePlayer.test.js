import { mount } from "@vue/test-utils";
import YouTubePlayer from "@/components/YouTubePlayer.vue";

describe("YouTubePlayer", () => {
  const factory = (props = {}) =>
    mount(YouTubePlayer, {
      props: {
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        ...props,
      },
    });

  it("renders iframe with the correct video URL", () => {
    const wrapper = factory({ videoUrl: "https://www.youtube.com/embed/abc123" });
    expect(wrapper.find("iframe").attributes("src")).toBe("https://www.youtube.com/embed/abc123");
  });

  it("sets proper accessibility attributes on iframe", () => {
    const wrapper = factory();
    const iframe = wrapper.find("iframe");
    expect(iframe.attributes("title")).toBe("YouTube video player");
    expect(iframe.attributes("allowfullscreen")).toBeDefined();
  });

  it("defaults to empty string when no videoUrl provided", () => {
    const wrapper = mount(YouTubePlayer);
    expect(wrapper.find("iframe").attributes("src")).toBe("");
  });
});
