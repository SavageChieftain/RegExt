import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - extractGroups", () => {
  it("should extract capture groups", () => {
    const groupRegex = new RegExt("(\\d{2})(\\d{2})", "g");
    const result = groupRegex.extractGroups("1234 5678");
    expect(result).toEqual([
      ["12", "34"],
      ["56", "78"],
    ]);
  });

  it("should return empty array when no matches", () => {
    const groupRegex = new RegExt("(\\d+)", "g");
    const result = groupRegex.extractGroups("abc def");
    expect(result).toEqual([]);
  });

  it("should handle patterns without capture groups", () => {
    const noGroupRegex = new RegExt("\\d+", "g");
    const result = noGroupRegex.extractGroups("123 456");
    expect(result).toEqual([[], []]);
  });

  it("should handle optional capture groups", () => {
    const optionalGroupRegex = new RegExt("(\\d+)-(\\d+)?", "g");
    const result = optionalGroupRegex.extractGroups("123-456 789-");
    expect(result).toEqual([
      ["123", "456"],
      ["789", undefined],
    ]);
  });

  it("should handle nested capture groups", () => {
    const nestedGroupRegex = new RegExt("((\\d+)-(\\d+))", "g");
    const result = nestedGroupRegex.extractGroups("123-456");
    expect(result).toEqual([["123-456", "123", "456"]]);
  });

  it("should handle named capture groups", () => {
    const namedGroupRegex = new RegExt("(?<year>\\d{4})-(?<month>\\d{2})", "g");
    const result = namedGroupRegex.extractGroups("2023-12");
    expect(result).toEqual([["2023", "12"]]);
  });
});
