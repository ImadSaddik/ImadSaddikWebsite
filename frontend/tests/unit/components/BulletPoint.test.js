import { mount } from "@vue/test-utils";
import BulletPoint from "@/components/BulletPoint.vue";

describe("BulletPoint", () => {
  it("renders slot content", () => {
    const wrapper = mount(BulletPoint, {
      slots: {
        default: "This is a bullet point item",
      },
    });
    expect(wrapper.find("span").text()).toBe("This is a bullet point item");
  });

  it("renders the stars icon", () => {
    const wrapper = mount(BulletPoint);
    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.find("img").attributes("alt")).toBe("A galaxy icon");
  });
});
