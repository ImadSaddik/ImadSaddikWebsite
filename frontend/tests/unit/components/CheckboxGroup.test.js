import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CheckboxGroup from "@/components/CheckboxGroup.vue";

const buildOptions = () => [
  { label: "Vue", value: "vue", count: 10 },
  { label: "FastAPI", value: "fastapi", count: 7 },
];

describe("CheckboxGroup", () => {
  it("renders fallback message when options are empty", () => {
    const wrapper = mount(CheckboxGroup, { props: { options: [] } });
    expect(wrapper.text()).toContain("No options available");
  });

  it("toggles selection and emits updated model", async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: buildOptions(),
        modelValue: ["vue"],
      },
    });

    await wrapper.findAll("li")[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([["vue", "fastapi"]]);

    await wrapper.findAll("li")[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")[1]).toEqual([[]]);
  });

  it("renders option labels with counts", () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options: buildOptions() },
    });

    const labels = wrapper.findAll("label");
    labels.forEach((label, index) => {
      expect(label.text()).toContain(buildOptions()[index].label);
      expect(label.text()).toContain(`(${buildOptions()[index].count})`);
    });
  });

  it("checks the checkbox for selected values", () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: buildOptions(),
        modelValue: ["fastapi"],
      },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      if (buildOptions()[index].value === "fastapi") {
        expect(checkbox.element.checked).toBe(true);
      } else {
        expect(checkbox.element.checked).toBe(false);
      }
    });
  });
});
