"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useMemo, useState } from "react";
import { SendIcon } from "lucide-react";

import type { CategoryOption } from "@/entities/category";
import type { UserPreferences } from "@/entities/user-preferences";
import type { WalletOption } from "@/entities/wallet";
import { Button } from "@/shared/ui/button";
import { Bubble, BubbleContent } from "@/shared/ui/bubble";
import { Message, MessageContent, MessageFooter } from "@/shared/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/shared/ui/message-scroller";
import { Textarea } from "@/src/shared/ui/textarea/textarea";

import type {
  CreateTransactionToolInput,
  CreateTransactionToolOutput,
} from "../model/types";
import { TransactionPreviewCard } from "./transaction-preview-card";

function getTimezone(): string {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Belgrade"
    );
  } catch {
    return "Europe/Belgrade";
  }
}

function isCreateTransactionInput(
  value: unknown,
): value is CreateTransactionToolInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const input = value as Record<string, unknown>;
  return (
    typeof input.walletId === "string" &&
    (input.kind === "INCOME" || input.kind === "EXPENSE") &&
    (input.moneyType === "REAL" || input.moneyType === "VIRTUAL") &&
    typeof input.amount === "number" &&
    typeof input.occurredAt === "string"
  );
}

function getCreateTransactionOutputLabel(output: unknown): string {
  if (!output || typeof output !== "object") {
    return "Транзакция обработана";
  }

  const result = output as CreateTransactionToolOutput;
  if (result.success) {
    return "Транзакция создана";
  }
  if (result.cancelled) {
    return "Создание отменено";
  }
  return result.error ? `Ошибка: ${result.error}` : "Ошибка создания";
}

type AssistantChatProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
  preferences?: UserPreferences;
};

export function AssistantChat({
  wallets,
  categories,
  preferences,
}: AssistantChatProps) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/assistant",
        headers: () => ({
          "x-timezone": getTimezone(),
        }),
      }),
    [],
  );

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const hasPendingCreatePreview = messages.some((message) =>
    message.parts.some(
      (part) =>
        part.type === "tool-createTransaction" &&
        part.state === "input-available",
    ),
  );
  const isBusy = isStreaming || hasPendingCreatePreview;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) {
      return;
    }

    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="space-y-3">
      <div className="flex h-[min(70vh,720px)] min-h-100 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <MessageScrollerProvider>
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-4">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Напиши обычным языком, например: «Сегодня купил продукты на
                    1200 картой».
                  </p>
                ) : null}

                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  const align = isUser ? "end" : "start";
                  const isLast = index === messages.length - 1;

                  const textParts = message.parts.filter(
                    (part) => part.type === "text",
                  );
                  const toolParts = message.parts.filter((part) =>
                    isToolUIPart(part),
                  );

                  return (
                    <MessageScrollerItem key={message.id} scrollAnchor={isLast}>
                      <Message align={align}>
                        <MessageContent>
                          {textParts.map((part, partIndex) =>
                            part.type === "text" ? (
                              <Bubble
                                key={`${message.id}-text-${partIndex}`}
                                variant={isUser ? "default" : "secondary"}
                                align={align}
                              >
                                <BubbleContent className="whitespace-pre-wrap">
                                  {part.text}
                                </BubbleContent>
                              </Bubble>
                            ) : null,
                          )}

                          {toolParts.length > 0 ? (
                            <MessageFooter className="flex flex-col items-stretch gap-3">
                              {toolParts.map((part, partIndex) => {
                                const key = `${message.id}-tool-${partIndex}`;

                                if (part.type === "tool-createTransaction") {
                                  if (part.state === "input-streaming") {
                                    return (
                                      <span
                                        key={key}
                                        className="text-xs text-muted-foreground"
                                      >
                                        Готовлю превью…
                                      </span>
                                    );
                                  }

                                  if (
                                    part.state === "input-available" &&
                                    isCreateTransactionInput(part.input)
                                  ) {
                                    return (
                                      <TransactionPreviewCard
                                        key={key}
                                        input={part.input}
                                        wallets={wallets}
                                        categories={categories}
                                        preferences={preferences}
                                        onResolved={(output) => {
                                          // No await — avoid potential deadlocks with useChat
                                          void addToolOutput({
                                            tool: "createTransaction",
                                            toolCallId: part.toolCallId,
                                            output,
                                          });
                                        }}
                                      />
                                    );
                                  }

                                  if (part.state === "output-available") {
                                    return (
                                      <span
                                        key={key}
                                        className="text-xs text-muted-foreground"
                                      >
                                        {getCreateTransactionOutputLabel(
                                          part.output,
                                        )}
                                      </span>
                                    );
                                  }

                                  if (part.state === "output-error") {
                                    return (
                                      <span
                                        key={key}
                                        className="text-xs text-destructive"
                                      >
                                        Ошибка tool
                                      </span>
                                    );
                                  }

                                  return null;
                                }

                                const state =
                                  "state" in part
                                    ? String(part.state)
                                    : "unknown";
                                const toolName =
                                  "type" in part &&
                                  typeof part.type === "string" &&
                                  part.type.startsWith("tool-")
                                    ? part.type.slice("tool-".length)
                                    : "tool";

                                const actionLabel =
                                  toolName === "getTransactionStats"
                                    ? "Считаю статистику"
                                    : "Выполняю tool";

                                const label =
                                  state === "output-available"
                                    ? toolName === "getTransactionStats"
                                      ? "Статистика готова"
                                      : "Tool выполнен"
                                    : state === "output-error"
                                      ? "Ошибка tool"
                                      : `${actionLabel}…`;

                                return (
                                  <span
                                    key={key}
                                    className="text-xs text-muted-foreground"
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                            </MessageFooter>
                          ) : null}
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>

        {error ? (
          <p className="border-t border-border px-4 py-2 text-sm text-destructive">
            {error.message || "Не удалось получить ответ"}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              hasPendingCreatePreview
                ? "Сначала подтверди или отклони превью…"
                : "Опиши транзакцию…"
            }
            disabled={isBusy}
            className="flex-1"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isBusy || !input.trim()}
            aria-label="Отправить"
          >
            <SendIcon />
          </Button>
        </form>
      </div>

      {process.env.NODE_ENV === "development" ? (
        <details
          open
          className="rounded-xl border border-dashed border-border bg-muted/40 p-3"
        >
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            debug · POST /api/assistant body (messages) · status={status}
          </summary>
          <pre className="mt-2 max-h-80 overflow-auto text-xs leading-relaxed whitespace-pre-wrap break-all">
            {JSON.stringify(
              { messages, status, error: error?.message ?? null },
              null,
              2,
            )}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
