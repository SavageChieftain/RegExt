import { describe, it, expect } from "vitest";
import RegExt from "../index";

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
      "g",
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

  it("should handle phone number extraction and validation", () => {
    const phoneRegex = new RegExt("\\d{3}-\\d{4}-\\d{4}", "g");
    const text = "Call 090-1234-5678 or 080-9876-5432 for support";

    const phones = phoneRegex.extract(text);
    expect(phones).toEqual(["090-1234-5678", "080-9876-5432"]);
    expect(phoneRegex.count(text)).toBe(2);

    const validated = phoneRegex.safeTest("090-1234-5678");
    expect(validated).toBe(true);
  });

  it("should handle HTML tag extraction", () => {
    const tagRegex = new RegExt("<([a-z]+)>.*?</\\1>", "gi");
    const html = "<div>Hello</div><span>World</span>";

    const tags = tagRegex.extract(html);
    expect(tags).toEqual(["<div>Hello</div>", "<span>World</span>"]);
  });

  it("should handle CSV parsing", () => {
    const csvRegex = new RegExt('(?:"([^"]*)"|([^,]+))(?:,|$)', "g");
    const csv = 'name,"value with, comma",123,end';

    const fields = csvRegex.extractGroups(csv);
    expect(fields.length).toBeGreaterThan(0);
  });

  it("should handle code comment extraction", () => {
    const commentRegex = new RegExt("//.*$|/\\*[\\s\\S]*?\\*/", "gm");
    const code = `
function test() {
  // Single line comment
  const x = 1; /* inline */
  /* Multi
     line
     comment */
  return x;
}`;

    const comments = commentRegex.extract(code);
    expect(comments.length).toBe(3);
    expect(comments[0]).toBe("// Single line comment");
    expect(comments[1]).toBe("/* inline */");
  });

  it("should handle IP address validation", () => {
    const ipRegex = new RegExt("\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", "g");
    const text = "Servers at 192.168.1.1 and 10.0.0.1";

    const ips = ipRegex.extract(text);
    expect(ips).toEqual(["192.168.1.1", "10.0.0.1"]);
    expect(ipRegex.safeTest("255.255.255.0")).toBe(true);
  });

  it("should handle markdown link extraction", () => {
    const linkRegex = new RegExt("\\[([^\\]]+)\\]\\(([^)]+)\\)", "g");
    const markdown =
      "Check [GitHub](https://github.com) and [Google](https://google.com)";

    const links = linkRegex.extractGroups(markdown);
    expect(links).toEqual([
      ["GitHub", "https://github.com"],
      ["Google", "https://google.com"],
    ]);
  });

  it("should handle password strength validation", () => {
    const strongPasswordRegex = new RegExt(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    );

    expect(strongPasswordRegex.safeTest("Weak123")).toBe(false);
    expect(strongPasswordRegex.safeTest("Strong@123")).toBe(true);
    expect(strongPasswordRegex.safeTest("NoSpecial123")).toBe(false);
  });

  it("should handle escape mode with special characters", () => {
    const priceRegex = new RegExt("$100", { escape: true, flags: "g" });
    const text = "Item costs $100, sale price $100";

    const prices = priceRegex.extract(text);
    expect(prices).toEqual(["$100", "$100"]);
    expect(priceRegex.count(text)).toBe(2);
  });

  it("should handle hexadecimal color extraction", () => {
    const colorRegex = new RegExt("#[0-9a-fA-F]{6}", "g");
    const css = "color: #FF5733; background: #C70039;";

    const colors = colorRegex.extract(css);
    expect(colors).toEqual(["#FF5733", "#C70039"]);
  });

  it("should handle JSON key extraction", () => {
    const jsonKeyRegex = new RegExt('"([^"]+)"\\s*:', "g");
    const json = '{"name": "John", "age": 30, "city": "Tokyo"}';

    const keys = jsonKeyRegex.extractGroups(json);
    expect(keys).toEqual([["name"], ["age"], ["city"]]);
  });

  it("should handle file path extraction", () => {
    const pathRegex = new RegExt("[a-zA-Z]:\\\\.+?(?=\\s|$)", "g");
    const text =
      "Files at C:\\\\Users\\\\Documents\\\\file.txt and D:\\\\Data\\\\report.pdf";

    const paths = pathRegex.extract(text);
    expect(paths.length).toBe(2);
  });

  it("should handle Twitter mention extraction", () => {
    const mentionRegex = new RegExt("@[a-zA-Z0-9_]+", "g");
    const tweet = "Thanks @user1 and @user2 for the support!";

    const mentions = mentionRegex.extract(tweet);
    expect(mentions).toEqual(["@user1", "@user2"]);
  });

  it("should handle hashtag extraction", () => {
    const hashtagRegex = new RegExt("#[a-zA-Z0-9_]+", "g");
    const post = "Love #coding and #javascript #typescript";

    const hashtags = hashtagRegex.extract(post);
    expect(hashtags).toEqual(["#coding", "#javascript", "#typescript"]);
  });

  it("should handle version number extraction", () => {
    const versionRegex = new RegExt("v?(\\d+)\\.(\\d+)\\.(\\d+)", "g");
    const text = "Using v1.2.3 and upgrading to 2.0.0";

    const versions = versionRegex.extractGroups(text);
    expect(versions).toEqual([
      ["1", "2", "3"],
      ["2", "0", "0"],
    ]);
  });

  it("should handle credit card masking", () => {
    const cardRegex = new RegExt("(\\d{4})-(\\d{4})-(\\d{4})-(\\d{4})", "g");
    const text = "Card: 1234-5678-9012-3456";

    const masked = cardRegex.replaceAll(text, (_, p1, _p2, _p3, p4) => {
      return `${p1}-****-****-${p4}`;
    });
    expect(masked).toBe("Card: 1234-****-****-3456");
  });

  it("should handle SQL query parsing", () => {
    const selectRegex = new RegExt("SELECT\\s+(.+?)\\s+FROM\\s+(\\S+)", "gi");
    const sql = "SELECT name, age FROM users";

    const parsed = selectRegex.extractGroups(sql);
    expect(parsed).toEqual([["name, age", "users"]]);
  });

  it("should handle chunks method with matches and non-matches", () => {
    const regex = new RegExt("\\d+", "g");
    const text = "abc123def456";

    const chunks = regex.chunks(text);
    expect(chunks).toHaveLength(4);
    expect(chunks[0]).toEqual({ text: "abc", isMatch: false, index: 0 });
    expect(chunks[1]).toEqual({ text: "123", isMatch: true, index: 3 });
    expect(chunks[2]).toEqual({ text: "def", isMatch: false, index: 6 });
    expect(chunks[3]).toEqual({ text: "456", isMatch: true, index: 9 });
  });

  it("should handle multiple method combinations", () => {
    const regex = new RegExt("\\b\\w+\\b", "g");
    const text = "Hello world from JavaScript";

    const words = regex.extract(text);
    const count = regex.count(text);
    const lastWord = regex.findLast(text);
    const replaced = regex.replaceFirst(text, "WORD");

    expect(words).toEqual(["Hello", "world", "from", "JavaScript"]);
    expect(count).toBe(4);
    expect(lastWord![0]).toBe("JavaScript");
    expect(replaced).toBe("WORD world from JavaScript");
  });

  it("should handle non-global regex correctly", () => {
    const regex = new RegExt("\\d+");
    const text = "abc123def456";

    const match = regex.loopExec(text);
    expect(match).toHaveLength(1);
    expect(match![0][0]).toBe("123");

    const extracted = regex.extract(text);
    expect(extracted).toEqual(["123"]);
  });
});
