import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  Compass,
  Globe,
  Layers,
  MapPin,
  Maximize2,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
} from "lucide-react";

import { AlertBanner } from "@/components/AlertBanner";
import { AlertSearch } from "@/components/AlertSearch";
import { BroadcastPanel } from "@/components/BroadcastPanel";
import { CapitalsWeatherView } from "@/components/CapitalsWeatherView";
import { ChatRail } from "@/components/ChatRail";
import { HazardBackground } from "@/components/HazardBackground";
import { LiveStatus } from "@/components/LiveStatus";
import { PrecautionDeck } from "@/components/PrecautionDeck";
import { PredictiveDeck } from "@/components/PredictiveDeck";
import { RiskMap } from "@/components/RiskMap";
import {
  DEFAULT_STATIC_EPOCH,
  fetchLiveCapitalsWeather,
  generateSyntheticCapitalReports,
  type CapitalWeatherReport,
  type StateCapital,
} from "@/lib/capitals";
import type { Hazard, HazardId } from "@/lib/hazards";
import { HAZARD_LANGUAGES, type LangCode } from "@/lib/i18n";
import { ensureFreshLiveData } from "@/lib/live.functions";
import { buildLiveHazards } from "@/lib/live/build-hazards";
import { liveSnapshotQuery } from "@/lib/live/queries";
import {
  computePredictiveDisasterAlerts,
  type PredictiveDisasterAlert,
} from "@/lib/predictive-engine";

const TITLE = "WeatherGPT India — Live State Capitals Weather & Disaster Early Warning System";
const DESCRIPTION =
  "Operational meteorological telemetry for all 36 Indian State and UT Capitals with 6-hour hourly forecasts, state-wise de-clustered hazard maps, predictive disaster modeling, and 3-phase emergency response protocols.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(liveSnapshotQuery),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-8 text-sm text-hazard-critical">
      Live feed unavailable: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-sm">Console not found.</div>,
  component: Console,
});

function Console() {
  const { data: snapshot } = useSuspenseQuery(liveSnapshotQuery);
  const queryClient = useQueryClient();
  const refresh = useServerFn(ensureFreshLiveData);

  // Deterministic baseline epoch matching SSR dehydrate and initial client hydration
  const baseEpoch = useMemo(() => {
    return snapshot.lastRun ? new Date(snapshot.lastRun).getTime() : DEFAULT_STATIC_EPOCH;
  }, [snapshot.lastRun]);

  // When null, we are on the default Initial Screen (State Capitals Dashboard)
  const [selectedHazardId, setSelectedHazardId] = useState<HazardId | null>(null);
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [activeCenterView, setActiveCenterView] = useState<"capitals_list" | "radar_map">(
    "capitals_list",
  );
  const [selectedCapital, setSelectedCapital] = useState<StateCapital | null>(null);

  const [lang, setLang] = useState<LangCode>("en");
  const [now, setNow] = useState<number>(baseEpoch);

  // Real-time state capitals weather dataset initialized deterministically
  const [capitalsReports, setCapitalsReports] = useState<CapitalWeatherReport[]>(() =>
    generateSyntheticCapitalReports(baseEpoch),
  );
  const [isFetchingCapitals, setIsFetchingCapitals] = useState(false);

  // Pull fresh government alert data on mount when stored snapshot has aged out
  const { isFetching: refreshingGovernmentFeed } = useQuery({
    queryKey: ["live-refresh"],
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const result = await refresh({});
      if (result.refreshed) await queryClient.invalidateQueries({ queryKey: ["live-snapshot"] });
      return result;
    },
  });

  // Fetch live Open-Meteo weather for all state capitals
  const loadCapitals = async () => {
    setIsFetchingCapitals(true);
    try {
      const reports = await fetchLiveCapitalsWeather();
      setCapitalsReports(reports);
    } catch (e) {
      console.warn("Using synthetic fallback for capitals telemetry", e);
    } finally {
      setIsFetchingCapitals(false);
    }
  };

  useEffect(() => {
    loadCapitals();
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const hazards = useMemo(
    () => buildLiveHazards(snapshot.alerts, snapshot.conditions, now),
    [snapshot, now],
  );

  // Predictive Disaster Alerts (calculated ahead of disaster impact)
  const predictiveAlerts = useMemo(
    () => computePredictiveDisasterAlerts(capitalsReports, now),
    [capitalsReports, now],
  );

  // Active Hazard Object (only populated if user selected one)
  const activeHazard = useMemo(() => {
    if (!selectedHazardId || selectedPredictionId) return null;
    return hazards.find((h) => h.id === selectedHazardId) ?? hazards[0];
  }, [selectedHazardId, selectedPredictionId, hazards]);

  // Active Prediction Object (only populated if user selected one)
  const activePrediction = useMemo(() => {
    if (!selectedPredictionId) return null;
    return predictiveAlerts.find((p) => p.id === selectedPredictionId) ?? predictiveAlerts[0];
  }, [selectedPredictionId, predictiveAlerts]);

  const activeLang =
    activeHazard && HAZARD_LANGUAGES[activeHazard.id]?.includes(lang) ? lang : "en";

  return (
    <div className="h-screen w-screen bg-background text-foreground selection:bg-hazard-safe/30 flex flex-col overflow-hidden">
      {/* Dynamic atmospheric background */}
      <HazardBackground ambient={activeHazard ? activeHazard.ambient : "hazard-safe"} />

      {/* Top Banner: Only shown when a hazard is actively selected */}
      {activeHazard && <AlertBanner hazard={activeHazard} lang={activeLang} />}

      {/* Main Operations Console */}
      <main className="relative z-10 flex flex-1 min-h-0 overflow-hidden">
        {/* Left Side: Conversational AI Intelligence Desk */}
        <ChatRail hazard={activeHazard ?? hazards[0]} />

        {/* Center Canvas: State Capitals Weather View OR State-Wise Hazard Map */}
        <section className="flex min-w-0 flex-1 flex-col bg-panel/20 border-r border-border overflow-hidden">
          {/* Top Global Status & Sub-View Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <LiveStatus
                lastRun={snapshot.lastRun}
                alertCount={snapshot.alerts.length}
                refreshing={refreshingGovernmentFeed || isFetchingCapitals}
                now={now}
              />

              {/* Mode indicator breadcrumb */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="text-border">|</span>
                {activePrediction ? (
                  <span className="flex items-center gap-1.5 font-semibold text-hazard-critical uppercase tracking-wider text-[11px] animate-pulse">
                    <Sparkles className="size-3.5 text-hazard-severe" />
                    Forecast Active: {activePrediction.title} (ETA:{" "}
                    {activePrediction.timeToImpactFormatted})
                  </span>
                ) : activeHazard ? (
                  <span className="flex items-center gap-1.5 font-semibold text-hazard-critical uppercase tracking-wider text-[11px]">
                    <ShieldAlert className="size-3.5" />
                    Hazard Active: {activeHazard.name}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-semibold text-hazard-safe uppercase tracking-wider text-[11px]">
                    <Sun className="size-3.5" />
                    State Capitals Overview (Default)
                  </span>
                )}
              </div>
            </div>

            {/* Switch between Capitals List & Radar Map or Reset to Capitals */}
            <div className="flex items-center gap-2">
              {activePrediction || activeHazard ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHazardId(null);
                      setSelectedPredictionId(null);
                      setActiveCenterView("capitals_list");
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-panel px-3 py-1 text-xs font-semibold uppercase tracking-wider text-hazard-safe hover:bg-panel-muted border border-border transition cursor-pointer"
                  >
                    <ArrowLeft className="size-3" />
                    <span>Capitals Weather</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (predictiveAlerts.length > 0) {
                        setSelectedHazardId(null);
                        setSelectedPredictionId(
                          activePrediction ? activePrediction.id : predictiveAlerts[0].id,
                        );
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition border ${
                      activePrediction
                        ? "bg-hazard-critical text-white border-hazard-critical font-bold shadow"
                        : "bg-panel hover:bg-panel-muted text-muted-foreground border-border"
                    }`}
                  >
                    <Sparkles className="size-3" />
                    <span>Predictions ({predictiveAlerts.length})</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center rounded-md border border-border bg-panel p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveCenterView("capitals_list")}
                    className={`rounded px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
                      activeCenterView === "capitals_list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Capitals (36)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCenterView("radar_map")}
                    className={`rounded px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
                      activeCenterView === "radar_map"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    National Radar Map
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (predictiveAlerts.length > 0) {
                        setSelectedHazardId(null);
                        setSelectedPredictionId(predictiveAlerts[0].id);
                      }
                    }}
                    className="rounded px-2.5 py-1 font-semibold uppercase tracking-wider transition text-hazard-critical hover:bg-hazard-critical/10 flex items-center gap-1"
                  >
                    <Sparkles className="size-3 text-hazard-severe" />
                    <span>Predictions ({predictiveAlerts.length})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Alert Search Engine (searches government bulletins) */}
          <AlertSearch alerts={snapshot.alerts} />

          {/* MAIN VIEWPORT BODY */}
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            {activePrediction ? (
              /* PREDICTION SELECTED VIEW: Predictive Heatmap & Thermodynamic Early Warning Deck */
              <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
                <div className="min-h-[380px] sm:min-h-[460px] flex-1 relative shrink-0">
                  <RiskMap
                    prediction={activePrediction}
                    predictiveAlerts={predictiveAlerts}
                    onSelectPrediction={setSelectedPredictionId}
                    viewMode="predictive"
                  />
                </div>
                <PredictiveDeck prediction={activePrediction} />
              </div>
            ) : activeHazard ? (
              /* HAZARD SELECTED VIEW: State-Wise De-Clustered Risk Map & 3-Phase Precaution Deck */
              <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
                <div className="min-h-[380px] sm:min-h-[460px] flex-1 relative shrink-0">
                  <RiskMap hazard={activeHazard} viewMode="hazard" />
                </div>
                <PrecautionDeck hazard={activeHazard} lang={activeLang} onLangChange={setLang} />
              </div>
            ) : /* INITIAL SCREEN: State Capitals View OR National Capitals Map */
            activeCenterView === "capitals_list" ? (
              <CapitalsWeatherView
                reports={capitalsReports}
                predictiveAlerts={predictiveAlerts}
                onSelectCapital={(cap) => {
                  setSelectedCapital(cap);
                  setActiveCenterView("radar_map");
                }}
                onSelectPrediction={setSelectedPredictionId}
                onRefresh={loadCapitals}
                isRefreshing={isFetchingCapitals}
              />
            ) : (
              <div className="flex flex-1 flex-col min-h-0 relative">
                <RiskMap
                  capitals={capitalsReports}
                  selectedCapital={selectedCapital}
                  onSelectCapital={setSelectedCapital}
                  viewMode="capitals"
                />
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Monitored Hazards & Predictive Inception Panel */}
        <BroadcastPanel
          hazard={activeHazard}
          hazards={hazards}
          predictiveAlerts={predictiveAlerts}
          selectedPredictionId={selectedPredictionId}
          onSelectHazard={(id) => {
            setSelectedHazardId(id);
            if (id) setSelectedPredictionId(null);
          }}
          onSelectPrediction={(predId) => {
            setSelectedPredictionId(predId);
            if (predId) setSelectedHazardId(null);
          }}
          onOpenCapitals={() => {
            setSelectedHazardId(null);
            setSelectedPredictionId(null);
            setActiveCenterView("capitals_list");
          }}
          isCapitalsActive={selectedHazardId === null && selectedPredictionId === null}
        />
      </main>
    </div>
  );
}
