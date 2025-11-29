import { mount } from "@vue/test-utils";
import SearchBar from "@/components/SearchBar.vue";

describe("SearchBar", () => {
  const factory = (props = {}) =>
    mount(SearchBar, {
      props: {
        placeHolder: "Search for galaxies",
        modelValue: "",
        ...props,
      },
    });

  it("emits update:modelValue as the user types", async () => {
    const wrapper = factory();
    const input = wrapper.find(".search-input");
    await input.setValue("cosmos");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["cosmos"]);
  });

  it("clears the input and triggers perform-search when clicking the clear icon", async () => {
    const wrapper = factory({ modelValue: "nebula" });
    await wrapper.find(".search-clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([""]);
    expect(wrapper.emitted("perform-search")).toHaveLength(1);
  });

  it("emits perform-search when pressing Enter", async () => {
    const wrapper = factory();
    const input = wrapper.find(".search-input");
    await input.trigger("keydown.enter");
    expect(wrapper.emitted("perform-search")).toHaveLength(1);
  });
});
