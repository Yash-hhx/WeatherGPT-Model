import { useEffect, useState } from "react";

import { severityBg, severityText, type Hazard } from "@/lib/hazards";
import { translateHeadline, type LangCode } from "@/lib/i18n";

function toSeconds(hms: string) {
  const [h = 0, m = 0, s = 0] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function format(total: number) {
  const t = Math.max(total, 0);
  const h = String(Math.floor(t / 3600)).padStart(2, "0");
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function AlertBanner({ hazard, lang }: { hazard: Hazard; lang: LangCode }) {
  const localHeadline = translateHeadline(hazard.id, lang);

  const [seconds, setSeconds] = useState(() => toSeconds(hazard.countdown));

  useEffect(() => {
    setSeconds(toSeconds(hazard.countdown));
  }, [hazard.countdown]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((v) => Math.max(v - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-50 flex items-center justify-between gap-6 border-b border-hazard-critical/20 bg-hazard-critical/10 px-6 py-2">
      <div className="flex min-w-0 items-center gap-4">
        <span
          className={`h-2 w-2 shrink-0 animate-pulse rounded-full ${severityBg[hazard.severity]}`}
        />
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-widest ring-1 ring-current/40 ${severityText[hazard.severity]}`}
        >
          IMD {hazard.imdCode}
        </span>
        <div className="min-w-0">
          <p
            className={`truncate font-display text-sm font-medium uppercase tracking-widest ${severityText[hazard.severity]}`}
          >
            {hazard.headline} <span className="tabular-nums">{format(seconds)}</span>
          </p>
          {localHeadline && (
            <p className="truncate text-[10px] uppercase tracking-widest text-subtle-foreground">
              {localHeadline}
            </p>
          )}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-6 text-[10px] font-medium uppercase tracking-widest text-subtle-foreground lg:flex">
        {hazard.metrics.slice(0, 3).map((m) => (
          <span key={m.label}>
            {m.label}: <span className={severityText[m.severity]}>{m.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
