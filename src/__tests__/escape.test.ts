import { describe, it, expect } from "vitest";
import { escape } from "../utils/escape";

describe("escape", () => {
  it("should escape special regex characters", () => {
    expect(escape(".")).toBe("\\.");
    expect(escape("*")).toBe("\\*");
    expect(escape("+")).toBe("\\+");
    expect(escape("?")).toBe("\\?");
    expect(escape("^")).toBe("\\^");
    expect(escape("$")).toBe("\\$");
    expect(escape("{")).toBe("\\{");
    expect(escape("}")).toBe("\\}");
    expect(escape("(")).toBe("\\(");
    expect(escape(")")).toBe("\\)");
    expect(escape("|")).toBe("\\|");
    expect(escape("[")).toBe("\\[");
    expect(escape("]")).toBe("\\]");
    expect(escape("\\")).toBe("\\\\");
  });

  it("should escape multiple special characters in a string", () => {
    expect(escape("$100 + $50")).toBe("\\$100 \\+ \\$50");
    expect(escape("user@example.com")).toBe("user@example\\.com");
    expect(escape("(test)")).toBe("\\(test\\)");
    expect(escape("[a-z]+")).toBe("\\[a-z\\]\\+");
  });

  it("should handle strings without special characters", () => {
    expect(escape("hello")).toBe("hello");
    expect(escape("abc123")).toBe("abc123");
    expect(escape("")).toBe("");
  });

  it("should work with RegExp constructor for literal matching", () => {
    const input = "What is $100?";
    const pattern = escape(input);
    const regex = new RegExp(pattern);

    expect(regex.test("What is $100?")).toBe(true);
    expect(regex.test("What is $200?")).toBe(false);
  });

  it("should escape complex expressions", () => {
    const complexStr = "function test() { return /[a-z]+/g; }";
    const escaped = escape(complexStr);
    const regex = new RegExp(escaped);

    expect(regex.test(complexStr)).toBe(true);
  });

  it("should handle edge cases", () => {
    expect(escape("***")).toBe("\\*\\*\\*");
    expect(escape("...")).toBe("\\.\\.\\.");
    expect(escape("\\\\\\")).toBe("\\\\\\\\\\\\");
  });

  it("should be usable for search and replace", () => {
    const text = "Price: $100, Tax: $10";
    const toFind = "$100";
    const pattern = escape(toFind);
    const regex = new RegExp(pattern, "g");

    expect(text.replace(regex, "$200")).toBe("Price: $200, Tax: $10");
  });

  it("should handle URL-like strings", () => {
    const url = "https://example.com/path?query=value";
    const escaped = escape(url);
    const regex = new RegExp(escaped);

    expect(regex.test(url)).toBe(true);
  });

  it("should handle email-like strings", () => {
    const email = "user+tag@example.com";
    const escaped = escape(email);
    const regex = new RegExp(escaped);

    expect(regex.test(email)).toBe(true);
    expect(regex.test("user@example.com")).toBe(false);
  });
});
