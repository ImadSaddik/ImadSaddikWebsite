import { describe, it, expect, vi, afterEach } from "vitest";
import { getLunarPhaseData } from "@/utils";

describe("getLunarPhaseData", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates accurate phase for a known New Moon (0%)", () => {
    const newMoonDate = new Date("2025-10-21T12:59:00Z");
    vi.setSystemTime(newMoonDate);

    const data = getLunarPhaseData();

    expect(data.percentage).toBe(0);
    expect(data.dayIndex).toBe(1);
  });

  it("calculates accurate phase for a known Full Moon (100%)", () => {
    const fullMoonDate = new Date("2025-11-05T13:19:00Z");
    vi.setSystemTime(fullMoonDate);

    const data = getLunarPhaseData();

    expect(data.percentage).toBe(100);
    expect(data.dayIndex).toBe(15);
  });

  it("handles the complex First Quarter correctly", () => {
    const firstQuarterDate = new Date("2025-10-29T16:00:00Z");
    vi.setSystemTime(firstQuarterDate);

    const data = getLunarPhaseData();

    expect(data.percentage).toBe(50);
    expect(data.dayIndex).toBe(8);
  });
});
