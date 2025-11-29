import { mount } from "@vue/test-utils";
import InlineButton from "@/components/InlineButton.vue";

describe("InlineButton", () => {
  const factory = (props = {}) =>
    mount(InlineButton, {
      props: {
        fontAwesomeIcon: "fa-solid fa-copy",
        label: "Copy code",
        ...props,
      },
    });

  it("renders icon class and label text", () => {
    const wrapper = factory();
    expect(wrapper.find("i").classes()).toContain("fa-solid");
    expect(wrapper.find("i").classes()).toContain("fa-copy");
    expect(wrapper.find("button").text()).toContain("Copy code");
  });

  it("emits button-clicked when clicked", async () => {
    const wrapper = factory();
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("button-clicked")).toHaveLength(1);
  });
});
