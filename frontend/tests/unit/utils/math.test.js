import { describe, it, expect } from "vitest";
import { toRadians, normalizeAngle } from "@/utils";

describe("math utils", () => {
  describe("toRadians", () => {
    it("converts degrees to radians correctly", () => {
      expect(toRadians(0)).toBe(0);
      expect(toRadians(180)).toBe(Math.PI);
      expect(toRadians(360)).toBe(2 * Math.PI);
      expect(toRadians(90)).toBeCloseTo(1.5708, 4);
    });
  });

  describe("normalizeAngle", () => {
    it("returns the same angle if it is within 0-360", () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(45)).toBe(45);
      expect(normalizeAngle(359.9)).toBe(359.9);
    });

    it("wraps angles larger than 360", () => {
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(361)).toBe(1);
      expect(normalizeAngle(720)).toBe(0);
      expect(normalizeAngle(725)).toBe(5);
    });

    it("wraps negative angles correctly (The critical test)", () => {
      expect(normalizeAngle(-1)).toBe(359);
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-360)).toBe(0);
      expect(normalizeAngle(-361)).toBe(359);
    });
  });
});
