export interface StateCapital {
  id: string;
  name: string;
  state: string;
  type: "state" | "ut";
  region: "north" | "south" | "east" | "west" | "central" | "northeast" | "island";
  lat: number;
  lon: number;
  elevationMeters: number;
  climateZone: string;
  riverOrCoast?: string;
}

export interface HourlyForecastItem {
  hourOffset: number;
  timeString: string;
  isoTime: string;
  temperatureC: number;
  apparentC: number;
  condition: string;
  weatherCode: number;
  precipitationProb: number;
  precipitationMm: number;
  windKph: number;
  windDirectionDeg: number;
  humidityPercent: number;
  uvIndex: number;
  earlyWarning?: {
    type: "heavy_rain" | "extreme_heat" | "high_wind" | "lightning" | "poor_aqi";
    severity: "warning" | "severe" | "critical";
    message: string;
  };
}

export interface CapitalWeatherReport {
  capital: StateCapital;
  current: {
    temperatureC: number;
    apparentC: number;
    humidityPercent: number;
    windKph: number;
    windDirectionDeg: number;
    precipitationMm: number;
    precip24hMm: number;
    pressureHpa: number;
    condition: string;
    weatherCode: number;
    uvIndex: number;
    usAqi: number;
    pm25: number;
    tempMinC: number;
    tempMaxC: number;
    updatedAt: string;
  };
  hourly6h: HourlyForecastItem[];
}

export const STATE_CAPITALS: StateCapital[] = [
  // National Capital
  {
    id: "delhi",
    name: "New Delhi",
    state: "Delhi",
    type: "ut",
    region: "north",
    lat: 28.6139,
    lon: 77.209,
    elevationMeters: 216,
    climateZone: "Semi-arid",
    riverOrCoast: "Yamuna River Basin",
  },
  // Major State Capitals
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    type: "state",
    region: "west",
    lat: 18.922,
    lon: 72.8347,
    elevationMeters: 14,
    climateZone: "Tropical Coastal",
    riverOrCoast: "Arabian Sea Coast",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    type: "state",
    region: "south",
    lat: 12.9716,
    lon: 77.5946,
    elevationMeters: 920,
    climateZone: "Tropical Savanna Plateau",
    riverOrCoast: "Vrishabhavathi Basin",
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    type: "state",
    region: "south",
    lat: 13.0827,
    lon: 80.2707,
    elevationMeters: 6,
    climateZone: "Tropical Coastal",
    riverOrCoast: "Bay of Bengal Coast / Adyar Basin",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    type: "state",
    region: "east",
    lat: 22.5726,
    lon: 88.3639,
    elevationMeters: 9,
    climateZone: "Tropical Wet-and-Dry",
    riverOrCoast: "Hooghly River / Ganges Delta",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    type: "state",
    region: "south",
    lat: 17.385,
    lon: 78.4867,
    elevationMeters: 542,
    climateZone: "Tropical Wet-and-Dry",
    riverOrCoast: "Musi River Basin",
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar / Ahmedabad",
    state: "Gujarat",
    type: "state",
    region: "west",
    lat: 23.2156,
    lon: 72.6369,
    elevationMeters: 81,
    climateZone: "Hot Semi-arid",
    riverOrCoast: "Sabarmati River Basin",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    type: "state",
    region: "north",
    lat: 26.9124,
    lon: 75.7873,
    elevationMeters: 431,
    climateZone: "Hot Semi-arid",
    riverOrCoast: "Dravyavati River Basin",
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    type: "state",
    region: "north",
    lat: 26.8467,
    lon: 80.9462,
    elevationMeters: 123,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Gomti River Basin",
  },
  {
    id: "patna",
    name: "Patna",
    state: "Bihar",
    type: "state",
    region: "east",
    lat: 25.5941,
    lon: 85.1376,
    elevationMeters: 53,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Ganga River Basin",
  },
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    type: "state",
    region: "central",
    lat: 23.2599,
    lon: 77.4126,
    elevationMeters: 527,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Bhojtal / Betwa Basin",
  },
  {
    id: "bhubaneswar",
    name: "Bhubaneswar",
    state: "Odisha",
    type: "state",
    region: "east",
    lat: 20.2961,
    lon: 85.8245,
    elevationMeters: 45,
    climateZone: "Tropical Savanna",
    riverOrCoast: "Mahanadi / Daya River Basin",
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Punjab & Haryana",
    type: "ut",
    region: "north",
    lat: 30.7333,
    lon: 76.7794,
    elevationMeters: 321,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Sukhna Lake Basin",
  },
  {
    id: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    state: "Kerala",
    type: "state",
    region: "south",
    lat: 8.5241,
    lon: 76.9366,
    elevationMeters: 10,
    climateZone: "Tropical Monsoon",
    riverOrCoast: "Arabian Sea Coast / Karamana River",
  },
  {
    id: "dispur",
    name: "Dispur / Guwahati",
    state: "Assam",
    type: "state",
    region: "northeast",
    lat: 26.1433,
    lon: 91.7898,
    elevationMeters: 55,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Brahmaputra River Basin",
  },
  {
    id: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    type: "state",
    region: "east",
    lat: 23.3441,
    lon: 85.3096,
    elevationMeters: 651,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Subarnarekha River Basin",
  },
  {
    id: "raipur",
    name: "Raipur",
    state: "Chhattisgarh",
    type: "state",
    region: "central",
    lat: 21.2514,
    lon: 81.6296,
    elevationMeters: 298,
    climateZone: "Tropical Wet-and-Dry",
    riverOrCoast: "Mahanadi River Basin",
  },
  {
    id: "dehradun",
    name: "Dehradun",
    state: "Uttarakhand",
    type: "state",
    region: "north",
    lat: 30.3165,
    lon: 78.0322,
    elevationMeters: 640,
    climateZone: "Humid Subtropical Montane",
    riverOrCoast: "Ganga–Yamuna Watershed",
  },
  {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    type: "state",
    region: "north",
    lat: 31.1048,
    lon: 77.1734,
    elevationMeters: 2276,
    climateZone: "Subtropical Highland",
    riverOrCoast: "Sutlej River Basin",
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu and Kashmir",
    type: "ut",
    region: "north",
    lat: 34.0837,
    lon: 74.7973,
    elevationMeters: 1585,
    climateZone: "Humid Subtropical Valley",
    riverOrCoast: "Jhelum River / Dal Lake",
  },
  {
    id: "amaravati",
    name: "Amaravati / Vijayawada",
    state: "Andhra Pradesh",
    type: "state",
    region: "south",
    lat: 16.5062,
    lon: 80.648,
    elevationMeters: 25,
    climateZone: "Tropical Savanna",
    riverOrCoast: "Krishna River Basin",
  },
  {
    id: "panaji",
    name: "Panaji",
    state: "Goa",
    type: "state",
    region: "west",
    lat: 15.4909,
    lon: 73.8278,
    elevationMeters: 7,
    climateZone: "Tropical Monsoon",
    riverOrCoast: "Mandovi River / Arabian Sea",
  },
  {
    id: "shillong",
    name: "Shillong",
    state: "Meghalaya",
    type: "state",
    region: "northeast",
    lat: 25.5788,
    lon: 91.8933,
    elevationMeters: 1525,
    climateZone: "Subtropical Highland",
    riverOrCoast: "Wah Umkhrah Basin",
  },
  {
    id: "agartala",
    name: "Agartala",
    state: "Tripura",
    type: "state",
    region: "northeast",
    lat: 23.8315,
    lon: 91.2868,
    elevationMeters: 16,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Howrah River Basin",
  },
  {
    id: "imphal",
    name: "Imphal",
    state: "Manipur",
    type: "state",
    region: "northeast",
    lat: 24.817,
    lon: 93.9368,
    elevationMeters: 786,
    climateZone: "Humid Subtropical",
    riverOrCoast: "Imphal River / Loktak Basin",
  },
  {
    id: "aizawl",
    name: "Aizawl",
    state: "Mizoram",
    type: "state",
    region: "northeast",
    lat: 23.7271,
    lon: 92.7176,
    elevationMeters: 1132,
    climateZone: "Humid Subtropical Hill",
    riverOrCoast: "Tlawng River Valley",
  },
  {
    id: "kohima",
    name: "Kohima",
    state: "Nagaland",
    type: "state",
    region: "northeast",
    lat: 25.6751,
    lon: 94.1086,
    elevationMeters: 1444,
    climateZone: "Subtropical Highland",
    riverOrCoast: "Dhansiri River Basin",
  },
  {
    id: "gangtok",
    name: "Gangtok",
    state: "Sikkim",
    type: "state",
    region: "northeast",
    lat: 27.3389,
    lon: 88.6065,
    elevationMeters: 1650,
    climateZone: "Subtropical Highland",
    riverOrCoast: "Rani Khola / Teesta Basin",
  },
  {
    id: "itanagar",
    name: "Itanagar",
    state: "Arunachal Pradesh",
    type: "state",
    region: "northeast",
    lat: 27.0844,
    lon: 93.6053,
    elevationMeters: 320,
    climateZone: "Humid Subtropical Foothill",
    riverOrCoast: "Dikrong River Basin",
  },
  {
    id: "leh",
    name: "Leh",
    state: "Ladakh",
    type: "ut",
    region: "north",
    lat: 34.1526,
    lon: 77.5771,
    elevationMeters: 3500,
    climateZone: "Cold Desert Highland",
    riverOrCoast: "Indus River Valley",
  },
  {
    id: "puducherry",
    name: "Puducherry",
    state: "Puducherry",
    type: "ut",
    region: "south",
    lat: 11.9416,
    lon: 79.8083,
    elevationMeters: 3,
    climateZone: "Tropical Coastal",
    riverOrCoast: "Coromandel Coast / Bay of Bengal",
  },
  {
    id: "portblair",
    name: "Port Blair",
    state: "Andaman and Nicobar Islands",
    type: "ut",
    region: "island",
    lat: 11.6234,
    lon: 92.7265,
    elevationMeters: 16,
    climateZone: "Tropical Maritime",
    riverOrCoast: "Andaman Sea / Bay of Bengal",
  },
];

export function decodeWmoCode(code: number): {
  label: string;
  category: "clear" | "clouds" | "rain" | "thunderstorm" | "fog" | "snow";
} {
  if (code === 0) return { label: "Clear Skies", category: "clear" };
  if (code === 1) return { label: "Mainly Clear", category: "clear" };
  if (code === 2) return { label: "Partly Cloudy", category: "clouds" };
  if (code === 3) return { label: "Overcast", category: "clouds" };
  if (code >= 45 && code <= 48) return { label: "Fog / Mist", category: "fog" };
  if (code >= 51 && code <= 55) return { label: "Light Drizzle", category: "rain" };
  if (code >= 61 && code <= 65) return { label: "Rain Showers", category: "rain" };
  if (code >= 66 && code <= 67) return { label: "Freezing Rain", category: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow Flurries", category: "snow" };
  if (code >= 80 && code <= 82) return { label: "Heavy Rain", category: "rain" };
  if (code >= 85 && code <= 86) return { label: "Snow Showers", category: "snow" };
  if (code === 95) return { label: "Thunderstorm", category: "thunderstorm" };
  if (code >= 96 && code <= 99)
    return { label: "Severe Thunderstorm with Hail", category: "thunderstorm" };
  return { label: "Variable Weather", category: "clouds" };
}

export function computeAqiRating(aqi: number): {
  label: string;
  category: "good" | "moderate" | "poor" | "unhealthy" | "severe" | "hazardous";
  colorClass: string;
  bgClass: string;
} {
  if (aqi <= 50)
    return {
      label: "Good (Green)",
      category: "good",
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/15 border-emerald-500/30",
    };
  if (aqi <= 100)
    return {
      label: "Satisfactory",
      category: "moderate",
      colorClass: "text-lime-400",
      bgClass: "bg-lime-500/15 border-lime-500/30",
    };
  if (aqi <= 150)
    return {
      label: "Moderate (Yellow)",
      category: "poor",
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500/15 border-amber-500/30",
    };
  if (aqi <= 200)
    return {
      label: "Poor (Orange)",
      category: "unhealthy",
      colorClass: "text-orange-400",
      bgClass: "bg-orange-500/15 border-orange-500/30",
    };
  if (aqi <= 300)
    return {
      label: "Very Poor (Red)",
      category: "severe",
      colorClass: "text-red-400",
      bgClass: "bg-red-500/15 border-red-500/30",
    };
  return {
    label: "Severe / Hazardous (GRAP-IV)",
    category: "hazardous",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-500/15 border-purple-500/30",
  };
}

export const DEFAULT_STATIC_EPOCH = 1756641600000;

export function getIstHour(date: Date): number {
  const istTotalMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + 330;
  return Math.floor(istTotalMinutes / 60) % 24;
}

/**
 * Deterministic fallback generator for 6-hour hourly forecasts if external API is rate limited.
 */
export function generateSyntheticCapitalReports(
  nowMs: number = DEFAULT_STATIC_EPOCH,
): CapitalWeatherReport[] {
  const date = new Date(nowMs);
  const hour = getIstHour(date);

  return STATE_CAPITALS.map((cap, idx) => {
    // Generate realistic base temperature according to region and season
    let baseTemp = 28;
    if (cap.region === "north") baseTemp = cap.elevationMeters > 1000 ? 16 : 31;
    else if (cap.region === "south") baseTemp = 30;
    else if (cap.region === "east") baseTemp = 29;
    else if (cap.region === "west") baseTemp = 32;
    else if (cap.region === "northeast") baseTemp = 24;
    else if (cap.region === "central") baseTemp = 33;
    else if (cap.region === "island") baseTemp = 29;

    // Diurnal cycle
    const diurnal = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 4;
    const currentTemp = Math.round((baseTemp + diurnal + (idx % 3) * 0.5) * 10) / 10;
    const apparent =
      Math.round((currentTemp + (cap.region === "south" || cap.region === "east" ? 3.5 : 1)) * 10) /
      10;
    const humidity = Math.min(95, Math.max(30, Math.round(55 + Math.sin(idx) * 25)));
    const wind = Math.round(12 + (idx % 7) * 2.5);
    const aqi = Math.round(75 + ((idx * 17) % 180));

    // Determine condition
    let wmo = 1;
    if (cap.id === "bhubaneswar" || cap.id === "kolkata")
      wmo = 80; // coastal rain
    else if (cap.id === "delhi" || cap.id === "patna") wmo = 2;
    else if (cap.id === "thiruvananthapuram") wmo = 61;
    else if (cap.id === "mumbai") wmo = 2;
    else if (cap.id === "shimla" || cap.id === "srinagar") wmo = 0;

    const { label: condLabel } = decodeWmoCode(wmo);

    const hourly6h: HourlyForecastItem[] = [];
    for (let h = 1; h <= 6; h++) {
      const forecastHour = (hour + h) % 24;
      const fDiurnal = Math.sin(((forecastHour - 9) / 24) * 2 * Math.PI) * 4;
      const fTemp = Math.round((baseTemp + fDiurnal + (idx % 3) * 0.5) * 10) / 10;
      const fApparent =
        Math.round((fTemp + (cap.region === "south" || cap.region === "east" ? 3.2 : 1)) * 10) / 10;

      const rainProb =
        wmo >= 50 || cap.region === "south" || cap.region === "east"
          ? Math.min(95, Math.round(40 + Math.sin(h + idx) * 35))
          : Math.round(10 + ((h + idx) % 20));
      const rainMm = rainProb > 60 ? Math.round(((rainProb - 50) / 8) * 10) / 10 : 0;
      const fWind = Math.round(wind + Math.sin(h) * 4);

      let earlyWarning: HourlyForecastItem["earlyWarning"] | undefined = undefined;
      if (rainMm > 8) {
        earlyWarning = {
          type: "heavy_rain",
          severity: rainMm > 15 ? "severe" : "warning",
          message: `Heavy rain spell (${rainMm} mm/h) forecast at ${String(forecastHour).padStart(2, "0")}:00`,
        };
      } else if (fTemp >= 40) {
        earlyWarning = {
          type: "extreme_heat",
          severity: fTemp >= 43 ? "critical" : "severe",
          message: `High thermal peak (${fTemp}°C) expected at ${String(forecastHour).padStart(2, "0")}:00`,
        };
      } else if (fWind >= 45) {
        earlyWarning = {
          type: "high_wind",
          severity: "warning",
          message: `Gale wind gusts (${fWind} km/h) forecast at ${String(forecastHour).padStart(2, "0")}:00`,
        };
      }

      const timeStr = `${String(forecastHour).padStart(2, "0")}:00`;
      const isoTime = new Date(nowMs + h * 3600_000).toISOString();

      hourly6h.push({
        hourOffset: h,
        timeString: timeStr,
        isoTime,
        temperatureC: fTemp,
        apparentC: fApparent,
        condition: rainMm > 4 ? "Heavy Showers" : rainProb > 40 ? "Passing Rain" : condLabel,
        weatherCode: rainMm > 4 ? 80 : wmo,
        precipitationProb: rainProb,
        precipitationMm: rainMm,
        windKph: fWind,
        windDirectionDeg: (idx * 45 + h * 15) % 360,
        humidityPercent: Math.min(95, Math.max(30, humidity + Math.round(Math.sin(h) * 8))),
        uvIndex: forecastHour >= 10 && forecastHour <= 16 ? Math.round(6 + Math.sin(h) * 3) : 0,
        earlyWarning,
      });
    }

    return {
      capital: cap,
      current: {
        temperatureC: currentTemp,
        apparentC: apparent,
        humidityPercent: humidity,
        windKph: wind,
        windDirectionDeg: (idx * 45) % 360,
        precipitationMm: wmo >= 60 ? 2.4 : 0,
        precip24hMm: wmo >= 60 ? 18.5 : 0,
        pressureHpa: 1012 - Math.round(cap.elevationMeters / 10),
        condition: condLabel,
        weatherCode: wmo,
        uvIndex: hour >= 10 && hour <= 16 ? 7 : 0,
        usAqi: aqi,
        pm25: Math.round(aqi * 0.45),
        tempMinC: Math.round((currentTemp - 4) * 10) / 10,
        tempMaxC: Math.round((currentTemp + 5) * 10) / 10,
        updatedAt: date.toISOString(),
      },
      hourly6h,
    };
  });
}

/**
 * Fetches live weather conditions & 6-hour forecasts from Open-Meteo API for all State Capitals.
 * Batches requests efficiently and falls back gracefully.
 */
export async function fetchLiveCapitalsWeather(): Promise<CapitalWeatherReport[]> {
  try {
    const lats = STATE_CAPITALS.map((c) => c.lat).join(",");
    const lons = STATE_CAPITALS.map((c) => c.lon).join(",");

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=2&wind_speed_unit=kmh&timezone=Asia%2FKolkata`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi,pm2_5&timezone=Asia%2FKolkata`;

    const [weatherRes, airRes] = await Promise.all([
      fetch(weatherUrl, { headers: { Accept: "application/json" } }),
      fetch(airUrl, { headers: { Accept: "application/json" } }).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      console.warn(`Open-Meteo returned status ${weatherRes.status}, using synthetic state model.`);
      return generateSyntheticCapitalReports();
    }

    const weatherData = await weatherRes.json();
    const airData = airRes && airRes.ok ? await airRes.json() : null;

    const weatherArray = Array.isArray(weatherData) ? weatherData : [weatherData];
    const airArray = airData ? (Array.isArray(airData) ? airData : [airData]) : [];

    const now = new Date();
    const currentHourIndex = getIstHour(now);

    return STATE_CAPITALS.map((capital, index) => {
      const w = weatherArray[index] ?? {};
      const currentObj = w.current ?? {};
      const hourlyObj = w.hourly ?? {};
      const dailyObj = w.daily ?? {};
      const a = airArray[index]?.current ?? {};

      const weatherCode = Number(currentObj.weather_code ?? 0);
      const { label: condLabel } = decodeWmoCode(weatherCode);

      const tempC = Number(currentObj.temperature_2m ?? 28);
      const apparentC = Number(currentObj.apparent_temperature ?? tempC);
      const humidity = Number(currentObj.relative_humidity_2m ?? 60);
      const windKph = Number(currentObj.wind_speed_10m ?? 12);
      const windDeg = Number(currentObj.wind_direction_10m ?? 0);
      const precip = Number(currentObj.precipitation ?? 0);
      const pressure = Number(currentObj.surface_pressure ?? 1010);
      const aqi = Number(a.us_aqi ?? 85);
      const pm25 = Number(a.pm2_5 ?? Math.round(aqi * 0.45));

      const tempMin = Number(dailyObj.temperature_2m_min?.[0] ?? tempC - 4);
      const tempMax = Number(dailyObj.temperature_2m_max?.[0] ?? tempC + 5);
      const precip24h = Number(dailyObj.precipitation_sum?.[0] ?? precip);

      // Build 6-hour hourly forecast
      const hourly6h: HourlyForecastItem[] = [];
      const times = hourlyObj.time ?? [];
      const temps = hourlyObj.temperature_2m ?? [];
      const apparents = hourlyObj.apparent_temperature ?? [];
      const precipProbs = hourlyObj.precipitation_probability ?? [];
      const precips = hourlyObj.precipitation ?? [];
      const codes = hourlyObj.weather_code ?? [];
      const humidities = hourlyObj.relative_humidity_2m ?? [];
      const winds = hourlyObj.wind_speed_10m ?? [];
      const windDirs = hourlyObj.wind_direction_10m ?? [];
      const uvs = hourlyObj.uv_index ?? [];

      for (let offset = 1; offset <= 6; offset++) {
        const targetIdx = currentHourIndex + offset;
        const isoTime =
          times[targetIdx] ?? new Date(now.getTime() + offset * 3600_000).toISOString();
        const fDate = new Date(isoTime);
        const timeStr = `${String(getIstHour(fDate)).padStart(2, "0")}:00`;
        const fTemp = Number(temps[targetIdx] ?? tempC);
        const fApparent = Number(apparents[targetIdx] ?? fTemp);
        const fProb = Number(precipProbs[targetIdx] ?? 0);
        const fMm = Number(precips[targetIdx] ?? 0);
        const fCode = Number(codes[targetIdx] ?? weatherCode);
        const fHum = Number(humidities[targetIdx] ?? humidity);
        const fWind = Number(winds[targetIdx] ?? windKph);
        const fWindDir = Number(windDirs[targetIdx] ?? windDeg);
        const fUv = Number(uvs[targetIdx] ?? 0);

        const { label: fCond } = decodeWmoCode(fCode);

        let earlyWarning: HourlyForecastItem["earlyWarning"] | undefined = undefined;
        if (fMm >= 10 || (fProb >= 80 && fMm >= 5)) {
          earlyWarning = {
            type: "heavy_rain",
            severity: fMm >= 25 ? "critical" : fMm >= 15 ? "severe" : "warning",
            message: `Impending heavy rainfall (${fMm} mm/h) expected at ${timeStr}`,
          };
        } else if (fTemp >= 41) {
          earlyWarning = {
            type: "extreme_heat",
            severity: fTemp >= 44 ? "critical" : "severe",
            message: `Severe thermal heatwave peak (${fTemp}°C) expected at ${timeStr}`,
          };
        } else if (fWind >= 45) {
          earlyWarning = {
            type: "high_wind",
            severity: fWind >= 65 ? "critical" : "warning",
            message: `High gale wind speeds (${fWind} km/h) expected at ${timeStr}`,
          };
        } else if (fCode >= 95) {
          earlyWarning = {
            type: "lightning",
            severity: fCode >= 96 ? "severe" : "warning",
            message: `Active thunderstorm and lightning activity predicted at ${timeStr}`,
          };
        }

        hourly6h.push({
          hourOffset: offset,
          timeString: timeStr,
          isoTime,
          temperatureC: fTemp,
          apparentC: fApparent,
          condition: fCond,
          weatherCode: fCode,
          precipitationProb: fProb,
          precipitationMm: fMm,
          windKph: fWind,
          windDirectionDeg: fWindDir,
          humidityPercent: fHum,
          uvIndex: fUv,
          earlyWarning,
        });
      }

      return {
        capital,
        current: {
          temperatureC: tempC,
          apparentC,
          humidityPercent: humidity,
          windKph,
          windDirectionDeg: windDeg,
          precipitationMm: precip,
          precip24hMm: precip24h,
          pressureHpa: pressure,
          condition: condLabel,
          weatherCode,
          uvIndex: Number(
            currentObj.uv_index ?? (currentHourIndex >= 10 && currentHourIndex <= 16 ? 7 : 0),
          ),
          usAqi: aqi,
          pm25,
          tempMinC: tempMin,
          tempMaxC: tempMax,
          updatedAt: now.toISOString(),
        },
        hourly6h,
      };
    });
  } catch (err) {
    console.error(
      "Failed to fetch live capitals weather from Open-Meteo, falling back to model:",
      err,
    );
    return generateSyntheticCapitalReports();
  }
}
