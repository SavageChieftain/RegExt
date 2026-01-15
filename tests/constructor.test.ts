import { describe, it, expect } from "vitest";
import RegExt from "../src/index";

describe("RegExt - constructor", () => {
  it("should store original pattern", () => {
    const testRegex = new RegExt("test", "g");
    expect(testRegex.originalPattern).toBe("test");
  });

  it("should work without flags", () => {
    const testRegex = new RegExt("test");
    expect(testRegex.source).toBe("test");
    expect(testRegex.flags).toBe("");
  });

  it("should inherit from RegExp", () => {
    const testRegex = new RegExt("test", "g");
    expect(testRegex).toBeInstanceOf(RegExp);
    expect(testRegex).toBeInstanceOf(RegExt);
  });

  it("should handle complex patterns", () => {
    const complexRegex = new RegExt("([a-z]+):(\\d+)", "gi");
    expect(complexRegex.originalPattern).toBe("([a-z]+):(\\d+)");
  });

  it("should handle escaped characters in pattern", () => {
    const escapedRegex = new RegExt("\\[\\d+\\]", "g");
    expect(escapedRegex.originalPattern).toBe("\\[\\d+\\]");
  });

  it("should handle RegExp with options object and flags", () => {
    const pattern = /test/i;
    const regex = new RegExt(pattern, { flags: "g" });
    expect(regex.global).toBe(true);
  });

  it("should handle RegExp with string flags", () => {
    const pattern = /test/;
    const regex = new RegExt(pattern, "gi");
    expect(regex.global).toBe(true);
    expect(regex.ignoreCase).toBe(true);
  });

  it("should handle RegExp with escape option (should ignore escape)", () => {
    const pattern = /\d+/;
    const regex = new RegExt(pattern, { escape: true, flags: "g" });
    expect(regex.test("123")).toBe(true);
  });

  it("should handle RegExp with options but no flags", () => {
    const pattern = /\d+/i;
    const regex = new RegExt(pattern, { escape: true });
    expect(regex.test("123")).toBe(true);
    expect(regex.ignoreCase).toBe(true);
    expect(regex.global).toBe(false);
  });

  it("should handle RegExp with empty options object", () => {
    const pattern = /abc/i;
    const regex = new RegExt(pattern, {});
    expect(regex.test("ABC")).toBe(true);
    expect(regex.ignoreCase).toBe(true);
    expect(regex.source).toBe("abc");
  });

  it("should handle options object without flags", () => {
    const regex = new RegExt("\\d+", { escape: false });
    expect(regex.test("123")).toBe(true);
    expect(regex.flags).toBe("");
  });

  it("should handle empty options object", () => {
    const regex = new RegExt("\\d+", {});
    expect(regex.test("123")).toBe(true);
  });

  it("should handle escape false with flags", () => {
    const regex = new RegExt("\\d+", { escape: false, flags: "g" });
    expect(regex.test("123")).toBe(true);
    expect(regex.global).toBe(true);
  });

  it("should store string pattern in originalPattern", () => {
    const regex = new RegExt("\\d+", "g");
    expect(regex.originalPattern).toBe("\\d+");
  });

  it("should store RegExp pattern in originalPattern", () => {
    const pattern = /\d+/g;
    const regex = new RegExt(pattern);
    expect(regex.originalPattern).toBe(pattern);
    expect(regex.test("123")).toBe(true);
    expect(regex.global).toBe(true);
    expect(regex.source).toBe("\\d+");
  });

  it("should handle RegExp pattern without additional flags", () => {
    const pattern = /\d+/;
    const regex = new RegExt(pattern);
    expect(regex.test("123")).toBe(true);
    expect(regex.global).toBe(false);
    expect(regex.source).toBe("\\d+");
    expect(regex.flags).toBe("");
  });

  it("should store escaped pattern as original (not escaped version)", () => {
    const regex = new RegExt("$100", { escape: true });
    expect(regex.originalPattern).toBe("$100");
  });

  it("should handle invalid regex patterns gracefully", () => {
    // RegExp constructor errors should propagate as-is
    expect(() => new RegExt("[", "g")).toThrow();
  });

  it("should handle special regex flags", () => {
    const stickyRegex = new RegExt("\\d+", "gy");
    expect(stickyRegex.sticky).toBe(true);

    const unicodeRegex = new RegExt("\\u{1F600}", "gu");
    expect(unicodeRegex.unicode).toBe(true);
  });

  describe("with escape mode", () => {
    it("should escape special characters when escape is true", () => {
      const regex = new RegExt("$100", { escape: true });
      expect(regex.test("$100")).toBe(true);
      expect(regex.test("100")).toBe(false);
    });

    it("should work with RegExp pattern and escape option (ignores escape)", () => {
      const pattern = /\d+/;
      const regex = new RegExt(pattern, { escape: true, flags: "g" });
      expect(regex.test("123")).toBe(true);
      expect(regex.global).toBe(true);
    });

    it("should preserve original pattern when escape is used", () => {
      const regex = new RegExt("$100", { escape: true });
      expect(regex.originalPattern).toBe("$100");
    });

    it("should handle escape with flags in options", () => {
      const regex = new RegExt("abc", { escape: true, flags: "i" });
      expect(regex.test("abc")).toBe(true);
      expect(regex.test("ABC")).toBe(true);
      expect(regex.test("aBc")).toBe(true);
    });

    it("should handle all special characters with escape", () => {
      const specialChars = ".*+?^${}()|[]\\";
      const regex = new RegExt(specialChars, { escape: true });
      expect(regex.test(specialChars)).toBe(true);
    });

    it("should combine escape with global flag", () => {
      const regex = new RegExt("$", { escape: true, flags: "g" });
      const matches = regex.extract("$100 $200");
      expect(matches).toEqual(["$", "$"]);
    });
  });
});
