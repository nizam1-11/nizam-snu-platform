"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  /** Network failure — rendered as the fixed, friendly inline notice. */
  error?: boolean;
};

/** Only the approved, non-fabricated UI copy lives here. */
const GREETING = "Hi! I'm here to answer questions about SNU Automation.";
const SUGGESTIONS = [
  "What does SNU Automation do?",
  "Is it Windows only?",
  "Does it follow platform rules?",
] as const;

type ChatResponse = {
  reply?: string;
  configured?: boolean;
  error?: boolean;
};

/**
 * Floating AI help widget for SNU Automation.
 *
 * The WhatsApp shortcut is fixed bottom-right (z-[150]), so this launcher is
 * anchored bottom-left to stay clear of it on every breakpoint. The panel is a
 * compact, non-modal dialog — Escape closes it, the input takes focus on open,
 * and focus returns to the launcher on close. Motion is always on (no toggle),
 * but collapses to a short fade when `useReducedMotion()` reports a preference.
 */
export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: GREETING },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const reduce = useReducedMotion();
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launchRef.current?.focus());
  }, []);

  // Focus the input once the panel is mounted.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Escape closes from anywhere while the widget is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closePanel]);

  // Keep the newest message in view (scroll only the panel, never the page).
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, role: "user", content: trimmed },
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });
        if (!response.ok) throw new Error("Request failed");

        const data = (await response.json()) as ChatResponse;
        const reply =
          typeof data.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : "";
        if (!reply) throw new Error("Empty reply");

        // `configured: false` already carries an honest, friendly reply — show it.
        setMessages((prev) => [
          ...prev,
          { id: idRef.current++, role: "assistant", content: reply },
        ]);
      } catch {
        // Never surface raw errors — only the fixed, friendly inline notice.
        setMessages((prev) => [
          ...prev,
          { id: idRef.current++, role: "assistant", content: "", error: true },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const reduced = !!reduce;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            id="ai-assistant-panel"
            role="dialog"
            aria-label="Ask about SNU Automation"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 10 }}
            transition={{ duration: reduced ? 0.01 : 0.22, ease: "easeOut" }}
            style={{ transformOrigin: "bottom left" }}
            className="glass-strong gradient-border fixed bottom-[4.5rem] left-4 z-[150] flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl shadow-2xl sm:bottom-20 sm:left-6"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-accent-electric/10 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-accent-electric/25 bg-accent-blue/15 text-accent-electric">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="truncate font-heading text-sm font-semibold text-text-primary">
                  Ask about SNU Automation
                </h2>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close AI assistant"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="flex shrink-0 flex-wrap gap-1.5 px-4 pt-3">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendMessage(suggestion)}
                  className="rounded-full border border-accent-electric/20 bg-surface-elevated/60 px-3 py-1.5 text-left text-[11px] leading-tight text-text-secondary transition-colors hover:border-accent-electric/50 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation"
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      message.role === "user"
                        ? "rounded-br-md border border-accent-electric/20 bg-accent-blue/15 text-text-primary"
                        : "rounded-bl-md border border-accent-electric/10 bg-surface-card/70 text-text-secondary"
                    )}
                  >
                    {message.error ? (
                      <span>
                        Couldn&apos;t reach the assistant. Try the{" "}
                        <Link
                          href="/contact"
                          className="font-medium text-accent-electric underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
                        >
                          Contact page
                        </Link>
                        .
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-accent-electric/10 bg-surface-card/70 px-3.5 py-3">
                    <span className="sr-only">Assistant is typing</span>
                    <span aria-hidden="true" className="flex items-center gap-1">
                      {[0, 1, 2].map((index) => (
                        <motion.span
                          key={index}
                          className="h-1.5 w-1.5 rounded-full bg-accent-electric"
                          initial={reduce ? false : { opacity: 0.3, y: 0 }}
                          animate={
                            reduce
                              ? { opacity: 0.6 }
                              : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }
                          }
                          transition={
                            reduce
                              ? { duration: 0 }
                              : {
                                  duration: 0.9,
                                  repeat: Infinity,
                                  delay: index * 0.15,
                                  ease: "easeInOut",
                                }
                          }
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="flex shrink-0 items-center gap-2 border-t border-accent-electric/10 px-3 py-3"
            >
              <label htmlFor="ai-assistant-input" className="sr-only">
                Your message
              </label>
              <input
                id="ai-assistant-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type a message…"
                autoComplete="off"
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-xl border border-accent-electric/15 bg-surface-deep/70 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus-visible:border-accent-electric/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-blue text-bg-base transition-colors hover:bg-accent-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Honesty note */}
            <p className="shrink-0 border-t border-accent-electric/10 px-4 py-2 text-center text-[10px] leading-snug text-text-muted">
              AI can make mistakes — check important details on the{" "}
              <Link
                href="/contact"
                className="text-accent-electric underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric"
              >
                Contact page
              </Link>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher — bottom-left keeps it clear of the bottom-right WhatsApp link. */}
      <button
        ref={launchRef}
        type="button"
        onClick={() => (open ? closePanel() : setOpen(true))}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        aria-controls="ai-assistant-panel"
        title={open ? "Close AI assistant" : "Ask about SNU Automation"}
        className="glass-strong fixed bottom-4 left-4 z-[150] grid h-12 w-12 place-items-center rounded-full border border-accent-electric/30 text-accent-electric shadow-lg shadow-accent-blue/20 transition-colors hover:border-accent-electric/60 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-electric focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base sm:bottom-6 sm:left-6 sm:h-14 sm:w-14"
      >
        {open ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        ) : (
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
