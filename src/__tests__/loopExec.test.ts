import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../index";

describe("RegExt - loopExec", () => {
  let regex: RegExt;

  beforeEach(() => {
    regex = new RegExt("a(b)c", "g");
  });

  it("should return all matches when pattern is found", () => {
    const result = regex.loopExec("abc abc abc");
    expect(result).toHaveLength(3);
    expect(result![0][0]).toBe("abc");
    expect(result![0][1]).toBe("b");
    expect(result![1][0]).toBe("abc");
    expect(result![1][1]).toBe("b");
    expect(result![2][0]).toBe("abc");
    expect(result![2][1]).toBe("b");
  });

  it("should return null when no pattern is found", () => {
    const result = regex.loopExec("def def def");
    expect(result).toBeNull();
  });

  it("should handle non-global regex with match", () => {
    const nonGlobalRegex = new RegExt("\\d+");
    const result = nonGlobalRegex.loopExec("123 456");
    expect(result).toHaveLength(1);
    expect(result![0][0]).toBe("123");
  });

  it("should handle non-global regex without match", () => {
    const nonGlobalRegex = new RegExt("\\d+");
    const result = nonGlobalRegex.loopExec("abc def");
    expect(result).toBeNull();
  });

  it("should handle empty pattern without global flag", () => {
    const emptyRegex = new RegExt("");
    const result = emptyRegex.loopExec("abc");
    expect(result).toHaveLength(1);
    expect(result![0][0]).toBe("");
  });

  it("should handle empty pattern without global flag on empty string", () => {
    const emptyRegex = new RegExt("");
    const result = emptyRegex.loopExec("");
    expect(result).toHaveLength(1);
    expect(result![0][0]).toBe("");
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

    it("should handle empty pattern with lastIndex reset", () => {
      // Empty pattern always matches, lastIndex should be reset to 0
      const emptyPatternRegex = new RegExt("", "g");
      emptyPatternRegex.lastIndex = 10;
      const result = emptyPatternRegex.loopExec("abc");
      expect(result).not.toBeNull();
      expect(result?.[0][0]).toBe("");
    });

    it("should handle patterns that match entire input", () => {
      const fullMatchRegex = new RegExt(".*", "g");
      const result = fullMatchRegex.loopExec("abc");
      expect(result).toHaveLength(2);
      expect(result?.[0][0]).toBe("abc");
      expect(result?.[1][0]).toBe("");
    });

    it("should handle moderately long strings", () => {
      const regex = new RegExt("a+", "g");
      const longString = "a".repeat(1000);

      const result = regex.loopExec(longString);
      expect(result).toHaveLength(1);
      expect(result![0][0]).toBe(longString);
    });

    it("should handle null and undefined inputs", () => {
      const regex = new RegExt("\\d+", "g");

      expect(() => regex.loopExec(null as any)).toThrow();
      expect(() => regex.loopExec(undefined as any)).toThrow();
    });
  });
});
