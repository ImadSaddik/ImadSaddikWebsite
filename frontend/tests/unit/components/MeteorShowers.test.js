import { mount } from "@vue/test-utils";
import MeteorShowers from "@/components/MeteorShowers.vue";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("MeteorShowers", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      save: vi.fn(),
      restore: vi.fn(),
    }));

    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", vi.fn());
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders a canvas element", () => {
    const wrapper = mount(MeteorShowers);
    expect(wrapper.find("canvas#meteor-canvas").exists()).toBe(true);
  });

  it("pauses spawning and clears meteors when document is hidden", async () => {
    const wrapper = mount(MeteorShowers);
    wrapper.vm.meteors = [{ x: 10, y: 10, dx: 1, dy: 1, length: 10, lineWidth: 1, opacity: 1 }];

    const hiddenSpy = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    expect(wrapper.vm.meteors.length).toBe(0);

    vi.advanceTimersByTime(100000);
    expect(wrapper.vm.meteors.length).toBe(0);

    hiddenSpy.mockRestore();
  });

  it("resumes spawning when document is visible", async () => {
    const wrapper = mount(MeteorShowers);

    const hiddenSpy = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));

    hiddenSpy.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));

    vi.advanceTimersByTime(100000);
    expect(wrapper.vm.meteors.length).toBeGreaterThan(0);

    hiddenSpy.mockRestore();
  });
});
