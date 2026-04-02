# Contributing to OmnExec

Thank you for your interest in contributing to OmnExec.

OmnExec is designed as a minimal, developer-first execution layer for AI. Contributions should align with its core principles: simplicity, determinism, and composability.

---

## Getting Started

### Prerequisites

* Node.js >= 18
* npm

### Setup

```bash
git clone https://github.com/balchandar/omnexec.git
cd omnexec
npm install
npm run build
```

### Run locally

```bash
node dist/cli.js run examples/hello.ai
```

---

## Running Tests

```bash
npm test
```

Or:

```bash
node dist/cli.js test
```

---

## Project Structure

```
src/
  cli/        CLI entrypoints
  core/       execution engine
  parser/     .ai file parsing
  assert/     assertion logic
```

---

## Contribution Guidelines

### Scope

* Keep changes focused and minimal
* One feature or fix per pull request
* Avoid mixing refactoring with feature work

---

### Code Style

* Follow the existing code structure and patterns
* Prefer small, composable functions
* Avoid unnecessary abstractions
* Do not introduce heavy dependencies without discussion

---

### Tests

* Add or update tests for any behavioral change
* Use `.ai` files where applicable
* Ensure all tests pass before submitting a PR

---

### Documentation

Update documentation if your change affects:

* CLI behavior
* `.ai` file format
* Assertions
* Configuration options

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feat/your-feature-name
```

3. Make your changes
4. Commit using clear messages:

```bash
feat: add regex assertion support
fix: resolve context interpolation issue
```

5. Push your branch
6. Open a pull request

---

## Commit Convention

Use conventional commit format:

* feat: new feature
* fix: bug fix
* docs: documentation changes
* refactor: internal code changes
* test: test updates

---

## Reporting Issues

When reporting issues, include:

* A minimal `.ai` file reproducing the issue
* CLI command used
* Expected behavior
* Actual behavior
* Environment details

---

## Design Principles

These must not be violated:

* `.ai` files must remain simple and readable
* Execution must be deterministic
* CLI must remain minimal and fast
* Avoid implicit or hidden behavior

---

## Before Submitting Large Changes

Open an issue to discuss the proposal before implementation.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
