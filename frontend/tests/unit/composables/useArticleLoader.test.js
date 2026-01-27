import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useArticleLoader } from "@/composables/useArticleLoader";
import { useRouter } from "vue-router";
import { PAGE_KEYS } from "@/constants";
import axios from "axios";

vi.mock("axios");
vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

const MOCK_SLUG = "valid-slug";
const MOCK_SECTION = "blogs";
const MOCK_REGISTRY = {
  [`/src/${MOCK_SECTION}/${MOCK_SLUG}/index.vue`]: Promise.resolve({ template: "<div>Content</div>" }),
};

const TestComponent = {
  props: ["slug"],
  setup(props, { emit }) {
    return useArticleLoader({
      props,
      registry: MOCK_REGISTRY,
      section: MOCK_SECTION,
      emit,
    });
  },
  template: "<div></div>",
};

describe("useArticleLoader", () => {
  let mockRouterReplace;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset router and axios mocks
    mockRouterReplace = vi.fn();
    useRouter.mockReturnValue({ replace: mockRouterReplace });
    axios.patch.mockResolvedValue({ data: { success: true } });
  });

  it("loads the component and tracks a view when the slug is valid", async () => {
    const wrapper = mount(TestComponent, {
      props: { slug: MOCK_SLUG },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.articleToDisplay).toBeTruthy();
    expect(axios.patch).toHaveBeenCalledWith(`/api/articles/${MOCK_SLUG}/increment-view-count`, expect.any(Object));
  });

  it("redirects to NotFound when the slug is invalid", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mount(TestComponent, {
      props: { slug: "invalid-slug-123" },
    });

    expect(mockRouterReplace).toHaveBeenCalledWith({ name: "NotFound" });
    expect(axios.patch).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Invalid blogs slug: invalid-slug-123");

    consoleSpy.mockRestore();
  });

  it("emits 'page-visited' on mount", () => {
    const wrapper = mount(TestComponent, {
      props: { slug: MOCK_SLUG },
    });

    expect(wrapper.emitted("page-visited")).toBeTruthy();
    expect(wrapper.emitted("page-visited")[0]).toEqual([PAGE_KEYS.OTHER]);
  });

  it("calls increment-read-count API when handleArticleRead is triggered", async () => {
    const wrapper = mount(TestComponent, {
      props: { slug: MOCK_SLUG },
    });

    await wrapper.vm.handleArticleRead();
    expect(axios.patch).toHaveBeenCalledWith(`/api/articles/${MOCK_SLUG}/increment-read-count`, expect.any(Object));
  });

  it("shows an error toast if the API call fails (Network error)", async () => {
    axios.patch.mockRejectedValue(new Error("Network error"));

    const wrapper = mount(TestComponent, {
      props: { slug: MOCK_SLUG },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("show-toast")).toBeTruthy();
    expect(wrapper.emitted("show-toast")[0][0]).toEqual(
      expect.objectContaining({
        type: "error",
        message: "Failed to increment view count",
      })
    );
  });

  it("shows an error toast if the API returns success: false (Backend error)", async () => {
    axios.patch.mockResolvedValue({
      data: { success: false, message: "Database offline" },
    });

    const wrapper = mount(TestComponent, {
      props: { slug: MOCK_SLUG },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("show-toast")).toBeTruthy();
    expect(wrapper.emitted("show-toast")[0][0].message).toContain("Database offline");
  });
});
