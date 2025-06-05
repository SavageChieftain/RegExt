import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - edge cases and error handling", () => {
  it("should handle moderately long strings", () => {
    const regex = new RegExt("a+", "g");
    const longString = "a".repeat(1000);

    const result = regex.loopExec(longString);
    expect(result).toHaveLength(1);
    expect(result![0][0]).toBe(longString);
  });

  it("should handle invalid regex patterns gracefully", () => {
    // RegExp constructor errors should propagate as-is
    expect(() => new RegExt("[", "g")).toThrow();
  });

  it("should handle null and undefined inputs", () => {
    const regex = new RegExt("\\d+", "g");

    expect(() => regex.loopExec(null as any)).toThrow();
    expect(() => regex.loopExec(undefined as any)).toThrow();
    expect(() => regex.safeTest(null as any)).toThrow();
    expect(() => regex.safeTest(undefined as any)).toThrow();
  });

  it("should handle special regex flags", () => {
    const stickyRegex = new RegExt("\\d+", "gy");
    expect(stickyRegex.sticky).toBe(true);

    const unicodeRegex = new RegExt("\\u{1F600}", "gu");
    expect(unicodeRegex.unicode).toBe(true);
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

  it("should handle dotAll flag", () => {
    const dotAllRegex = new RegExt("a.b", "gs");
    const text = "a\nb";

    const result = dotAllRegex.safeTest(text);
    expect(result).toBe(true);
  });
});
