export function HazardBackground({ ambient }: { ambient: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className={`absolute inset-0 opacity-25 ${ambient}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,transparent,var(--background)_75%)]" />
    </div>
  );
}
