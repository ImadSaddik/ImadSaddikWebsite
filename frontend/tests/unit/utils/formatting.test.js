import { describe, it, expect } from "vitest";
import { calculateReadingTime, convertUnixTimestampToReadableFormat } from "@/utils";

describe("calculateReadingTime", () => {
  it("rounds up reading time based on words per minute", () => {
    const text = "word ".repeat(250);
    expect(calculateReadingTime(text)).toBe(2);
  });
});

describe("convertUnixTimestampToReadableFormat", () => {
  it("formats timestamps using locale rules", () => {
    const timestamp = 1732838400;
    expect(convertUnixTimestampToReadableFormat(timestamp)).toBe("November 29, 2024");
  });
});
