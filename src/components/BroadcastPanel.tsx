import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronRight,
  Flame,
  Globe,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Wind,
} from "lucide-react";

import { severityText, type Hazard, type HazardId } from "@/lib/hazards";
import type { PredictiveDisasterAlert } from "@/lib/predictive-engine";

interface BroadcastPanelProps {
  hazard: Hazard | null;
  hazards: Hazard[];
  predictiveAlerts?: PredictiveDisasterAlert[];
  selectedPredictionId?: string | null;
  onSelectHazard: (id: HazardId | null) => void;
  onSelectPrediction: (predId: string | null) => void;
  onOpenCapitals: () => void;
  isCapitalsActive: boolean;
}

export function BroadcastPanel({
  hazard,
  hazards,
  predictiveAlerts = [],
  selectedPredictionId = null,
  onSelectHazard,
  onSelectPrediction,
  onOpenCapitals,
  isCapitalsActive,
}: BroadcastPanelProps) {
  const [dispatched, setDispatched] = useState(false);
  const [activeTab, setActiveTab] = useState<"hazards" | "predictive">("hazards");

  return (
    <aside className="flex w-80 lg:w-88 shrink-0 flex-col gap-5 overflow-y-auto border-l border-border bg-background/95 p-5 backdrop-blur-xl transition-all">
      {/* View Switcher: State Capitals vs Hazard Analysis */}
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-subtle-foreground">
          System View Navigation
        </span>
        <button
          type="button"
          onClick={() => {
            onSelectPrediction(null);
            onOpenCapitals();
          }}
          className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-bold uppercase tracking-wider transition border ${
            isCapitalsActive && !selectedPredictionId
              ? "bg-hazard-safe/15 border-hazard-safe text-foreground ring-1 ring-hazard-safe/30"
              : "bg-panel border-border text-muted-foreground hover:bg-panel-muted hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-hazard-safe" />
            <span>State Capitals Grid (Default)</span>
          </div>
          <span className="rounded bg-panel-muted px-1.5 py-0.5 text-[9px] font-bold text-hazard-safe">
            36 Cities
          </span>
        </button>
      </div>

      {/* Tabs: Monitored Live Hazards vs Predictive Disaster Engine */}
      <div className="flex rounded-md bg-panel p-1 border border-border">
        <button
          type="button"
          onClick={() => {
            setActiveTab("hazards");
            if (selectedPredictionId) {
              onSelectPrediction(null);
            }
          }}
          className={`flex-1 rounded py-1.5 text-center text-[10px] font-bold uppercase tracking-wider transition ${
            activeTab === "hazards" && !selectedPredictionId
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monitored Hazards ({hazards.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("predictive");
            if (predictiveAlerts.length > 0 && !selectedPredictionId) {
              onSelectPrediction(predictiveAlerts[0].id);
            }
          }}
          className={`flex-1 rounded py-1.5 text-center text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 ${
            activeTab === "predictive" || selectedPredictionId
              ? "bg-background text-hazard-severe shadow-sm font-extrabold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="size-3" />
          <span>Predictions ({predictiveAlerts.length})</span>
        </button>
      </div>

      {activeTab === "hazards" && !selectedPredictionId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground font-bold">
              Select Disaster to Monitor
            </h2>
            {hazard && (
              <button
                type="button"
                onClick={() => onSelectHazard(null)}
                className="text-[10px] text-hazard-safe uppercase tracking-wider hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {hazards.map((h) => {
              const isSelected = hazard?.id === h.id && !selectedPredictionId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    onSelectPrediction(null);
                    onSelectHazard(h.id);
                  }}
                  className={`flex flex-col rounded-lg p-3 text-left transition border ${
                    isSelected
                      ? `bg-panel border-hazard-safe/80 ring-1 ring-hazard-safe/50 shadow-md`
                      : "bg-panel/60 border-border hover:bg-panel hover:border-border-strong text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${h.severity === "critical" ? "bg-hazard-critical animate-ping" : "bg-hazard-severe"}`}
                      />
                      {h.name}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${severityText[h.severity]}`}
                    >
                      IMD {h.imdCode}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-subtle-foreground line-clamp-1">{h.event}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/50">
                    <span className="truncate max-w-[170px]">{h.states}</span>
                    <span className="text-hazard-safe font-semibold flex items-center gap-0.5 shrink-0">
                      {isSelected ? "Inspecting Heatmap" : "Inspect Heatmap"}{" "}
                      <ChevronRight className="size-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* If a hazard is selected, display live broadcast protocols and evacuation radius */}
          {hazard && (
            <>
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                  <Radio className="size-3.5 text-hazard-safe" />
                  Active Warning Broadcasts
                </h3>
                <div className="space-y-2">
                  {hazard.broadcast.map((b) => (
                    <div
                      key={b.title}
                      className="flex items-start gap-2.5 rounded-lg bg-panel/50 p-2.5 border border-border/80"
                    >
                      <div
                        className={`mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full ${
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
                        <p className="text-[11px] font-bold text-foreground">{b.title}</p>
                        <p className="text-[10px] text-subtle-foreground leading-tight mt-0.5">
                          {b.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-2">
                <div className="rounded-lg bg-hazard-critical/10 p-3.5 ring-1 ring-hazard-critical/30 border border-hazard-critical/20">
                  <p className="font-display text-[10px] font-bold uppercase tracking-widest text-hazard-critical">
                    Impact Danger Zone
                  </p>
                  <p className="font-display text-2xl font-bold text-foreground mt-0.5">
                    {hazard.areaKm2}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-subtle-foreground">
                    Projected expansion: <strong>{hazard.expansion}</strong> · Core:{" "}
                    <strong>{hazard.coreRadius}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDispatched(true);
                    toast.success("Mass Cell-Broadcast Alert Dispatched", {
                      description: `Geo-fenced emergency warning transmitted in regional languages for ${hazard.event}.`,
                    });
                  }}
                  className="w-full rounded-lg bg-hazard-critical py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-hazard-critical/90 flex items-center justify-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  <span>{dispatched ? "Re-Issue Sachet Cell Alert" : "Push Sachet Geo-Alert"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Predictive Disaster Warning Engine Tab */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-widest text-foreground font-bold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-hazard-severe" />
              Pre-Disaster Predictions
            </h2>
            <span className="rounded bg-hazard-severe/20 px-1.5 py-0.5 text-[9px] font-bold text-hazard-severe uppercase">
              Live AI Model
            </span>
          </div>

          <p className="text-[11px] text-subtle-foreground">
            Multi-parameter thermodynamic forecasting calculates catastrophic storm, flood, and
            thermal surge risks before landfall.
          </p>

          <div className="space-y-3">
            {predictiveAlerts.map((pred) => {
              const isSelected = selectedPredictionId === pred.id;
              return (
                <div
                  key={pred.id}
                  className={`rounded-lg border p-3 flex flex-col gap-2 transition cursor-pointer ${
                    isSelected
                      ? "border-hazard-critical bg-panel ring-1 ring-hazard-critical/50 shadow-lg"
                      : "border-border bg-panel/70 hover:border-border-strong hover:bg-panel"
                  }`}
                  onClick={() => {
                    onSelectPrediction(pred.id);
                    toast.info(`Inspecting Forecast Heatmap: ${pred.title}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-hazard-critical/20 px-1.5 py-0.5 text-[9px] font-bold text-hazard-critical uppercase font-mono">
                      {pred.timeToImpactFormatted}
                    </span>
                    <span className="text-[10px] font-bold text-hazard-safe">
                      {pred.confidencePercent}% Confidence
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-foreground mt-0.5 leading-snug">
                    {pred.title}
                  </h3>

                  <p className="text-[10px] text-subtle-foreground line-clamp-2 leading-relaxed">
                    {pred.triggerMechanism}
                  </p>

                  <div className="rounded bg-background/70 p-2 border border-border/60 text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-subtle-foreground">Affected States:</span>
                      <span className="font-semibold text-foreground">
                        {pred.affectedStates.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-subtle-foreground">High-Risk Districts:</span>
                      <span className="font-semibold text-hazard-critical">
                        {pred.highRiskDistricts.map((d) => d.district.split(" ")[0]).join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="w-full rounded bg-hazard-critical/15 py-1.5 text-[10px] font-bold uppercase tracking-wider text-hazard-critical border border-hazard-critical/30 transition flex items-center justify-center gap-1">
                    <span>
                      {isSelected ? "Inspecting Predictive Heatmap" : "View Predictive Heatmap"}
                    </span>
                    <ChevronRight className="size-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
