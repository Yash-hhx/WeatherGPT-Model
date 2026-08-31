import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { askWeatherGpt } from "@/lib/chat.functions";
import { severityText, type Hazard } from "@/lib/hazards";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function ChatRail({ hazard }: { hazard: Hazard }) {
  const ask = useServerFn(askWeatherGpt);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send() {
    const text = input.trim();
    if (!text || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    setError(null);
    try {
      const res = await ask({
        data: {
          hazard: hazard.event,
          states: hazard.states,
          context: `${hazard.briefing} || ${hazard.metrics.map((m) => `${m.label}: ${m.value}`).join("; ")}`,
          messages: next,
        },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed. Retry in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex w-[400px] shrink-0 flex-col border-r border-border bg-background/80 backdrop-blur-xl">
      <header className="border-b border-border p-6">
        <h1 className="text-balance font-display text-2xl uppercase tracking-tight">
          WeatherGPT India
        </h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-subtle-foreground">
          IMD · CWC · NDMA Intelligence Node · {hazard.states}
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-hazard-safe">
            Intelligence Engine
          </p>
          <p className="max-w-[56ch] text-pretty text-sm leading-relaxed text-muted-foreground">
            {hazard.briefing}
          </p>
          <div className="divide-y divide-border rounded-lg bg-panel/30 ring-1 ring-border">
            {hazard.metrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <span className={`text-xs font-medium ${severityText[m.severity]}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${
                m.role === "user" ? "text-subtle-foreground" : "text-hazard-safe"
              }`}
            >
              {m.role === "user" ? "System Input" : "Intelligence Engine"}
            </p>
            {m.role === "user" ? (
              <div className="rounded-lg bg-panel/50 p-4 ring-1 ring-border">
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {m.content}
                </p>
              </div>
            ) : (
              <p className="max-w-[56ch] whitespace-pre-wrap text-pretty text-sm leading-relaxed">
                {m.content}
              </p>
            )}
          </div>
        ))}

        {pending && (
          <p className="animate-pulse text-[10px] uppercase tracking-widest text-hazard-safe">
            Analysing telemetry…
          </p>
        )}
        {error && <p className="text-xs text-hazard-critical">{error}</p>}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            className="h-24 w-full resize-none rounded-lg bg-panel p-3 text-sm text-foreground ring-1 ring-border-strong transition-all placeholder:text-subtle-foreground focus:outline-none focus:ring-hazard-safe/50"
            placeholder="Ask about IMD warnings, districts at risk, precautions…"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={pending}
            className="absolute bottom-3 right-3 rounded bg-hazard-safe px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-background ring-1 ring-hazard-safe transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? "Working" : "Execute Query"}
          </button>
        </div>
      </div>
    </section>
  );
}
