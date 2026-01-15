import { describe, it, expect } from "vitest";
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

  it("should return 0 for null loopExec result", () => {
    const regex = new RegExt("\\d+", "g");
    const result = regex.count("abc");
    expect(result).toBe(0);
  });

  describe("with escape mode", () => {
    it("should count literal strings when escape is true", () => {
      const regex = new RegExt("$100", { escape: true, flags: "g" });
      const result = regex.count("I have $100 and $100 more");
      expect(result).toBe(2);
    });
  });
});
