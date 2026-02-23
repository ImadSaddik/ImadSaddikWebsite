import { mount } from "@vue/test-utils";
import UnorderedItem from "@/components/UnorderedItem.vue";
import UnorderedList from "@/components/UnorderedList.vue";

describe("UnorderedItem", () => {
  it("renders slot content", () => {
    const wrapper = mount(UnorderedItem, {
      slots: {
        default: "This is an unordered item",
      },
    });
    expect(wrapper.find("span").text()).toBe("This is an unordered item");
  });

  it("renders the stars icon image", () => {
    const wrapper = mount(UnorderedItem);
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("A galaxy icon");
  });

  it("renders multiple UnorderedItem children inside UnorderedList", () => {
    const wrapper = mount({
      template: `
          <UnorderedList>
            <UnorderedItem>First item</UnorderedItem>
            <UnorderedItem>Second item</UnorderedItem>
            <UnorderedItem>Third item</UnorderedItem>
          </UnorderedList>
        `,
      components: { UnorderedList, UnorderedItem },
    });

    const items = wrapper.findAllComponents(UnorderedItem);
    expect(items).toHaveLength(3);
  });

  it("has correct CSS classes", () => {
    const wrapper = mount(UnorderedItem);
    expect(wrapper.find(".unordered-item").exists()).toBe(true);
  });
});
