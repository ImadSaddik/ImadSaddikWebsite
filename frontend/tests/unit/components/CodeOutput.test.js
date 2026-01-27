import { mount } from "@vue/test-utils";
import CodeOutput from "@/components/CodeOutput.vue";

describe("CodeOutput", () => {
  it("renders the code output in a pre/code block", () => {
    const output = "Hello, World!\nLine 2";
    const wrapper = mount(CodeOutput, { props: { codeOutput: output } });
    expect(wrapper.find("pre.code-output-container").exists()).toBe(true);
    expect(wrapper.find("code").text()).toBe(output);
  });

  it("warns when no code output is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(CodeOutput);
    expect(warn).toHaveBeenCalled();
    const warningMessage = warn.mock.calls.flat().join(" ");
    expect(warningMessage).toContain('Missing required prop: "codeOutput"');
    warn.mockRestore();
  });
});
