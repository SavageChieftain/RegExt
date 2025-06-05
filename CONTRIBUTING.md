# Contributing to RegExt

Thank you for your interest in contributing to RegExt! This document provides guidelines and information for contributors.

## Development Setup

### Getting Started

```bash
# Clone the repository
git clone https://github.com/SavageChieftain/regext.git
cd regext

# Install dependencies
npm install

# Git hooks are automatically installed via the prepare script
# If needed, you can manually install them:
npm run lefthook:install
```

### Development Scripts

```bash
# Build the project
npm run build
npm run build:watch    # Watch mode

# Testing
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix auto-fixable issues
npm run lint:check    # Strict check including warnings

# Type Checking
npm run type-check         # Run TypeScript type checking
npm run type-check:watch   # Type checking in watch mode

# Cleanup
npm run clean         # Remove dist folder
```

## Code Quality Standards

This project uses ESLint 9.x for code quality management and lefthook for Git hooks.

### ESLint Configuration

- **ESLint 9.x**: Uses the latest flat config format
- **ES2024**: Supports the latest JavaScript features
- **ES Modules**: Uses import/export syntax
- **Strict Code Style**: Double quotes and semicolons required
- **Complexity Check**: Method complexity limited to 10
- **Test Files**: Allows Vitest global variables

### Git Hooks

The project uses lefthook to manage Git hooks:

- **pre-commit**: Runs linting, type checking, and tests
- **commit-msg**: Validates commit messages using commitlint
- **pre-push**: Runs tests and build verification

## Commit Guidelines

This project follows [Conventional Commits](https://conventionalcommits.org/) specification.
Git hooks will automatically validate your commit messages.

### Commit Message Format

```plain
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add new extractGroups method
fix: handle empty string input in loopExec
docs: update README with new examples
test: add edge cases for count method
chore: update dependencies
```

### Breaking Changes

Breaking changes should be indicated by `!` after the type/scope:

```bash
feat!: remove deprecated hasMatch method
```

Or in the footer:

```bash
feat: add new validation

BREAKING CHANGE: validation now throws for invalid patterns
```

## TypeScript Support

RegExt provides complete TypeScript type definitions:

- **Type Definition File**: Complete type support in `dist/index.d.ts`
- **TypeScript Configuration**: Strict type checking in `tsconfig.json`
- **Type Safety**: Proper return types defined for all methods
- **JSDoc**: Detailed documentation included in type definitions

```typescript
import RegExt from 'regext';

const regex = new RegExt(/(\d+)/g);
const matches: RegExpExecArray[] | null = regex.loopExec("123 456");
const count: number = regex.count("123 456");
```

## Testing

All new features and bug fixes should include appropriate tests. We use Vitest as our testing framework.

### Test Structure

- Unit tests for individual methods are in separate files
- Integration tests verify methods work together
- Edge case tests cover boundary conditions

### Running Tests

Tests are automatically run by Git hooks, but you can also run them manually:

```bash
# Run all tests
npm test

# Run tests once (useful for CI)
npm run test:run

# Run with coverage
npm run test:coverage
```

## Release Process

This project uses semantic-release for automated versioning and publishing:

1. **Development**: Work on feature branches
2. **Pull Request**: Create PR to main branch
3. **Review**: Code review and approval
4. **Merge**: Merge to main triggers CI/CD
5. **Release**: semantic-release automatically:
   - Analyzes commits to determine version bump
   - Generates CHANGELOG.md
   - Creates GitHub release
   - Publishes to npm

No manual versioning or publishing is required.

## Project Structure

```bash
root/
├── src/
│   └── index.ts              # Main library source file
├── dist/                     # Compiled output (generated)
│   ├── index.js              # Compiled JavaScript
│   ├── index.js.map          # Source map
│   ├── index.d.ts            # TypeScript type definitions
│   └── index.d.ts.map        # Type definition source map
├── docs/                     # Documentation
│   ├── api.md               # API reference
│   └── examples.md          # Usage examples
├── tests/                   # Test files
│   ├── *.test.ts            # Individual test files
│   ├── integration.test.ts  # Integration tests
│   └── edgeCases.test.ts    # Edge case tests
├── .github/workflows/       # GitHub Actions
├── CONTRIBUTING.md          # This file
├── CHANGELOG.md             # Version history (auto-generated)
├── README.md                # Main documentation
└── package.json             # Project configuration
```

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Create a new issue for bugs or feature requests
3. Start a discussion for general questions

Thank you for contributing to RegExt!
