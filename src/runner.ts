import * as fs from "fs";
import * as path from "path";
import { parse } from "./parser";
import { resolveContext } from "./context";
import { run as runOpenAI } from "./providers/openai";
import { checkAssertions } from "./assert";
import { RunResult } from "./types";

export async function runFile(
  filePath: string,
  stdinContent?: string,
): Promise<RunResult> {
  const absolutePath = path.resolve(filePath);
  const content = fs.readFileSync(absolutePath, "utf-8");

  // Parse
  const aiFile = parse(content);

  // Resolve context and templates
  const resolved = resolveContext(aiFile, absolutePath, stdinContent);

  // Execute
  const output = await runOpenAI(resolved);

  // Assert
  let passed = true;
  let error: string | undefined;

  if (resolved.assert) {
    const result = checkAssertions(output, resolved.assert);
    passed = result.passed;
    error = result.error;
  }

  return {
    file: filePath,
    output,
    passed,
    error,
  };
}
