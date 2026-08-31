import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Compass,
  Flame,
  Layers,
  Radio,
  Shield,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";
import { type FC, useState } from "react";

import { severityBg, severityBorder, severityText } from "@/lib/hazards";
import type { PredictiveDisasterAlert } from "@/lib/predictive-engine";

interface PredictiveDeckProps {
  prediction: PredictiveDisasterAlert;
  onClose?: () => void;
}

export const PredictiveDeck: FC<PredictiveDeckProps> = ({ prediction, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "districts" | "thermodynamics" | "actions"
  >("overview");

  return (
    <div className="flex flex-col border-t border-border bg-background/95 backdrop-blur-xl p-4 sm:p-5 gap-4">
      {/* Top Header with Prediction Title & ETA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-hazard-critical/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-hazard-critical animate-pulse">
              <Sparkles className="size-3" />
              Pre-Disaster Forecast Model
            </span>
            <span className="rounded bg-panel-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-subtle-foreground">
              IMD {prediction.imdWarningCode}
            </span>
            <span className="rounded bg-hazard-safe/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-hazard-safe">
              {prediction.confidencePercent}% Confidence
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {prediction.title}
          </h2>
          <p className="text-xs text-subtle-foreground flex items-center gap-2">
            <span>
              Disaster Vector:{" "}
              <strong className="text-foreground">{prediction.disasterType}</strong>
            </span>
            <span>·</span>
            <span>
              Affected:{" "}
              <strong className="text-foreground">{prediction.affectedStates.join(", ")}</strong>
            </span>
          </p>
        </div>

        {/* ETA & Impact Window Highlight Card */}
        <div className="flex items-center gap-3 bg-panel/80 p-3 rounded-lg border border-border">
          <div className="flex size-9 items-center justify-center rounded-lg bg-hazard-critical/15 text-hazard-critical">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-subtle-foreground">
              Expected Time to Impact (ETA)
            </div>
            <div className="text-sm sm:text-base font-bold text-hazard-critical font-mono">
              {prediction.timeToImpactFormatted}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Impact Window:{" "}
              <strong className="text-foreground">{prediction.impactWindowIST}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "overview"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-panel"
          }`}
        >
          Disaster Mechanism
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("districts")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
            activeTab === "districts"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-panel"
          }`}
        >
          <span>High-Risk Districts</span>
          <span className="rounded-full bg-hazard-critical/20 px-1.5 text-[10px] font-bold text-hazard-critical">
            {prediction.highRiskDistricts.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("thermodynamics")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "thermodynamics"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-panel"
          }`}
        >
          Atmospheric Indicators ({prediction.thermodynamicIndicators.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("actions")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "actions"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-panel"
          }`}
        >
          Pre-Emptive Directives
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[140px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-lg bg-panel/50 p-4 border border-border/80 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Radio className="size-3.5 text-hazard-safe" />
                Physical Trigger & Forecast Genesis
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {prediction.triggerMechanism}
              </p>
            </div>

            <div className="rounded-lg bg-hazard-critical/10 p-4 border border-hazard-critical/20 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-hazard-critical flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" />
                Forecasting Readiness
              </h3>
              <p className="text-xs text-subtle-foreground">
                State Disaster Management Authorities (SDMA) in{" "}
                <strong className="text-foreground">{prediction.affectedStates.join(", ")}</strong>{" "}
                have been placed on pre-emptive deployment alert.
              </p>
              <div className="pt-2 text-[11px] text-muted-foreground font-mono">
                Model Confidence:{" "}
                <span className="text-hazard-safe font-bold">{prediction.confidencePercent}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "districts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {prediction.highRiskDistricts.map((dist) => (
              <div
                key={dist.district}
                className="rounded-lg bg-panel/70 p-3 border border-border flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                      {dist.state}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        dist.evacuationPriority === "immediate"
                          ? "bg-hazard-critical/20 text-hazard-critical animate-pulse"
                          : dist.evacuationPriority === "standby"
                            ? "bg-hazard-severe/20 text-hazard-severe"
                            : "bg-panel-muted text-subtle-foreground"
                      }`}
                    >
                      {dist.evacuationPriority}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground mt-1">
                    {dist.district}
                  </h4>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/60">
                  <p className="text-[10px] text-subtle-foreground leading-tight">
                    Danger: <strong className="text-foreground">{dist.dangerMetric}</strong>
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-subtle-foreground">Risk Score:</span>
                    <span className="font-bold text-hazard-critical font-mono">
                      {dist.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "thermodynamics" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {prediction.thermodynamicIndicators.map((ind) => (
              <div
                key={ind.label}
                className="rounded-lg bg-panel/70 p-3 border border-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-subtle-foreground line-clamp-1">
                    {ind.label}
                  </span>
                  <span
                    className={`size-2 rounded-full ${
                      ind.status === "critical"
                        ? "bg-hazard-critical animate-ping"
                        : ind.status === "warning"
                          ? "bg-hazard-severe"
                          : "bg-hazard-safe"
                    }`}
                  />
                </div>

                <div className="text-sm font-bold text-foreground font-mono">
                  {ind.currentValue}
                </div>

                <div className="text-[10px] text-subtle-foreground">
                  Threshold:{" "}
                  <span className="font-semibold text-muted-foreground">{ind.thresholdValue}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "actions" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-panel/60 p-3.5 border border-border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-hazard-critical flex items-center gap-1.5">
                <Shield className="size-3.5" />
                For Disaster Authorities
              </h4>
              <ul className="space-y-1.5 text-xs text-subtle-foreground list-disc list-inside">
                {prediction.preEmptiveActions.forAuthorities.map((act, i) => (
                  <li key={i} className="leading-snug">
                    {act}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-panel/60 p-3.5 border border-border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-hazard-safe flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" />
                For Communities & Residents
              </h4>
              <ul className="space-y-1.5 text-xs text-subtle-foreground list-disc list-inside">
                {prediction.preEmptiveActions.forCommunities.map((act, i) => (
                  <li key={i} className="leading-snug">
                    {act}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-panel/60 p-3.5 border border-border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-hazard-severe flex items-center gap-1.5">
                <AlertTriangle className="size-3.5" />
                Vulnerable Populations
              </h4>
              <ul className="space-y-1.5 text-xs text-subtle-foreground list-disc list-inside">
                {prediction.preEmptiveActions.forVulnerablePopulations.map((act, i) => (
                  <li key={i} className="leading-snug">
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
