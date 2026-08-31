import { createFileRoute } from "@tanstack/react-router";

import { runIngest } from "@/lib/live/ingest.server";

/**
 * Scheduled refresh of the live alert + weather pipeline.
 * Called by the platform scheduler with a shared secret header.
 */
export const Route = createFileRoute("/api/public/hooks/refresh-alerts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["INGEST_SECRET"];
        const provided =
          request.headers.get("x-ingest-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const trusted = Boolean(expected) && provided === expected;

        // Untrusted callers may still trigger a refresh, but only once the
        // stored snapshot has aged out. This exposes no data and protects the
        // upstream government feeds from being hammered.
        if (!trusted) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("ingest_runs")
            .select("ran_at")
            .eq("ok", true)
            .order("ran_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          const ageMinutes = data?.ran_at
            ? (Date.now() - new Date(data.ran_at).getTime()) / 60_000
            : Infinity;
          if (ageMinutes < 20) {
            return new Response(
              JSON.stringify({
                ok: true,
                skipped: "throttled",
                ageMinutes: Math.round(ageMinutes),
              }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
        }

        const summary = await runIngest();
        return new Response(JSON.stringify({ ok: summary.errors.length === 0, ...summary }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
