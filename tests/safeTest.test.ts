import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - safeTest", () => {
  let regex: RegExt;

  beforeEach(() => {
    regex = new RegExt("a(b)c", "g");
  });

  it("should return true when pattern is found", () => {
    const result = regex.safeTest("abc");
    expect(result).toBe(true);
  });

  it("should return false when no pattern is found", () => {
    const result = regex.safeTest("def");
    expect(result).toBe(false);
  });

  it("should not change lastIndex after test", () => {
    regex.test("abc");
    const lastIndexBefore = regex.lastIndex;
    regex.safeTest("abc");
    expect(regex.lastIndex).toBe(lastIndexBefore);
  });

  describe("edge cases", () => {
    it("should return false for an empty string", () => {
      const result = regex.safeTest("");
      expect(result).toBe(false);
    });

    it("should handle empty pattern correctly", () => {
      const emptyPatternRegex = new RegExt("", "g");
      const result = emptyPatternRegex.safeTest("abc");
      expect(result).toBe(true);
    });

    it("should handle special characters correctly", () => {
      const specialCharRegex = new RegExt("\\d+", "g");
      const result = specialCharRegex.safeTest("123");
      expect(result).toBe(true);
    });

    it("should be case-sensitive by default", () => {
      const caseSensitiveRegex = new RegExt("abc", "g");
      const result = caseSensitiveRegex.safeTest("ABC");
      expect(result).toBe(false);
    });

    it("should handle case-insensitive flag correctly", () => {
      const caseInsensitiveRegex = new RegExt("abc", "gi");
      const result = caseInsensitiveRegex.safeTest("ABC");
      expect(result).toBe(true);
    });

    it("should match special characters correctly", () => {
      const specialCharRegex = new RegExt("\\$", "g");
      const result = specialCharRegex.safeTest("$");
      expect(result).toBe(true);
    });

    it("should handle multiple matches correctly", () => {
      const multipleMatchRegex = new RegExt("\\d+", "g");
      const result = multipleMatchRegex.safeTest("123 456");
      expect(result).toBe(true);
    });

    it("should handle long strings correctly", () => {
      const longStringRegex = new RegExt("a+", "g");
      const longString = "a".repeat(1000); // Adjusted to reasonable size
      const result = longStringRegex.safeTest(longString);
      expect(result).toBe(true);
    });

    it("should handle partial matches correctly", () => {
      const partialMatchRegex = new RegExt("abc", "g");
      const result = partialMatchRegex.safeTest("xyzabcxyz");
      expect(result).toBe(true);
    });

    it("should handle escape characters correctly", () => {
      const escapeCharRegex = new RegExt("\\\\", "g");
      const result = escapeCharRegex.safeTest("\\");
      expect(result).toBe(true);
    });

    it("should return false for non-matching string", () => {
      const nonMatchingRegex = new RegExt("abc", "g");
      const result = nonMatchingRegex.safeTest("def");
      expect(result).toBe(false);
    });

    it("should handle multiline strings correctly", () => {
      const multilineRegex = new RegExt("^abc", "gm");
      const result = multilineRegex.safeTest("abc\ndef\nabc");
      expect(result).toBe(true);
    });

    it("should handle Unicode characters correctly", () => {
      const unicodeRegex = new RegExt("\\u{1F600}", "gu");
      const result = unicodeRegex.safeTest("😀");
      expect(result).toBe(true);
    });

    it("should preserve lastIndex with multiple consecutive calls", () => {
      const testRegex = new RegExt("\\d+", "g");
      testRegex.lastIndex = 10;
      testRegex.safeTest("123 456 789");
      testRegex.safeTest("abc def ghi");
      expect(testRegex.lastIndex).toBe(10);
    });

    it("should handle null and undefined inputs", () => {
      const regex = new RegExt("\\d+", "g");

      expect(() => regex.safeTest(null as any)).toThrow();
      expect(() => regex.safeTest(undefined as any)).toThrow();
    });

    it("should handle dotAll flag", () => {
      const dotAllRegex = new RegExt("a.b", "gs");
      const text = "a\nb";

      const result = dotAllRegex.safeTest(text);
      expect(result).toBe(true);
    });
  });

  describe("with escape mode", () => {
    it("should match literal special characters when escape is true", () => {
      const regex = new RegExt("$100", { escape: true });
      expect(regex.safeTest("$100")).toBe(true);
      expect(regex.safeTest("100")).toBe(false);
    });

    it("should match literal dots when escape is true", () => {
      const regex = new RegExt("a.b", { escape: true });
      expect(regex.safeTest("a.b")).toBe(true);
      expect(regex.safeTest("axb")).toBe(false);
    });

    it("should match literal brackets when escape is true", () => {
      const regex = new RegExt("[abc]", { escape: true });
      expect(regex.safeTest("[abc]")).toBe(true);
      expect(regex.safeTest("a")).toBe(false);
    });

    it("should work with flags when escape is true", () => {
      const regex = new RegExt("$100", { escape: true, flags: "gi" });
      expect(regex.safeTest("$100")).toBe(true);
      expect(regex.safeTest("$100")).toBe(true);
    });

    it("should match literal asterisks when escape is true", () => {
      const regex = new RegExt("a*b", { escape: true });
      expect(regex.safeTest("a*b")).toBe(true);
      expect(regex.safeTest("ab")).toBe(false);
      expect(regex.safeTest("aab")).toBe(false);
    });

    it("should match literal plus signs when escape is true", () => {
      const regex = new RegExt("a+b", { escape: true });
      expect(regex.safeTest("a+b")).toBe(true);
      expect(regex.safeTest("ab")).toBe(false);
      expect(regex.safeTest("aab")).toBe(false);
    });
  });
});
