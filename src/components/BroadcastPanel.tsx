import { useState } from "react";
import { toast } from "sonner";

import { severityText, type Hazard, type HazardId } from "@/lib/hazards";

export function BroadcastPanel({
  hazard,
  hazards,
  onSelect,
}: {
  hazard: Hazard;
  hazards: Hazard[];
  onSelect: (id: HazardId) => void;
}) {
  const [dispatched, setDispatched] = useState(false);

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-8 overflow-y-auto border-l border-border bg-background/90 p-6 backdrop-blur-xl">
      <div className="space-y-3">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Monitored Hazards
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {hazards.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => onSelect(h.id)}
              className={`rounded px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-widest ring-1 transition-colors ${
                h.id === hazard.id
                  ? `bg-panel ring-border-strong ${severityText[h.severity]}`
                  : "text-subtle-foreground ring-border hover:bg-panel/60"
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Broadcast Status
        </h2>
        <div className="space-y-3">
          {hazard.broadcast.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded ${
                  b.active || dispatched ? "bg-hazard-safe/20" : "bg-panel-muted"
                }`}
              >
                <div
                  className={`size-1.5 rounded-full ${
                    b.active || dispatched ? "bg-hazard-safe" : "bg-subtle-foreground"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    b.active || dispatched ? "" : "text-subtle-foreground"
                  }`}
                >
                  {b.title}
                </p>
                <p className="text-[10px] leading-normal text-subtle-foreground">{b.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="rounded-lg bg-hazard-critical/5 p-4 ring-1 ring-hazard-critical/20">
          <p className="mb-1 font-display text-[10px] font-semibold uppercase tracking-widest text-hazard-critical">
            Danger Zone Dimensions
          </p>
          <p className="font-display text-2xl">{hazard.areaKm2}</p>
          <p className="mt-2 text-[10px] uppercase text-subtle-foreground">
            Projected expansion: {hazard.expansion}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDispatched(true);
            toast.success("Mass notification dispatched", {
              description: `${hazard.event}: alert pushed to all devices inside the ${hazard.coreRadius} core radius and to local + national authorities.`,
            });
          }}
          className="w-full rounded bg-foreground py-3 font-display text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-85"
        >
          {dispatched ? "Re-issue Mass Notify" : "Initiate Mass Notify"}
        </button>
      </div>
    </aside>
  );
}
