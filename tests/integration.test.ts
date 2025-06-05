import { describe, it, expect, beforeEach } from "vitest";
import RegExt from "../src/index";

describe("RegExt - integration tests", () => {
  it("should work with chained method calls", () => {
    const regex = new RegExt("\\d+", "g");
    const text = "abc123def456ghi789";

    const count = regex.count(text);
    const matches = regex.extract(text);
    const lastMatch = regex.findLast(text);

    expect(count).toBe(3);
    expect(matches).toEqual(["123", "456", "789"]);
    expect(lastMatch).not.toBeNull();
    expect(lastMatch![0]).toBe("789");
  });

  it("should preserve state correctly across different methods", () => {
    const regex = new RegExt("\\d+", "g");
    regex.lastIndex = 10;

    regex.safeTest("123 456 789");
    expect(regex.lastIndex).toBe(10);

    regex.replaceAll("123 456 789", "NUM");
    expect(regex.lastIndex).toBe(10);
  });

  it("should handle complex real-world patterns", () => {
    const emailRegex = new RegExt(
      "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      "g"
    );
    const text = "Contact us at support@example.com or admin@test.org";

    const emails = emailRegex.extract(text);
    expect(emails).toEqual(["support@example.com", "admin@test.org"]);

    const count = emailRegex.count(text);
    expect(count).toBe(2);
  });

  it("should handle URL extraction", () => {
    const urlRegex = new RegExt("https?://[^\\s]+", "g");
    const text = "Visit https://example.com or http://test.org for more info";

    const urls = urlRegex.extract(text);
    expect(urls).toEqual(["https://example.com", "http://test.org"]);
  });

  it("should handle date patterns", () => {
    const dateRegex = new RegExt("(\\d{4})-(\\d{2})-(\\d{2})", "g");
    const text = "Events on 2023-12-25 and 2024-01-01";

    const dates = dateRegex.extractGroups(text);
    expect(dates).toEqual([
      ["2023", "12", "25"],
      ["2024", "01", "01"],
    ]);
  });
});
