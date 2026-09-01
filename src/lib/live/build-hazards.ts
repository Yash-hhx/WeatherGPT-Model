import { HAZARDS, type Hazard, type HazardId, type HeatCell, type Severity } from "@/lib/hazards";
import { IMD_CODE, categorise, project, severityFrom } from "./geo";

export interface LiveAlert {
  id: number;
  disaster_type: string;
  category: string;
  area_description: string;
  warning_message: string;
  severity_color: string;
  severity_level: string | null;
  severity_raw: string | null;
  alert_source: string | null;
  effective_start: string | null;
  effective_end: string | null;
  lat: number | null;
  lon: number | null;
  area_covered_km2: number | null;
  state: string | null;
}

export interface LiveCondition {
  city: string;
  state: string;
  lat: number;
  lon: number;
  temperature_c: number | null;
  apparent_c: number | null;
  precipitation_mm: number | null;
  precip_24h_mm: number | null;
  wind_kph: number | null;
  us_aqi: number | null;
  pm2_5: number | null;
  weather_code: number | null;
  is_day: number | null;
  updated_at: string;
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 3, severe: 2, warning: 1, safe: 0 };
const IMPACT_BASE: Record<Severity, number> = { critical: 88, severe: 68, warning: 44, safe: 18 };

const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function radiusFor(areaKm2: number | null, severity: Severity) {
  const base = areaKm2 && areaKm2 > 0 ? Math.sqrt(areaKm2) * 3.4 : 90;
  const weight = severity === "critical" ? 1.15 : severity === "severe" ? 1.05 : 1;
  return Math.round(Math.min(170, Math.max(70, base * weight)));
}

function impactIndex(alert: LiveAlert, severity: Severity) {
  const area = alert.area_covered_km2 ?? 0;
  const bonus = Math.min(10, Math.round(Math.log10(Math.max(area, 1)) * 2.5));
  return Math.min(99, IMPACT_BASE[severity] + bonus);
}

function shortArea(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 46 ? `${clean.slice(0, 44)}…` : clean;
}

function countdown(target: string | null, now: number) {
  if (!target) return "—:—:—";
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return "00:00:00";
  const s = Math.floor(diff / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function aqiSeverity(aqi: number): Severity {
  if (aqi >= 200) return "critical";
  if (aqi >= 150) return "severe";
  if (aqi >= 100) return "warning";
  return "safe";
}

function heatSeverity(temp: number): Severity {
  if (temp >= 45) return "critical";
  if (temp >= 42) return "severe";
  if (temp >= 38) return "warning";
  return "safe";
}

function conditionCells(
  conditions: LiveCondition[],
  value: (c: LiveCondition) => number | null,
  sev: (v: number) => Severity,
  unit: string,
): HeatCell[] {
  return conditions
    .map((c) => ({ c, v: value(c) }))
    .filter((e): e is { c: LiveCondition; v: number } => e.v !== null)
    .sort((a, b) => b.v - a.v)
    .slice(0, 16)
    .map(({ c, v }) => {
      const severity = sev(v);
      const p = project(c.lat, c.lon);
      return {
        x: p.x,
        y: p.y,
        r: severity === "critical" ? 140 : severity === "severe" ? 120 : 100,
        severity,
        region: `${c.city} — ${Math.round(v)}${unit}`,
        exposure: Math.min(99, Math.round(IMPACT_BASE[severity])),
      };
    });
}

function buildAlertHazard(
  id: HazardId,
  alerts: LiveAlert[],
  conditions: LiveCondition[],
  now: number,
): Hazard {
  const template = HAZARDS.find((h) => h.id === id) ?? (HAZARDS[0] as Hazard);
  const ranked = alerts
    .map((a) => ({ a, s: severityFrom(a.severity_color, a.severity_raw) }))
    .sort(
      (x, y) =>
        SEVERITY_RANK[y.s] - SEVERITY_RANK[x.s] ||
        (y.a.area_covered_km2 ?? 0) - (x.a.area_covered_km2 ?? 0),
    );

  // The feed republishes the same station/district under several identifiers —
  // keep only the most severe bulletin per area.
  const seen = new Set<string>();
  const scored = ranked.filter((e) => {
    const key = `${e.a.area_description}|${e.a.disaster_type}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const top = scored[0];
  const severity: Severity = top ? top.s : "safe";
  const states = [...new Set(scored.map((e) => e.a.state).filter(Boolean))] as string[];
  const totalArea = scored.reduce((sum, e) => sum + (e.a.area_covered_km2 ?? 0), 0);
  const sources = [...new Set(scored.map((e) => e.a.alert_source).filter(Boolean))] as string[];

  const cells: HeatCell[] = scored
    .filter((e) => e.a.lat !== null && e.a.lon !== null)
    .slice(0, 30)
    .map((e) => {
      const p = project(e.a.lat as number, e.a.lon as number);
      return {
        x: p.x,
        y: p.y,
        r: radiusFor(e.a.area_covered_km2, e.s),
        severity: e.s,
        region: shortArea(e.a.area_description),
        exposure: impactIndex(e.a, e.s),
      };
    });

  const soonest = scored
    .map((e) => e.a.effective_end)
    .filter(Boolean)
    .sort()[0] as string | undefined;

  const worst = conditions.reduce<LiveCondition | null>(
    (best, c) => ((c.precip_24h_mm ?? 0) > (best?.precip_24h_mm ?? -1) ? c : best),
    null,
  );

  const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
  ];

  const dynamicStateGroups: StateHazardGroup[] = [];
  const stateMap = new Map<string, typeof scored>();
  for (const item of scored) {
    let st = item.a.state?.trim();
    if (!st || st.toLowerCase() === "null" || st.toLowerCase() === "alert zone") {
      const fullText = `${item.a.area_description} ${item.a.warning_message || ""}`.toLowerCase();
      const matched = INDIAN_STATES.find((s) => fullText.includes(s.toLowerCase()));
      st = matched || "National Alert Zone";
    }
    if (!stateMap.has(st)) stateMap.set(st, []);
    stateMap.get(st)!.push(item);
  }

  for (const [st, items] of stateMap.entries()) {
    const highestSev =
      items.map((i) => i.s).sort((a, b) => SEVERITY_RANK[b] - SEVERITY_RANK[a])[0] || "warning";
    const avgExposure = Math.round(
      items.reduce((sum, i) => sum + impactIndex(i.a, i.s), 0) / items.length,
    );
    const validCoords = items.filter((i) => i.a.lat != null && i.a.lon != null);
    const centerLat = validCoords.length
      ? validCoords.reduce((s, i) => s + (i.a.lat as number), 0) / validCoords.length
      : 22.0;
    const centerLon = validCoords.length
      ? validCoords.reduce((s, i) => s + (i.a.lon as number), 0) / validCoords.length
      : 82.0;
    const centerProj = project(centerLat, centerLon);

    dynamicStateGroups.push({
      state: st,
      severity: highestSev,
      exposure: avgExposure,
      activeAlertsCount: items.length,
      center: { x: centerProj.x, y: centerProj.y, lat: centerLat, lon: centerLon },
      districts: items.slice(0, 10).map((it, idx) => {
        let dProj =
          it.a.lat != null && it.a.lon != null ? project(it.a.lat, it.a.lon) : { ...centerProj };

        // If multiple items in same state share identical coordinates, disperse radially
        if (
          items.length > 1 &&
          (it.a.lat == null ||
            items.some(
              (other, oIdx) =>
                oIdx < idx &&
                Math.abs((other.a.lat ?? 0) - (it.a.lat ?? 0)) < 0.05 &&
                Math.abs((other.a.lon ?? 0) - (it.a.lon ?? 0)) < 0.05,
            ))
        ) {
          const angle = (idx / Math.min(items.length, 10)) * 2 * Math.PI;
          const radius = 3.2; // slight percentage dispersion
          dProj = {
            x: Math.max(12, Math.min(88, centerProj.x + Math.cos(angle) * radius)),
            y: Math.max(12, Math.min(88, centerProj.y + Math.sin(angle) * radius)),
          };
        }

        return {
          name: shortArea(it.a.area_description),
          state: st,
          severity: it.s,
          exposure: impactIndex(it.a, it.s),
          lat: it.a.lat ?? centerLat,
          lon: it.a.lon ?? centerLon,
          x: dProj.x,
          y: dProj.y,
          dangerSummary: it.a.warning_message || `${it.a.disaster_type} Warning in force`,
          evacuationPriority: it.s === "critical" ? "immediate" : "standby",
          bulletin: it.a.warning_message || `${it.a.alert_source} active bulletin`,
          safeSheltersCount: Math.max(8, Math.round(impactIndex(it.a, it.s) * 0.35)),
        };
      }),
    });
  }

  const finalStateGroups =
    dynamicStateGroups.length > 0 ? dynamicStateGroups : (template.stateGroups ?? []);

  return {
    ...template,
    id,
    event: top
      ? `${top.a.disaster_type} — ${top.a.state ?? shortArea(top.a.area_description)}`
      : `${template.name} — no active warning`,
    imdCode: IMD_CODE[severity],
    states: states.length ? states.slice(0, 5).join(" · ") : "No state currently under warning",
    headline: top
      ? `${top.a.alert_source ?? "NDMA Sachet"} ${IMD_CODE[severity]} warning — ${shortArea(top.a.area_description)} · expires in`
      : `No active ${template.name.toLowerCase()} warning on the national feed — next refresh in`,
    countdown: countdown(soonest ?? null, now),
    severity,
    metrics: [
      { label: "Active Warnings", value: `${scored.length}`, severity },
      { label: "States / UTs Affected", value: `${states.length || 0}`, severity: severity },
      {
        label: "Area Under Warning",
        value: totalArea > 0 ? `${nf.format(Math.round(totalArea))} KM²` : "—",
        severity: "warning",
      },
      {
        label: "Wettest Tracked City (24H)",
        value:
          worst?.precip_24h_mm != null ? `${worst.city} ${worst.precip_24h_mm.toFixed(1)} MM` : "—",
        severity: (worst?.precip_24h_mm ?? 0) > 60 ? "severe" : "safe",
      },
    ],
    briefing: top
      ? top.a.warning_message ||
        `${top.a.disaster_type} warning in force for ${top.a.area_description}.`
      : `No ${template.name.toLowerCase()} warning is currently published on the national alert feed. Live city telemetry is still being tracked below.`,
    areaKm2: totalArea > 0 ? `${nf.format(Math.round(totalArea))} KM²` : "—",
    expansion: `${scored.length} LIVE BULLETINS`,
    coreRadius: top?.a.area_covered_km2
      ? `${Math.round(Math.sqrt(top.a.area_covered_km2 / Math.PI))} KM`
      : "—",
    cells: cells.length
      ? cells
      : conditionCells(
          conditions,
          (c) => c.precip_24h_mm,
          (v) => (v > 100 ? "severe" : v > 40 ? "warning" : "safe"),
          " MM",
        ),
    stateGroups: finalStateGroups,
    relocationHubs: template.relocationHubs ?? [],
    broadcast: [
      {
        title: "Sachet / Cell Broadcast",
        detail: top
          ? `${scored.length} live bulletin(s) relayed for ${shortArea(top.a.area_description)}`
          : "Standing by — no live bulletin for this hazard",
        active: scored.length > 0,
      },
      {
        title: "District Disaster Authorities",
        detail: states.length
          ? `DDMAs notified across ${states.slice(0, 4).join(", ")}`
          : "No district authority activation required",
        active: states.length > 0,
      },
      {
        title: "Issuing Agencies",
        detail: sources.length ? sources.slice(0, 4).join(" · ") : "IMD · CWC · NDMA",
        active: sources.length > 0,
      },
    ],
    cards: template.cards,
  };
}

function buildHeatHazard(alerts: LiveAlert[], conditions: LiveCondition[], now: number): Hazard {
  if (alerts.length) return buildAlertHazard("heat", alerts, conditions, now);
  const template = HAZARDS.find((h) => h.id === "heat") as Hazard;
  const hottest = [...conditions]
    .filter((c) => c.apparent_c !== null)
    .sort((a, b) => (b.apparent_c as number) - (a.apparent_c as number));
  const top = hottest[0];
  const severity = top?.apparent_c != null ? heatSeverity(top.apparent_c) : "safe";

  return {
    ...template,
    event: top ? `Heat Index — ${top.city}, ${top.state}` : "Heat — no live reading",
    imdCode: IMD_CODE[severity],
    states: hottest
      .slice(0, 4)
      .map((c) => c.state)
      .filter((s, i, a) => a.indexOf(s) === i)
      .join(" · "),
    headline: `Live heat index peak ${top?.apparent_c?.toFixed(1) ?? "—"}°C at ${top?.city ?? "—"} — reading refreshes in`,
    countdown: countdown(new Date(now + 5 * 60_000).toISOString(), now),
    severity,
    metrics: hottest.slice(0, 4).map((c) => ({
      label: `${c.city} Feels Like`,
      value: `${c.apparent_c?.toFixed(1) ?? "—"}°C`,
      severity: heatSeverity(c.apparent_c ?? 0),
    })),
    briefing: `No IMD heat warning is on the national feed right now. Live observations show a peak apparent temperature of ${top?.apparent_c?.toFixed(1) ?? "—"}°C at ${top?.city ?? "—"}, with air temperature ${top?.temperature_c?.toFixed(1) ?? "—"}°C. Heat-action precautions below stay valid whenever the heat index crosses 40°C.`,
    areaKm2: "—",
    expansion: `${conditions.length} CITIES POLLED`,
    coreRadius: "—",
    cells: conditionCells(conditions, (c) => c.apparent_c, heatSeverity, "°C"),
    broadcast: [
      { title: "Sachet / Cell Broadcast", detail: "No heat warning to relay", active: false },
      {
        title: "District Disaster Authorities",
        detail: "Heat action plans on standby",
        active: severity !== "safe",
      },
      { title: "Issuing Agencies", detail: "IMD observations · Open-Meteo model", active: true },
    ],
  };
}

function buildAqiHazard(alerts: LiveAlert[], conditions: LiveCondition[], now: number): Hazard {
  const template = HAZARDS.find((h) => h.id === "airquality") as Hazard;
  const ranked = [...conditions]
    .filter((c) => c.us_aqi !== null)
    .sort((a, b) => (b.us_aqi as number) - (a.us_aqi as number));
  const top = ranked[0];
  const severity = top?.us_aqi != null ? aqiSeverity(top.us_aqi) : "safe";

  return {
    ...template,
    event: top ? `Air Quality — ${top.city}, ${top.state}` : "Air Quality — no live reading",
    imdCode: IMD_CODE[severity],
    states: ranked
      .slice(0, 4)
      .map((c) => c.state)
      .filter((s, i, a) => a.indexOf(s) === i)
      .join(" · "),
    headline: `Live AQI peak ${Math.round(top?.us_aqi ?? 0)} at ${top?.city ?? "—"} — reading refreshes in`,
    countdown: countdown(new Date(now + 5 * 60_000).toISOString(), now),
    severity,
    metrics: ranked.slice(0, 4).map((c) => ({
      label: `${c.city} AQI`,
      value: `${Math.round(c.us_aqi ?? 0)} · PM2.5 ${Math.round(c.pm2_5 ?? 0)}`,
      severity: aqiSeverity(c.us_aqi ?? 0),
    })),
    briefing: `Live air-quality model readings across ${conditions.length} tracked cities. Peak US AQI is ${Math.round(top?.us_aqi ?? 0)} at ${top?.city ?? "—"} with PM2.5 at ${Math.round(top?.pm2_5 ?? 0)} µg/m³. GRAP stages are triggered by CPCB on sustained AQI, not single readings.${alerts.length ? ` ${alerts.length} related official bulletin(s) are also active.` : ""}`,
    areaKm2: "—",
    expansion: `${conditions.length} CITIES POLLED`,
    coreRadius: "—",
    cells: conditionCells(conditions, (c) => c.us_aqi, aqiSeverity, " AQI"),
    broadcast: [
      {
        title: "Sachet / Cell Broadcast",
        detail: alerts.length
          ? `${alerts.length} bulletin(s) live`
          : "No pollution bulletin to relay",
        active: alerts.length > 0,
      },
      {
        title: "District Disaster Authorities",
        detail: severity === "safe" ? "No GRAP escalation indicated" : "GRAP review recommended",
        active: severity !== "safe",
      },
      {
        title: "Issuing Agencies",
        detail: "CAMS air-quality model · CPCB reference",
        active: true,
      },
    ],
  };
}

export function buildLiveHazards(
  alerts: LiveAlert[],
  conditions: LiveCondition[],
  now: number,
): Hazard[] {
  const byCategory = new Map<string, LiveAlert[]>();
  for (const a of alerts) {
    const key = (a.category as HazardId) ?? categorise(a.disaster_type);
    const list = byCategory.get(key) ?? [];
    list.push(a);
    byCategory.set(key, list);
  }

  const hazards: Hazard[] = [
    buildAlertHazard("flood", byCategory.get("flood") ?? [], conditions, now),
    buildAlertHazard("rain", byCategory.get("rain") ?? [], conditions, now),
    buildAlertHazard("thunderstorm", byCategory.get("thunderstorm") ?? [], conditions, now),
    buildAlertHazard("cyclone", byCategory.get("cyclone") ?? [], conditions, now),
    buildHeatHazard(byCategory.get("heat") ?? [], conditions, now),
    buildAqiHazard(byCategory.get("airquality") ?? [], conditions, now),
  ];

  return hazards.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
}
