import { useMemo, useState } from "react";

import { severityText } from "@/lib/hazards";
import type { LiveAlert } from "@/lib/live/build-hazards";
import { severityFrom } from "@/lib/live/geo";

export function AlertSearch({ alerts }: { alerts: LiveAlert[] }) {
  const [term, setTerm] = useState("");
  const query = term.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return alerts
      .filter(
        (a) =>
          a.area_description.toLowerCase().includes(query) ||
          a.warning_message.toLowerCase().includes(query) ||
          (a.state ?? "").toLowerCase().includes(query) ||
          a.disaster_type.toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [alerts, query]);

  return (
    <div className="relative z-20 border-b border-border bg-background/70 px-4 py-2 backdrop-blur-xl">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search live bulletins by district, river or state — e.g. Chitrakoot"
        aria-label="Search live official alerts"
        className="w-full bg-transparent text-xs uppercase tracking-widest text-foreground placeholder:text-subtle-foreground focus:outline-none"
      />

      {query.length >= 2 && (
        <div className="absolute left-4 right-4 top-full mt-2 max-h-72 overflow-y-auto rounded-lg bg-background/95 p-2 ring-1 ring-border backdrop-blur-xl">
          {results.length === 0 ? (
            <p className="p-2 text-xs text-muted-foreground">
              No official bulletin currently mentions “{term.trim()}”. Only warnings live on the
              national feed right now are shown — past or unpublished events will not appear.
            </p>
          ) : (
            results.map((a) => {
              const sev = severityFrom(a.severity_color, a.severity_raw);
              return (
                <div key={a.id} className="border-b border-border/60 p-2 last:border-0">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-widest ${severityText[sev]}`}
                  >
                    {a.disaster_type} · {a.area_description}
                  </p>
                  <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">
                    {a.warning_message.slice(0, 220)}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-widest text-subtle-foreground">
                    {a.alert_source ?? "NDMA"} ·{" "}
                    {a.effective_end
                      ? new Date(a.effective_end).toLocaleString("en-IN")
                      : "open ended"}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
