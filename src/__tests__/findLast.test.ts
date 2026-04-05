import { describe, it, expect } from "vitest";
import RegExt from "../index";

describe("RegExt - findLast", () => {
  it("should return last match", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.findLast("123 456 789");
    expect(result?.[0]).toBe("789");
    expect(result?.index).toBe(8);
  });

  it("should return null when no matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.findLast("abc def ghi");
    expect(result).toBeNull();
  });

  it("should work with single match", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.findLast("abc 123 def");
    expect(result?.[0]).toBe("123");
    expect(result?.index).toBe(4);
  });

  it("should work correctly with capture groups", () => {
    const groupRegex = new RegExt("(\\d+)-(\\d+)", "g");
    const result = groupRegex.findLast("123-456 789-012");
    expect(result?.[0]).toBe("789-012");
    expect(result?.[1]).toBe("789");
    expect(result?.[2]).toBe("012");
  });

  it("should return null for null loopExec result", () => {
    const regex = new RegExt("\\d+", "g");
    const result = regex.findLast("abc");
    expect(result).toBeNull();
  });

  describe("with escape mode", () => {
    it("should find last literal string when escape is true", () => {
      const regex = new RegExt("$100", { escape: true, flags: "g" });
      const result = regex.findLast("I have $100 and $100 more");
      expect(result?.[0]).toBe("$100");
      expect(result?.index).toBe(16);
    });
  });
});
