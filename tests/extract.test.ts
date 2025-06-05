import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - extract", () => {
  it("should extract all matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.extract("123 456 789");
    expect(result).toEqual(["123", "456", "789"]);
  });

  it("should return empty array when no matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.extract("abc def ghi");
    expect(result).toEqual([]);
  });

  it("should handle empty string input", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.extract("");
    expect(result).toEqual([]);
  });

  it("should handle overlapping potential matches", () => {
    const overlapRegex = new RegExt("a+", "g");
    const result = overlapRegex.extract("aaa bbb aaa");
    expect(result).toEqual(["aaa", "aaa"]);
  });
});
