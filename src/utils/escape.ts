/**
 * Escape special characters in a string for use in regular expressions
 *
 * This function escapes all special regex characters so that the string
 * can be safely used as a literal pattern in a RegExp constructor.
 *
 * @param str - The string to escape
 * @returns The escaped string safe for use in RegExp patterns
 *
 * @example
 * ```typescript
 * import { escape } from 'regext';
 *
 * const userInput = "What is $100 + $50?";
 * const pattern = escape(userInput);
 * // "What is \\$100 \\+ \\$50\\?"
 *
 * const regex = new RegExp(pattern, 'g');
 * const found = regex.test("What is $100 + $50?");
 * // true
 * ```
 */
export function escape(str: string): string {
  // Escape special regex characters: . * + ? ^ $ { } ( ) | [ ] \ /
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
