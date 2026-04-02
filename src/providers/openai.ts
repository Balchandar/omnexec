import OpenAI from "openai";
import { AiFile } from "../types";

export async function run(aiFile: AiFile): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is required. Set it with: export OPENAI_API_KEY=your-key",
    );
  }

  const client = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] =
    aiFile.conversation.map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

  const response = await client.chat.completions.create({
    model: aiFile.meta.model,
    messages,
    temperature: aiFile.meta.temperature,
    max_tokens: aiFile.meta.max_tokens,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response content from model");
  }

  return content;
}
