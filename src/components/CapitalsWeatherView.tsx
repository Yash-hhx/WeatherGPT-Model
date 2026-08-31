import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  Compass,
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

import {
  computeAqiRating,
  type CapitalWeatherReport,
  type HourlyForecastItem,
  type StateCapital,
} from "@/lib/capitals";
import type { PredictiveDisasterAlert } from "@/lib/predictive-engine";

interface CapitalsWeatherViewProps {
  reports: CapitalWeatherReport[];
  predictiveAlerts?: PredictiveDisasterAlert[];
  onSelectCapital?: (capital: StateCapital) => void;
  onSelectPrediction?: (predId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

type RegionFilter =
  "all" | "north" | "south" | "east" | "west" | "central" | "northeast" | "island";
type SortOption = "name" | "temp_desc" | "rain_desc" | "aqi_desc";

function getWeatherIcon(category: string, size = "size-5") {
  switch (category) {
    case "clear":
      return <Sun className={`${size} text-amber-400`} />;
    case "rain":
      return <CloudRain className={`${size} text-sky-400`} />;
    case "thunderstorm":
      return <CloudLightning className={`${size} text-yellow-400 animate-pulse`} />;
    case "fog":
      return <CloudFog className={`${size} text-slate-400`} />;
    case "clouds":
    default:
      return <Cloud className={`${size} text-slate-300`} />;
  }
}

export function CapitalsWeatherView({
  reports,
  predictiveAlerts = [],
  onSelectCapital,
  onSelectPrediction,
  onRefresh,
  isRefreshing = false,
}: CapitalsWeatherViewProps) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [expandedCapitalIds, setExpandedCapitalIds] = useState<Set<string>>(
    () => new Set(["delhi", "bhubaneswar", "mumbai"]),
  );

  const toggleExpand = (id: string) => {
    setExpandedCapitalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCapitalIds(new Set(reports.map((r) => r.capital.id)));
  };

  const collapseAll = () => {
    setExpandedCapitalIds(new Set());
  };

  const filteredReports = useMemo(() => {
    let list = reports;

    if (selectedRegion !== "all") {
      list = list.filter((r) => r.capital.region === selectedRegion);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.capital.name.toLowerCase().includes(q) ||
          r.capital.state.toLowerCase().includes(q) ||
          r.current.condition.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "temp_desc") return b.current.temperatureC - a.current.temperatureC;
      if (sortBy === "rain_desc")
        return (b.current.precipitationMm ?? 0) - (a.current.precipitationMm ?? 0);
      if (sortBy === "aqi_desc") return b.current.usAqi - a.current.usAqi;
      return a.capital.name.localeCompare(b.capital.name);
    });
  }, [reports, selectedRegion, search, sortBy]);

  const criticalPredictiveAlert = predictiveAlerts[0];

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 overflow-y-auto">
      {/* Top Header & Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-2.5 rounded-full bg-hazard-safe animate-pulse" />
            <h1 className="font-display text-xl uppercase tracking-wider text-foreground">
              India State & UT Capitals — Live Weather & 6-Hour Forecasts
            </h1>
          </div>
          <p className="mt-1 text-xs text-subtle-foreground">
            Current meteorological conditions for all 36 state capitals with expandable hour-by-hour
            telemetry and early hazard prediction.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground hover:bg-panel-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin text-hazard-safe" : ""}`}
            />
            <span>{isRefreshing ? "Fetching Grid..." : "Refresh Feeds"}</span>
          </button>

          <div className="flex items-center rounded-md border border-border bg-panel text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-1.5 hover:text-foreground transition"
            >
              Expand All
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-1.5 hover:text-foreground transition"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Early Predictive Alert Banner (if severe impending conditions detected) */}
      {criticalPredictiveAlert && (
        <div className="relative overflow-hidden rounded-lg border border-hazard-severe/40 bg-hazard-severe/10 p-3.5 text-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-hazard-severe/20 p-1.5 text-hazard-severe shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-hazard-severe/30 px-1.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-hazard-severe">
                  Early Predictive Alert ({criticalPredictiveAlert.confidencePercent}% Confidence)
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Impact Window: {criticalPredictiveAlert.timeToImpactFormatted}
                </span>
              </div>
              <p className="text-xs font-semibold mt-0.5">{criticalPredictiveAlert.title}</p>
              <p className="text-[11px] text-subtle-foreground line-clamp-1">
                Affected States: {criticalPredictiveAlert.affectedStates.join(", ")} ·{" "}
                {criticalPredictiveAlert.triggerMechanism}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectPrediction?.(criticalPredictiveAlert.id)}
              className="rounded bg-hazard-critical px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-hazard-critical/90 transition flex items-center gap-1"
            >
              <span>View Forecast Heatmap</span>
            </button>
            <div className="text-[11px] uppercase tracking-wider text-hazard-severe font-semibold bg-panel/60 px-3 py-1.5 rounded border border-hazard-severe/30">
              IMD {criticalPredictiveAlert.imdWarningCode} Watch
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-subtle-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search capital city (e.g. Delhi, Bhubaneswar, Mumbai, Patna)..."
            className="w-full rounded-md border border-border bg-panel py-2 pl-9 pr-4 text-xs placeholder:text-subtle-foreground focus:border-hazard-safe focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-subtle-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Tabs */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto text-[11px] font-medium">
          {(
            [
              { id: "all", label: "All Regions" },
              { id: "north", label: "North" },
              { id: "south", label: "South" },
              { id: "east", label: "East" },
              { id: "west", label: "West" },
              { id: "central", label: "Central" },
              { id: "northeast", label: "North-East" },
              { id: "island", label: "UTs & Islands" },
            ] as { id: RegionFilter; label: string }[]
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRegion(r.id)}
              className={`rounded-md px-2.5 py-1.5 transition uppercase tracking-wider ${
                selectedRegion === r.id
                  ? "bg-hazard-safe/20 text-hazard-safe font-semibold border border-hazard-safe/40"
                  : "bg-panel text-muted-foreground hover:bg-panel-muted border border-border"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end lg:self-auto text-xs">
          <span className="text-subtle-foreground text-[11px] uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded border border-border bg-panel px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="name">City Name (A–Z)</option>
            <option value="temp_desc">Temperature (Highest)</option>
            <option value="rain_desc">Precipitation / Rain</option>
            <option value="aqi_desc">AQI (Worst First)</option>
          </select>
        </div>
      </div>

      {/* Capitals Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="rounded-lg border border-border bg-panel/40 p-8 text-center text-sm text-subtle-foreground">
          No state capitals matched your search query "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const isExpanded = expandedCapitalIds.has(report.capital.id);
            const aqiInfo = computeAqiRating(report.current.usAqi);
            const hasSevereHourly = report.hourly6h.some(
              (h) =>
                h.earlyWarning?.severity === "critical" || h.earlyWarning?.severity === "severe",
            );

            return (
              <div
                key={report.capital.id}
                className={`flex flex-col rounded-xl border bg-panel/70 p-4 transition-all duration-200 hover:border-border-strong ${
                  hasSevereHourly
                    ? "border-hazard-severe/40 shadow-sm shadow-hazard-severe/10"
                    : "border-border"
                }`}
              >
                {/* City Name & Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-bold tracking-wide text-foreground">
                        {report.capital.name}
                      </h2>
                      <span className="rounded bg-panel-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {report.capital.state}
                      </span>
                    </div>
                    <p className="text-[11px] text-subtle-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-hazard-safe" />
                      {report.capital.riverOrCoast ?? report.capital.climateZone} ·{" "}
                      {report.capital.elevationMeters}m MSL
                    </p>
                  </div>

                  {onSelectCapital && (
                    <button
                      type="button"
                      onClick={() => onSelectCapital(report.capital)}
                      title="Inspect coordinates on National Radar Map"
                      className="rounded p-1.5 text-subtle-foreground hover:bg-panel-muted hover:text-hazard-safe transition"
                    >
                      <Eye className="size-4" />
                    </button>
                  )}
                </div>

                {/* Primary Weather Condition Bar (Broadcast Style) */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-background/60 p-3 border border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-panel p-2">
                      {getWeatherIcon(
                        report.current.condition.toLowerCase().includes("rain")
                          ? "rain"
                          : report.current.condition.toLowerCase().includes("thunder")
                            ? "thunderstorm"
                            : report.current.condition.toLowerCase().includes("fog")
                              ? "fog"
                              : report.current.condition.toLowerCase().includes("clear")
                                ? "clear"
                                : "clouds",
                        "size-7",
                      )}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                          {report.current.temperatureC}°C
                        </span>
                        <span className="text-[11px] text-subtle-foreground">
                          Feels {report.current.apparentC}°C
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground/90">
                        {report.current.condition}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-subtle-foreground block">
                      Range (24h)
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {report.current.tempMinC}° / {report.current.tempMaxC}°C
                    </span>
                  </div>
                </div>

                {/* Weather Metrics Grid */}
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded bg-panel/40 p-2 border border-border/50">
                    <span className="flex items-center justify-center gap-1 text-[10px] uppercase text-subtle-foreground">
                      <Droplets className="size-3 text-sky-400" /> Hum
                    </span>
                    <p className="mt-0.5 font-bold text-foreground">
                      {report.current.humidityPercent}%
                    </p>
                  </div>

                  <div className="rounded bg-panel/40 p-2 border border-border/50">
                    <span className="flex items-center justify-center gap-1 text-[10px] uppercase text-subtle-foreground">
                      <Wind className="size-3 text-emerald-400" /> Wind
                    </span>
                    <p className="mt-0.5 font-bold text-foreground">
                      {report.current.windKph}{" "}
                      <span className="text-[9px] font-normal text-subtle-foreground">km/h</span>
                    </p>
                  </div>

                  <div className="rounded bg-panel/40 p-2 border border-border/50">
                    <span className="flex items-center justify-center gap-1 text-[10px] uppercase text-subtle-foreground">
                      <CloudRain className="size-3 text-blue-400" /> Rain
                    </span>
                    <p className="mt-0.5 font-bold text-foreground">
                      {report.current.precipitationMm}{" "}
                      <span className="text-[9px] font-normal text-subtle-foreground">mm</span>
                    </p>
                  </div>

                  <div className={`rounded p-2 border ${aqiInfo.bgClass}`}>
                    <span className="flex items-center justify-center gap-1 text-[10px] uppercase text-subtle-foreground">
                      AQI
                    </span>
                    <p className={`mt-0.5 font-bold ${aqiInfo.colorClass}`}>
                      {report.current.usAqi}
                    </p>
                  </div>
                </div>

                {/* 6-Hour Forecast Dropdown Toggle */}
                <div className="mt-3 border-t border-border pt-2.5">
                  <button
                    type="button"
                    onClick={() => toggleExpand(report.capital.id)}
                    className="flex w-full items-center justify-between rounded-md bg-panel-muted/60 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-panel-muted hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-hazard-safe" />
                      Next 6-Hour Forecast (Hourly)
                    </span>
                    <div className="flex items-center gap-1.5">
                      {hasSevereHourly && (
                        <span className="flex items-center gap-1 text-[10px] text-hazard-severe font-bold">
                          <AlertTriangle className="size-3" /> Alert
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded 6-Hour Timeline */}
                  {isExpanded && (
                    <div className="mt-2.5 rounded-lg border border-border bg-background/80 p-2.5">
                      <div className="no-scrollbar flex items-stretch gap-2 overflow-x-auto pb-1">
                        {report.hourly6h.map((hourItem) => (
                          <div
                            key={hourItem.timeString}
                            className={`flex w-24 shrink-0 flex-col items-center rounded-lg border p-2 text-center text-xs transition ${
                              hourItem.earlyWarning
                                ? hourItem.earlyWarning.severity === "critical"
                                  ? "border-hazard-critical/60 bg-hazard-critical/10"
                                  : "border-hazard-severe/60 bg-hazard-severe/10"
                                : "border-border/60 bg-panel/40"
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-subtle-foreground">
                              +{hourItem.hourOffset}h ({hourItem.timeString})
                            </span>

                            <div className="my-1.5">
                              {getWeatherIcon(
                                hourItem.condition.toLowerCase().includes("rain")
                                  ? "rain"
                                  : hourItem.condition.toLowerCase().includes("thunder")
                                    ? "thunderstorm"
                                    : hourItem.condition.toLowerCase().includes("clear")
                                      ? "clear"
                                      : "clouds",
                                "size-4",
                              )}
                            </div>

                            <span className="font-display text-sm font-bold text-foreground">
                              {hourItem.temperatureC}°C
                            </span>

                            <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-subtle-foreground">
                              <span className="text-sky-400 font-medium">
                                💧 {hourItem.precipitationProb}% ({hourItem.precipitationMm}mm)
                              </span>
                              <span>💨 {hourItem.windKph} km/h</span>
                            </div>

                            {hourItem.earlyWarning && (
                              <div
                                title={hourItem.earlyWarning.message}
                                className="mt-1.5 w-full rounded bg-hazard-critical/20 px-1 py-0.5 text-[9px] font-semibold text-hazard-critical uppercase tracking-tight truncate"
                              >
                                ⚠️ {hourItem.earlyWarning.type.replace("_", " ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Hourly Early Warning Summary if any */}
                      {report.hourly6h.find((h) => h.earlyWarning) && (
                        <div className="mt-2 rounded bg-panel p-2 border border-border/80 text-[11px] text-muted-foreground flex items-start gap-2">
                          <AlertTriangle className="size-3.5 text-hazard-warning shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-foreground">Predictive Note: </span>
                            {report.hourly6h.find((h) => h.earlyWarning)?.earlyWarning?.message}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
