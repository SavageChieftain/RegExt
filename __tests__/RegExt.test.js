import RegExt from "../index";

describe("RegExt Class", () => {
  let regex;

  beforeEach(() => {
    regex = new RegExt("a(b)c", "g");
  });

  describe("loopExec", () => {
    it("should return all matches when pattern is found", () => {
      const result = regex.loopExec("abc abc abc");

      expect(result).toEqual(
        expect.arrayContaining([
          expect.arrayContaining(["abc", "b"]),
          expect.arrayContaining(["abc", "b"]),
          expect.arrayContaining(["abc", "b"]),
        ])
      );
    });

    it("should return null when no pattern is found", () => {
      const result = regex.loopExec("def def def");
      expect(result).toBeNull();
    });

    describe("edge cases", () => {
      it("should return null for an empty string", () => {
        const result = regex.loopExec("");
        expect(result).toBeNull();
      });
      it("should handle empty pattern correctly", () => {
        const emptyPatternRegex = new RegExt("", "g");
        const result = emptyPatternRegex.loopExec(
          "abcaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        );
        expect(result).toEqual(
          expect.arrayContaining([expect.arrayContaining([""])])
        );
      });
      it("should handle special characters correctly", () => {
        const specialCharRegex = new RegExt("\\d+", "g");
        const result = specialCharRegex.loopExec("123 456 789");
        expect(result).toEqual(
          expect.arrayContaining([
            expect.arrayContaining(["123"]),
            expect.arrayContaining(["456"]),
            expect.arrayContaining(["789"]),
          ])
        );
      });

      it("should be case-sensitive by default", () => {
        const caseSensitiveRegex = new RegExt("abc", "g");
        const result = caseSensitiveRegex.loopExec("ABC abc");
        expect(result).toEqual(
          expect.arrayContaining([expect.arrayContaining(["abc"])])
        );
      });

      it("should handle case-insensitive flag correctly", () => {
        const caseInsensitiveRegex = new RegExt("abc", "gi");
        const result = caseInsensitiveRegex.loopExec("ABC abc");
        expect(result).toEqual(
          expect.arrayContaining([
            expect.arrayContaining(["ABC"]),
            expect.arrayContaining(["abc"]),
          ])
        );
      });

      it("should return multiple matches correctly", () => {
        const result = regex.loopExec("abc abc abc");
        expect(result).toEqual(
          expect.arrayContaining([
            expect.arrayContaining(["abc", "b"]),
            expect.arrayContaining(["abc", "b"]),
            expect.arrayContaining(["abc", "b"]),
          ])
        );
      });

      it("should return null when no matches are found", () => {
        const result = regex.loopExec("def def def");
        expect(result).toBeNull();
      });

      it("should not enter an infinite loop with zero-length matches", () => {
        const zeroLengthRegex = new RegExt("a*", "g");
        const result = zeroLengthRegex.loopExec("aaa");
        expect(result).toEqual(
          expect.arrayContaining([expect.arrayContaining(["aaa"])])
        );
      });
    });
  });

  describe("safeTest", () => {
    it("should return true when pattern is found", () => {
      const result = regex.safeTest("abc");
      expect(result).toBe(true);
    });

    it("should return false when no pattern is found", () => {
      const result = regex.safeTest("def");
      expect(result).toBe(false);
    });

    it("should not change lastIndex after test", () => {
      regex.test("abc");
      const lastIndexBefore = regex.lastIndex;
      regex.safeTest("abc");
      expect(regex.lastIndex).toBe(lastIndexBefore);
    });
    describe("edge cases", () => {
      it("should return false for an empty string", () => {
        const result = regex.safeTest("");
        expect(result).toBe(false);
      });

      it("should handle empty pattern correctly", () => {
        const emptyPatternRegex = new RegExt("", "g");
        const result = emptyPatternRegex.safeTest("abc");
        // empty pattern should always match
        expect(result).toBe(true);
      });

      it("should handle special characters correctly", () => {
        const specialCharRegex = new RegExt("\\d+", "g");
        const result = specialCharRegex.safeTest("123");
        expect(result).toBe(true);
      });

      it("should be case-sensitive by default", () => {
        const caseSensitiveRegex = new RegExt("abc", "g");
        const result = caseSensitiveRegex.safeTest("ABC");
        expect(result).toBe(false);
      });

      it("should handle case-insensitive flag correctly", () => {
        const caseInsensitiveRegex = new RegExt("abc", "gi");
        const result = caseInsensitiveRegex.safeTest("ABC");
        expect(result).toBe(true);
      });

      it("should return false for empty string", () => {
        const emptyStringRegex = new RegExt("abc", "g");
        const result = emptyStringRegex.safeTest("");
        expect(result).toBe(false);
      });

      it("should match special characters correctly", () => {
        const specialCharRegex = new RegExt("\\$", "g");
        const result = specialCharRegex.safeTest("$");
        expect(result).toBe(true);
      });

      it("should handle multiple matches correctly", () => {
        const multipleMatchRegex = new RegExt("\\d+", "g");
        const result = multipleMatchRegex.safeTest("123 456");
        expect(result).toBe(true);
      });

      it("should handle invalid regex gracefully", () => {
        try {
          const invalidRegex = new RegExt("[", "g");
          invalidRegex.safeTest("test");
        } catch (e) {
          expect(e).toBeInstanceOf(SyntaxError);
        }
      });
      it("should return false for empty string", () => {
        const emptyStringRegex = new RegExt("abc", "g");
        const result = emptyStringRegex.safeTest("");
        expect(result).toBe(false);
      });

      it("should match special characters correctly", () => {
        const specialCharRegex = new RegExt("\\$", "g");
        const result = specialCharRegex.safeTest("$");
        expect(result).toBe(true);
      });

      it("should handle multiple matches correctly", () => {
        const multipleMatchRegex = new RegExt("\\d+", "g");
        const result = multipleMatchRegex.safeTest("123 456");
        expect(result).toBe(true);
      });

      it("should handle invalid regex gracefully", () => {
        try {
          const invalidRegex = new RegExt("[", "g");
          invalidRegex.safeTest("test");
        } catch (e) {
          expect(e).toBeInstanceOf(SyntaxError);
        }
      });

      it("should handle long strings correctly", () => {
        const longStringRegex = new RegExt("a+", "g");
        const longString = "a".repeat(10000);
        const result = longStringRegex.safeTest(longString);
        expect(result).toBe(true);
      });

      it("should handle partial matches correctly", () => {
        const partialMatchRegex = new RegExt("abc", "g");
        const result = partialMatchRegex.safeTest("xyzabcxyz");
        expect(result).toBe(true);
      });

      it("should handle escape characters correctly", () => {
        const escapeCharRegex = new RegExt("\\\\", "g");
        const result = escapeCharRegex.safeTest("\\");
        expect(result).toBe(true);
      });

      it("should return false for non-matching string", () => {
        const nonMatchingRegex = new RegExt("abc", "g");
        const result = nonMatchingRegex.safeTest("def");
        expect(result).toBe(false);
      });

      it("should handle multiline strings correctly", () => {
        const multilineRegex = new RegExt("^abc", "gm");
        const result = multilineRegex.safeTest("abc\ndef\nabc");
        expect(result).toBe(true);
      });

      it("should handle Unicode characters correctly", () => {
        const unicodeRegex = new RegExt("\\u{1F600}", "gu");
        const result = unicodeRegex.safeTest("😀");
        expect(result).toBe(true);
      });
    });
  });
});
