import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useArticleContent } from "@/composables/useArticleContent";
import { useRoute } from "vue-router";
import { calculateReadingTime } from "@/utils";
import { DEFAULT_ARTICLE_TITLE } from "@/constants";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

vi.mock("@/utils", () => ({
  calculateReadingTime: vi.fn(),
}));

const TestComponent = {
  props: ["title", "content"],
  setup(props, { emit }) {
    return useArticleContent({
      title: props.title,
      content: props.content,
      emit,
    });
  },
  template: "<div></div>",
};

describe("useArticleContent", () => {
  const MOCK_SLUG = "how-to-fix-kernel-panic";

  beforeEach(() => {
    vi.clearAllMocks();

    useRoute.mockReturnValue({
      params: { slug: MOCK_SLUG },
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.title = "";
  });

  it("sets the document title correctly when provided", () => {
    const title = "My awesome article";

    mount(TestComponent, {
      props: { title, content: "Some content" },
    });

    expect(document.title).toBe(title);
  });

  it("falls back to the default title if none is provided", () => {
    mount(TestComponent, {
      props: { title: "", content: "Some content" },
    });

    expect(document.title).toBe(DEFAULT_ARTICLE_TITLE);
  });

  it("calculates the slug from the route", () => {
    const wrapper = mount(TestComponent, {
      props: { title: "Test", content: "Content" },
    });

    expect(wrapper.vm.slug).toBe(MOCK_SLUG);
  });

  it("calculates reading time and sets a timer to emit 'article-read'", async () => {
    const MOCK_READING_TIME = 10;
    calculateReadingTime.mockReturnValue(MOCK_READING_TIME);

    const wrapper = mount(TestComponent, {
      props: { title: "Test", content: "Long content string" },
    });

    expect(calculateReadingTime).toHaveBeenCalledWith("Long content string");
    expect(wrapper.vm.readingTime).toBe(MOCK_READING_TIME);

    const EXPECTED_DELAY = MOCK_READING_TIME * 0.25 * 60 * 1000;

    vi.advanceTimersByTime(EXPECTED_DELAY);

    expect(wrapper.emitted("article-read")).toBeTruthy();
    expect(wrapper.emitted("article-read")).toHaveLength(1);
  });

  it("does not crash or set a timer if content is missing", () => {
    const wrapper = mount(TestComponent, {
      props: { title: "Test", content: null },
    });

    expect(calculateReadingTime).not.toHaveBeenCalled();
    expect(wrapper.vm.readingTime).toBe(0);

    vi.advanceTimersByTime(1000000);

    expect(wrapper.emitted("article-read")).toBeFalsy();
  });

  it("cleans up the timer on unmount (prevents memory leaks)", () => {
    calculateReadingTime.mockReturnValue(10);

    const wrapper = mount(TestComponent, {
      props: { title: "Test", content: "Content" },
    });

    wrapper.unmount();

    vi.advanceTimersByTime(200000);

    expect(wrapper.emitted("article-read")).toBeFalsy();
  });
});
