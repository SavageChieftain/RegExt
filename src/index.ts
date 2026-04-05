/**
 * RegExt - Extended Regular Expression Class
 *
 * Extends the standard RegExp class with additional utility methods
 * for more convenient string matching and manipulation.
 */

export { escape } from "./utils/escape";
import { escape } from "./utils/escape";

/**
 * Options for creating a RegExt instance
 */
export interface RegExtOptions {
  /** Flags for the regular expression (e.g., 'g', 'i', 'gi') */
  flags?: string;
  /** If true, the pattern will be escaped for literal matching */
  escape?: boolean;
}

/**
 * Represents a chunk of text with match information
 */
export interface TextChunk {
  /** The text content of this chunk */
  text: string;
  /** Whether this chunk is a regex match */
  isMatch: boolean;
  /** The starting index of this chunk in the original string */
  index: number;
}

export default class RegExt extends RegExp {
  /** The original pattern used to create this RegExt instance */
  public readonly originalPattern: string | RegExp;

  /**
   * Creates a new RegExt instance
   * @param pattern - The regular expression pattern
   * @param flagsOrOptions - Optional flags string or options object
   *
   * @example
   * ```typescript
   * // Traditional usage with flags
   * const regex1 = new RegExt('\\d+', 'g');
   *
   * // Using escape mode for literal matching
   * const regex2 = new RegExt('$100', { flags: 'g', escape: true });
   * regex2.test('$100'); // true
   *
   * // Escape mode with user input
   * const userInput = '(test)';
   * const regex3 = new RegExt(userInput, { escape: true });
   * regex3.test('(test)'); // true
   * ```
   */
  constructor(
    pattern: string | RegExp,
    flagsOrOptions?: string | RegExtOptions,
  ) {
    const { processedPattern, flags } = RegExt._processConstructorArgs(
      pattern,
      flagsOrOptions,
    );
    super(processedPattern, flags);
    this.originalPattern = pattern;
  }

  /**
   * Extract flags from the constructor arguments
   * @private
   */
  private static _resolveFlags(
    flagsOrOptions?: string | RegExtOptions,
  ): string | undefined {
    if (typeof flagsOrOptions === "string") {
      return flagsOrOptions;
    }
    return flagsOrOptions?.flags;
  }

  /**
   * Process constructor arguments to handle both string flags and options object
   * @private
   */
  private static _processConstructorArgs(
    pattern: string | RegExp,
    flagsOrOptions?: string | RegExtOptions,
  ): { processedPattern: string | RegExp; flags?: string } {
    const flags = RegExt._resolveFlags(flagsOrOptions);

    // If pattern is already a RegExp, return as-is
    if (pattern instanceof RegExp) {
      return flags !== undefined
        ? { processedPattern: pattern, flags }
        : { processedPattern: pattern };
    }

    // Handle escape option
    const shouldEscape =
      typeof flagsOrOptions === "object" && flagsOrOptions?.escape;
    const processedPattern = shouldEscape ? escape(pattern) : pattern;

    return flags !== undefined
      ? { processedPattern, flags }
      : { processedPattern };
  }

  /**
   * Execute the regex against the string and return all matches
   * @param str - The string to search
   * @returns Array of match results, or null if no matches
   * @throws {TypeError} If str is null or undefined
   */
  loopExec(str: string): RegExpExecArray[] | null {
    if (str === null || str === undefined) {
      throw new TypeError("Input string cannot be null or undefined");
    }

    return this._executeLoop(str);
  }

  /**
   * Internal method to execute the loop with proper lastIndex handling
   * @private
   */
  private _executeLoop(str: string): RegExpExecArray[] | null {
    const result: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    const originalLastIndex = this.lastIndex;
    this.lastIndex = 0;

    // Without global flag, exec() only returns first match
    if (!this.global) {
      match = this.exec(str);
      this.lastIndex = originalLastIndex;
      return match ? [match] : null;
    }

    // Special handling for empty pattern to avoid excessive matches
    // Empty pattern always matches at position 0
    if (this.originalPattern === "") {
      match = this.exec(str);
      this.lastIndex = originalLastIndex;
      return [match!];
    }

    while ((match = this.exec(str))) {
      result.push(match);

      if (this._shouldBreakLoop(match, str)) {
        break;
      }
    }

    this.lastIndex = originalLastIndex;
    return result.length ? result : null;
  }

  /**
   * Determine if the loop should break to prevent infinite loops
   * @private
   */
  private _shouldBreakLoop(match: RegExpExecArray, str: string): boolean {
    // Condition to prevent infinite loops
    if (match[0].length === 0) {
      // For zero-length matches, advance lastIndex by one
      this.lastIndex = match.index + 1;
      if (this.lastIndex > str.length) {
        return true;
      }
    }

    // When match reaches the end of the string
    if (this.lastIndex >= str.length) {
      // Check for zero-length match at the end
      const finalMatch = this.exec(str);
      if (finalMatch) {
        // In this case, result needs to be added, so handle in caller
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Test the pattern against a string without changing lastIndex
   * @param str - The string to test
   * @returns true if the pattern matches, false otherwise
   * @throws {TypeError} If str is null or undefined
   */
  safeTest(str: string): boolean {
    if (str === null || str === undefined) {
      throw new TypeError("Input string cannot be null or undefined");
    }
    const lastIndex = this.lastIndex;
    const result = this.test(str);
    this.lastIndex = lastIndex;
    return result;
  }

  /**
   * Replace all matches in the string
   * @param str - The string to search and replace
   * @param replacement - The replacement string or function
   * @returns The string with all matches replaced
   */
  replaceAll(
    str: string,
    replacement: string | ((substring: string, ...args: unknown[]) => string),
  ): string {
    // Special handling for empty pattern
    if (this.originalPattern === "") {
      return (replacement as string) + str;
    }

    if (!this.global) {
      // If no global flag, replace only once
      return str.replace(
        this,
        replacement as (substring: string, ...args: string[]) => string,
      );
    }
    const lastIndex = this.lastIndex;
    this.lastIndex = 0;
    const result = str.replace(
      this,
      replacement as (substring: string, ...args: string[]) => string,
    );
    this.lastIndex = lastIndex;
    return result;
  }

  /**
   * Replace only the first match in the string
   * @param str - The string to search and replace
   * @param replacement - The replacement string or function
   * @returns The string with the first match replaced
   */
  replaceFirst(
    str: string,
    replacement: string | ((substring: string, ...args: unknown[]) => string),
  ): string {
    const lastIndex = this.lastIndex;
    const nonGlobalRegex = new RegExp(this.source, this.flags.replace("g", ""));
    const result = str.replace(
      nonGlobalRegex,
      replacement as (substring: string, ...args: string[]) => string,
    );
    this.lastIndex = lastIndex;
    return result;
  }

  /**
   * Extract all matched strings as an array
   * @param str - The string to search
   * @returns Array of matched strings
   */
  extract(str: string): string[] {
    const matches = this.loopExec(str);
    return matches ? matches.map((match) => match[0]) : [];
  }

  /**
   * Extract capture groups from all matches
   * @param str - The string to search
   * @returns Array of capture group arrays
   */
  extractGroups(str: string): (string | undefined)[][] {
    const matches = this.loopExec(str);
    return matches ? matches.map((match) => match.slice(1)) : [];
  }

  /**
   * Count the number of matches
   * @param str - The string to search
   * @returns Number of matches found
   */
  count(str: string): number {
    const matches = this.loopExec(str);
    return matches ? matches.length : 0;
  }

  /**
   * Find the last match
   * @param str - The string to search
   * @returns The last match result, or null if no match
   */
  findLast(str: string): RegExpExecArray | null {
    const matches = this.loopExec(str);
    return matches ? matches[matches.length - 1] : null;
  }

  /**
   * Split the string into chunks of matched and unmatched parts
   * @param str - The string to split into chunks
   * @returns Array of chunks with text, match status, and position
   *
   * @example
   * ```typescript
   * const regex = new RegExt('error', 'gi');
   * const chunks = regex.chunks('No error found');
   * // [
   * //   { text: 'No ', isMatch: false, index: 0 },
   * //   { text: 'error', isMatch: true, index: 3 },
   * //   { text: ' found', isMatch: false, index: 8 }
   * // ]
   * ```
   */
  chunks(str: string): TextChunk[] {
    const matches = this.loopExec(str);
    if (!matches?.length) {
      return str.length ? [{ text: str, isMatch: false, index: 0 }] : [];
    }

    const result: TextChunk[] = [];
    let pos = 0;

    for (let i = 0, len = matches.length; i < len; i++) {
      const { index: start, 0: matchText } = matches[i];

      // Add unmatched chunk before match (if any)
      if (pos < start) {
        result.push({
          text: str.slice(pos, start),
          isMatch: false,
          index: pos,
        });
      }

      // Add matched chunk
      result.push({ text: matchText, isMatch: true, index: start });
      pos = start + matchText.length;
    }

    // Add final unmatched chunk (if any)
    if (pos < str.length) {
      result.push({ text: str.slice(pos), isMatch: false, index: pos });
    }

    return result;
  }
}
