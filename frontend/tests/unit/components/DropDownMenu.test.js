import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DropDownMenu from "@/components/DropDownMenu.vue";

const buildOptions = () => [
  { label: "JavaScript", value: "js" },
  { label: "Python", value: "py" },
];

describe("DropDownMenu", () => {
  it("renders placeholder text when nothing is selected", () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
        placeholder: "Pick a language",
      },
    });

    expect(wrapper.find(".dropdown-label").text()).toBe("Pick a language");
  });

  it("emits selection and closes menu", async () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
      },
    });

    await wrapper.find("button").trigger("click");
    await wrapper.findAll("li")[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["py"]);
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("displays selected option label when modelValue is set", () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
        modelValue: "js",
      },
    });

    expect(wrapper.find(".dropdown-label").text()).toBe("JavaScript");
    expect(wrapper.find(".dropdown-label").classes()).not.toContain("is-placeholder");
  });

  it("toggles dropdown open/closed on button click", async () => {
    const wrapper = mount(DropDownMenu, {
      props: { options: buildOptions() },
    });

    expect(wrapper.find(".dropdown-menu").exists()).toBe(false);
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".dropdown-menu").exists()).toBe(true);
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".dropdown-menu").exists()).toBe(false);
  });

  it("shows clear icon when clearable and value is set", () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
        modelValue: "py",
        clearable: true,
      },
    });

    expect(wrapper.find(".dropdown-clear").exists()).toBe(true);
  });

  it("emits empty string when clear icon is clicked", async () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
        modelValue: "py",
        clearable: true,
      },
    });

    await wrapper.find(".dropdown-clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([""]);
  });

  it("closes menu when clicking outside", async () => {
    const wrapper = mount(DropDownMenu, {
      props: { options: buildOptions() },
      attachTo: document.body,
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);

    const clickOutsideEvent = new MouseEvent("click", { bubbles: true });
    document.body.dispatchEvent(clickOutsideEvent);

    expect(wrapper.vm.isOpen).toBe(false);
    wrapper.unmount();
  });

  it("selects option with Enter key", async () => {
    const wrapper = mount(DropDownMenu, {
      props: { options: buildOptions() },
    });

    await wrapper.find("button").trigger("click");
    await wrapper.findAll("li")[0].trigger("keydown.enter");

    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["js"]);
  });

  it("marks selected option with is-selected class", async () => {
    const wrapper = mount(DropDownMenu, {
      props: {
        options: buildOptions(),
        modelValue: "py",
      },
    });

    await wrapper.find("button").trigger("click");
    const options = wrapper.findAll("li");
    options.forEach((option, index) => {
      if (buildOptions()[index].value === "py") {
        expect(option.classes()).toContain("is-selected");
      } else {
        expect(option.classes()).not.toContain("is-selected");
      }
    });
  });
});
