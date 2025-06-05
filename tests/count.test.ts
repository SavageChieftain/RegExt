import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - count", () => {
  it("should count all matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.count("123 456 789");
    expect(result).toBe(3);
  });

  it("should return 0 when no matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.count("abc def ghi");
    expect(result).toBe(0);
  });

  it("should handle empty string", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.count("");
    expect(result).toBe(0);
  });

  it("should count zero-length matches correctly", () => {
    const emptyRegex = new RegExt("", "g");
    const result = emptyRegex.count("abc");
    expect(result).toBe(1);
  });
});
