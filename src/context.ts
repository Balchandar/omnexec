import * as fs from "fs";
import * as path from "path";
import { AiFile } from "./types";

const TEMPLATE_RE = /\{\{(.+?)\}\}/g;

export function resolveContext(
  aiFile: AiFile,
  filePath: string,
  stdinContent?: string,
): AiFile {
  const dir = path.dirname(filePath);
  const contextValues: Record<string, string> = {};

  // Resolve context section file references
  for (const [key, value] of Object.entries(aiFile.context)) {
    contextValues[key] = resolveValue(String(value), dir, stdinContent);
  }

  // Replace templates in conversation messages
  const conversation = aiFile.conversation.map((entry) => ({
    ...entry,
    content: replaceTemplates(entry.content, contextValues, dir, stdinContent),
  }));

  return { ...aiFile, context: contextValues, conversation };
}

function resolveValue(
  value: string,
  dir: string,
  stdinContent?: string,
): string {
  // Check if the entire value is a file reference like {{./file.txt}}
  const match = value.match(/^\{\{(.+?)\}\}$/);
  if (match) {
    return resolveReference(match[1].trim(), dir, stdinContent);
  }
  return value;
}

function resolveReference(
  ref: string,
  dir: string,
  stdinContent?: string,
): string {
  if (ref === "stdin") {
    if (!stdinContent) {
      throw new Error("stdin referenced but no input was piped");
    }
    return stdinContent;
  }

  // File path reference
  const resolved = path.resolve(dir, ref);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Referenced file not found: ${resolved}`);
  }
  return fs.readFileSync(resolved, "utf-8");
}

function replaceTemplates(
  text: string,
  contextValues: Record<string, string>,
  dir: string,
  stdinContent?: string,
): string {
  return text.replace(TEMPLATE_RE, (_, ref: string) => {
    const key = ref.trim();

    // Check context values first
    if (key in contextValues) {
      return contextValues[key];
    }

    // Then try to resolve as file or stdin
    return resolveReference(key, dir, stdinContent);
  });
}
