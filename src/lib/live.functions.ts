import { createServerFn } from "@tanstack/react-start";

/**
 * Refreshes the live feeds when the stored data is older than the given window.
 * Public on purpose (it exposes no data), but self-throttled so it cannot be
 * used to hammer the upstream government feeds.
 */
export const ensureFreshLiveData = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data } = await supabaseAdmin
    .from("ingest_runs")
    .select("ran_at")
    .eq("ok", true)
    .order("ran_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastRun = data?.ran_at ? new Date(data.ran_at).getTime() : 0;
  const ageMinutes = (Date.now() - lastRun) / 60_000;
  if (ageMinutes < 20) return { refreshed: false, ageMinutes: Math.round(ageMinutes) };

  const { runIngest } = await import("@/lib/live/ingest.server");
  const summary = await runIngest();
  return { refreshed: true, ageMinutes: 0, ...summary };
});
