#!/usr/bin/env node

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import chalk from "chalk";
import { Command } from "commander";
import { glob } from "glob";
import { runFile } from "./runner";

const program = new Command();

program
  .name("omnx")
  .description("Execute .ai files — run AI prompts like code")
  .version("0.1.0");

program
  .command("run <file>")
  .description("Run a single .ai file")
  .action(async (file: string) => {
    try {
      const stdin = await readStdin();

      // 🔥 Optional guard (better DX)
      if (!process.env.OPENAI_API_KEY) {
        console.log(chalk.yellow("\n⚠️ No OPENAI_API_KEY found"));
        console.log(chalk.gray("You can:"));
        console.log(chalk.gray("  1. Create .env → OPENAI_API_KEY=your-key"));
        console.log(chalk.gray("  2. export OPENAI_API_KEY=your-key"));
        console.log(chalk.gray("  3. (future) use local model like Ollama\n"));
      }

      const result = await runFile(file, stdin);

      console.log(chalk.bold("\n> AI Output:"));
      console.log(result.output);

      if (result.passed) {
        console.log(chalk.green("\n✔ Assertions passed"));
      } else {
        console.log(chalk.red(`\n❌ Assertion failed: ${result.error}`));
        process.exit(1);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`\nError: ${message}`));
      process.exit(1);
    }
  });

program
  .command("test")
  .description("Run all .ai files in the project")
  .action(async () => {
    try {
      const files = await glob("**/*.ai", {
        ignore: "node_modules/**",
      });

      if (files.length === 0) {
        console.log(chalk.yellow("No .ai files found"));
        return;
      }

      console.log(
        chalk.bold(`\nRunning ${files.length} .ai file(s)...\n`)
      );

      let passed = 0;
      let failed = 0;

      for (const file of files) {
        try {
          const result = await runFile(file);

          if (result.passed) {
            console.log(chalk.green(`  ✔ ${file}`));
            passed++;
          } else {
            console.log(chalk.red(`  ❌ ${file} (${result.error})`));
            failed++;
          }
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : String(err);
          console.log(chalk.red(`  ❌ ${file} (${message})`));
          failed++;
        }
      }

      console.log(
        chalk.bold(`\nResults: ${passed} passed, ${failed} failed\n`)
      );

      if (failed > 0) process.exit(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`\nError: ${message}`));
      process.exit(1);
    }
  });

program.parse();

// 🔹 STDIN helper
function readStdin(): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve(undefined);
      return;
    }

    let data = "";
    process.stdin.setEncoding("utf-8");

    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));

    // fallback timeout
    setTimeout(() => resolve(data || undefined), 100);
  });
}