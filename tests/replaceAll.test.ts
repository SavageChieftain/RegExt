import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - replaceAll", () => {
  it("should replace all matches with global flag", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceAll("123 456 789", "NUM");
    expect(result).toBe("NUM NUM NUM");
  });

  it("should replace only first match without global flag", () => {
    const nonGlobalRegex = new RegExt("\\d+");
    const result = nonGlobalRegex.replaceAll("123 456 789", "NUM");
    expect(result).toBe("NUM 456 789");
  });

  it("should preserve lastIndex after replacement", () => {
    const numRegex = new RegExt("\\d+", "g");
    numRegex.lastIndex = 5;
    numRegex.replaceAll("123 456 789", "NUM");
    expect(numRegex.lastIndex).toBe(5);
  });

  it("should handle empty string", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceAll("", "NUM");
    expect(result).toBe("");
  });

  it("should handle no matches", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceAll("abc def ghi", "NUM");
    expect(result).toBe("abc def ghi");
  });

  it("should handle function replacement", () => {
    const numRegex = new RegExt("\\d+", "g");
    const result = numRegex.replaceAll("123 456", (match) => `<${match}>`);
    expect(result).toBe("<123> <456>");
  });

  it("should handle function replacement with capture groups", () => {
    const groupRegex = new RegExt("(\\d+)-(\\d+)", "g");
    const result = groupRegex.replaceAll(
      "123-456 789-012",
      (match, p1, p2) => `${p2}:${p1}`
    );
    expect(result).toBe("456:123 012:789");
  });

  it("should handle empty pattern replacement", () => {
    const emptyRegex = new RegExt("", "g");
    const result = emptyRegex.replaceAll("abc", "X");
    expect(result).toBe("Xabc");
  });
});
