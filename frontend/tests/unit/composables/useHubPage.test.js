import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useHubPage } from "@/composables/useHubPage";
import { trackVisitorData } from "@/utils";

vi.mock("@/utils", () => ({
  trackVisitorData: vi.fn(),
}));

const TestComponent = {
  setup(props, { emit }) {
    useHubPage({
      pageKey: "TEST_PAGE_KEY",
      title: "Test page title",
      emit,
    });
    return {};
  },
  template: "<div></div>",
};

describe("useHubPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.title = "";
  });

  it("sets the document title on mount", () => {
    mount(TestComponent);
    expect(document.title).toBe("Test page title");
  });

  it("emits the 'page-visited' event with the correct key", () => {
    const wrapper = mount(TestComponent);

    expect(wrapper.emitted("page-visited")).toBeTruthy();
    expect(wrapper.emitted("page-visited")[0]).toEqual(["TEST_PAGE_KEY"]);
  });

  it("calls the analytics tracker with the correct key", () => {
    mount(TestComponent);
    expect(trackVisitorData).toHaveBeenCalledTimes(1);
    expect(trackVisitorData).toHaveBeenCalledWith("TEST_PAGE_KEY");
  });
});
