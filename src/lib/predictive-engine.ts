import { DEFAULT_STATIC_EPOCH, getIstHour, type CapitalWeatherReport } from "./capitals";
import type { HazardId, Severity } from "./hazards";

/** 15-Minute Sub-Hourly Hyetograph & Urban Drainage Interval Telemetry (Research Proposal 1) */
export interface SubHourlyIntervalData {
  timeMinute: number; // 0, 15, 30, 45, 60, 75, 90, 105, 120, 150, 180
  timeLabel: string; // "T+00m", "T+15m", etc.
  rainfallIntensityMmHr: number; // instantaneous burst intensity
  intervalPrecipMm: number; // incremental mm in this 15-min window
  cumulativePrecipMm: number; // cumulative precipitation
  soilInfiltrationCapacityMmHr: number; // Horton / Green-Ampt decay
  urbanRunoffRateMmHr: number; // surface overland runoff rate
  drainageThroughputLimitMmHr: number; // capacity of municipal stormwater channels
  surfaceWaterDepthCm: number; // accumulated ponding/waterlogging depth
  saturationStatus: "normal" | "absorbing" | "threshold_near" | "saturated" | "critical_overflow";
}

export interface SubHourlyCatchmentModel {
  catchmentName: string;
  riverBasin: string;
  catchmentAreaKm2: number;
  imperviousFraction: number; // e.g. 0.82 (82% paved / urbanized)
  drainageCapacityMmHr: number; // e.g. 45 mm/h
  timeToPeakMinutes: number; // e.g. 45 min
  peakRainfallIntensityMmHr: number;
  peakRunoffDischargeCusecs: number;
  saturationOnsetMinute: number; // minute when soil + storm drains overflow
  intervals: SubHourlyIntervalData[];
  methodologyNotes: string;
}

/** Physics-Guided Extreme Value Theory (EVT) & GEV Extrapolation Model (Research Proposal 2) */
export interface EvtReturnPeriodDischarge {
  returnPeriodYears: number; // 5, 10, 25, 50, 100
  annualExceedanceProbability: string; // "20%", "10%", "4%", "2%", "1%"
  unconstrainedDeepLearningPeakCusecs: number; // Raw LSTM/CNN prediction (severe underestimation)
  physicsGuidedEvtPeakCusecs: number; // True EVT GEV/Gumbel corrected peak discharge
  underestimationDeficitPercent: number; // -45% to -58% deficit in unconstrained DL
  confidenceInterval95: [number, number]; // 95% Bayesian credible interval
  hydraulicDangerLevelMeters: number; // Gauge height above danger level
}

export interface ExtremeValueTheoryModel {
  catchmentGaugingStation: string;
  gevLocationMu: number; // Location parameter μ
  gevScaleSigma: number; // Scale parameter σ
  gevShapeXi: number; // Shape parameter ξ (Fréchet heavy tail > 0)
  gumbelTailMultiplier: number;
  observedHistoricalMaxCusecs: number;
  observedHistoricalMaxYear: string;
  projectedUnprecedentedPeakCusecs: number;
  physicsPeakPenaltyCorrectionPercent: number;
  unconstrainedDlUnderestimatePercent: number;
  scientificRationale: string;
  returnPeriods: EvtReturnPeriodDischarge[];
}

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
  subHourlyCatchmentModel?: SubHourlyCatchmentModel;
  extremeValueTheoryModel?: ExtremeValueTheoryModel;
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
    subHourlyCatchmentModel: {
      catchmentName: "Puri-Paradip Coastal Delta & Inundation Zone",
      riverBasin: "Mahanadi-Devi Estuarine Network",
      catchmentAreaKm2: 320,
      imperviousFraction: 0.74,
      drainageCapacityMmHr: 40,
      timeToPeakMinutes: 45,
      peakRainfallIntensityMmHr: 165,
      peakRunoffDischargeCusecs: 485000,
      saturationOnsetMinute: 30,
      methodologyNotes:
        "15-Minute SCS-CN Hyetograph with Dynamic Impervious Runoff Scaling (C=0.74) & Horton Infiltration Decay",
      intervals: [
        {
          timeMinute: 0,
          timeLabel: "T+00m",
          rainfallIntensityMmHr: 35,
          intervalPrecipMm: 8.75,
          cumulativePrecipMm: 8.75,
          soilInfiltrationCapacityMmHr: 50,
          urbanRunoffRateMmHr: 12,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 0,
          saturationStatus: "normal",
        },
        {
          timeMinute: 15,
          timeLabel: "T+15m",
          rainfallIntensityMmHr: 78,
          intervalPrecipMm: 19.5,
          cumulativePrecipMm: 28.25,
          soilInfiltrationCapacityMmHr: 35,
          urbanRunoffRateMmHr: 38,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 1.5,
          saturationStatus: "absorbing",
        },
        {
          timeMinute: 30,
          timeLabel: "T+30m",
          rainfallIntensityMmHr: 135,
          intervalPrecipMm: 33.75,
          cumulativePrecipMm: 62.0,
          soilInfiltrationCapacityMmHr: 22,
          urbanRunoffRateMmHr: 82,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 6.8,
          saturationStatus: "saturated",
        },
        {
          timeMinute: 45,
          timeLabel: "T+45m (Peak)",
          rainfallIntensityMmHr: 165,
          intervalPrecipMm: 41.25,
          cumulativePrecipMm: 103.25,
          soilInfiltrationCapacityMmHr: 12,
          urbanRunoffRateMmHr: 134,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 18.4,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 60,
          timeLabel: "T+60m",
          rainfallIntensityMmHr: 120,
          intervalPrecipMm: 30.0,
          cumulativePrecipMm: 133.25,
          soilInfiltrationCapacityMmHr: 8,
          urbanRunoffRateMmHr: 102,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 26.5,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 75,
          timeLabel: "T+75m",
          rainfallIntensityMmHr: 85,
          intervalPrecipMm: 21.25,
          cumulativePrecipMm: 154.5,
          soilInfiltrationCapacityMmHr: 6,
          urbanRunoffRateMmHr: 68,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 29.8,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 90,
          timeLabel: "T+90m",
          rainfallIntensityMmHr: 55,
          intervalPrecipMm: 13.75,
          cumulativePrecipMm: 168.25,
          soilInfiltrationCapacityMmHr: 5,
          urbanRunoffRateMmHr: 42,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 27.2,
          saturationStatus: "saturated",
        },
        {
          timeMinute: 120,
          timeLabel: "T+120m",
          rainfallIntensityMmHr: 28,
          intervalPrecipMm: 7.0,
          cumulativePrecipMm: 175.25,
          soilInfiltrationCapacityMmHr: 5,
          urbanRunoffRateMmHr: 20,
          drainageThroughputLimitMmHr: 40,
          surfaceWaterDepthCm: 19.5,
          saturationStatus: "threshold_near",
        },
      ],
    },
    extremeValueTheoryModel: {
      catchmentGaugingStation: "Paradip Coastal Estuary Station (CWC-094)",
      gevLocationMu: 285.0,
      gevScaleSigma: 94.2,
      gevShapeXi: 0.22,
      gumbelTailMultiplier: 1.94,
      observedHistoricalMaxCusecs: 410000,
      observedHistoricalMaxYear: "1999 Super Cyclone",
      projectedUnprecedentedPeakCusecs: 585000,
      physicsPeakPenaltyCorrectionPercent: 54.8,
      unconstrainedDlUnderestimatePercent: -48.2,
      scientificRationale:
        "Rectifies the >50% peak underestimation in standard unconstrained LSTM/CNN architectures by enforcing GEV heavy-tail Fisher-Tippett extreme value convergence.",
      returnPeriods: [
        {
          returnPeriodYears: 5,
          annualExceedanceProbability: "20.0%",
          unconstrainedDeepLearningPeakCusecs: 215000,
          physicsGuidedEvtPeakCusecs: 245000,
          underestimationDeficitPercent: -12.2,
          confidenceInterval95: [225000, 268000],
          hydraulicDangerLevelMeters: 0.6,
        },
        {
          returnPeriodYears: 10,
          annualExceedanceProbability: "10.0%",
          unconstrainedDeepLearningPeakCusecs: 280000,
          physicsGuidedEvtPeakCusecs: 345000,
          underestimationDeficitPercent: -18.8,
          confidenceInterval95: [320000, 375000],
          hydraulicDangerLevelMeters: 1.2,
        },
        {
          returnPeriodYears: 25,
          annualExceedanceProbability: "4.0%",
          unconstrainedDeepLearningPeakCusecs: 340000,
          physicsGuidedEvtPeakCusecs: 460000,
          underestimationDeficitPercent: -26.1,
          confidenceInterval95: [425000, 502000],
          hydraulicDangerLevelMeters: 1.9,
        },
        {
          returnPeriodYears: 50,
          annualExceedanceProbability: "2.0%",
          unconstrainedDeepLearningPeakCusecs: 385000,
          physicsGuidedEvtPeakCusecs: 565000,
          underestimationDeficitPercent: -31.8,
          confidenceInterval95: [515000, 620000],
          hydraulicDangerLevelMeters: 2.6,
        },
        {
          returnPeriodYears: 100,
          annualExceedanceProbability: "1.0%",
          unconstrainedDeepLearningPeakCusecs: 410000,
          physicsGuidedEvtPeakCusecs: 690000,
          underestimationDeficitPercent: -40.6,
          confidenceInterval95: [620000, 775000],
          hydraulicDangerLevelMeters: 3.4,
        },
      ],
    },
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
    subHourlyCatchmentModel: {
      catchmentName: "Mahanadi-Kathajodi Delta & Cuttack Urban Flood Plain",
      riverBasin: "Lower Mahanadi Basin",
      catchmentAreaKm2: 450,
      imperviousFraction: 0.82,
      drainageCapacityMmHr: 45,
      timeToPeakMinutes: 45,
      peakRainfallIntensityMmHr: 148,
      peakRunoffDischargeCusecs: 785000,
      saturationOnsetMinute: 30,
      methodologyNotes:
        "15-Minute SCS-CN Synthetic Hyetograph downscaled from WRF-Hydro with Green-Ampt antecedent soil moisture deficit (98% saturation)",
      intervals: [
        {
          timeMinute: 0,
          timeLabel: "T+00m",
          rainfallIntensityMmHr: 28,
          intervalPrecipMm: 7.0,
          cumulativePrecipMm: 7.0,
          soilInfiltrationCapacityMmHr: 30,
          urbanRunoffRateMmHr: 10,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 0,
          saturationStatus: "normal",
        },
        {
          timeMinute: 15,
          timeLabel: "T+15m",
          rainfallIntensityMmHr: 65,
          intervalPrecipMm: 16.25,
          cumulativePrecipMm: 23.25,
          soilInfiltrationCapacityMmHr: 20,
          urbanRunoffRateMmHr: 35,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 2.0,
          saturationStatus: "absorbing",
        },
        {
          timeMinute: 30,
          timeLabel: "T+30m",
          rainfallIntensityMmHr: 110,
          intervalPrecipMm: 27.5,
          cumulativePrecipMm: 50.75,
          soilInfiltrationCapacityMmHr: 12,
          urbanRunoffRateMmHr: 72,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 8.5,
          saturationStatus: "saturated",
        },
        {
          timeMinute: 45,
          timeLabel: "T+45m (Peak)",
          rainfallIntensityMmHr: 148,
          intervalPrecipMm: 37.0,
          cumulativePrecipMm: 87.75,
          soilInfiltrationCapacityMmHr: 6,
          urbanRunoffRateMmHr: 128,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 22.4,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 60,
          timeLabel: "T+60m",
          rainfallIntensityMmHr: 130,
          intervalPrecipMm: 32.5,
          cumulativePrecipMm: 120.25,
          soilInfiltrationCapacityMmHr: 4,
          urbanRunoffRateMmHr: 115,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 34.0,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 75,
          timeLabel: "T+75m",
          rainfallIntensityMmHr: 95,
          intervalPrecipMm: 23.75,
          cumulativePrecipMm: 144.0,
          soilInfiltrationCapacityMmHr: 3,
          urbanRunoffRateMmHr: 82,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 39.5,
          saturationStatus: "critical_overflow",
        },
        {
          timeMinute: 90,
          timeLabel: "T+90m",
          rainfallIntensityMmHr: 60,
          intervalPrecipMm: 15.0,
          cumulativePrecipMm: 159.0,
          soilInfiltrationCapacityMmHr: 3,
          urbanRunoffRateMmHr: 48,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 37.0,
          saturationStatus: "saturated",
        },
        {
          timeMinute: 120,
          timeLabel: "T+120m",
          rainfallIntensityMmHr: 32,
          intervalPrecipMm: 8.0,
          cumulativePrecipMm: 167.0,
          soilInfiltrationCapacityMmHr: 3,
          urbanRunoffRateMmHr: 22,
          drainageThroughputLimitMmHr: 45,
          surfaceWaterDepthCm: 28.0,
          saturationStatus: "threshold_near",
        },
      ],
    },
    extremeValueTheoryModel: {
      catchmentGaugingStation: "Naraj Hydrological Gauging Station (Mahanadi River - CWC)",
      gevLocationMu: 420.0,
      gevScaleSigma: 135.8,
      gevShapeXi: 0.18,
      gumbelTailMultiplier: 1.87,
      observedHistoricalMaxCusecs: 680000,
      observedHistoricalMaxYear: "1982 Catastrophic Inundation",
      projectedUnprecedentedPeakCusecs: 920000,
      physicsPeakPenaltyCorrectionPercent: 61.8,
      unconstrainedDlUnderestimatePercent: -53.4,
      scientificRationale:
        "Deep Learning models minimize MSE/RMSE by truncating extreme peaks. Our EVT Hybrid Layer enforces GEV probability constraints, correcting a 53.4% discharge deficit on 50-year return events.",
      returnPeriods: [
        {
          returnPeriodYears: 5,
          annualExceedanceProbability: "20.0%",
          unconstrainedDeepLearningPeakCusecs: 340000,
          physicsGuidedEvtPeakCusecs: 395000,
          underestimationDeficitPercent: -13.9,
          confidenceInterval95: [365000, 430000],
          hydraulicDangerLevelMeters: 0.8,
        },
        {
          returnPeriodYears: 10,
          annualExceedanceProbability: "10.0%",
          unconstrainedDeepLearningPeakCusecs: 430000,
          physicsGuidedEvtPeakCusecs: 540000,
          underestimationDeficitPercent: -20.4,
          confidenceInterval95: [495000, 585000],
          hydraulicDangerLevelMeters: 1.4,
        },
        {
          returnPeriodYears: 25,
          annualExceedanceProbability: "4.0%",
          unconstrainedDeepLearningPeakCusecs: 510000,
          physicsGuidedEvtPeakCusecs: 710000,
          underestimationDeficitPercent: -28.2,
          confidenceInterval95: [650000, 775000],
          hydraulicDangerLevelMeters: 2.2,
        },
        {
          returnPeriodYears: 50,
          annualExceedanceProbability: "2.0%",
          unconstrainedDeepLearningPeakCusecs: 560000,
          physicsGuidedEvtPeakCusecs: 865000,
          underestimationDeficitPercent: -35.3,
          confidenceInterval95: [780000, 950000],
          hydraulicDangerLevelMeters: 2.9,
        },
        {
          returnPeriodYears: 100,
          annualExceedanceProbability: "1.0%",
          unconstrainedDeepLearningPeakCusecs: 590000,
          physicsGuidedEvtPeakCusecs: 1050000,
          underestimationDeficitPercent: -43.8,
          confidenceInterval95: [930000, 1180000],
          hydraulicDangerLevelMeters: 3.8,
        },
      ],
    },
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
