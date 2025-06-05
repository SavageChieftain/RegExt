/**
 * RegExt - Extended Regular Expression Class
 *
 * Extends the standard RegExp class with additional utility methods
 * for more convenient string matching and manipulation.
 */
export default class RegExt extends RegExp {
  /** The original pattern used to create this RegExt instance */
  public readonly originalPattern: string | RegExp;

  /**
   * Creates a new RegExt instance
   * @param pattern - The regular expression pattern
   * @param flags - Optional flags for the regular expression
   */
  constructor(pattern: string | RegExp, flags?: string) {
    super(pattern, flags);
    this.originalPattern = pattern;
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
    if (this.originalPattern === "") {
      const match = this.exec(str);
      return match ? [match] : null;
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
      if (match.index + match[0].length === str.length && match[0].length > 0) {
        const finalMatch = this.exec(str);
        if (finalMatch && finalMatch[0].length === 0) {
          // In this case, result needs to be added, so handle in caller
          return false;
        }
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
    replacement: string | ((substring: string, ...args: any[]) => string)
  ): string {
    // Special handling for empty pattern
    if (this.originalPattern === "") {
      return replacement + str;
    }

    if (!this.global) {
      // If no global flag, replace only once
      return str.replace(this, replacement as any);
    }
    const lastIndex = this.lastIndex;
    this.lastIndex = 0;
    const result = str.replace(this, replacement as any);
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
    replacement: string | ((substring: string, ...args: any[]) => string)
  ): string {
    const lastIndex = this.lastIndex;
    const nonGlobalRegex = new RegExp(this.source, this.flags.replace("g", ""));
    const result = str.replace(nonGlobalRegex, replacement as any);
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
}
