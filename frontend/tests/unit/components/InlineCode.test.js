import { mount } from "@vue/test-utils";
import InlineCode from "@/components/InlineCode.vue";

describe("InlineCode", () => {
  it("renders the text prop as text content", () => {
    const wrapper = mount(InlineCode, { props: { text: "-f ~/.ssh/<your_key_name>" } });
    expect(wrapper.text()).toBe("-f ~/.ssh/<your_key_name>");
  });

  it("escapes HTML tags in text prop", () => {
    const wrapper = mount(InlineCode, { props: { text: "<strong>code</strong>" } });
    expect(wrapper.text()).toBe("<strong>code</strong>");
    expect(wrapper.find("strong").exists()).toBe(false);
  });
});
