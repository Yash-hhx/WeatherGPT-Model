import { categorise, detectState, insideIndia, severityFrom, TRACKED_CITIES } from "./geo";

const SACHET_URL = "https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/** Parses "Sun Aug 30 10:25:00 IST 2026" into an ISO timestamp. */
export function parseIndianTimestamp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const m = value.match(/^\w{3}\s+(\w{3})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})\s+\w+\s+(\d{4})$/);
  if (!m) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const [, mon, day, hh, mm, ss, yyyy] = m;
  const month = MONTHS[mon as string];
  if (month === undefined) return null;
  // Feed timestamps are IST (UTC+05:30).
  const utc = Date.UTC(
    Number(yyyy),
    month,
    Number(day),
    Number(hh) - 5,
    Number(mm) - 30,
    Number(ss),
  );
  return new Date(utc).toISOString();
}

export interface AlertRow {
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
  raw: Record<string, unknown>;
  ingested_at: string;
}

export async function fetchOfficialAlerts(): Promise<AlertRow[]> {
  const res = await fetch(SACHET_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      Accept: "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    body: "{}",
  });
  if (!res.ok) throw new Error(`National alert feed returned ${res.status}`);
  const payload = (await res.json()) as Record<string, unknown>[];
  if (!Array.isArray(payload)) throw new Error("Unexpected alert feed payload");

  const now = new Date().toISOString();
  const rows = new Map<number, AlertRow>();

  for (const a of payload) {
    const id = Number(a["identifier"]);
    if (!Number.isFinite(id)) continue;
    if (String(a["actual_lang"] ?? "en") !== "en") continue;

    let lat: number | null = null;
    let lon: number | null = null;
    const centroid = typeof a["centroid"] === "string" ? a["centroid"].split(",") : null;
    if (centroid && centroid.length === 2) {
      const cLon = Number(centroid[0]);
      const cLat = Number(centroid[1]);
      if (Number.isFinite(cLat) && Number.isFinite(cLon) && insideIndia(cLat, cLon)) {
        lat = cLat;
        lon = cLon;
      }
    }

    const disasterType = String(a["disaster_type"] ?? "Weather warning");
    const area = String(a["area_description"] ?? "India");
    const message = String(a["warning_message"] ?? "");
    const areaKm2 = Number(a["area_covered"]);

    rows.set(id, {
      id,
      disaster_type: disasterType,
      category: categorise(disasterType),
      area_description: area,
      warning_message: message,
      severity_color: String(a["severity_color"] ?? "yellow").toLowerCase(),
      severity_level: a["severity_level"] ? String(a["severity_level"]) : null,
      severity_raw: a["severity"] ? String(a["severity"]) : null,
      alert_source: a["alert_source"] ? String(a["alert_source"]) : null,
      effective_start: parseIndianTimestamp(a["effective_start_time"]),
      effective_end: parseIndianTimestamp(a["effective_end_time"]),
      lat,
      lon,
      area_covered_km2: Number.isFinite(areaKm2) ? areaKm2 : null,
      state: detectState(`${area} ${message}`),
      raw: a,
      ingested_at: now,
    });
  }

  return [...rows.values()];
}

export interface ConditionRow {
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
  updated_at: string;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export async function fetchCityConditions(): Promise<ConditionRow[]> {
  const lats = TRACKED_CITIES.map((c) => c.lat).join(",");
  const lons = TRACKED_CITIES.map((c) => c.lon).join(",");

  const forecastUrl =
    `${FORECAST_URL}?latitude=${lats}&longitude=${lons}` +
    "&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,relative_humidity_2m,weather_code" +
    "&wind_speed_unit=kmh&timezone=Asia%2FKolkata" +
    `&cachebust=${Date.now()}`;
  const airUrl = `${AIR_URL}?latitude=${lats}&longitude=${lons}&current=us_aqi,pm2_5&timezone=Asia%2FKolkata&cachebust=${Date.now()}`;

  const [forecastRes, airRes] = await Promise.all([fetch(forecastUrl), fetch(airUrl)]);
  if (!forecastRes.ok) throw new Error(`Weather feed returned ${forecastRes.status}`);

  const asArray = (v: unknown) =>
    (Array.isArray(v) ? v : [v]) as Record<string, Record<string, unknown> | undefined>[];
  const forecast = asArray(await forecastRes.json());
  const air = airRes.ok ? asArray(await airRes.json()) : [];
  const now = new Date().toISOString();

  return TRACKED_CITIES.map((c, i) => {
    const f = forecast[i]?.["current"] ?? {};
    const daily = forecast[i]?.["daily"] ?? {};
    const a = air[i]?.["current"] ?? {};
    return {
      city: c.city,
      state: c.state,
      lat: c.lat,
      lon: c.lon,
      temperature_c: num(f["temperature_2m"]),
      apparent_c: num(f["apparent_temperature"]),
      precipitation_mm: num(f["precipitation"]),
      precip_24h_mm: num(daily["precipitation_sum"]?.[0]),
      wind_kph: num(f["wind_speed_10m"]),
      us_aqi: num(a["us_aqi"]),
      pm2_5: num(a["pm2_5"]),
      updated_at: now,
    };
  });
}

/** Pulls every source and writes it to the database. Server-only. */
export async function runIngest() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const summary = { alerts: 0, conditions: 0, errors: [] as string[] };

  try {
    const alerts = await fetchOfficialAlerts();
    if (alerts.length) {
      const { error } = await supabaseAdmin
        .from("live_alerts")
        .upsert(alerts as unknown as never[], { onConflict: "id" });
      if (error) throw new Error(error.message);
      // Drop alerts that expired more than a day ago and are no longer in the feed.
      await supabaseAdmin
        .from("live_alerts")
        .delete()
        .lt("effective_end", new Date(Date.now() - 24 * 3600_000).toISOString())
        .not("id", "in", `(${alerts.map((a) => a.id).join(",")})`);
    }
    summary.alerts = alerts.length;
    await supabaseAdmin
      .from("ingest_runs")
      .insert({ source: "sachet", ok: true, records: alerts.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "alert ingest failed";
    summary.errors.push(message);
    await supabaseAdmin.from("ingest_runs").insert({ source: "sachet", ok: false, error: message });
  }

  try {
    const conditions = await fetchCityConditions();
    const { error } = await supabaseAdmin
      .from("live_conditions")
      .upsert(conditions, { onConflict: "city" });
    if (error) throw new Error(error.message);
    summary.conditions = conditions.length;
    await supabaseAdmin
      .from("ingest_runs")
      .insert({ source: "weather", ok: true, records: conditions.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "weather ingest failed";
    summary.errors.push(message);
    await supabaseAdmin
      .from("ingest_runs")
      .insert({ source: "weather", ok: false, error: message });
  }

  return summary;
}
