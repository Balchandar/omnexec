import * as yaml from "yaml";
import { AiFile, AiFileConversationEntry } from "./types";

const SECTIONS = ["@meta", "@context", "@conversation", "@assert"] as const;

type SectionName = (typeof SECTIONS)[number];

interface RawSections {
  "@meta"?: string;
  "@context"?: string;
  "@conversation"?: string;
  "@assert"?: string;
}

export function parse(content: string): AiFile {
  const sections = splitSections(content);

  const meta = sections["@meta"]
    ? yaml.parse(sections["@meta"])
    : { model: "gpt-4o" };

  const context = sections["@context"]
    ? yaml.parse(sections["@context"]) ?? {}
    : {};

  const conversation = parseConversation(sections["@conversation"] ?? "");

  const assert = sections["@assert"]
    ? yaml.parse(sections["@assert"])
    : undefined;

  return { meta, context, conversation, assert };
}

function splitSections(content: string): RawSections {
  const result: RawSections = {};
  let currentSection: SectionName | null = null;
  const lines: string[] = [];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (SECTIONS.includes(trimmed as SectionName)) {
      if (currentSection) {
        result[currentSection] = lines.join("\n");
      }
      currentSection = trimmed as SectionName;
      lines.length = 0;
      continue;
    }

    if (currentSection) {
      lines.push(line);
    }
  }

  if (currentSection) {
    result[currentSection] = lines.join("\n");
  }

  return result;
}

function parseConversation(raw: string): AiFileConversationEntry[] {
  if (!raw.trim()) return [];

  const parsed = yaml.parse(raw);
  if (!parsed) return [];

  // Support flat format: { system: "...", user: "..." }
  if (typeof parsed === "object" && !Array.isArray(parsed)) {
    const entries: AiFileConversationEntry[] = [];
    for (const [role, content] of Object.entries(parsed)) {
      if (role === "system" || role === "user") {
        entries.push({ role, content: String(content) });
      }
    }
    return entries;
  }

  return [];
}
