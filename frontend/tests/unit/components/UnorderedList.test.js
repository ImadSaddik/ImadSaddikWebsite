import { mount } from "@vue/test-utils";
import UnorderedList from "@/components/UnorderedList.vue";
import UnorderedItem from "@/components/UnorderedItem.vue";

describe("UnorderedList", () => {
  it("renders slot content", () => {
    const wrapper = mount(UnorderedList, {
      slots: {
        default: "<p>List content</p>",
      },
    });
    expect(wrapper.find("p").text()).toBe("List content");
  });

  it("renders multiple UnorderedItem children", () => {
    const wrapper = mount({
      template: `
          <UnorderedList>
            <UnorderedItem>Item 1</UnorderedItem>
            <UnorderedItem>Item 2</UnorderedItem>
            <UnorderedItem>Item 3</UnorderedItem>
          </UnorderedList>
        `,
      components: { UnorderedList, UnorderedItem },
    });

    const items = wrapper.findAllComponents(UnorderedItem);
    expect(items).toHaveLength(3);
  });

  it("is a container for unordered items", () => {
    const wrapper = mount({
      template: `
          <UnorderedList>
            <UnorderedItem>First step</UnorderedItem>
            <UnorderedItem>Second step</UnorderedItem>
          </UnorderedList>
        `,
      components: { UnorderedList, UnorderedItem },
    });

    const list = wrapper.findComponent(UnorderedList);
    expect(list.exists()).toBe(true);

    const items = wrapper.findAllComponents(UnorderedItem);
    expect(items).toHaveLength(2);

    items.forEach((item) => {
      expect(item.element.parentElement).toBe(list.element);
    });
  });

  it("renders with correct CSS class", () => {
    const wrapper = mount(UnorderedList);
    expect(wrapper.find(".unordered-list").exists()).toBe(true);
  });
});
