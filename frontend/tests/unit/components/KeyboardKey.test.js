import { mount } from "@vue/test-utils";
import KeyboardKey from "@/components/KeyboardKey.vue";

describe("KeyboardKey", () => {
  it("renders a single key inside a kbd element", () => {
    const wrapper = mount(KeyboardKey, { props: { text: "F12" } });
    const kbd = wrapper.find("kbd.keyboard-key");
    expect(kbd.exists()).toBe(true);
    expect(kbd.text()).toBe("F12");
    expect(wrapper.find("kbd.keyboard-shortcut").exists()).toBe(false);
  });

  it("renders shortcut combinations with individual kbd keys and separators", () => {
    const wrapper = mount(KeyboardKey, { props: { text: "Ctrl+Shift+P" } });
    expect(wrapper.find("kbd.keyboard-shortcut").exists()).toBe(true);

    const keys = wrapper.findAll("kbd.keyboard-key");
    expect(keys).toHaveLength(3);
    expect(keys[0].text()).toBe("Ctrl");
    expect(keys[1].text()).toBe("Shift");
    expect(keys[2].text()).toBe("P");

    const separators = wrapper.findAll(".keyboard-separator");
    expect(separators).toHaveLength(2);
    expect(separators[0].text()).toBe("+");
  });

  it("handles literal plus sign '+' as a single key", () => {
    const wrapper = mount(KeyboardKey, { props: { text: "+" } });
    const kbd = wrapper.find("kbd.keyboard-key");
    expect(kbd.exists()).toBe(true);
    expect(kbd.text()).toBe("+");
    expect(wrapper.find("kbd.keyboard-shortcut").exists()).toBe(false);
  });

  it("trims whitespace around combined keys", () => {
    const wrapper = mount(KeyboardKey, { props: { text: "Ctrl + C" } });
    const keys = wrapper.findAll("kbd.keyboard-key");
    expect(keys).toHaveLength(2);
    expect(keys[0].text()).toBe("Ctrl");
    expect(keys[1].text()).toBe("C");
  });
});
