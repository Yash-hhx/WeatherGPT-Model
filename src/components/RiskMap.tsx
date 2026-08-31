import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Eye,
  EyeOff,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  PhoneCall,
  Radio,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ShelterDirectoryModal } from "@/components/ShelterDirectoryModal";
import type { CapitalWeatherReport, StateCapital } from "@/lib/capitals";
import {
  EMERGENCY_HELPLINES,
  SEVERITY_LABEL,
  severityBg,
  severityBorder,
  severityText,
  type DistrictConcern,
  type Hazard,
  type HeatCell,
  type Severity,
  type StateHazardGroup,
} from "@/lib/hazards";
import type { PredictiveDisasterAlert } from "@/lib/predictive-engine";

const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

// Geo Projection Helper: Converts Lat/Lon to 100x100 SVG viewbox coordinates
export function projectCoords(lat: number, lon: number): { x: number; y: number } {
  const minLon = 68.0;
  const maxLon = 97.5;
  const minLat = 7.5;
  const maxLat = 37.5;

  const x = ((lon - minLon) / (maxLon - minLon)) * 78 + 11;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 82 + 8;
  return {
    x: clamp(x, 5, 95),
    y: clamp(y, 5, 95),
  };
}

interface RiskMapProps {
  hazard?: Hazard | null;
  prediction?: PredictiveDisasterAlert | null;
  predictiveAlerts?: PredictiveDisasterAlert[];
  onSelectPrediction?: (predId: string) => void;
  capitals?: CapitalWeatherReport[];
  selectedCapital?: StateCapital | null;
  onSelectCapital?: (capital: StateCapital) => void;
  viewMode?: "capitals" | "hazard" | "predictive";
}

export function RiskMap({
  hazard,
  prediction,
  predictiveAlerts = [],
  onSelectPrediction,
  capitals = [],
  selectedCapital,
  onSelectCapital,
  viewMode = "capitals",
}: RiskMapProps) {
  const [selectedStateGroup, setSelectedStateGroup] = useState<StateHazardGroup | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictConcern | null>(null);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showShelterDirectoryModal, setShowShelterDirectoryModal] = useState(false);

  const [selectedPredDistrict, setSelectedPredDistrict] = useState<{
    district: string;
    state: string;
    riskScore: number;
    dangerMetric: string;
    evacuationPriority: "immediate" | "standby" | "advisory";
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [showHeatmapLayer, setShowHeatmapLayer] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const stateRef = useRef({ zoom, offset });
  stateRef.current = { zoom, offset };

  // Reset drill-down when hazard, prediction, or viewMode changes
  useEffect(() => {
    setSelectedStateGroup(null);
    setSelectedDistrict(null);
    setSelectedPredDistrict(null);
    setShowDistrictModal(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [hazard?.id, prediction?.id, viewMode]);

  const zoomAt = useCallback((factor: number, px: number, py: number) => {
    const { zoom: z, offset: o } = stateRef.current;
    const next = clamp(z * factor, MIN_ZOOM, MAX_ZOOM);
    const k = next / z;
    setZoom(next);
    setOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k });
  }, []);

  // Smooth wheel zoom
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

  const resetView = () => {
    setSelectedStateGroup(null);
    setSelectedDistrict(null);
    setSelectedPredDistrict(null);
    setShowDistrictModal(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // If the click is on an interactive button or control, don't initiate canvas drag
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest(".no-drag")) {
      return;
    }
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

  // State drill-down with centered viewport geometry
  const drillDownToState = (stateGroup: StateHazardGroup) => {
    setSelectedStateGroup(stateGroup);
    const initialDistrict = stateGroup.districts[0] ?? null;
    setSelectedDistrict(initialDistrict);

    const el = viewportRef.current;
    if (!el) return;

    const targetZoom = 2.4;
    const width = el.clientWidth;
    const height = el.clientHeight;

    const imgSize = Math.min(width, height);
    const mapLeft = (width - imgSize) / 2;
    const mapTop = (height - imgSize) / 2;

    const targetX = mapLeft + (stateGroup.center.x / 100) * imgSize;
    const targetY = mapTop + (stateGroup.center.y / 100) * imgSize;

    const newOffsetX = width / 2 - targetX * targetZoom;
    const newOffsetY = height / 2 - targetY * targetZoom;

    setZoom(targetZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Drill down to a specific district
  const inspectDistrict = (dist: DistrictConcern, stateGroup?: StateHazardGroup) => {
    if (stateGroup && (!selectedStateGroup || selectedStateGroup.state !== stateGroup.state)) {
      setSelectedStateGroup(stateGroup);
    }
    setSelectedDistrict(dist);
    setShowDistrictModal(true);

    const el = viewportRef.current;
    if (!el) return;

    const targetZoom = Math.max(zoom, 2.6);
    const width = el.clientWidth;
    const height = el.clientHeight;

    const imgSize = Math.min(width, height);
    const mapLeft = (width - imgSize) / 2;
    const mapTop = (height - imgSize) / 2;

    const targetX = mapLeft + (dist.x / 100) * imgSize;
    const targetY = mapTop + (dist.y / 100) * imgSize;

    const newOffsetX = width / 2 - targetX * targetZoom;
    const newOffsetY = height / 2 - targetY * targetZoom;

    setZoom(targetZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Compute robust stateGroups
  const stateGroups = useMemo<StateHazardGroup[]>(() => {
    if (hazard?.stateGroups && hazard.stateGroups.length > 0) {
      return hazard.stateGroups;
    }
    if (hazard?.cells && hazard.cells.length > 0) {
      return hazard.cells.map((cell, idx) => ({
        state: cell.region.split(/[,\u2014-]/)[0]?.trim() || `Warning Zone ${idx + 1}`,
        severity: cell.severity,
        exposure: cell.exposure,
        activeAlertsCount: 1,
        center: { x: cell.x, y: cell.y, lat: 22, lon: 82 },
        districts: [
          {
            name: cell.region,
            state: cell.region.split(/[,\u2014-]/)[0]?.trim() || "National Alert Zone",
            severity: cell.severity,
            exposure: cell.exposure,
            lat: 22,
            lon: 82,
            x: cell.x,
            y: cell.y,
            dangerSummary: `${hazard.name} Warning Area: ${cell.region}`,
            evacuationPriority: cell.severity === "critical" ? "immediate" : "standby",
            bulletin: `${hazard.name} advisory in effect for ${cell.region}`,
            safeSheltersCount: 12,
          },
        ],
      }));
    }
    return [];
  }, [hazard]);

  const labelScale = 1 / zoom;

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative w-full h-full min-h-[420px] sm:min-h-[500px] touch-none overflow-hidden bg-background ${
        zoom > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
    >
      {/* Background Radar Instrumentation Rings */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50" />
        <div className="radar-sweep absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Main Pan / Zoom Container */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-300 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
      >
        {/* Square India Geospatial Canvas */}
        <div className="absolute inset-y-0 left-1/2 aspect-square h-full -translate-x-1/2 select-none">
          {/* Base SVG Map of India with Topography, Coastlines & States */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial Gradients for Heatmap Thermal Rendering */}
              <radialGradient id="heat-critical" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#dc2626" stopOpacity="0.5" />
                <stop offset="75%" stopColor="#ea580c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-severe" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#ea580c" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#eab308" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-warning" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#ca8a04" stopOpacity="0.35" />
                <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="heat-safe" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#0891b2" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>

              {/* Arrow Marker for Forecast Vector Track */}
              <marker
                id="forecastArrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
              </marker>

              {/* Topographic Land Pattern */}
              <pattern id="landGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path
                  d="M 4 0 L 0 0 0 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.15"
                  className="text-border/40"
                />
              </pattern>
            </defs>

            {/* Ocean Waters / Bay of Bengal / Arabian Sea Backdrop */}
            <rect width="100" height="100" className="fill-panel/30" />

            {/* Latitude / Longitude Geospatial Graticules */}
            <g className="stroke-border/30" strokeWidth="0.2" strokeDasharray="1 1.5">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="40" x2="100" y2="40" />
              <line x1="0" y1="60" x2="100" y2="60" />
              <line x1="0" y1="80" x2="100" y2="80" />
              <line x1="25" y1="0" x2="25" y2="100" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="75" y1="0" x2="75" y2="100" />
            </g>

            {/* Geographic Landmass Boundary of India */}
            <g>
              <path
                d="M 37.5 12.0
                   C 36.5 15.0, 34.0 18.0, 31.0 22.0
                   C 26.0 26.0, 21.0 30.0, 19.5 35.0
                   C 18.0 40.0, 20.0 45.0, 22.5 48.5
                   C 24.5 51.5, 23.0 55.5, 25.5 58.5
                   C 27.5 61.5, 29.5 67.0, 32.5 73.0
                   C 35.0 78.0, 38.0 84.0, 42.0 90.0
                   C 43.5 92.5, 45.0 92.5, 46.5 89.0
                   C 50.0 81.0, 55.0 73.0, 58.5 65.0
                   C 62.0 57.0, 68.0 50.0, 72.0 44.0
                   C 75.0 39.0, 80.0 35.0, 86.0 32.0
                   C 91.0 29.5, 93.0 25.0, 90.0 22.0
                   C 86.0 19.0, 81.0 21.0, 77.0 24.0
                   C 72.0 26.0, 66.0 27.0, 60.0 25.0
                   C 54.0 22.0, 49.0 17.0, 44.0 13.0
                   Z"
                className="fill-panel/90 stroke-border"
                strokeWidth="0.75"
              />

              {/* Land Texture */}
              <path
                d="M 37.5 12.0
                   C 36.5 15.0, 34.0 18.0, 31.0 22.0
                   C 26.0 26.0, 21.0 30.0, 19.5 35.0
                   C 18.0 40.0, 20.0 45.0, 22.5 48.5
                   C 24.5 51.5, 23.0 55.5, 25.5 58.5
                   C 27.5 61.5, 29.5 67.0, 32.5 73.0
                   C 35.0 78.0, 38.0 84.0, 42.0 90.0
                   C 43.5 92.5, 45.0 92.5, 46.5 89.0
                   C 50.0 81.0, 55.0 73.0, 58.5 65.0
                   C 62.0 57.0, 68.0 50.0, 72.0 44.0
                   C 75.0 39.0, 80.0 35.0, 86.0 32.0
                   C 91.0 29.5, 93.0 25.0, 90.0 22.0
                   C 86.0 19.0, 81.0 21.0, 77.0 24.0
                   C 72.0 26.0, 66.0 27.0, 60.0 25.0
                   C 54.0 22.0, 49.0 17.0, 44.0 13.0
                   Z"
                fill="url(#landGrid)"
              />

              {/* Internal State Geospatial Delimitation Lines */}
              <g
                className="stroke-border/45 fill-none"
                strokeWidth="0.35"
                strokeDasharray="0.6 0.8"
              >
                {/* Northern States (J&K, HP, Punjab, Haryana, Uttarakhand) */}
                <path d="M 33 21 C 36 23, 40 21, 45 19" />
                <path d="M 31 25 C 37 26, 42 27, 47 25" />
                {/* Western & Central (Rajasthan, Gujarat, MP) */}
                <path d="M 23 38 C 30 37, 39 39, 48 37" />
                <path d="M 21 47 C 27 46, 35 48, 43 49" />
                <path d="M 36 38 C 42 45, 47 48, 55 46" />
                {/* Eastern & Gangetic Plains (UP, Bihar, WB, Odisha) */}
                <path d="M 46 29 C 52 33, 60 34, 68 36" />
                <path d="M 54 36 C 58 42, 62 45, 68 47" />
                <path d="M 50 49 C 55 53, 58 58, 62 60" />
                {/* Peninsular & Southern (Maharashtra, Karnataka, AP, TN, Kerala) */}
                <path d="M 26 58 C 34 59, 44 57, 52 61" />
                <path d="M 29 67 C 36 68, 43 68, 50 71" />
                <path d="M 33 77 C 39 78, 44 80, 46 86" />
                {/* North-East Corridor (Assam, Meghalaya, Arunachal) */}
                <path d="M 72 32 C 78 30, 83 31, 89 27" />
                <path d="M 75 37 C 80 37, 85 36, 88 38" />
              </g>

              {/* Coastline Highlight */}
              <path
                d="M 20 44
                   C 23 50, 24 55, 26 60
                   C 28 65, 31 72, 35 80
                   C 38 85, 42 90, 44 92
                   C 46 90, 50 82, 55 74
                   C 60 66, 66 58, 70 50
                   C 73 45, 78 40, 84 35"
                className="stroke-sky-500/40 fill-none"
                strokeWidth="0.6"
              />
            </g>

            {/* SVG MULTI-LAYERED HEATMAPS */}
            {showHeatmapLayer && (
              <g className="heatmap-container mix-blend-multiply dark:mix-blend-screen pointer-events-none">
                {/* MODE 1: MONITORED HAZARD HEATMAP CELLS */}
                {viewMode === "hazard" && hazard?.cells && (
                  <g className="transition-opacity duration-500">
                    {hazard.cells.map((cell, idx) => {
                      const gradId = `heat-${cell.severity}`;
                      const radiusSvg = (cell.r / 1000) * 85;
                      return (
                        <g key={`hazard-cell-${idx}`}>
                          <circle
                            cx={cell.x}
                            cy={cell.y}
                            r={radiusSvg}
                            fill={`url(#${gradId})`}
                            className="animate-pulse"
                            style={{ animationDuration: `${2.8 + (idx % 3) * 0.7}s` }}
                          />
                          <circle
                            cx={cell.x}
                            cy={cell.y}
                            r={radiusSvg * 0.35}
                            fill={`url(#${gradId})`}
                            opacity="0.9"
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* MODE 2: PREDICTIVE DISASTER FORECAST HEATMAP & TRACK VECTOR */}
                {viewMode === "predictive" && prediction && (
                  <g className="transition-opacity duration-500">
                    {/* Primary Thermal Core Heatmap at Forecast Center */}
                    <circle
                      cx={prediction.center.x}
                      cy={prediction.center.y}
                      r={(prediction.heatmapRadius || 24) * 0.9}
                      fill="url(#heat-critical)"
                      className="animate-pulse"
                      style={{ animationDuration: "2.8s" }}
                    />
                    <circle
                      cx={prediction.center.x}
                      cy={prediction.center.y}
                      r={(prediction.heatmapRadius || 24) * 0.4}
                      fill="url(#heat-critical)"
                      opacity="0.9"
                    />

                    {/* Regional Impact Zones for High Risk Districts */}
                    {prediction.highRiskDistricts.map((dist, idx) => {
                      const gradId =
                        dist.evacuationPriority === "immediate" ? "heat-critical" : "heat-severe";
                      const radiusSvg = (dist.riskScore / 100) * 14 + 4;
                      return (
                        <circle
                          key={`pred-dist-heat-${dist.district}-${idx}`}
                          cx={dist.x}
                          cy={dist.y}
                          r={radiusSvg}
                          fill={`url(#${gradId})`}
                          className="animate-pulse"
                          style={{ animationDuration: `${2.2 + idx * 0.4}s` }}
                        />
                      );
                    })}

                    {/* Forecast Progression Vector Track */}
                    {prediction.forecastTrack && prediction.forecastTrack.length > 1 && (
                      <g className="forecast-track">
                        <path
                          d={`M ${prediction.forecastTrack.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1"
                          markerEnd="url(#forecastArrow)"
                        />
                        {prediction.forecastTrack.map((point, idx) => (
                          <g key={`track-pt-${idx}`}>
                            <circle cx={point.x} cy={point.y} r="1.2" fill="#ef4444" />
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="2"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="0.3"
                            />
                          </g>
                        ))}
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* HTML INTERACTIVE LAYER (Pins, Labels & Interactive Markers) */}

          {/* VIEW MODE 1: STATE CAPITALS (Default Overview) */}
          {viewMode === "capitals" && (
            <>
              {capitals.map((rep) => {
                const pos = projectCoords(rep.capital.lat, rep.capital.lon);
                const isSelected = selectedCapital?.id === rep.capital.id;

                return (
                  <button
                    key={rep.capital.id}
                    type="button"
                    onClick={() => onSelectCapital?.(rep.capital)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 outline-none group z-10 transition-transform duration-200 hover:scale-125 cursor-pointer"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    aria-label={`${rep.capital.name}, ${rep.capital.state}: ${rep.current.temperatureC}°C`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`size-3 rounded-full border-2 border-background shadow-md transition ${
                          isSelected
                            ? "bg-hazard-safe size-4 ring-4 ring-hazard-safe/30"
                            : "bg-sky-500 group-hover:bg-amber-400"
                        }`}
                      />
                      {isSelected && (
                        <span className="impact-ring absolute size-8 rounded-full border border-hazard-safe/80" />
                      )}
                    </div>

                    {showLabels && (
                      <div
                        className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-foreground ring-1 ring-border backdrop-blur-sm shadow-sm"
                        style={{ transform: `scale(${labelScale})`, transformOrigin: "top center" }}
                      >
                        <span>{rep.capital.name}</span>
                        <span className="ml-1 text-hazard-safe font-mono">
                          {rep.current.temperatureC}°
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {/* VIEW MODE 2: MONITORED HAZARD HEATMAP (Live De-clustered View) */}
          {viewMode === "hazard" && hazard && (
            <>
              {!selectedStateGroup ? (
                /* STATE-LEVEL HAZARD PINS (Interactive Clusters) */
                <>
                  {stateGroups.map((group) => (
                    <button
                      key={group.state}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        drillDownToState(group);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group outline-none z-20 cursor-pointer flex flex-col items-center select-none transition-transform hover:scale-110 active:scale-95"
                      style={{
                        left: `${group.center.x}%`,
                        top: `${group.center.y}%`,
                      }}
                      aria-label={`Drill into ${group.state}: ${group.districts.length} districts under warning`}
                    >
                      {/* Pulsing state threat beacon */}
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`size-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-shadow group-hover:ring-4 group-hover:ring-white/60 ${severityBg[group.severity]}`}
                        >
                          <span className="size-2.5 rounded-full bg-white animate-pulse" />
                        </span>
                        {group.severity === "critical" && (
                          <span className="impact-ring absolute size-14 rounded-full border border-hazard-critical/90" />
                        )}
                      </div>

                      {/* State Group Badge (Fully Interactive & Clickable) */}
                      {showLabels && (
                        <div
                          className="mt-1.5 whitespace-nowrap rounded-lg bg-background/95 px-3 py-1.5 text-center ring-1 ring-border shadow-xl backdrop-blur-md transition-all group-hover:border-hazard-safe group-hover:bg-background group-hover:shadow-2xl"
                          style={{
                            transform: `scale(${labelScale})`,
                            transformOrigin: "top center",
                          }}
                        >
                          <div className="flex items-center gap-1.5 justify-center">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider ${severityText[group.severity]}`}
                            >
                              {group.state}
                            </span>
                            <span className="rounded bg-panel-muted px-1.5 py-0.5 text-[9px] font-bold text-foreground">
                              {group.districts.length} Districts
                            </span>
                          </div>
                          <div className="mt-1 text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                            <span>Click to Inspect Districts</span>
                            <ChevronRight className="size-3" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </>
              ) : (
                /* DRILLED DOWN VIEW: SPECIFIC DISTRICT RISK NODES */
                <>
                  {selectedStateGroup.districts.map((dist) => {
                    const isSelected = selectedDistrict?.name === dist.name;
                    return (
                      <button
                        key={dist.name}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectDistrict(dist, selectedStateGroup);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group outline-none z-20 cursor-pointer flex flex-col items-center select-none transition-transform hover:scale-125"
                        style={{ left: `${dist.x}%`, top: `${dist.y}%` }}
                        aria-label={`Inspect ${dist.name}: ${dist.exposure}% Threat`}
                      >
                        <div className="relative flex items-center justify-center">
                          <span
                            className={`size-4 sm:size-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-white ring-4 ring-hazard-critical animate-pulse"
                                : severityBg[dist.severity]
                            }`}
                          >
                            {isSelected && <span className="size-2 rounded-full bg-red-600" />}
                          </span>
                          {dist.evacuationPriority === "immediate" && (
                            <span className="impact-ring absolute size-12 rounded-full border border-hazard-critical" />
                          )}
                        </div>

                        {showLabels && (
                          <div
                            className={`mt-1 whitespace-nowrap rounded-md px-2.5 py-1 text-center ring-1 shadow-lg backdrop-blur-md transition-all ${
                              isSelected
                                ? "bg-background ring-hazard-critical text-foreground scale-105 font-bold shadow-red-500/20"
                                : "bg-background/90 ring-border text-foreground hover:ring-hazard-safe"
                            }`}
                            style={{
                              transform: `scale(${labelScale})`,
                              transformOrigin: "top center",
                            }}
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${severityText[dist.severity]}`}
                              >
                                {dist.name}
                              </span>
                              <span className="text-[9px] font-semibold text-subtle-foreground">
                                ({dist.exposure}%)
                              </span>
                            </div>
                            <span className="text-[8px] uppercase tracking-wider text-hazard-critical font-bold block mt-0.5">
                              {dist.evacuationPriority === "immediate"
                                ? "🚨 Immediate Action"
                                : "⚠️ Standby Readiness"}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </>
          )}

          {/* VIEW MODE 3: PREDICTIVE DISASTER INCEPTION HEATMAP */}
          {viewMode === "predictive" && prediction && (
            <>
              {/* Epicenter Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                style={{ left: `${prediction.center.x}%`, top: `${prediction.center.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="size-6 sm:size-7 rounded-full bg-hazard-critical border-2 border-white shadow-2xl flex items-center justify-center animate-bounce">
                    <Sparkles className="size-3.5 sm:size-4 text-white" />
                  </span>
                  <span className="impact-ring absolute size-20 rounded-full border border-hazard-critical" />
                </div>
              </div>

              {/* High-Risk Districts Under Predicted Threat */}
              {prediction.highRiskDistricts.map((dist) => {
                const isSelected = selectedPredDistrict?.district === dist.district;
                return (
                  <button
                    key={dist.district}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPredDistrict(dist);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group outline-none z-20 cursor-pointer flex flex-col items-center transition-transform hover:scale-125"
                    style={{ left: `${dist.x}%`, top: `${dist.y}%` }}
                    aria-label={`Predicted risk in ${dist.district}: ${dist.dangerMetric}`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`size-4 sm:size-5 rounded-full border-2 border-white shadow-lg ${
                          dist.evacuationPriority === "immediate"
                            ? "bg-hazard-critical"
                            : "bg-hazard-severe"
                        } ${isSelected ? "ring-4 ring-white shadow-xl scale-110" : ""}`}
                      />
                      {dist.evacuationPriority === "immediate" && (
                        <span className="impact-ring absolute size-10 rounded-full border border-hazard-critical" />
                      )}
                    </div>

                    {showLabels && (
                      <div
                        className={`mt-1 whitespace-nowrap rounded px-2 py-1 text-center ring-1 shadow-md backdrop-blur-md ${
                          isSelected
                            ? "bg-background ring-hazard-critical text-foreground font-bold"
                            : "bg-background/95 ring-border text-foreground"
                        }`}
                        style={{ transform: `scale(${labelScale})`, transformOrigin: "top center" }}
                      >
                        <span className="text-[10px] font-bold text-foreground block">
                          {dist.district}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-hazard-critical block">
                          {dist.dangerMetric}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* FLOATING TOP STATE QUICK-SWITCHER PILLS (When in Hazard Mode) */}
      {viewMode === "hazard" && stateGroups.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 overflow-x-auto max-w-[92vw] sm:max-w-[70vw] p-1.5 rounded-xl bg-background/90 ring-1 ring-border backdrop-blur-md shadow-lg no-scrollbar">
          <button
            type="button"
            onClick={resetView}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1 ${
              !selectedStateGroup
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground hover:bg-panel"
            }`}
          >
            <span>🇮🇳 All States ({stateGroups.length})</span>
          </button>
          <div className="h-4 w-px bg-border shrink-0" />
          {stateGroups.map((grp) => {
            const isCurrent = selectedStateGroup?.state === grp.state;
            return (
              <button
                key={grp.state}
                type="button"
                onClick={() => drillDownToState(grp)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-hazard-safe text-white shadow-md ring-2 ring-hazard-safe/30"
                    : "bg-panel hover:bg-panel-muted text-foreground"
                }`}
              >
                <span className={`size-1.5 rounded-full ${severityBg[grp.severity]}`} />
                <span>{grp.state}</span>
                <span className="text-[9px] opacity-75 font-mono">({grp.districts.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* FLOATING TOP PREDICTION QUICK-SWITCHER PILLS (When in Predictive Mode) */}
      {viewMode === "predictive" && predictiveAlerts.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 overflow-x-auto max-w-[92vw] sm:max-w-[75vw] p-1.5 rounded-xl bg-background/90 ring-1 ring-border backdrop-blur-md shadow-lg no-scrollbar">
          {predictiveAlerts.map((pred) => {
            const isCurrent = prediction?.id === pred.id;
            return (
              <button
                key={pred.id}
                type="button"
                onClick={() => onSelectPrediction?.(pred.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-hazard-critical text-white shadow-md ring-2 ring-hazard-critical/30"
                    : "bg-panel hover:bg-panel-muted text-foreground"
                }`}
              >
                <Sparkles className="size-2.5 text-hazard-severe" />
                <span>
                  {pred.title.split("—")[0].replace("Very Severe Cyclonic Storm", "Cyclone").trim()}
                </span>
                <span className="text-[9px] opacity-85 font-mono font-normal">
                  (ETA {pred.timeToImpactFormatted.split(" ")[0]})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* FLOATING TOP-LEFT HUD: Active Mode Status & Controls */}
      <div className="absolute left-3 top-3 z-30 flex flex-col gap-2 rounded-lg bg-background/90 p-3 ring-1 ring-border backdrop-blur-md shadow-lg max-w-xs sm:max-w-sm">
        {viewMode === "hazard" && hazard && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`size-2.5 rounded-full ${hazard.severity === "critical" ? "bg-hazard-critical animate-ping" : "bg-hazard-severe"}`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Heatmap: {hazard.name}
              </span>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${severityText[hazard.severity]}`}
              >
                IMD {hazard.imdCode}
              </span>
            </div>

            {selectedStateGroup ? (
              <div className="space-y-1.5 pt-1.5 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {selectedStateGroup.state}
                    </span>
                    <span className="text-[10px] text-subtle-foreground font-semibold">
                      ({selectedStateGroup.districts.length} Districts)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={resetView}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <RotateCcw className="size-2.5" /> All States
                  </button>
                </div>
                <p className="text-[10px] text-subtle-foreground">
                  Click on any district node on the map or below to inspect warning bulletin &
                  shelter counts.
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-subtle-foreground">
                Click any <strong>State Node</strong> or{" "}
                <strong>&apos;Click to Inspect Districts&apos;</strong> badge to drill down.
              </p>
            )}
          </div>
        )}

        {viewMode === "predictive" && prediction && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-hazard-severe" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Forecast Vector: {prediction.disasterType}
              </span>
            </div>

            {/* Time to Occurrence / ETA Bar */}
            <div className="rounded bg-hazard-critical/15 p-2 border border-hazard-critical/30 space-y-0.5">
              <div className="text-[9px] font-bold uppercase tracking-widest text-hazard-critical flex items-center gap-1">
                <Clock className="size-3" />
                Time to Impact (ETA)
              </div>
              <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                {prediction.timeToImpactFormatted}
              </div>
              <div className="text-[9px] text-subtle-foreground">
                Impact Window: <strong>{prediction.impactWindowIST}</strong>
              </div>
            </div>
          </div>
        )}

        {viewMode === "capitals" && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              <Sun className="size-3.5 text-amber-500" />
              National Capitals Radar Map
            </div>
            <p className="text-[10px] text-subtle-foreground">
              Tracking real-time conditions across all 36 State & UT administrative centers.
            </p>
          </div>
        )}
      </div>

      {/* FLOATING TOP-RIGHT MAP CONTROLS */}
      <div className="absolute right-3 top-3 z-30 flex flex-col gap-1.5 rounded-lg bg-background/90 p-1.5 ring-1 ring-border backdrop-blur-md shadow-md">
        <button
          type="button"
          onClick={() => zoomButton(1.35)}
          className="flex size-7 items-center justify-center rounded hover:bg-panel text-muted-foreground hover:text-foreground transition cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomButton(0.75)}
          className="flex size-7 items-center justify-center rounded hover:bg-panel text-muted-foreground hover:text-foreground transition cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="flex size-7 items-center justify-center rounded hover:bg-panel text-muted-foreground hover:text-foreground transition cursor-pointer"
          title="Reset Map View"
          aria-label="Reset Map View"
        >
          <RotateCcw className="size-3.5" />
        </button>
        <div className="h-px bg-border my-0.5" />
        <button
          type="button"
          onClick={() => setShowHeatmapLayer((prev) => !prev)}
          className={`flex size-7 items-center justify-center rounded transition cursor-pointer ${
            showHeatmapLayer
              ? "bg-hazard-safe/20 text-hazard-safe"
              : "text-muted-foreground hover:bg-panel"
          }`}
          title={showHeatmapLayer ? "Hide Heatmap Layer" : "Show Heatmap Layer"}
          aria-label="Toggle Heatmap Layer"
        >
          <Flame className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setShowLabels((prev) => !prev)}
          className={`flex size-7 items-center justify-center rounded transition cursor-pointer ${
            showLabels
              ? "bg-hazard-safe/20 text-hazard-safe"
              : "text-muted-foreground hover:bg-panel"
          }`}
          title={showLabels ? "Hide District Labels" : "Show District Labels"}
          aria-label="Toggle Labels"
        >
          {showLabels ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </button>
      </div>

      {/* DRILLED-DOWN DISTRICT INSPECTOR DRAWER (Anchored Bottom-Left on Map) */}
      {selectedStateGroup && (
        <div className="absolute left-3 bottom-3 z-30 max-w-[94vw] sm:max-w-md bg-background/95 p-3.5 rounded-xl ring-1 ring-border shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-hazard-critical" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {selectedStateGroup.state} Districts Under Warning
                </h4>
                <p className="text-[9px] text-subtle-foreground">
                  {selectedStateGroup.districts.length} active district alerts
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetView}
              className="text-[10px] text-muted-foreground hover:text-foreground font-bold px-2 py-1 rounded bg-panel hover:bg-panel-muted transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="size-3" /> All States
            </button>
          </div>

          {/* District list / horizontal carousel */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {selectedStateGroup.districts.map((dist) => {
              const isSelected = selectedDistrict?.name === dist.name;
              return (
                <div
                  key={dist.name}
                  onClick={() => inspectDistrict(dist, selectedStateGroup)}
                  className={`p-2 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "border-hazard-critical bg-hazard-critical/10 shadow-sm"
                      : "border-border bg-panel/50 hover:bg-panel hover:border-border/80"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${
                          dist.severity === "critical"
                            ? "bg-red-500 animate-pulse"
                            : dist.severity === "severe"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-foreground truncate">
                        {dist.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${severityText[dist.severity]} bg-panel-muted`}
                      >
                        {dist.exposure}% Risk
                      </span>
                    </div>
                    <p className="text-[10px] text-subtle-foreground truncate mt-0.5">
                      {dist.dangerSummary}
                    </p>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      inspectDistrict(dist, selectedStateGroup);
                      setShowShelterDirectoryModal(true);
                    }}
                    className="flex items-center gap-1 shrink-0 hover:opacity-80 transition cursor-pointer"
                    title="Click to view all safe shelters in this district"
                  >
                    <span className="text-[9px] font-bold text-hazard-safe bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {dist.safeSheltersCount} Shelters
                    </span>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EXPANDED DISTRICT THREAT DOSSIER MODAL */}
      {showDistrictModal && selectedDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-background border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${
                    selectedDistrict.severity === "critical"
                      ? "bg-hazard-critical/15 text-hazard-critical"
                      : "bg-hazard-severe/15 text-hazard-severe"
                  }`}
                >
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    {selectedDistrict.name}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${severityText[selectedDistrict.severity]} ${severityBg[selectedDistrict.severity]}/15 border ${severityBorder[selectedDistrict.severity]}`}
                    >
                      {SEVERITY_LABEL[selectedDistrict.severity]}
                    </span>
                  </h3>
                  <p className="text-xs text-subtle-foreground">
                    State: <strong>{selectedDistrict.state}</strong> · Population Exposure:{" "}
                    <strong>{selectedDistrict.exposure}%</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDistrictModal(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-panel hover:text-foreground transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Warning Bulletin */}
            <div className="rounded-xl bg-panel/70 p-3.5 border border-border space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Official Warning Bulletin
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                {selectedDistrict.bulletin || selectedDistrict.dangerSummary}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-panel/50 p-3 border border-border space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Evacuation Priority
                </span>
                <div className="text-xs font-bold text-hazard-critical uppercase flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" />
                  {selectedDistrict.evacuationPriority === "immediate"
                    ? "Mandatory Immediate"
                    : "Standby Readiness"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowShelterDirectoryModal(true)}
                className="rounded-xl bg-panel/50 p-3 border border-border space-y-1 text-left hover:border-emerald-500/50 hover:bg-panel transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Safe Relief Shelters
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                    View List →
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Building2 className="size-3.5" />
                  {selectedDistrict.safeSheltersCount} Concrete Centers
                </div>
              </button>
            </div>

            {/* Emergency Action Protocols */}
            <div className="rounded-xl bg-panel/40 p-3.5 border border-border space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Immediate Survival Protocols for {selectedDistrict.name}
              </span>
              <ul className="space-y-1.5 text-xs text-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Move elderly, children, and livestock to designated community concrete shelters.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Turn off main electrical breakers and LPG gas cylinders before leaving premises.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Keep 3-day drinking water, dry rations, Aadhaar ID, and essential medicines
                    sealed.
                  </span>
                </li>
              </ul>
            </div>

            {/* Helplines / Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <a
                  href="tel:1077"
                  className="px-3 py-1.5 rounded-lg bg-hazard-critical text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition"
                >
                  <PhoneCall className="size-3.5" /> DEOC 1077
                </a>
                <a
                  href="tel:112"
                  className="px-3 py-1.5 rounded-lg bg-panel hover:bg-panel-muted text-foreground text-xs font-bold flex items-center gap-1.5 border border-border transition"
                >
                  <PhoneCall className="size-3.5" /> National 112
                </a>
              </div>

              <button
                type="button"
                onClick={() => setShowDistrictModal(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition cursor-pointer"
              >
                Back to Map View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM-RIGHT HEATMAP SEVERITY SCALE LEGEND */}
      <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1 rounded-lg bg-background/90 p-2.5 ring-1 ring-border backdrop-blur-md shadow-md text-[9px]">
        <span className="font-bold uppercase tracking-wider text-subtle-foreground text-[8px]">
          Heatmap Severity Scale
        </span>
        <div className="flex items-center gap-1">
          <div className="h-2 w-28 rounded-full bg-gradient-to-r from-cyan-500 via-yellow-400 via-orange-500 to-red-600 shadow-inner" />
        </div>
        <div className="flex justify-between text-[8px] font-bold text-subtle-foreground pt-0.5">
          <span className="text-cyan-600 dark:text-cyan-400">Safe</span>
          <span className="text-yellow-600 dark:text-yellow-400">Warning</span>
          <span className="text-orange-600 dark:text-orange-400">Severe</span>
          <span className="text-red-600 dark:text-red-400">Critical</span>
        </div>
      </div>
      {/* EMERGENCY SHELTER DIRECTORY MODAL */}
      <ShelterDirectoryModal
        isOpen={showShelterDirectoryModal}
        onClose={() => setShowShelterDirectoryModal(false)}
        hazard={hazard}
        initialDistrict={selectedDistrict?.name}
        initialState={selectedDistrict?.state || selectedStateGroup?.state}
      />
    </div>
  );
}
