# OmnExec

Run AI from files. Execute, test, and version prompts like code.

[![npm version](https://img.shields.io/npm/v/omnexec)](https://www.npmjs.com/package/omnexec)
[![license](https://img.shields.io/npm/l/omnexec)](./LICENSE)
[![node](https://img.shields.io/node/v/omnexec)](https://nodejs.org)
[![build](https://img.shields.io/github/actions/workflow/status/balchandar/omnexec/ci.yml?branch=main)](https://github.com/balchandar/omnexec/actions)

**The execution layer for AI.**

OmnExec (`omnx`) executes `.ai` files — a structured, human-readable format for running AI prompts with model configuration, file context, and output assertions.

Think `.http` files, but for LLMs.

Each `.ai` file is an executable prompt — with inputs, configuration, and assertions.

---

## Quick Start

Create a file called `hello.ai`:

```yaml
@conversation
  user: |
    Say hello world
```

Run it:

```bash
omnx run hello.ai
```

```
▶ AI Output
----------------------------------------
Hello world!
----------------------------------------

✔ Assertions passed
```

Prompts are files. Files are executable.

---

## Why

Prompting in chat tools doesn’t scale.

* Prompts aren’t versioned
* Inputs aren’t reproducible
* Outputs aren’t testable

OmnExec treats prompts as executable artifacts — like code.

You define them in files, run them from the CLI, and validate outputs with assertions.

---

## Features

* **File-based execution** — define prompts as runnable files
* **Assertions** — validate outputs like tests
* **Context injection** — `{{./file}}` and `{{stdin}}`
* **Test runner** — `omnx test` runs all `.ai` files
* **Structured format** — config, context, and prompts in one place

---

## Installation

```bash
npm install -g omnexec
```

Requires Node.js >= 18 and an OpenAI API key:

```bash
export OPENAI_API_KEY=sk-...
```

---

## Usage

### Run a single file

```bash
omnx run summarize.ai
```

### Pipe input via stdin

```bash
cat logs.txt | omnx run debug.ai
```

Inside `debug.ai`, reference the piped content with `{{stdin}}`:

```yaml
@conversation
  user: |
    Analyze these logs for errors:
    {{stdin}}
```

### Run all `.ai` files as tests

```bash
omnx test
```

```
Running 3 .ai file(s)...

  ✔ examples/hello.ai
  ✔ examples/summarize.ai
  ❌ examples/classify.ai (missing "category")

--------------------------------
Results: 2 passed, 1 failed
```

The process exits with code 1 if any file fails, so `omnx test` works in CI pipelines.

---

## .ai File Format

An `.ai` file has four optional sections, each starting with `@`:

```yaml
@meta
  model: gpt-4o
  temperature: 0.3

@context
  input: "{{./input.txt}}"

@conversation
  system: You are a concise summarizer.
  user: |
    Summarize the following:
    {{input}}

@assert
  contains: "summary"
```

### `@meta`

Model configuration. Defaults to `gpt-4o` if omitted.

| Field         | Type   | Default |
| ------------- | ------ | ------- |
| `model`       | string | gpt-4o  |
| `temperature` | number | —       |
| `max_tokens`  | number | —       |

---

### `@context`

Named variables resolved before execution. Values can reference local files or stdin:

```yaml
@context
  readme: "{{./README.md}}"
  piped: "{{stdin}}"
```

File paths are resolved relative to the `.ai` file, not the working directory.

---

### `@conversation`

The messages sent to the model. Supports `system` and `user` roles:

```yaml
@conversation
  system: You are a helpful assistant.
  user: Explain this code.
```

Context variables and file references are interpolated with `{{name}}` syntax.

---

### `@assert`

Validate the model's output. Currently supports `contains` (case-insensitive):

```yaml
@assert
  contains: "expected text"
```

Also accepts a list:

```yaml
@assert
  contains:
    - "first thing"
    - "second thing"
```

---

## Examples

### hello.ai

```yaml
@meta
  model: gpt-4o
  temperature: 0.7

@conversation
  user: Say hello in a creative way. Keep it to one sentence.

@assert
  contains: "hello"
```

---

### summarize.ai

```yaml
@meta
  model: gpt-4o
  temperature: 0.3

@context
  input: "{{./input.txt}}"

@conversation
  system: You are a concise summarizer. Always include the word "summary" in your response.
  user: |
    Summarize the following:
    {{input}}

@assert
  contains: "summary"
```

---

## CLI Reference

Basic usage:

```bash
omnx run file.ai
omnx test
```

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `omnx run <file>` | Execute a single `.ai` file      |
| `omnx test`       | Discover and run all `.ai` files |
| `omnx --version`  | Print version                    |
| `omnx --help`     | Show help                        |

---

## Roadmap

* Multi-provider support (Anthropic, local models)
* `omnx compare` — run prompts across models
* Cost estimation
* Snapshot diffs (track output changes)
* Watch mode (`omnx watch`)
* Additional assertions (`regex`, `json_schema`)

---

## Development

```bash
git clone https://github.com/balchandar/omnexec.git
cd omnexec
npm install
npm run build
node dist/cli.js run examples/hello.ai
```

---

## Contributing

Contributions are welcome.

If you’re planning a change, please open an issue first to discuss it.

### Development

```bash
git clone https://github.com/balchandar/omnexec.git
cd omnexec
npm install
npm run build
node dist/cli.js run examples/hello.ai
```

### Guidelines

* Keep changes focused and minimal
* Follow existing code style and structure
* Add tests where applicable
* Update documentation if behavior changes

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

One feature or fix per PR.

---

## License

[MIT](./LICENSE)
