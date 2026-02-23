import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useArticleTracking } from "@/composables/useArticleTracking";

vi.mock("axios");

const mockShowToast = vi.fn();

const TestComponent = {
  setup() {
    return useArticleTracking();
  },
  template: "<div></div>",
};

function mountComponent() {
  return mount(TestComponent, {
    global: {
      provide: {
        showToast: mockShowToast,
      },
    },
  });
}

describe("useArticleTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("incrementViewCount", () => {
    it("calls the view count endpoint with the correct slug", async () => {
      axios.patch.mockResolvedValue({ data: { success: true } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementViewCount("my-article");

      expect(axios.patch).toHaveBeenCalledWith("/api/articles/my-article/increment-view-count", expect.any(Object));
    });

    it("returns data and shows no toast on success", async () => {
      axios.patch.mockResolvedValue({ data: { success: true, view_count: 123 } });
      const wrapper = mountComponent();

      const result = await wrapper.vm.incrementViewCount("my-article");

      expect(result).toEqual({ view_count: 123 });
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it("shows an error toast when the response has success: false", async () => {
      axios.patch.mockResolvedValue({ data: { success: false, message: "something went wrong" } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementViewCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to increment view count: something went wrong",
        type: "error",
      });
    });

    it("shows a rate limit warning toast on a 429 response", async () => {
      axios.patch.mockRejectedValue({ response: { status: 429 } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementViewCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Hold up! You're refreshing too much. Please wait a minute before trying again.",
        type: "warning",
      });
    });

    it("shows a generic error toast on other request failures", async () => {
      axios.patch.mockRejectedValue(new Error("network error"));
      const wrapper = mountComponent();

      await wrapper.vm.incrementViewCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to increment view count",
        type: "error",
      });
    });
  });

  describe("incrementReadCount", () => {
    it("calls the read count endpoint with the correct slug", async () => {
      axios.patch.mockResolvedValue({ data: { success: true } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementReadCount("my-article");

      expect(axios.patch).toHaveBeenCalledWith("/api/articles/my-article/increment-read-count", expect.any(Object));
    });

    it("returns data and shows no toast on success", async () => {
      axios.patch.mockResolvedValue({ data: { success: true, read_count: 369 } });
      const wrapper = mountComponent();

      const result = await wrapper.vm.incrementReadCount("my-article");

      expect(result).toEqual({ read_count: 369 });
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it("shows a rate limit warning toast on a 429 response", async () => {
      axios.patch.mockRejectedValue({ response: { status: 429 } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementReadCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Slow down! You're reading too fast. Please wait a minute before trying again.",
        type: "warning",
      });
    });

    it("shows a generic error toast on other request failures", async () => {
      axios.patch.mockRejectedValue(new Error("network error"));
      const wrapper = mountComponent();

      await wrapper.vm.incrementReadCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to increment read count",
        type: "error",
      });
    });
  });

  describe("incrementClapCount", () => {
    it("calls the claps count endpoint with the correct slug", async () => {
      axios.patch.mockResolvedValue({ data: { success: true, claps_count: 42 } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementClapCount("my-article");

      expect(axios.patch).toHaveBeenCalledWith("/api/articles/my-article/increment-claps-count", expect.any(Object));
    });

    it("returns data from the response on success", async () => {
      axios.patch.mockResolvedValue({ data: { success: true, claps_count: 42 } });
      const wrapper = mountComponent();

      const result = await wrapper.vm.incrementClapCount("my-article");

      expect(result).toEqual({ claps_count: 42 });
    });

    it("shows an error toast when the response has success: false", async () => {
      axios.patch.mockResolvedValue({ data: { success: false, message: "limit reached" } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementClapCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to increment clap count: limit reached",
        type: "error",
      });
    });

    it("shows a rate limit warning toast on a 429 response", async () => {
      axios.patch.mockRejectedValue({ response: { status: 429 } });
      const wrapper = mountComponent();

      await wrapper.vm.incrementClapCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Woah there! You are hammering the button too fast. Please wait a minute before clapping again.",
        type: "warning",
      });
    });

    it("returns null on request failure", async () => {
      axios.patch.mockRejectedValue(new Error("network error"));
      const wrapper = mountComponent();

      const result = await wrapper.vm.incrementClapCount("my-article");

      expect(result).toBeNull();
    });
  });

  describe("fetchInitialClapCount", () => {
    it("calls the correct endpoint with the given slug", async () => {
      axios.get.mockResolvedValue({ data: { success: true, claps_count: 10 } });
      const wrapper = mountComponent();

      await wrapper.vm.fetchInitialClapCount("my-article");

      expect(axios.get).toHaveBeenCalledWith("/api/articles/my-article/claps-count");
    });

    it("returns the clap count on success", async () => {
      axios.get.mockResolvedValue({ data: { success: true, claps_count: 10 } });
      const wrapper = mountComponent();

      const result = await wrapper.vm.fetchInitialClapCount("my-article");

      expect(result).toBe(10);
      expect(mockShowToast).not.toHaveBeenCalled();
    });

    it("shows an error toast and returns null when success is false", async () => {
      axios.get.mockResolvedValue({ data: { success: false } });
      const wrapper = mountComponent();

      const result = await wrapper.vm.fetchInitialClapCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to fetch initial clap count",
        type: "error",
      });
      expect(result).toBeNull();
    });

    it("shows an error toast and returns null on request failure", async () => {
      axios.get.mockRejectedValue(new Error("network error"));
      const wrapper = mountComponent();

      const result = await wrapper.vm.fetchInitialClapCount("my-article");

      expect(mockShowToast).toHaveBeenCalledWith({
        message: "Failed to fetch initial clap count",
        type: "error",
      });
      expect(result).toBeNull();
    });
  });
});
