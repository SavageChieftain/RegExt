import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - replaceFirst", () => {
  it("should replace only the first match even with global flag", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceFirst("123 456 789", "NUM");
    expect(result).toBe("NUM 456 789");
  });

  it("should preserve lastIndex after replacement", () => {
    const numRegex = new RegExt("\\d+", "g");
    numRegex.lastIndex = 5;
    numRegex.replaceFirst("123 456 789", "NUM");
    expect(numRegex.lastIndex).toBe(5);
  });

  it("should handle no matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceFirst("abc def ghi", "NUM");
    expect(result).toBe("abc def ghi");
  });

  it("should handle function replacement", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceFirst("123 456", (match) => `<${match}>`);
    expect(result).toBe("<123> 456");
  });

  it("should work correctly with capture groups", () => {
    const groupRegex = new RegExt("(\\d+)-(\\d+)", "g");
    const result = groupRegex.replaceFirst("123-456 789-012", "$2-$1");
    expect(result).toBe("456-123 789-012");
  });

  it("should handle function replacement with capture groups", () => {
    const groupRegex = new RegExt("(\\d+)-(\\d+)", "g");
    const result = groupRegex.replaceFirst("123-456 789-012", (match, p1, p2) => `${p2}:${p1}`);
    expect(result).toBe("456:123 789-012");
  });
});
