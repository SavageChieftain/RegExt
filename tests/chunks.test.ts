import { describe, it, expect } from "vitest";
import RegExt, { TextChunk } from "../src/index";

describe("RegExt - chunks", () => {
  describe("global flag behavior", () => {
    it("should work without global flag", () => {
      const regex = new RegExt("\\d+");
      const chunks = regex.chunks("abc123def456");
      // Without global flag, only first match
      expect(chunks).toEqual([
        { text: "abc", isMatch: false, index: 0 },
        { text: "123", isMatch: true, index: 3 },
        { text: "def456", isMatch: false, index: 6 },
      ]);
    });
  });

  describe("basic functionality", () => {
    it("should split text into matched and unmatched chunks", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks = regex.chunks("abc123def456ghi");

      expect(chunks).toEqual([
        { text: "abc", isMatch: false, index: 0 },
        { text: "123", isMatch: true, index: 3 },
        { text: "def", isMatch: false, index: 6 },
        { text: "456", isMatch: true, index: 9 },
        { text: "ghi", isMatch: false, index: 12 },
      ]);
    });

    it("should handle text with no matches", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks = regex.chunks("abcdef");

      expect(chunks).toEqual([{ text: "abcdef", isMatch: false, index: 0 }]);
    });

    it("should handle text that is all matches", () => {
      const regex = new RegExt("\\d", "g");
      const chunks = regex.chunks("123");

      expect(chunks).toEqual([
        { text: "1", isMatch: true, index: 0 },
        { text: "2", isMatch: true, index: 1 },
        { text: "3", isMatch: true, index: 2 },
      ]);
    });

    it("should handle empty string", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks = regex.chunks("");

      expect(chunks).toEqual([]);
    });

    it("should handle match at the beginning", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks = regex.chunks("123abc");

      expect(chunks).toEqual([
        { text: "123", isMatch: true, index: 0 },
        { text: "abc", isMatch: false, index: 3 },
      ]);
    });

    it("should handle match at the end", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks = regex.chunks("abc123");

      expect(chunks).toEqual([
        { text: "abc", isMatch: false, index: 0 },
        { text: "123", isMatch: true, index: 3 },
      ]);
    });

    it("should work with case-insensitive flag", () => {
      const regex = new RegExt("error", "gi");
      const chunks = regex.chunks("No ERROR found. Check for errors.");

      expect(chunks).toEqual([
        { text: "No ", isMatch: false, index: 0 },
        { text: "ERROR", isMatch: true, index: 3 },
        { text: " found. Check for ", isMatch: false, index: 8 },
        { text: "error", isMatch: true, index: 26 },
        { text: "s.", isMatch: false, index: 31 },
      ]);
    });

    it("should handle consecutive matches", () => {
      const regex = new RegExt("\\d", "g");
      const chunks = regex.chunks("a12b");

      expect(chunks).toEqual([
        { text: "a", isMatch: false, index: 0 },
        { text: "1", isMatch: true, index: 1 },
        { text: "2", isMatch: true, index: 2 },
        { text: "b", isMatch: false, index: 3 },
      ]);
    });
  });

  describe("special patterns", () => {
    it("should handle when entire string is one match", () => {
      const regex = new RegExt("\\w+", "g");
      const chunks = regex.chunks("hello");
      expect(chunks).toEqual([{ text: "hello", isMatch: true, index: 0 }]);
    });

    it("should handle patterns that could theoretically overlap", () => {
      const regex = new RegExt("a+", "g");
      const chunks = regex.chunks("aabaaac");
      expect(chunks).toEqual([
        { text: "aa", isMatch: true, index: 0 },
        { text: "b", isMatch: false, index: 2 },
        { text: "aaa", isMatch: true, index: 3 },
        { text: "c", isMatch: false, index: 6 },
      ]);
    });

    it("should work with multiline patterns", () => {
      const regex = new RegExt("^\\w+$", "gm");
      const chunks = regex.chunks("line1\nline2");
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.some((c) => c.isMatch)).toBe(true);
    });

    it("should handle unicode characters correctly", () => {
      const regex = new RegExt("😀", { escape: true, flags: "g" });
      const chunks = regex.chunks("hello😀world");
      expect(chunks).toContainEqual(
        expect.objectContaining({ text: "😀", isMatch: true })
      );
    });
  });

  describe("real-world scenarios", () => {
    it("should work for syntax highlighting use case", () => {
      const codeRegex = new RegExt("`[^`]+`", "g");
      const text = "Use `console.log()` to debug. Try `alert()` too.";
      const chunks = codeRegex.chunks(text);

      expect(chunks).toEqual([
        { text: "Use ", isMatch: false, index: 0 },
        { text: "`console.log()`", isMatch: true, index: 4 },
        { text: " to debug. Try ", isMatch: false, index: 19 },
        { text: "`alert()`", isMatch: true, index: 34 },
        { text: " too.", isMatch: false, index: 43 },
      ]);
    });

    it("should work for search highlighting use case", () => {
      const searchRegex = new RegExt("the", "gi");
      const text = "The quick brown fox jumps over the lazy dog";
      const chunks = searchRegex.chunks(text);

      expect(chunks).toEqual([
        { text: "The", isMatch: true, index: 0 },
        { text: " quick brown fox jumps over ", isMatch: false, index: 3 },
        { text: "the", isMatch: true, index: 31 },
        { text: " lazy dog", isMatch: false, index: 34 },
      ]);
    });

    it("should handle email masking use case", () => {
      const emailRegex = new RegExt("[\\w.]+@[\\w.]+", "g");
      const text = "Contact alice@example.com or bob@test.org";
      const chunks = emailRegex.chunks(text);

      expect(chunks).toEqual([
        { text: "Contact ", isMatch: false, index: 0 },
        { text: "alice@example.com", isMatch: true, index: 8 },
        { text: " or ", isMatch: false, index: 25 },
        { text: "bob@test.org", isMatch: true, index: 29 },
      ]);

      // Verify masking works
      const masked = chunks
        .map((chunk) => (chunk.isMatch ? "***@***.***" : chunk.text))
        .join("");
      expect(masked).toBe("Contact ***@***.*** or ***@***.***");
    });

    it("should handle single character matches", () => {
      const regex = new RegExt("a", "g");
      const chunks = regex.chunks("banana");

      expect(chunks).toEqual([
        { text: "b", isMatch: false, index: 0 },
        { text: "a", isMatch: true, index: 1 },
        { text: "n", isMatch: false, index: 2 },
        { text: "a", isMatch: true, index: 3 },
        { text: "n", isMatch: false, index: 4 },
        { text: "a", isMatch: true, index: 5 },
      ]);
    });

    it("should work with complex patterns", () => {
      const regex = new RegExt("\\[(\\w+)\\]", "g");
      const text = "Hello [world], this is [test]!";
      const chunks = regex.chunks(text);

      expect(chunks).toEqual([
        { text: "Hello ", isMatch: false, index: 0 },
        { text: "[world]", isMatch: true, index: 6 },
        { text: ", this is ", isMatch: false, index: 13 },
        { text: "[test]", isMatch: true, index: 23 },
        { text: "!", isMatch: false, index: 29 },
      ]);
    });

    it("should handle whitespace patterns", () => {
      const regex = new RegExt("\\s+", "g");
      const chunks = regex.chunks("Hello   world\t\ttest");

      expect(chunks).toEqual([
        { text: "Hello", isMatch: false, index: 0 },
        { text: "   ", isMatch: true, index: 5 },
        { text: "world", isMatch: false, index: 8 },
        { text: "\t\t", isMatch: true, index: 13 },
        { text: "test", isMatch: false, index: 15 },
      ]);
    });

    it("should preserve correct indices throughout", () => {
      const regex = new RegExt("\\d+", "g");
      const text = "a123b456c789";
      const chunks = regex.chunks(text);

      // Verify we can reconstruct the original string
      const reconstructed = chunks.map((chunk) => chunk.text).join("");
      expect(reconstructed).toBe(text);

      // Verify indices are correct
      chunks.forEach((chunk) => {
        expect(text.slice(chunk.index, chunk.index + chunk.text.length)).toBe(
          chunk.text
        );
      });
    });

    it("should work with escape mode", () => {
      const regex = new RegExt("$100", { escape: true, flags: "g" });
      const chunks = regex.chunks("Price: $100, Total: $100");

      expect(chunks).toEqual([
        { text: "Price: ", isMatch: false, index: 0 },
        { text: "$100", isMatch: true, index: 7 },
        { text: ", Total: ", isMatch: false, index: 11 },
        { text: "$100", isMatch: true, index: 20 },
      ]);
    });

    it("should handle zero-length matches edge case", () => {
      const regex = new RegExt("\\b", "g");
      const text = "hi";
      const chunks = regex.chunks(text);

      // Zero-length matches should still produce chunks
      expect(chunks.length).toBeGreaterThan(0);
    });
  });

  describe("type exports", () => {
    it("should allow using TextChunk type", () => {
      const regex = new RegExt("\\d+", "g");
      const chunks: TextChunk[] = regex.chunks("a1b2");
      expect(chunks.length).toBe(4);
      expect(chunks[0]).toHaveProperty("text");
      expect(chunks[0]).toHaveProperty("isMatch");
      expect(chunks[0]).toHaveProperty("index");
    });
  });
});
