import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { LiveAlert, LiveCondition } from "./build-hazards";

export interface LiveSnapshot {
  alerts: LiveAlert[];
  conditions: LiveCondition[];
  lastRun: string | null;
}

export const liveSnapshotQuery = queryOptions({
  queryKey: ["live-snapshot"],
  staleTime: 5 * 60_000,
  queryFn: async (): Promise<LiveSnapshot> => {
    const cutoff = new Date(Date.now() - 6 * 3600_000).toISOString();
    const [alerts, conditions, runs] = await Promise.all([
      supabase
        .from("live_alerts")
        .select(
          "id,disaster_type,category,area_description,warning_message,severity_color,severity_level,severity_raw,alert_source,effective_start,effective_end,lat,lon,area_covered_km2,state",
        )
        .or(`effective_end.gte.${cutoff},effective_end.is.null`)
        .order("ingested_at", { ascending: false })
        .limit(400),
      supabase.from("live_conditions").select("*"),
      supabase
        .from("ingest_runs")
        .select("ran_at")
        .eq("ok", true)
        .order("ran_at", { ascending: false })
        .limit(1),
    ]);

    return {
      alerts: (alerts.data ?? []) as LiveAlert[],
      conditions: (conditions.data ?? []) as LiveCondition[],
      lastRun: runs.data?.[0]?.ran_at ?? null,
    };
  },
});
