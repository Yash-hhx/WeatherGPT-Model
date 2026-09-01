import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  Flame,
  Gauge,
  Layers,
  LineChart,
  Radio,
  Shield,
  ShieldAlert,
  Sparkles,
  Sliders,
  Thermometer,
  TrendingUp,
  Waves,
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
    "overview" | "hyetograph" | "evt" | "districts" | "thermodynamics" | "actions"
  >(prediction.subHourlyCatchmentModel ? "hyetograph" : "overview");

  const [simulatedImpervious, setSimulatedImpervious] = useState<number>(
    prediction.subHourlyCatchmentModel?.imperviousFraction
      ? Math.round(prediction.subHourlyCatchmentModel.imperviousFraction * 100)
      : 80,
  );

  const hyetograph = prediction.subHourlyCatchmentModel;
  const evtModel = prediction.extremeValueTheoryModel;

  return (
    <div className="flex flex-col border-t border-border bg-background/95 backdrop-blur-xl p-4 sm:p-5 gap-4">
      {/* Top Header with Prediction Title & ETA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
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
            {hyetograph && (
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-400">
                15-Min Sub-Hourly Hydrology
              </span>
            )}
            {evtModel && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Physics-Guided EVT GEV Layer
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {prediction.title}
          </h2>
          <p className="text-xs text-subtle-foreground flex flex-wrap items-center gap-2">
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

        {hyetograph && (
          <button
            type="button"
            onClick={() => setActiveTab("hyetograph")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeTab === "hyetograph"
                ? "bg-sky-600 text-white shadow-sm font-bold"
                : "text-sky-400 hover:text-foreground hover:bg-sky-500/10"
            }`}
          >
            <Waves className="size-3.5" />
            <span>15-min Hyetograph (Prop 1)</span>
          </button>
        )}

        {evtModel && (
          <button
            type="button"
            onClick={() => setActiveTab("evt")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeTab === "evt"
                ? "bg-amber-600 text-white shadow-sm font-bold"
                : "text-amber-400 hover:text-foreground hover:bg-amber-500/10"
            }`}
          >
            <TrendingUp className="size-3.5" />
            <span>EVT Peak Extrapolation (Prop 2)</span>
          </button>
        )}

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
      <div className="min-h-[160px]">
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

        {/* PROPOSAL 1: 15-MINUTE SUB-HOURLY HYETOGRAPH & URBAN DRAINAGE SATURATION */}
        {activeTab === "hyetograph" && hyetograph && (
          <div className="space-y-4">
            {/* Catchment Telemetry Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-panel/60 p-3 rounded-lg border border-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                  Target Catchment
                </span>
                <p className="text-xs font-bold text-foreground truncate">
                  {hyetograph.catchmentName}
                </p>
                <span className="text-[10px] text-muted-foreground">{hyetograph.riverBasin}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                  Catchment Area & Paved %
                </span>
                <p className="text-xs font-bold text-foreground">
                  {hyetograph.catchmentAreaKm2} km² · {simulatedImpervious}% Impervious
                </p>
                <span className="text-[10px] text-sky-400">Urban Overland Runoff</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                  Drainage Limit
                </span>
                <p className="text-xs font-bold text-hazard-warning font-mono">
                  {hyetograph.drainageCapacityMmHr} mm/hr
                </p>
                <span className="text-[10px] text-muted-foreground">Municipal Surcharge Cap</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                  Drainage Saturation Onset
                </span>
                <p className="text-xs font-bold text-hazard-critical font-mono animate-pulse">
                  T+{hyetograph.saturationOnsetMinute} min (Critical)
                </p>
                <span className="text-[10px] text-hazard-critical">Overland Flood Wave</span>
              </div>
            </div>

            {/* Hyetograph 15-Minute Interval Graph */}
            <div className="rounded-lg bg-panel/80 p-4 border border-border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-sky-400" />
                    Sub-Hourly SCS-CN Hyetograph vs. Infiltration & Runoff Decay (15-min Intervals)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{hyetograph.methodologyNotes}</p>
                </div>

                {/* Imperviousness Interactive Slider */}
                <div className="flex items-center gap-2 bg-background/80 px-2.5 py-1 rounded border border-border text-xs">
                  <Sliders className="size-3.5 text-subtle-foreground" />
                  <span className="text-[10px] uppercase font-bold text-subtle-foreground">
                    Impervious Built-up:
                  </span>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    value={simulatedImpervious}
                    onChange={(e) => setSimulatedImpervious(Number(e.target.value))}
                    className="w-20 accent-sky-500 h-1.5 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-sky-400">{simulatedImpervious}%</span>
                </div>
              </div>

              {/* Hyetograph Bar Visualizer */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
                {hyetograph.intervals.map((step) => {
                  const runoffScale = simulatedImpervious / (hyetograph.imperviousFraction * 100);
                  const scaledRunoff = Math.round(step.urbanRunoffRateMmHr * runoffScale);
                  const isSaturated = scaledRunoff > hyetograph.drainageCapacityMmHr;

                  return (
                    <div
                      key={step.timeMinute}
                      className={`rounded-lg p-2 border flex flex-col justify-between gap-1 transition ${
                        isSaturated
                          ? "bg-hazard-critical/15 border-hazard-critical/50"
                          : "bg-background/80 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-foreground font-mono">
                          {step.timeLabel}
                        </span>
                        {isSaturated && (
                          <span className="size-2 rounded-full bg-hazard-critical animate-ping" />
                        )}
                      </div>

                      {/* Bar height indicator */}
                      <div className="h-16 w-full bg-panel-muted/50 rounded flex flex-col justify-end overflow-hidden relative">
                        {/* Drainage Capacity Threshold Line */}
                        <div
                          className="absolute w-full border-b border-dashed border-amber-400/80 z-10"
                          style={{ bottom: `${(hyetograph.drainageCapacityMmHr / 180) * 100}%` }}
                          title={`Drainage Limit: ${hyetograph.drainageCapacityMmHr} mm/h`}
                        />

                        {/* Rain burst bar */}
                        <div
                          className="w-full bg-sky-500/40 rounded-t"
                          style={{ height: `${(step.rainfallIntensityMmHr / 180) * 100}%` }}
                        />

                        {/* Surface Runoff bar */}
                        <div
                          className={`w-full absolute bottom-0 rounded-t transition-all ${
                            isSaturated ? "bg-hazard-critical/80" : "bg-sky-400"
                          }`}
                          style={{ height: `${(scaledRunoff / 180) * 100}%` }}
                        />
                      </div>

                      <div className="space-y-0.5 text-[9px] font-mono leading-tight">
                        <div className="flex justify-between text-subtle-foreground">
                          <span>Rain:</span>
                          <span className="font-bold text-sky-400">
                            {step.rainfallIntensityMmHr}mm/h
                          </span>
                        </div>
                        <div className="flex justify-between text-foreground font-bold">
                          <span>Runoff:</span>
                          <span className={isSaturated ? "text-hazard-critical" : "text-sky-300"}>
                            {scaledRunoff}mm/h
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-[8px]">
                          <span>Inundation:</span>
                          <span>{step.surfaceWaterDepthCm} cm</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Scientific Insights */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[10px] text-subtle-foreground border-t border-border/60">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-sky-500/40" /> Rainfall Intensity (mm/h)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-sky-400" /> Overland Runoff
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2.5 rounded bg-hazard-critical" /> Storm Drain Overtopping
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 border-b border-dashed border-amber-400" /> Municipal
                    Capacity (45mm/h)
                  </span>
                </div>
                <div className="font-mono text-sky-400 font-bold">
                  Peak Discharge: {hyetograph.peakRunoffDischargeCusecs.toLocaleString()} Cusecs @
                  T+45m
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROPOSAL 2: EXTREME VALUE THEORY (EVT / GEV) PEAK EXTRAPOLATION */}
        {activeTab === "evt" && evtModel && (
          <div className="space-y-4">
            {/* Scientific Highlight Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 rounded-lg bg-panel/70 p-3.5 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <TrendingUp className="size-3.5" />
                    Physics-Guided EVT GEV Tail Loss Layer (Research Proposal 2)
                  </h4>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 font-mono">
                    GEV Shape ξ = +{evtModel.gevShapeXi} (Heavy Tail)
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {evtModel.scientificRationale}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-subtle-foreground font-mono pt-1">
                  <span>
                    Location Parameter (μ):{" "}
                    <strong className="text-foreground">{evtModel.gevLocationMu}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Scale Parameter (σ):{" "}
                    <strong className="text-foreground">{evtModel.gevScaleSigma}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Gauging Station:{" "}
                    <strong className="text-foreground">{evtModel.catchmentGaugingStation}</strong>
                  </span>
                </div>
              </div>

              {/* Peak Penalty Deficit Card */}
              <div className="rounded-lg bg-hazard-critical/10 p-3.5 border border-hazard-critical/30 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-hazard-critical flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    Unconstrained DL Deficit
                  </span>
                  <div className="text-xl font-bold font-mono text-hazard-critical mt-1">
                    {evtModel.unconstrainedDlUnderestimatePercent}%
                  </div>
                  <p className="text-[10px] text-subtle-foreground">
                    Severe truncation of peak flood crests in standard pure Deep Learning
                    architectures.
                  </p>
                </div>
                <div className="pt-2 border-t border-hazard-critical/20 text-[10px] font-mono text-emerald-400 font-bold">
                  ✓ Corrected via EVT Loss: +{evtModel.physicsPeakPenaltyCorrectionPercent}% Peak
                  Surge
                </div>
              </div>
            </div>

            {/* Recurrence Return Period Table & Comparison */}
            <div className="rounded-lg bg-panel/80 p-3.5 border border-border space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Database className="size-3.5 text-sky-400" />
                Return Period Extrapolation (5-Yr to 100-Yr Rare Event Discharges)
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-[10px] uppercase font-bold text-subtle-foreground">
                      <th className="pb-2">Return Period</th>
                      <th className="pb-2">Annual Exceedance</th>
                      <th className="pb-2">Standard Deep Learning (Raw)</th>
                      <th className="pb-2 text-amber-400 font-bold">
                        Physics-Guided EVT (True Peak)
                      </th>
                      <th className="pb-2">DL Underestimation</th>
                      <th className="pb-2">95% Bayesian Interval</th>
                      <th className="pb-2">River Danger Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    {evtModel.returnPeriods.map((rp) => (
                      <tr key={rp.returnPeriodYears} className="hover:bg-panel-muted/30">
                        <td className="py-2.5 font-bold text-foreground">
                          {rp.returnPeriodYears}-Year Event
                        </td>
                        <td className="py-2.5 text-subtle-foreground">
                          {rp.annualExceedanceProbability}
                        </td>
                        <td className="py-2.5 text-muted-foreground line-through decoration-hazard-critical/60">
                          {rp.unconstrainedDeepLearningPeakCusecs.toLocaleString()} cusecs
                        </td>
                        <td className="py-2.5 text-amber-400 font-bold">
                          {rp.physicsGuidedEvtPeakCusecs.toLocaleString()} cusecs
                        </td>
                        <td className="py-2.5 text-hazard-critical font-bold">
                          {rp.underestimationDeficitPercent}%
                        </td>
                        <td className="py-2.5 text-subtle-foreground text-[10px]">
                          [{rp.confidenceInterval95[0].toLocaleString()} -{" "}
                          {rp.confidenceInterval95[1].toLocaleString()}]
                        </td>
                        <td className="py-2.5">
                          <span className="rounded bg-hazard-critical/20 px-1.5 py-0.5 text-[10px] font-bold text-hazard-critical">
                            +{rp.hydraulicDangerLevelMeters}m &gt; DL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
