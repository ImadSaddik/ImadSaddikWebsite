import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { trackVisitorData } from "@/utils";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("trackVisitorData", () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  it("posts payload to visitors API", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    await trackVisitorData("home");
    expect(axios.post).toHaveBeenCalledWith("/api/visitors/track", { visited_page: "home" });
  });

  it("swallows errors", async () => {
    axios.post.mockRejectedValue(new Error("Bot bot bot!"));
    await expect(trackVisitorData("home")).resolves.toBeUndefined();
  });
});
