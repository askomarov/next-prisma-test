"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { useMemo, useState } from "react";
import { SendIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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

function getTimezone(): string {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Belgrade"
    );
  } catch {
    return "Europe/Belgrade";
  }
}

export function AssistantChat() {
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

  const { messages, sendMessage, status, error } = useChat({ transport });
  const isBusy = status === "submitted" || status === "streaming";

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
                            <MessageFooter>
                              {toolParts.map((part, partIndex) => {
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
                                    : toolName === "createTransaction"
                                      ? "Создаю транзакцию"
                                      : "Выполняю tool";

                                const label =
                                  state === "output-available"
                                    ? toolName === "getTransactionStats"
                                      ? "Статистика готова"
                                      : "Транзакция обработана"
                                    : state === "output-error"
                                      ? "Ошибка tool"
                                      : `${actionLabel}…`;

                                return (
                                  <span
                                    key={`${message.id}-tool-${partIndex}`}
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
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Опиши транзакцию…"
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
