import OpenAI from "openai";
import { AiFile } from "../types";

export async function run(aiFile: AiFile): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL =
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(`
OPENAI_API_KEY is missing

Fix:
  1. Create .env
     OPENAI_API_KEY=your-key

  2. (optional)
     OPENAI_BASE_URL=your-compatible-endpoint
`);
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] =
    aiFile.conversation.map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

  const model =
    aiFile.meta.model ||
    process.env.OMNEXEC_MODEL ||
    "gpt-4o";

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: aiFile.meta.temperature ?? 0.7,
    max_tokens: aiFile.meta.max_tokens ?? 1024,
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from model");
  }

  return content;
}