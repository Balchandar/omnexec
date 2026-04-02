export interface AiFileMeta {
  model: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AiFileConversationEntry {
  role: "system" | "user";
  content: string;
}

export interface AiFileAssertions {
  contains?: string | string[];
}

export interface AiFile {
  meta: AiFileMeta;
  context: Record<string, string>;
  conversation: AiFileConversationEntry[];
  assert?: AiFileAssertions;
}

export interface RunResult {
  file: string;
  output: string;
  passed: boolean;
  error?: string;
}
