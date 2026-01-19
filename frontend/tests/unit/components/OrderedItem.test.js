import { mount } from "@vue/test-utils";
import OrderedItem from "@/components/OrderedItem.vue";
import OrderedList from "@/components/OrderedList.vue";

describe("OrderedItem", () => {
  it("renders slot content", () => {
    const wrapper = mount(OrderedItem, {
      slots: {
        default: "This is an ordered item",
      },
    });
    expect(wrapper.find("span").text()).toBe("This is an ordered item");
  });

  it("renders the step number SVG container", () => {
    const wrapper = mount(OrderedItem);
    const stepNumberDiv = wrapper.find(".step-number");
    expect(stepNumberDiv.exists()).toBe(true);
  });

  it("updates item number based on position in ordered list", async () => {
    const wrapper = mount({
      template: `
          <OrderedList>
            <OrderedItem>First item</OrderedItem>
            <OrderedItem>Second item</OrderedItem>
            <OrderedItem>Third item</OrderedItem>
          </OrderedList>
        `,
      components: { OrderedList, OrderedItem },
    });

    await wrapper.vm.$nextTick();

    const items = wrapper.findAllComponents(OrderedItem);
    expect(items).toHaveLength(3);

    items.forEach((item, index) => {
      expect(item.vm.itemNumber).toBe(index + 1);
    });
  });

  it("has correct CSS classes", () => {
    const wrapper = mount(OrderedItem);
    expect(wrapper.find(".ordered-item").exists()).toBe(true);
    expect(wrapper.find(".step-number").exists()).toBe(true);
  });
});
