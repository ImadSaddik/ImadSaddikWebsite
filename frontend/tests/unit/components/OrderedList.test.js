import { mount } from "@vue/test-utils";
import OrderedList from "@/components/OrderedList.vue";
import OrderedItem from "@/components/OrderedItem.vue";

describe("OrderedList", () => {
  it("renders slot content", () => {
    const wrapper = mount(OrderedList, {
      slots: {
        default: "<p>List content</p>",
      },
    });
    expect(wrapper.find("p").text()).toBe("List content");
  });

  it("renders multiple OrderedItem children", () => {
    const wrapper = mount({
      template: `
          <OrderedList>
            <OrderedItem>Item 1</OrderedItem>
            <OrderedItem>Item 2</OrderedItem>
            <OrderedItem>Item 3</OrderedItem>
          </OrderedList>
        `,
      components: { OrderedList, OrderedItem },
    });

    const items = wrapper.findAllComponents(OrderedItem);
    expect(items).toHaveLength(3);
  });

  it("is a container for ordered items", () => {
    const wrapper = mount({
      template: `
          <OrderedList>
            <OrderedItem>First step</OrderedItem>
            <OrderedItem>Second step</OrderedItem>
          </OrderedList>
        `,
      components: { OrderedList, OrderedItem },
    });

    const list = wrapper.findComponent(OrderedList);
    expect(list.exists()).toBe(true);

    const items = wrapper.findAllComponents(OrderedItem);
    expect(items).toHaveLength(2);

    items.forEach((item) => {
      expect(item.element.parentElement).toBe(list.element);
    });
  });

  it("renders with correct CSS class", () => {
    const wrapper = mount(OrderedList);
    expect(wrapper.find(".ordered-list").exists()).toBe(true);
  });
});
