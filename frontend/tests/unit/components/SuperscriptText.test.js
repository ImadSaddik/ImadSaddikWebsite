import { mount } from "@vue/test-utils";
import SuperscriptText from "@/components/SuperscriptText.vue";

describe("SuperscriptText", () => {
  it("renders string text in superscript", () => {
    const wrapper = mount(SuperscriptText, { props: { text: "TM" } });
    expect(wrapper.find("sup").text()).toBe("TM");
  });

  it("renders numeric text in superscript", () => {
    const wrapper = mount(SuperscriptText, { props: { text: 2 } });
    expect(wrapper.find("sup").text()).toBe("2");
  });
});
