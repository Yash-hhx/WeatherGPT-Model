import { useCallback, useEffect, useRef, useState } from "react";

import indiaMap from "@/assets/india-map.jpg";
import {
  SEVERITY_LABEL,
  severityBg,
  severityText,
  type Hazard,
  type HeatCell,
} from "@/lib/hazards";

const CELL_TINT: Record<HeatCell["severity"], string> = {
  critical: "oklch(0.637 0.237 25.331 / 55%)",
  severe: "oklch(0.705 0.213 47.604 / 45%)",
  warning: "oklch(0.795 0.184 86.047 / 38%)",
  safe: "oklch(0.715 0.143 215.221 / 30%)",
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function RiskMap({ hazard }: { hazard: Hazard }) {
  const [active, setActive] = useState<HeatCell | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const stateRef = useRef({ zoom, offset });
  stateRef.current = { zoom, offset };

  const focus: HeatCell | undefined = active ?? hazard.cells[0];

  const zoomAt = useCallback((factor: number, px: number, py: number) => {
    const { zoom: z, offset: o } = stateRef.current;
    const next = clamp(z * factor, MIN_ZOOM, MAX_ZOOM);
    const k = next / z;
    setZoom(next);
    setOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k });
  }, []);

  // native non-passive wheel listener so the page does not scroll behind the map
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      zoomAt(Math.exp(-dy * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const zoomButton = (factor: number) => {
    const el = viewportRef.current;
    if (!el) return;
    zoomAt(factor, el.clientWidth / 2, el.clientHeight / 2);
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (stateRef.current.zoom <= 1) return;
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const labelScale = 1 / zoom;

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative flex-1 touch-none overflow-hidden ${
        zoom > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
    >
      {/* radar instrumentation */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border" />
        <div className="radar-sweep absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* zoom + pan layer */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
      >
        {/* square India canvas — cell coordinates are relative to the map image */}
        <div className="absolute inset-y-0 left-1/2 aspect-square h-full -translate-x-1/2">
          <img
            src={indiaMap}
            alt={`Map of India showing impact zones for ${hazard.event}`}
            width={1440}
            height={1440}
            className="absolute inset-0 h-full w-full object-contain opacity-70 grayscale"
            draggable={false}
          />

          {/* heatmap cells */}
          {hazard.cells.map((cell) => (
            <button
              key={cell.region}
              type="button"
              onMouseEnter={() => setActive(cell)}
              onFocus={() => setActive(cell)}
              onClick={() => setActive(cell)}
              aria-label={`${cell.region}: ${SEVERITY_LABEL[cell.severity]} risk, ${cell.exposure}% impact index`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
              style={{
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                width: cell.r * 1.4,
                height: cell.r * 1.4,
                background: `radial-gradient(circle, ${CELL_TINT[cell.severity]} 0%, transparent 70%)`,
              }}
            >
              <span
                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${severityBg[cell.severity]}`}
              />
              {cell.severity === "critical" && (
                <span className="impact-ring absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hazard-critical/60" />
              )}
            </button>
          ))}

          {/* district / area labels — kept legible at every zoom level */}
          {hazard.cells.map((cell, i) => (
            <div
              key={`${cell.region}-label`}
              className="pointer-events-none absolute origin-top left-0 top-0"
              style={{
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                transform: `translate(-50%, ${10 + (i % 4) * 15}px) scale(${labelScale})`,
              }}
            >
              <span
                className={`whitespace-nowrap rounded bg-background/75 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-border backdrop-blur-sm ${severityText[cell.severity]}`}
              >
                {cell.region}
                <span className="ml-1 text-subtle-foreground">{cell.exposure}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* focus readout */}
      {focus && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-background/85 px-4 py-2 text-center ring-1 ring-border backdrop-blur-md">
          <p
            className={`font-display text-xs uppercase tracking-widest ${severityText[focus.severity]}`}
          >
            {focus.region}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-subtle-foreground">
            {SEVERITY_LABEL[focus.severity]} impact · {focus.exposure}% impact index
          </p>
        </div>
      )}

      {/* zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col overflow-hidden rounded-lg ring-1 ring-border backdrop-blur-md">
        <button
          type="button"
          onClick={() => zoomButton(1.5)}
          aria-label="Zoom in"
          className="bg-background/80 px-3 py-2 font-display text-sm hover:bg-panel"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomButton(1 / 1.5)}
          aria-label="Zoom out"
          className="border-t border-border bg-background/80 px-3 py-2 font-display text-sm hover:bg-panel"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset map view"
          className="border-t border-border bg-background/80 px-3 py-2 text-[9px] uppercase tracking-widest hover:bg-panel"
        >
          Fit
        </button>
      </div>

      {/* core impact readout */}
      <div className="absolute right-6 top-6 rounded-lg bg-background/80 p-3 ring-1 ring-border backdrop-blur-md">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle-foreground">
          Core Impact Radius
        </p>
        <p className="font-display text-2xl">{hazard.coreRadius}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-subtle-foreground">
          {hazard.states}
        </p>
        <p className="mt-2 text-[9px] uppercase tracking-widest text-subtle-foreground">
          Zoom ×{zoom.toFixed(1)} · scroll to zoom, drag to pan
        </p>
      </div>

      {/* legend */}
      <div className="absolute left-6 top-6 flex flex-col gap-3 rounded-lg bg-background/80 p-3 ring-1 ring-border backdrop-blur-md">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-subtle-foreground">
          Risk Intensity — {hazard.cells.length} zones tracked
        </p>
        <div className="flex h-1.5 w-48 gap-1">
          <div className="flex-1 bg-hazard-safe/50" />
          <div className="flex-1 bg-hazard-warning/50" />
          <div className="flex-1 bg-hazard-severe/50" />
          <div className="flex-1 bg-hazard-critical/50" />
        </div>
        <div className="flex justify-between text-[9px] uppercase tracking-widest text-subtle-foreground">
          <span>Marginal</span>
          <span>Most affected</span>
        </div>
      </div>
    </div>
  );
}
