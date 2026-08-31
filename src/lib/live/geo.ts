import type { HazardId, Severity } from "@/lib/hazards";

/**
 * Equirectangular projection calibrated against the India relief image used by
 * RiskMap. Returns percentage coordinates on the square map canvas.
 */
export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: 3.13 * lon - 208.6, y: -2.903 * lat + 111.013 };
}

export const INDIA_BOUNDS = { minLat: 6, maxLat: 37.5, minLon: 67, maxLon: 98 };

export function insideIndia(lat: number, lon: number) {
  return (
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lon >= INDIA_BOUNDS.minLon &&
    lon <= INDIA_BOUNDS.maxLon
  );
}

/** Map an official disaster_type string onto one of the console's hazard tabs. */
export function categorise(disasterType: string): HazardId {
  const t = disasterType.toLowerCase();
  if (t.includes("cyclone") || t.includes("surge") || t.includes("gale")) return "cyclone";
  if (t.includes("flood") || t.includes("inundation")) return "flood";
  if (
    t.includes("thunder") ||
    t.includes("lightning") ||
    t.includes("squall") ||
    t.includes("hail")
  )
    return "thunderstorm";
  if (t.includes("heat") || t.includes("warm night")) return "heat";
  if (
    t.includes("smog") ||
    t.includes("pollution") ||
    t.includes("air quality") ||
    t.includes("fog")
  )
    return "airquality";
  return "rain";
}

export function severityFrom(color: string | null, raw: string | null): Severity {
  const c = (color ?? "").toLowerCase();
  if (c === "red") return "critical";
  if (c === "orange") return "severe";
  if (c === "yellow") return "warning";
  if (c === "green") return "safe";
  const r = (raw ?? "").toLowerCase();
  if (r.includes("severe") || r.includes("extreme") || r === "warning") return "critical";
  if (r === "alert") return "severe";
  if (r === "watch") return "warning";
  return "warning";
}

export const IMD_CODE: Record<Severity, "RED" | "ORANGE" | "YELLOW" | "GREEN"> = {
  critical: "RED",
  severe: "ORANGE",
  warning: "YELLOW",
  safe: "GREEN",
};

export const INDIAN_STATES = [
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
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Lakshadweep",
  "Dadra and Nagar Haveli and Daman and Diu",
];

export function detectState(text: string): string | null {
  const hay = text.toLowerCase();
  for (const s of INDIAN_STATES) {
    if (hay.includes(s.toLowerCase())) return s;
  }
  return null;
}

/** Cities polled for live temperature, rainfall and air quality. */
export const TRACKED_CITIES: { city: string; state: string; lat: number; lon: number }[] = [
  { city: "Delhi", state: "Delhi", lat: 28.61, lon: 77.21 },
  { city: "Mumbai", state: "Maharashtra", lat: 19.08, lon: 72.88 },
  { city: "Kolkata", state: "West Bengal", lat: 22.57, lon: 88.36 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.08, lon: 80.27 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.97, lon: 77.59 },
  { city: "Hyderabad", state: "Telangana", lat: 17.39, lon: 78.49 },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.02, lon: 72.57 },
  { city: "Pune", state: "Maharashtra", lat: 18.52, lon: 73.86 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.91, lon: 75.79 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.85, lon: 80.95 },
  { city: "Patna", state: "Bihar", lat: 25.59, lon: 85.14 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.26, lon: 77.41 },
  { city: "Nagpur", state: "Maharashtra", lat: 21.15, lon: 79.09 },
  { city: "Guwahati", state: "Assam", lat: 26.14, lon: 91.74 },
  { city: "Bhubaneswar", state: "Odisha", lat: 20.3, lon: 85.82 },
  { city: "Amritsar", state: "Punjab", lat: 31.63, lon: 74.87 },
  { city: "Chitrakoot", state: "Uttar Pradesh", lat: 25.2, lon: 80.9 },
  { city: "Varanasi", state: "Uttar Pradesh", lat: 25.32, lon: 82.97 },
  { city: "Kochi", state: "Kerala", lat: 9.93, lon: 76.27 },
  { city: "Srinagar", state: "Jammu and Kashmir", lat: 34.08, lon: 74.8 },
];
