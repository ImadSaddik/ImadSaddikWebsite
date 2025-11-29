import { mount } from "@vue/test-utils";
import CodeOutput from "@/components/CodeOutput.vue";

describe("CodeOutput", () => {
  it("renders the code output in a pre/code block", () => {
    const output = "Hello, World!\nLine 2";
    const wrapper = mount(CodeOutput, { props: { codeOutput: output } });
    expect(wrapper.find("pre.code-output-container").exists()).toBe(true);
    expect(wrapper.find("code").text()).toBe(output);
  });

  it("raises an error when no code output is provided", () => {
    try {
      mount(CodeOutput);
    } catch (e) {
      expect(e.message).toContain('Missing required prop: "codeOutput"');
    }
  });
});
