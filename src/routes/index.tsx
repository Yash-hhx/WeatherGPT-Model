import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { AlertBanner } from "@/components/AlertBanner";
import { AlertSearch } from "@/components/AlertSearch";
import { BroadcastPanel } from "@/components/BroadcastPanel";
import { ChatRail } from "@/components/ChatRail";
import { HazardBackground } from "@/components/HazardBackground";
import { LiveStatus } from "@/components/LiveStatus";
import { PrecautionDeck } from "@/components/PrecautionDeck";
import { RiskMap } from "@/components/RiskMap";
import type { Hazard, HazardId } from "@/lib/hazards";
import { HAZARD_LANGUAGES, type LangCode } from "@/lib/i18n";
import { ensureFreshLiveData } from "@/lib/live.functions";
import { buildLiveHazards } from "@/lib/live/build-hazards";
import { liveSnapshotQuery } from "@/lib/live/queries";

const TITLE = "WeatherGPT India — Live IMD, CWC & NDMA Disaster Alerts";
const DESCRIPTION =
  "Live conversational AI for India's weather and disaster risk: real NDMA Sachet, IMD and CWC bulletins on a district heatmap, live city temperature and AQI, occupation-wise precautions and mass alerts to residents, DDMAs and NDMA.";

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

  const [hazardId, setHazardId] = useState<HazardId | null>(null);
  const [lang, setLang] = useState<LangCode>("en");
  const [now, setNow] = useState(() => Date.now());

  // Pull fresh government data on mount when the stored snapshot has aged out.
  const { isFetching: refreshing } = useQuery({
    queryKey: ["live-refresh"],
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const result = await refresh({});
      if (result.refreshed) await queryClient.invalidateQueries({ queryKey: ["live-snapshot"] });
      return result;
    },
  });

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const hazards = useMemo(
    () => buildLiveHazards(snapshot.alerts, snapshot.conditions, now),
    [snapshot, now],
  );

  const hazard = (hazards.find((h) => h.id === hazardId) ?? hazards[0]) as Hazard;
  const activeLang = HAZARD_LANGUAGES[hazard.id].includes(lang) ? lang : "en";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-hazard-safe/30">
      <HazardBackground ambient={hazard.ambient} />
      <AlertBanner hazard={hazard} lang={activeLang} />

      <main className="relative z-10 flex h-[calc(100vh-41px)] overflow-hidden">
        <ChatRail hazard={hazard} />

        <section className="flex min-w-0 flex-1 flex-col bg-panel/20">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
            <LiveStatus
              lastRun={snapshot.lastRun}
              alertCount={snapshot.alerts.length}
              refreshing={refreshing}
            />
            <span className="text-[10px] uppercase tracking-widest text-subtle-foreground">
              Sources: NDMA Sachet · IMD · CWC · air-quality model
            </span>
          </div>
          <AlertSearch alerts={snapshot.alerts} />
          <RiskMap hazard={hazard} />
          <PrecautionDeck hazard={hazard} lang={activeLang} onLangChange={setLang} />
        </section>

        <BroadcastPanel hazard={hazard} hazards={hazards} onSelect={setHazardId} />
      </main>
    </div>
  );
}
