# RegExt - Extended Regular Expression Class

[![npm version](https://badge.fury.io/js/regext.svg)](https://badge.fury.io/js/regext)
[![Release](https://github.com/SavageChieftain/regext/workflows/Release/badge.svg)](https://github.com/SavageChieftain/regext/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

- RegExt is a TypeScript library that provides convenient utility methods by extending JavaScript's standard RegExp class.
- It offers complete TypeScript support and type safety.

## Features

- 🚀 Full TypeScript support
- 📦 ES Modules & CommonJS support
- 🔧 Rich extension methods
- 🛡️ Type-safe operations
- 📝 Comprehensive JSDoc documentation

## Installation

```bash
npm install regext
```

## Usage

### ES Modules (TypeScript/JavaScript)

```typescript
import RegExt from 'regext';

// Full type support in TypeScript
const regex = new RegExt('\\d+', 'g');
const numbers: string[] = regex.extract('abc123def456');
console.log(numbers); // ['123', '456']
```

### CommonJS

```javascript
const RegExt = require('regext').default;
```

### TypeScript

```typescript
import RegExt from 'regext';
```

## Quick Start

```javascript
import RegExt, { escape } from 'regext';

const regex = new RegExt('\\d+', 'g');

// Extract all numbers from text
const numbers = regex.extract('Price: $29.99, Tax: $3.50');
console.log(numbers); // ['29', '99', '3', '50']

// Count matches
const count = regex.count('123 456 789');
console.log(count); // 3

// Safe testing without affecting lastIndex
const hasNumbers = regex.safeTest('abc123');
console.log(hasNumbers); // true

// Use escape mode for literal string matching
const literalRegex = new RegExt('$100', { escape: true, flags: 'g' });
console.log(literalRegex.test('$100')); // true

// Or use the escape utility function
const pattern = escape('$100');
const regex2 = new RegExt(pattern, 'g');
```

## Methods Overview

### Instance Methods
- **`loopExec(str)`** - Get all matches with infinite loop prevention
- **`safeTest(str)`** - Test without modifying lastIndex
- **`extract(str)`** - Extract matched strings as array
- **`extractGroups(str)`** - Extract capture groups
- **`replaceAll(str, replacement)`** - Replace all matches
- **`replaceFirst(str, replacement)`** - Replace first match only
- **`count(str)`** - Count number of matches
- **`findLast(str)`** - Get the last match

### Utility Functions
- **`escape(str)`** - Escape special regex characters for literal matching

### Constructor Options
- **Escape Mode** - Automatically escape patterns for literal string matching

## Documentation

- [📖 API Reference](./docs/api.md) - Complete API documentation
- [💡 Usage Examples](./docs/examples.md) - Practical examples and use cases
- [🤝 Contributing](./CONTRIBUTING.md) - Development setup and guidelines

## License

MIT
