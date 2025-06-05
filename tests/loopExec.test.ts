import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - loopExec", () => {
  let regex;

  beforeEach(() => {
    regex = new RegExt("a(b)c", "g");
  });

  it("should return all matches when pattern is found", () => {
    const result = regex.loopExec("abc abc abc");
    expect(result).toHaveLength(3);
    expect(result[0][0]).toBe("abc");
    expect(result[0][1]).toBe("b");
    expect(result[1][0]).toBe("abc");
    expect(result[1][1]).toBe("b");
    expect(result[2][0]).toBe("abc");
    expect(result[2][1]).toBe("b");
  });

  it("should return null when no pattern is found", () => {
    const result = regex.loopExec("def def def");
    expect(result).toBeNull();
  });

  describe("edge cases", () => {
    it("should return null for an empty string", () => {
      const result = regex.loopExec("");
      expect(result).toBeNull();
    });

    it("should handle empty pattern correctly", () => {
      const emptyPatternRegex = new RegExt("", "g");
      const result = emptyPatternRegex.loopExec("abc");
      expect(result).toHaveLength(1);
      expect(result?.[0][0]).toBe("");
    });

    it("should handle special characters correctly", () => {
      const specialCharRegex = new RegExt("\\d+", "g");
      const result = specialCharRegex.loopExec("123 456 789");
      expect(result).toHaveLength(3);
      expect(result?.[0][0]).toBe("123");
      expect(result?.[1][0]).toBe("456");
      expect(result?.[2][0]).toBe("789");
    });

    it("should be case-sensitive by default", () => {
      const caseSensitiveRegex = new RegExt("abc", "g");
      const result = caseSensitiveRegex.loopExec("ABC abc");
      expect(result).toHaveLength(1);
      expect(result?.[0][0]).toBe("abc");
    });

    it("should handle case-insensitive flag correctly", () => {
      const caseInsensitiveRegex = new RegExt("abc", "gi");
      const result = caseInsensitiveRegex.loopExec("ABC abc");
      expect(result).toHaveLength(2);
      expect(result?.[0][0]).toBe("ABC");
      expect(result?.[1][0]).toBe("abc");
    });

    it("should not enter an infinite loop with zero-length matches", () => {
      const zeroLengthRegex = new RegExt("a*", "g");
      const result = zeroLengthRegex.loopExec("aaa");
      expect(result).toHaveLength(2);
      expect(result?.[0][0]).toBe("aaa");
      expect(result?.[1][0]).toBe("");
    });

    it("should handle empty pattern at position boundary correctly", () => {
      const emptyPatternRegex = new RegExt("", "g");
      const result = emptyPatternRegex.loopExec("a");
      expect(result).toHaveLength(1);
      expect(result?.[0][0]).toBe("");
      expect(result?.[0].index).toBe(0);
    });

    it("should handle empty pattern with no match", () => {
      // Create a regex that would result in no match even with empty pattern
      const emptyPatternRegex = new RegExt("", "g");
      // Set lastIndex to beyond the string length to force null match
      emptyPatternRegex.lastIndex = 10;
      const result = emptyPatternRegex.loopExec("abc");
      expect(result).toBeNull();
    });

    it("should handle patterns that match entire input", () => {
      const fullMatchRegex = new RegExt(".*", "g");
      const result = fullMatchRegex.loopExec("abc");
      expect(result).toHaveLength(2);
      expect(result?.[0][0]).toBe("abc");
      expect(result?.[1][0]).toBe("");
    });
  });
});
