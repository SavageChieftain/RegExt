# RegExt API Reference

This document provides a comprehensive reference for all RegExt methods.

## Quick Overview

RegExt extends the standard JavaScript RegExp class with 8 powerful utility methods:

- **Core Methods**: `loopExec()`, `safeTest()` - Safe and enhanced regex execution
- **Replacement**: `replaceAll()`, `replaceFirst()` - Flexible string replacement
- **Extraction**: `extract()`, `extractGroups()` - Get matches and capture groups
- **Utilities**: `count()`, `findLast()` - Count matches and find patterns

## Constructor

### `new RegExt(pattern, flags?)`

Creates a new RegExt instance.

**Parameters:**
- `pattern` (string | RegExp): The regular expression pattern
- `flags` (string, optional): Optional flags for the regular expression

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const regexFromRegExp = new RegExt(/\d+/g);
```

## Core Methods

### `loopExec(str)`

Execute the regex against the string and return all matches with infinite loop prevention.

**Parameters:**
- `str` (string): The string to search

**Returns:**
- `RegExpExecArray[] | null`: Array of match results, or null if no matches

**Throws:**
- `TypeError`: If str is null or undefined

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const matches = regex.loopExec('123 456 789');
// [['123', index: 0, ...], ['456', index: 4, ...], ['789', index: 8, ...]]
```

### `safeTest(str)`

Test the pattern against a string without changing lastIndex.

**Parameters:**
- `str` (string): The string to test

**Returns:**
- `boolean`: true if the pattern matches, false otherwise

**Throws:**
- `TypeError`: If str is null or undefined

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
regex.lastIndex = 5;
const result = regex.safeTest('123 456'); // true
console.log(regex.lastIndex); // 5 (unchanged)
```

## Replacement Methods

### `replaceAll(str, replacement)`

Replace all matches in the string regardless of global flag.

**Parameters:**
- `str` (string): The string to search and replace
- `replacement` (string | function): The replacement string or function

**Returns:**
- `string`: The string with all matches replaced

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const result = regex.replaceAll('123 456 789', 'NUM');
// "NUM NUM NUM"

// With function replacement
const result2 = regex.replaceAll('123 456', (match) => `<${match}>`);
// "<123> <456>"
```

### `replaceFirst(str, replacement)`

Replace only the first match in the string.

**Parameters:**
- `str` (string): The string to search and replace
- `replacement` (string | function): The replacement string or function

**Returns:**
- `string`: The string with the first match replaced

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const result = regex.replaceFirst('123 456 789', 'NUM');
// "NUM 456 789"
```

## Extraction Methods

### `extract(str)`

Extract all matched strings as an array.

**Parameters:**
- `str` (string): The string to search

**Returns:**
- `string[]`: Array of matched strings

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const numbers = regex.extract('abc123def456ghi');
// ['123', '456']
```

### `extractGroups(str)`

Extract capture groups from all matches.

**Parameters:**
- `str` (string): The string to search

**Returns:**
- `(string | undefined)[][]`: Array of capture group arrays

**Example:**
```javascript
const regex = new RegExt('(\\d{2})(\\d{2})', 'g');
const groups = regex.extractGroups('1234 5678');
// [['12', '34'], ['56', '78']]
```

## Utility Methods

### `count(str)`

Count the number of matches.

**Parameters:**
- `str` (string): The string to search

**Returns:**
- `number`: Number of matches found

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const count = regex.count('123 456 789');
// 3
```

### `findLast(str)`

Find the last match.

**Parameters:**
- `str` (string): The string to search

**Returns:**
- `RegExpExecArray | null`: The last match result, or null if no match

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
const last = regex.findLast('123 456 789');
// ['789', index: 8, ...]
```

## Properties

### `originalPattern`

The original pattern used to create this RegExt instance.

**Type:** `string | RegExp` (readonly)

**Example:**
```javascript
const regex = new RegExt('\\d+', 'g');
console.log(regex.originalPattern); // "\\d+"
```

## Error Handling

All methods that accept a string parameter will throw a `TypeError` if the string is `null` or `undefined`:

```javascript
const regex = new RegExt('\\d+', 'g');

try {
  regex.loopExec(null); // Throws TypeError
} catch (error) {
  console.error(error.message); // "Input string cannot be null or undefined"
}
```

## Method Chaining

RegExt methods can be used together for complex operations:

```javascript
const regex = new RegExt('\\d+', 'g');
const text = 'abc123def456ghi789';

// Get count, extract matches, and find last match
const count = regex.count(text);
const matches = regex.extract(text);
const lastMatch = regex.findLast(text);

console.log(`Found ${count} matches: ${matches.join(', ')}`);
console.log(`Last match: ${lastMatch?.[0]}`);
```

## State Preservation

Most RegExt methods preserve the `lastIndex` property:

```javascript
const regex = new RegExt('\\d+', 'g');
regex.lastIndex = 10;

regex.safeTest('123 456 789');    // lastIndex remains 10
regex.replaceAll('123 456', 'X'); // lastIndex remains 10
regex.extract('123 456');         // lastIndex remains 10

console.log(regex.lastIndex); // 10
```

The only method that modifies `lastIndex` is `loopExec()`, but it restores the original value after execution.
