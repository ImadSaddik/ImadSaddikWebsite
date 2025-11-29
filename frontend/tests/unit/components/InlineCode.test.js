import { mount } from "@vue/test-utils";
import InlineCode from "@/components/InlineCode.vue";

describe("InlineCode", () => {
  it("renders the text prop as inner HTML", () => {
    const wrapper = mount(InlineCode, { props: { text: "<strong>code</strong>" } });
    expect(wrapper.find("code").html()).toContain("<strong>code</strong>");
  });
});
