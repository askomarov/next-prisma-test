import { openai } from "@ai-sdk/openai";
import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserPreferences } from "@/entities/user-preferences/server";
import { getUserWalletOptions } from "@/entities/wallet/server";
import {
  buildSystemPrompt,
  createAssistantTools,
} from "@/features/ai-assistant/server";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

export const maxDuration = 30;

const DEFAULT_TIMEZONE = "Europe/Belgrade";

function resolveTimezone(request: Request): string {
  const header = request.headers.get("x-timezone")?.trim();
  if (!header) {
    return DEFAULT_TIMEZONE;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: header });
    return header;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export async function POST(request: Request) {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await request.json();
  const timezone = resolveTimezone(request);

  const [wallets, categories, preferences] = await Promise.all([
    getUserWalletOptions(userId),
    getUserCategoryOptions(userId),
    getUserPreferences(userId),
  ]);

  if (wallets.length === 0) {
    return Response.json(
      { error: "Сначала создайте хотя бы один кошелёк" },
      { status: 400 },
    );
  }

  const tools = createAssistantTools({ userId, wallets, categories });
  const system = buildSystemPrompt({
    wallets,
    categories,
    preferences,
    timezone,
    now: new Date(),
  });

  const modelId = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const result = streamText({
    model: openai.chat(modelId),
    system,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(8),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, tools }),
  });
}
