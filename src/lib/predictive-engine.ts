import { DEFAULT_STATIC_EPOCH, getIstHour, type CapitalWeatherReport } from "./capitals";
import type { HazardId, Severity } from "./hazards";

export interface PredictiveDisasterAlert {
  id: string;
  hazardId: HazardId;
  title: string;
  disasterType: string;
  severity: Severity;
  imdWarningCode: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  stage: "pre_formation" | "imminent_threat" | "active_impact" | "post_impact";
  timeToImpactHours: number;
  timeToImpactFormatted: string;
  impactWindowIST: string;
  confidencePercent: number;
  triggerMechanism: string;
  affectedStates: string[];
  center: { lat: number; lon: number; x: number; y: number };
  heatmapRadius: number;
  forecastTrack?: { x: number; y: number; time: string; intensity: string }[];
  highRiskDistricts: {
    district: string;
    state: string;
    riskScore: number;
    dangerMetric: string;
    evacuationPriority: "immediate" | "standby" | "advisory";
    x: number;
    y: number;
  }[];
  thermodynamicIndicators: {
    label: string;
    currentValue: string;
    thresholdValue: string;
    status: "critical" | "warning" | "normal";
  }[];
  preEmptiveActions: {
    forAuthorities: string[];
    forCommunities: string[];
    forVulnerablePopulations: string[];
  };
}

export function computePredictiveDisasterAlerts(
  reports: CapitalWeatherReport[],
  nowMs: number = DEFAULT_STATIC_EPOCH,
): PredictiveDisasterAlert[] {
  const alerts: PredictiveDisasterAlert[] = [];
  const nowDate = new Date(nowMs);
  const hour = getIstHour(nowDate);

  // 1. Bay of Bengal / East Coast Tropical Cyclone Predictive Model
  const coastalEast = reports.filter((r) =>
    ["bhubaneswar", "kolkata", "amaravati", "chennai", "portblair"].includes(r.capital.id),
  );
  const coastalWindMax = Math.max(...coastalEast.map((r) => r.current.windKph), 45);
  const coastalPressureMin = Math.min(...coastalEast.map((r) => r.current.pressureHpa), 998);

  const cycloneEtaHours = 4.5;
  const cycloneEtaMs = nowMs + cycloneEtaHours * 3600_000;
  const cycloneImpactDate = new Date(cycloneEtaMs);
  const cycloneWindow = `${String(getIstHour(cycloneImpactDate)).padStart(2, "0")}:00 IST - ${String(
    (getIstHour(cycloneImpactDate) + 4) % 24,
  ).padStart(2, "0")}:00 IST`;

  alerts.push({
    id: "pred-cyclone-tejas",
    hazardId: "cyclone",
    title: "Very Severe Cyclonic Storm 'Tejas' — Pre-Landfall Predictive Inception",
    disasterType: "Tropical Cyclone & Destructive Storm Surge",
    severity: "critical",
    imdWarningCode: "RED",
    stage: "imminent_threat",
    timeToImpactHours: cycloneEtaHours,
    timeToImpactFormatted: "04h 30m before Landfall",
    impactWindowIST: cycloneWindow,
    confidencePercent: 94,
    triggerMechanism:
      "Rapid oceanic pressure deepening (ΔP > 16 hPa/12h) over West-Central Bay of Bengal coupled with high Sea Surface Temperature (30.2°C) and tight convective vortex core.",
    affectedStates: ["Odisha", "West Bengal", "Andhra Pradesh"],
    center: { lat: 19.8, lon: 86.2, x: 59.0, y: 49.0 },
    heatmapRadius: 24,
    forecastTrack: [
      { x: 67.0, y: 55.0, time: "T-06h (Offshore)", intensity: "Cat 2 (145 km/h)" },
      { x: 59.0, y: 49.0, time: "T+04h 30m (Landfall)", intensity: "Cat 3 (185 km/h)" },
      { x: 52.0, y: 44.0, time: "T+10h (Inland)", intensity: "Depression (75 km/h)" },
    ],
    highRiskDistricts: [
      {
        district: "Puri & Konark Coast",
        state: "Odisha",
        riskScore: 96,
        dangerMetric: "185 km/h sustained wind + 2.8m astronomical surge",
        evacuationPriority: "immediate",
        x: 58.0,
        y: 49.3,
      },
      {
        district: "Paradip & Jagatsinghpur Port Zone",
        state: "Odisha",
        riskScore: 92,
        dangerMetric: "Extremely heavy rain > 380mm / 24h",
        evacuationPriority: "immediate",
        x: 60.1,
        y: 48.0,
      },
      {
        district: "Kolkata & Digha Coastal Belt",
        state: "West Bengal",
        riskScore: 78,
        dangerMetric: "Gale squalls 95 km/h & saline water inundation",
        evacuationPriority: "standby",
        x: 64.6,
        y: 41.9,
      },
      {
        district: "Visakhapatnam & Srikakulam",
        state: "Andhra Pradesh",
        riskScore: 65,
        dangerMetric: "High wave activity & fishing craft hazard",
        evacuationPriority: "advisory",
        x: 51.4,
        y: 55.1,
      },
    ],
    thermodynamicIndicators: [
      {
        label: "Central Barometric Pressure",
        currentValue: `${coastalPressureMin} hPa (Dropping)`,
        thresholdValue: "< 985 hPa (Severe Cyclone)",
        status: "critical",
      },
      {
        label: "Peak Offshore Gale Velocity",
        currentValue: "185 km/h",
        thresholdValue: "> 120 km/h (Destructive Core)",
        status: "critical",
      },
      {
        label: "Projected Storm Surge Inundation",
        currentValue: "+2.4m Above Normal High Tide",
        thresholdValue: "> 1.5m (Inundation Danger)",
        status: "critical",
      },
      {
        label: "Convective Cloud Top Temperature",
        currentValue: "-82°C (Intense Vortex)",
        thresholdValue: "< -70°C (Violent Updrafts)",
        status: "warning",
      },
    ],
    preEmptiveActions: {
      forAuthorities: [
        "Issue mandatory 100% coastal evacuation for low-lying kutchha dwellings within 5 km of shoreline.",
        "Pre-position 18 NDRF battalions and ODRAF disaster taskforces with inflatable power rescue boats.",
        "Suspend commercial shipping, port vessel docking, and fishing operations at Paradip, Dhamra, and Gopalpur ports.",
        "Trigger Sachet Geo-fenced SMS Cell Broadcast in Odia, Bengali, Hindi and English to all active SIMs.",
      ],
      forCommunities: [
        "Move immediately to designated Multi-Purpose Cyclone Shelters before gale winds exceed 50 km/h.",
        "Store 3 days of potable drinking water in sealed containers; boil all tap water.",
        "Fasten or dismantle tin roofs, hoardings, solar panels, and loose rooftop objects.",
        "Keep battery-powered AM/FM radios, fully charged power banks, essential medical prescriptions in waterproof pouches.",
      ],
      forVulnerablePopulations: [
        "Relocate bedridden patients, expectant mothers, and senior citizens to reinforced taluk hospital wards.",
        "Untether cattle and move livestock to community high-ground concrete pens.",
      ],
    },
  });

  // 2. Heavy Flash Flood & River Catchment Overflow Predictive Model
  const floodEtaHours = 6.0;
  alerts.push({
    id: "pred-flood-mahanadi-ganga",
    hazardId: "flood",
    title: "Mahanadi & Lower Gangetic Basin — Flash Flood & Inundation Predictive Alert",
    disasterType: "Riverine Basin Inundation & Urban Flash Flood",
    severity: "severe",
    imdWarningCode: "ORANGE",
    stage: "imminent_threat",
    timeToImpactHours: floodEtaHours,
    timeToImpactFormatted: "06h 00m before Basin Peak Inundation",
    impactWindowIST: "Next 12 to 24 Hours",
    confidencePercent: 88,
    triggerMechanism:
      "Heavy upstream catchment rainfall (210mm in 12h) exceeding reservoir retention cushion at Hirakud and upstream barrages, coupled with high antecedent soil moisture saturation (98%).",
    affectedStates: ["Odisha", "Bihar", "Assam", "West Bengal"],
    center: { lat: 23.5, lon: 85.5, x: 57.0, y: 39.0 },
    heatmapRadius: 26,
    forecastTrack: [
      { x: 55.0, y: 35.0, time: "T-12h (Catchment Inflow)", intensity: "680k Cusecs" },
      { x: 57.0, y: 39.0, time: "T+06h (Embankment Crest)", intensity: "1.8m > DL" },
      { x: 61.0, y: 46.0, time: "T+24h (Delta Inundation)", intensity: "High Tide Surge" },
    ],
    highRiskDistricts: [
      {
        district: "Cuttack & Kendrapara Lowlands",
        state: "Odisha",
        riskScore: 89,
        dangerMetric: "River gauge 1.8m above Danger Level (DL)",
        evacuationPriority: "immediate",
        x: 59.5,
        y: 48.2,
      },
      {
        district: "Patna & Vaishali Diara Zones",
        state: "Bihar",
        riskScore: 82,
        dangerMetric: "Ganga discharge exceeding 1.2M cusecs",
        evacuationPriority: "standby",
        x: 56.2,
        y: 33.5,
      },
      {
        district: "Barpeta & Kaziranga Basin",
        state: "Assam",
        riskScore: 86,
        dangerMetric: "Brahmaputra tributaries spilling over embankment",
        evacuationPriority: "immediate",
        x: 74.5,
        y: 32.2,
      },
    ],
    thermodynamicIndicators: [
      {
        label: "24h Accumulated Rainfall",
        currentValue: "240 mm / 24h",
        thresholdValue: "> 150 mm (Flood Trigger)",
        status: "critical",
      },
      {
        label: "River Level Trend (Central Water Commission)",
        currentValue: "+0.35 m / hour (Rising Rapidly)",
        thresholdValue: "> Danger Level (DL)",
        status: "critical",
      },
      {
        label: "Upstream Sluice Gate Inflow",
        currentValue: "680,000 cusecs",
        thresholdValue: "> 500,000 cusecs (Full Spillage)",
        status: "warning",
      },
    ],
    preEmptiveActions: {
      forAuthorities: [
        "Initiate controlled reservoir outflow staging to prevent synchronized downstream flood wave peaks.",
        "Reinforce vulnerable earthen embankments with wire-crated sandbags and geotextile sheets.",
        "Position mobile water purification plants and chlorine tablet distribution centers in flood shelters.",
      ],
      forCommunities: [
        "Never drive or walk across submerged culverts, causeways, or roads ('Turn Around, Don't Drown').",
        "Elevate electronic appliances, grain storage sacks, and fertilizer bags above high water marks.",
        "Keep livestock away from riverbanks and unreinforced retaining walls.",
      ],
      forVulnerablePopulations: [
        "Move families in river island 'Diara' zones to elevated embankment roads before dusk.",
      ],
    },
  });

  // 3. Extreme Heatwave & Thermal Stress Predictive Model
  const hotReports = reports.filter(
    (r) => r.current.temperatureC >= 38 || r.current.apparentC >= 41,
  );
  const heatEtaHours = hour < 12 ? 12 - hour : 24 - hour + 11;
  alerts.push({
    id: "pred-heat-northwest",
    hazardId: "heat",
    title: "Northwest & Central India — Severe Thermal Heatwave Spike",
    disasterType: "Loo Wind Advection & Critical Wet-Bulb Stress",
    severity: hotReports.length > 2 ? "severe" : "warning",
    imdWarningCode: "ORANGE",
    stage: "pre_formation",
    timeToImpactHours: heatEtaHours,
    timeToImpactFormatted: `${String(heatEtaHours).padStart(2, "0")}h until Peak Afternoon Insolation (13:00 - 16:00 IST)`,
    impactWindowIST: "12:00 PM - 04:30 PM Peak Daily Window",
    confidencePercent: 91,
    triggerMechanism:
      "Persistent anticyclonic subsidence over the Thar Desert funneling dry, scorching westerly 'Loo' winds with surface temperatures crossing 43.5°C across the Indo-Gangetic plain.",
    affectedStates: ["Rajasthan", "Delhi", "Uttar Pradesh", "Madhya Pradesh", "Gujarat"],
    center: { lat: 27.5, lon: 76.0, x: 32.0, y: 28.0 },
    heatmapRadius: 28,
    highRiskDistricts: [
      {
        district: "Churu & Bikaner",
        state: "Rajasthan",
        riskScore: 94,
        dangerMetric: "Max ambient temp 46.2°C (Departure +5.4°C)",
        evacuationPriority: "standby",
        x: 27.5,
        y: 28.0,
      },
      {
        district: "Delhi NCR (Palam & Najafgarh)",
        state: "Delhi",
        riskScore: 88,
        dangerMetric: "Urban Heat Island + Apparent temp 47.8°C",
        evacuationPriority: "standby",
        x: 35.3,
        y: 25.2,
      },
      {
        district: "Bhopal & Gwalior Basin",
        state: "Madhya Pradesh",
        riskScore: 81,
        dangerMetric: "Continuous 3-day thermal exposure index",
        evacuationPriority: "advisory",
        x: 36.0,
        y: 36.0,
      },
    ],
    thermodynamicIndicators: [
      {
        label: "Peak Daytime Surface Temperature",
        currentValue: "44.8°C",
        thresholdValue: "> 42.0°C (Heatwave Criteria)",
        status: "critical",
      },
      {
        label: "Wet-Bulb Temperature (Thermal Survivability)",
        currentValue: "29.4°C",
        thresholdValue: "> 30.0°C (Critical Heatstroke Risk)",
        status: "warning",
      },
      {
        label: "Nocturnal Minimum Recovery Temp",
        currentValue: "31.2°C (Dangerous Warm Night)",
        thresholdValue: "> 28.0°C (No Thermal Rest)",
        status: "warning",
      },
    ],
    preEmptiveActions: {
      forAuthorities: [
        "Enforce mandatory suspension of outdoor construction, MGNREGA field labor, and delivery work from 11:30 AM to 04:00 PM.",
        "Deploy municipal water-mist cannons and open air-conditioned cooling shelters / shaded hydration kiosks.",
        "Stock district hospitals with ice packs, intravenous saline fluids, and heatstroke resuscitation beds.",
      ],
      forCommunities: [
        "Drink plenty of water mixed with ORS, coconut water, lemon water, or buttermilk (chaas) before feeling thirsty.",
        "Keep heads covered with light cotton cloth/umbrellas when stepping outside.",
        "Never leave children, pets, or elderly persons inside locked parked vehicles.",
      ],
      forVulnerablePopulations: [
        "Ensure infants, pregnant mothers, and elderly citizens stay in well-ventilated, shaded rooms with damp curtains.",
      ],
    },
  });

  // 4. Convective Supercell Thunderstorm & Squall Predictive Model
  alerts.push({
    id: "pred-storm-norwester",
    hazardId: "thunderstorm",
    title: "Eastern & North-East Plateau — Kalbaisakhi (Nor'wester) Severe Squall Predictive Alert",
    disasterType: "Severe Convective Squall Line, Hailstorm & Cloud-to-Ground Lightning",
    severity: "severe",
    imdWarningCode: "ORANGE",
    stage: "pre_formation",
    timeToImpactHours: 3.0,
    timeToImpactFormatted: "03h 00m until Convective Cell Trigger",
    impactWindowIST: "04:30 PM - 08:30 PM IST",
    confidencePercent: 86,
    triggerMechanism:
      "Moist southerly winds from Bay of Bengal colliding with dry north-westerly upper air over Chota Nagpur plateau, generating extreme Convective Available Potential Energy (CAPE > 3200 J/kg).",
    affectedStates: ["Jharkhand", "West Bengal", "Odisha", "Bihar"],
    center: { lat: 23.4, lon: 86.0, x: 58.5, y: 40.0 },
    heatmapRadius: 22,
    forecastTrack: [
      { x: 55.0, y: 42.0, time: "T-03h (Plateau Updrafts)", intensity: "CAPE 3400 J/kg" },
      { x: 58.5, y: 40.0, time: "T+00h (Squall Front)", intensity: "85 km/h & 30mm Hail" },
      { x: 65.0, y: 39.0, time: "T+04h (Gangetic Delta)", intensity: "Lightning Front" },
    ],
    highRiskDistricts: [
      {
        district: "Ranchi & East Singhbhum",
        state: "Jharkhand",
        riskScore: 87,
        dangerMetric: "Squall gusts 85 km/h & 30mm hail diameter",
        evacuationPriority: "standby",
        x: 57.5,
        y: 40.5,
      },
      {
        district: "Bankura & Purba Bardhaman",
        state: "West Bengal",
        riskScore: 84,
        dangerMetric: "Dense cloud-to-ground lightning flash rate (> 120/min)",
        evacuationPriority: "standby",
        x: 65.5,
        y: 39.8,
      },
    ],
    thermodynamicIndicators: [
      {
        label: "Convective Instability (CAPE)",
        currentValue: "3,420 J/kg",
        thresholdValue: "> 2,500 J/kg (Severe Squalls)",
        status: "critical",
      },
      {
        label: "Lifted Index (LI)",
        currentValue: "-6.8 K",
        thresholdValue: "< -4.0 K (Violent Updrafts)",
        status: "critical",
      },
      {
        label: "Estimated Squall Gust Velocity",
        currentValue: "75 - 90 km/h",
        thresholdValue: "> 60 km/h (Structure Damage)",
        status: "warning",
      },
    ],
    preEmptiveActions: {
      forAuthorities: [
        "Issue localized lightning sirens and notify agricultural field workers via Damini app integration.",
        "Instruct electricity distribution companies to prepare for rapid feeder isolation upon squall detection.",
      ],
      forCommunities: [
        "Follow the 30/30 Lightning Rule: If thunder is heard within 30 seconds of lightning flash, seek immediate indoor shelter.",
        "Stay away from isolated trees, metal fences, tractors, and open bodies of water.",
      ],
      forVulnerablePopulations: [
        "Ensure farmers and graziers return from open fields and paddy lands before 04:00 PM.",
      ],
    },
  });

  return alerts;
}
