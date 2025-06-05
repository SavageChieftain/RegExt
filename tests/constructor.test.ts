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
});
