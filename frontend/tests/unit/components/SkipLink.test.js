import { mount } from "@vue/test-utils";
import SkipLink from "@/components/SkipLink.vue";

describe("SkipLink", () => {
  it("renders the skip link with correct href", () => {
    const wrapper = mount(SkipLink);
    const link = wrapper.find("a.skip-link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("#skip-link");
    expect(link.text()).toBe("Skip to main content");
  });

  it("has accessible text", () => {
    const wrapper = mount(SkipLink);
    expect(wrapper.find("a").text()).toBe("Skip to main content");
  });
});
