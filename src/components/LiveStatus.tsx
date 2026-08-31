export function LiveStatus({
  lastRun,
  alertCount,
  refreshing,
  now,
}: {
  lastRun: string | null;
  alertCount: number;
  refreshing: boolean;
  now?: number;
}) {
  const currentNow = now ?? (lastRun ? new Date(lastRun).getTime() : 1756641600000);
  const age = lastRun
    ? Math.max(0, Math.round((currentNow - new Date(lastRun).getTime()) / 60_000))
    : null;
  const stale = age === null || age > 90;

  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-subtle-foreground">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          refreshing
            ? "animate-pulse bg-hazard-warning"
            : stale
              ? "bg-hazard-severe"
              : "bg-hazard-safe"
        }`}
      />
      <span suppressHydrationWarning>
        {refreshing
          ? "Syncing national feed…"
          : stale
            ? "Feed stale — retrying"
            : `Live · ${alertCount} official bulletins · updated ${age}m ago`}
      </span>
    </div>
  );
}
