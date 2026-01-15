import { describe, it, expect } from "vitest";
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

  it("should return empty array for null loopExec result", () => {
    const regex = new RegExt("\\d+", "g");
    const result = regex.extract("abc");
    expect(result).toEqual([]);
  });

  it("should handle multiline patterns", () => {
    const multilineRegex = new RegExt("^\\d+", "gm");
    const text = "123\n456\nabc\n789";

    const matches = multilineRegex.extract(text);
    expect(matches).toEqual(["123", "456", "789"]);
  });

  it("should handle case-insensitive patterns", () => {
    const caseInsensitiveRegex = new RegExt("abc", "gi");
    const text = "ABC abc Abc";

    const matches = caseInsensitiveRegex.extract(text);
    expect(matches).toEqual(["ABC", "abc", "Abc"]);
  });

  describe("with escape mode", () => {
    it("should extract literal strings when escape is true", () => {
      const regex = new RegExt("$100", { escape: true, flags: "g" });
      const result = regex.extract("I have $100 and $100 more");
      expect(result).toEqual(["$100", "$100"]);
    });

    it("should not extract regex patterns when escape is true", () => {
      const regex = new RegExt("a.b", { escape: true, flags: "g" });
      const result = regex.extract("a.b axb");
      expect(result).toEqual(["a.b"]);
    });

    it("should work with other flags when escape is true", () => {
      const regex = new RegExt("$100", { escape: true, flags: "gi" });
      const result = regex.extract("I have $100 and $100 more");
      expect(result).toEqual(["$100", "$100"]);
    });

    it("should extract multiple literal special characters", () => {
      const regex = new RegExt("a*b", { escape: true, flags: "g" });
      const result = regex.extract("a*b ab a*b");
      expect(result).toEqual(["a*b", "a*b"]);
    });
  });
});
