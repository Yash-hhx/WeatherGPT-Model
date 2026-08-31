export type Severity = "critical" | "severe" | "warning" | "safe";

export type HazardId = "cyclone" | "flood" | "heat" | "thunderstorm" | "airquality" | "rain";

export type Occupation = "civilian" | "farmer" | "business" | "commuter" | "government";

export interface Flashcard {
  occupation: Occupation;
  severity: Severity;
  label: string;
  action: string;
}

export interface HeatCell {
  /** percentage positions on the map canvas */
  x: number;
  y: number;
  /** radius in px at 1x */
  r: number;
  severity: Severity;
  region: string;
  /** percentage of population exposed */
  exposure: number;
}

export interface Hazard {
  id: HazardId;
  name: string;
  event: string;
  /** IMD-style colour code for the warning */
  imdCode: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  /** states / UTs under the warning */
  states: string;
  headline: string;
  countdown: string;
  /** ambient background utility class */
  ambient: string;
  severity: Severity;
  metrics: { label: string; value: string; severity: Severity }[];
  briefing: string;
  areaKm2: string;
  expansion: string;
  coreRadius: string;
  cells: HeatCell[];
  broadcast: { title: string; detail: string; active: boolean }[];
  cards: Flashcard[];
}

export const OCCUPATIONS: { id: Occupation; label: string }[] = [
  { id: "civilian", label: "Civilian" },
  { id: "farmer", label: "Kisan / Agriculture" },
  { id: "business", label: "Business / MSME" },
  { id: "commuter", label: "Transport" },
  { id: "government", label: "Government" },
];

export const HAZARDS: Hazard[] = [
  {
    id: "cyclone",
    name: "Cyclone",
    event: "Cyclone 'Tejas' — Bay of Bengal",
    imdCode: "RED",
    states: "Odisha · West Bengal · Andhra Pradesh",
    headline: "IMD Red Warning: Cyclone 'Tejas' landfall near Puri in",
    countdown: "04:22:15",
    ambient: "hazard-cyclone",
    severity: "critical",
    metrics: [
      { label: "Wind Velocity Max", value: "185 KM/H", severity: "severe" },
      { label: "Central Pressure", value: "962 HPA", severity: "critical" },
      { label: "Storm Surge", value: "+2.4 M ABOVE ASTRO TIDE", severity: "critical" },
      { label: "Rainfall Peak", value: "420MM / 24H", severity: "warning" },
    ],
    briefing:
      "INSAT-3DR imagery confirms rapid intensification into an Extremely Severe Cyclonic Storm over the west-central Bay of Bengal. The track has shifted 15 km north — landfall is now expected between Puri and Paradip before dawn. Destructive surge is forecast for the Mahanadi delta; IMD has issued a red warning for coastal Odisha.",
    areaKm2: "1,420 KM²",
    expansion: "+12% / HR",
    coreRadius: "12.4 KM",
    cells: [
      {
        x: 59.9,
        y: 52.2,
        r: 150,
        severity: "critical",
        region: "Puri–Paradip Coastal Belt, Odisha",
        exposure: 92,
      },
      {
        x: 57.5,
        y: 55.5,
        r: 120,
        severity: "severe",
        region: "Ganjam & Gopalpur, Odisha",
        exposure: 74,
      },
      {
        x: 67.9,
        y: 45.6,
        r: 115,
        severity: "severe",
        region: "Purba Medinipur & Kolkata, West Bengal",
        exposure: 66,
      },
      {
        x: 52.1,
        y: 59.8,
        r: 110,
        severity: "warning",
        region: "Visakhapatnam & North Andhra Coast",
        exposure: 48,
      },
      {
        x: 58.4,
        y: 43.3,
        r: 100,
        severity: "warning",
        region: "Ranchi & East Singhbhum, Jharkhand",
        exposure: 34,
      },
      {
        x: 46.9,
        y: 49.4,
        r: 110,
        severity: "safe",
        region: "Raipur & Interior Chhattisgarh",
        exposure: 18,
      },
      {
        x: 42.6,
        y: 73.3,
        r: 95,
        severity: "safe",
        region: "Chennai & North Tamil Nadu Coast",
        exposure: 12,
      },
      {
        x: 51.1,
        y: 37.6,
        r: 95,
        severity: "safe",
        region: "Varanasi & East Uttar Pradesh",
        exposure: 9,
      },
      { x: 78.6, y: 35.2, r: 90, severity: "safe", region: "Guwahati, Assam", exposure: 6 },
    ],

    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone A",
        detail: "14,202 residents of Puri & Kendrapara notified in Odia, Hindi and English",
        active: true,
      },
      {
        title: "District Collectorates",
        detail: "Puri, Jagatsinghpur and Kendrapara control rooms acknowledged",
        active: true,
      },
      {
        title: "NDRF / OSDMA",
        detail: "12 NDRF teams staged; ODRAF awaiting national clearance",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "critical",
        label: "Move to Cyclone Shelter",
        action:
          "Shift to the nearest MPCS (multipurpose cyclone shelter) before 04:00. Carry Aadhaar, medicines and a torch.",
      },
      {
        occupation: "civilian",
        severity: "severe",
        label: "Provisioning",
        action:
          "Store 72 hours of drinking water, dry food and ORS. Charge phones and keep power banks ready.",
      },
      {
        occupation: "civilian",
        severity: "warning",
        label: "Stay Informed",
        action:
          "Follow IMD Bhubaneswar bulletins and All India Radio; keep Sachet and NDMA alerts on maximum volume.",
      },
      {
        occupation: "farmer",
        severity: "critical",
        label: "Livestock Safety",
        action:
          "Move cattle to raised community sheds. Do not leave animals tethered in open fields or under trees.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Harvest Salvage",
        action:
          "Harvest mature kharif paddy immediately; move pump sets and tractors above the 2.4 m surge line.",
      },
      {
        occupation: "farmer",
        severity: "warning",
        label: "Drainage",
        action:
          "Clear field channels and open sluice gates so saline water drains out fast after landfall.",
      },
      {
        occupation: "business",
        severity: "severe",
        label: "Port & Supply Chain",
        action:
          "Paradip Port will shut for ~48h. Reroute freight via NH-16 inland corridor and inform buyers today.",
      },
      {
        occupation: "business",
        severity: "warning",
        label: "Asset Protection",
        action:
          "Switch off godown electricals, unplug DG sets and lift stock off ground-level racking.",
      },
      {
        occupation: "commuter",
        severity: "critical",
        label: "Route Suspension",
        action:
          "Coastal stretch of NH-316 is red-zoned. Stop all travel towards the shoreline now.",
      },
      {
        occupation: "commuter",
        severity: "severe",
        label: "Rail Cancellations",
        action:
          "East Coast Railway has cancelled services after 02:10 — check NTES before leaving home.",
      },
      {
        occupation: "government",
        severity: "critical",
        label: "Evacuation Order",
        action:
          "Execute phased evacuation of the 12.4 km core radius; prioritise elderly, PwD and pregnant women.",
      },
      {
        occupation: "government",
        severity: "severe",
        label: "Shelter Readiness",
        action:
          "Verify DG backup, ASHA staffing and medicine stock at all 34 designated cyclone shelters.",
      },
    ],
  },
  {
    id: "flood",
    name: "Flood",
    event: "Brahmaputra Flood — Assam",
    imdCode: "RED",
    states: "Assam · Arunachal Pradesh · Meghalaya",
    headline: "CWC Severe Flood: Brahmaputra above danger level — crest in",
    countdown: "09:05:40",
    ambient: "hazard-flood",
    severity: "critical",
    metrics: [
      { label: "River Level (Neamatighat)", value: "+1.8 M ABOVE DANGER", severity: "critical" },
      { label: "Discharge", value: "48,000 CUMEC", severity: "severe" },
      { label: "Upstream Rainfall", value: "310MM / 24H", severity: "warning" },
      { label: "Embankment Stress", value: "HIGH — 2 BREACH POINTS", severity: "severe" },
    ],
    briefing:
      "Sustained rainfall over Arunachal catchments and the Meghalaya hills has pushed the Brahmaputra past the CWC danger mark at Neamatighat and Dhubri. Two embankment segments in Majuli and Morigaon show seepage. Char areas and left-bank villages will inundate first, with backflow into Guwahati's drainage within six hours.",
    areaKm2: "860 KM²",
    expansion: "+8% / HR",
    coreRadius: "18.0 KM",
    cells: [
      {
        x: 85.0,
        y: 32.0,
        r: 155,
        severity: "critical",
        region: "Majuli & Jorhat Char Areas, Assam",
        exposure: 88,
      },
      {
        x: 78.6,
        y: 35.2,
        r: 125,
        severity: "severe",
        region: "Guwahati & Morigaon, Assam",
        exposure: 69,
      },
      {
        x: 74.5,
        y: 35.8,
        r: 115,
        severity: "severe",
        region: "Dhubri & Barpeta Farmland, Assam",
        exposure: 63,
      },
      {
        x: 88.4,
        y: 31.3,
        r: 100,
        severity: "warning",
        region: "Dibrugarh & Tinsukia, Upper Assam",
        exposure: 45,
      },
      {
        x: 77.1,
        y: 41.9,
        r: 100,
        severity: "warning",
        region: "Agartala & West Tripura",
        exposure: 31,
      },
      {
        x: 68.1,
        y: 33.5,
        r: 105,
        severity: "warning",
        region: "Siliguri Corridor & Jalpaiguri, West Bengal",
        exposure: 28,
      },
      {
        x: 67.9,
        y: 45.6,
        r: 95,
        severity: "safe",
        region: "Kolkata & Lower Ganga Delta",
        exposure: 14,
      },
      {
        x: 81.0,
        y: 41.0,
        r: 90,
        severity: "safe",
        region: "Barak Valley Uplands, Assam",
        exposure: 12,
      },
    ],

    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone C",
        detail: "9,540 residents alerted across 11 revenue circles in Assamese and Bodo",
        active: true,
      },
      {
        title: "District Disaster Authorities",
        detail: "Majuli, Morigaon and Barpeta DDMAs on standby with boats",
        active: true,
      },
      {
        title: "NDRF / ASDMA",
        detail: "SDRF deployed; 4 NDRF battalions en route — ETA 3h",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "critical",
        label: "Move to Relief Camp",
        action:
          "Shift to the upper floor or the nearest government relief camp. Never wade water above knee depth.",
      },
      {
        occupation: "civilian",
        severity: "severe",
        label: "Utilities & Documents",
        action:
          "Switch off the mains before water reaches floor level; seal Aadhaar, land patta and ration card in plastic.",
      },
      {
        occupation: "farmer",
        severity: "critical",
        label: "Field Drainage",
        action:
          "Open bunds on the left bank now — sali paddy submerged beyond 48h will not recover.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Input Storage",
        action:
          "Move seed, urea and diesel above 2 m; register crop loss on the PMFBY app once water recedes.",
      },
      {
        occupation: "business",
        severity: "severe",
        label: "Premises",
        action:
          "Sandbag ground-floor entrances and shift inventory and servers above the flood line.",
      },
      {
        occupation: "commuter",
        severity: "critical",
        label: "Road & Ferry",
        action:
          "NH-715 underpasses are flooding and Majuli ferries are suspended. Avoid night travel.",
      },
      {
        occupation: "government",
        severity: "critical",
        label: "Embankment Watch",
        action:
          "Post round-the-clock patrols at the two seeping segments; pre-position boulder and sandbag stock.",
      },
      {
        occupation: "government",
        severity: "severe",
        label: "Relief Camps",
        action:
          "Open 11 camps with potable water, ORS, halogen tablets and veterinary support before crest hour.",
      },
    ],
  },
  {
    id: "heat",
    name: "Heatwave",
    event: "Severe Heatwave — Vidarbha & North India",
    imdCode: "RED",
    states: "Maharashtra (Vidarbha) · Telangana · Rajasthan",
    headline: "IMD Red Warning: Severe heatwave over Vidarbha — peak radiation in",
    countdown: "02:40:00",
    ambient: "hazard-heat",
    severity: "severe",
    metrics: [
      { label: "Max Temperature (Nagpur)", value: "46.2 °C", severity: "critical" },
      { label: "Feels Like", value: "51 °C", severity: "critical" },
      { label: "Humidity", value: "18 %", severity: "warning" },
      { label: "UV Index", value: "11 EXTREME", severity: "severe" },
    ],
    briefing:
      "A persistent anticyclonic ridge is holding hot continental air over Vidarbha and Marathwada for a fifth day. Night minimums are not falling below 31°C, removing recovery time. Heatstroke risk is highest for MGNREGA workers, construction labour and street vendors between 11:00 and 16:00. NDMA heat action plans should be at stage two.",
    areaKm2: "3,110 KM²",
    expansion: "+3% / HR",
    coreRadius: "40.0 KM",
    cells: [
      {
        x: 39.0,
        y: 50.0,
        r: 175,
        severity: "critical",
        region: "Nagpur & Chandrapur Urban Core, Vidarbha",
        exposure: 81,
      },
      {
        x: 33.5,
        y: 51.5,
        r: 130,
        severity: "severe",
        region: "Akola–Amravati Industrial Belt, Maharashtra",
        exposure: 64,
      },
      {
        x: 37.0,
        y: 60.7,
        r: 125,
        severity: "severe",
        region: "Hyderabad & Nalgonda, Telangana",
        exposure: 58,
      },
      {
        x: 28.6,
        y: 33.0,
        r: 130,
        severity: "severe",
        region: "Jaipur & Kota, Rajasthan",
        exposure: 55,
      },
      {
        x: 20.0,
        y: 34.8,
        r: 115,
        severity: "warning",
        region: "Jodhpur & Barmer Desert Belt, Rajasthan",
        exposure: 49,
      },
      {
        x: 28.0,
        y: 54.0,
        r: 120,
        severity: "warning",
        region: "Marathwada Dryland Farms, Maharashtra",
        exposure: 47,
      },
      {
        x: 18.6,
        y: 44.4,
        r: 115,
        severity: "warning",
        region: "Ahmedabad & Saurashtra, Gujarat",
        exposure: 43,
      },
      {
        x: 33.6,
        y: 43.6,
        r: 105,
        severity: "warning",
        region: "Bhopal & Sagar, Madhya Pradesh",
        exposure: 36,
      },
      {
        x: 22.5,
        y: 57.4,
        r: 95,
        severity: "safe",
        region: "Pune & Western Ghats Foothills",
        exposure: 15,
      },
      {
        x: 34.2,
        y: 73.6,
        r: 90,
        severity: "safe",
        region: "Bengaluru Plateau, Karnataka",
        exposure: 8,
      },
    ],

    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone B",
        detail: "22,860 residents sent hydration and shade advisories in Marathi and Hindi",
        active: true,
      },
      {
        title: "Municipal Corporations",
        detail: "Water kiosks (piau) activated at 62 bus stops and rail stations",
        active: true,
      },
      {
        title: "NDMA / State Health Dept",
        detail: "Heat-illness reporting from all district hospitals pending activation",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "critical",
        label: "Exposure Window",
        action:
          "Avoid direct sun 11:00–16:00. Drink 200ml water every 30 minutes; add lemon-salt water, chaas or ORS.",
      },
      {
        occupation: "civilian",
        severity: "warning",
        label: "Vulnerable Care",
        action:
          "Check on elderly neighbours and infants twice daily; watch for confusion, cramps or dry hot skin.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Field Timing",
        action:
          "Shift all field labour to 05:00–09:00. Irrigate at night to cut evaporation loss and save on pump hours.",
      },
      {
        occupation: "farmer",
        severity: "warning",
        label: "Livestock",
        action:
          "Provide continuous shade and double the drinking-water allocation per head of cattle.",
      },
      {
        occupation: "business",
        severity: "severe",
        label: "Worker Safety",
        action:
          "Mandate 10-minute shade breaks per hour for outdoor staff; stock ORS and keep a cooling room on site.",
      },
      {
        occupation: "commuter",
        severity: "warning",
        label: "Travel",
        action:
          "Carry 1.5L water; expect road-surface softening and higher tyre-blowout risk on highways at noon.",
      },
      {
        occupation: "government",
        severity: "critical",
        label: "Cooling Centres",
        action:
          "Open AC public halls and libraries; extend water-kiosk hours to 22:00 and revise MGNREGA work timings.",
      },
      {
        occupation: "government",
        severity: "severe",
        label: "Hospital Load",
        action:
          "Pre-stage heatstroke protocols, ice packs and IV fluids across all PHCs and district hospitals.",
      },
    ],
  },
  {
    id: "thunderstorm",
    name: "Thunderstorm",
    event: "Squall & Lightning — Bihar / East UP",
    imdCode: "ORANGE",
    states: "Bihar · Eastern Uttar Pradesh · Jharkhand",
    headline: "IMD Orange Alert: Squall line with dense lightning — arrival in",
    countdown: "00:48:12",
    ambient: "hazard-storm",
    severity: "severe",
    metrics: [
      { label: "Lightning Rate", value: "142 STRIKES / 10MIN", severity: "critical" },
      { label: "Gust Front", value: "95 KM/H", severity: "severe" },
      { label: "Hail Probability", value: "60 %", severity: "warning" },
      { label: "Cloud Top", value: "14.2 KM", severity: "severe" },
    ],
    briefing:
      "A fast-moving squall line is tracking east at 55 km/h across the north Bihar plains. Expect abrupt gust fronts, dense cloud-to-ground lightning and hail. Bihar records the country's highest lightning fatalities — most victims are farm workers caught in open fields. Damini app users in the corridor should be receiving strike alerts now.",
    areaKm2: "540 KM²",
    expansion: "+20% / HR",
    coreRadius: "9.5 KM",
    cells: [
      {
        x: 57.9,
        y: 36.8,
        r: 140,
        severity: "critical",
        region: "Patna–Bhagalpur Corridor, Bihar",
        exposure: 77,
      },
      {
        x: 57.0,
        y: 39.5,
        r: 110,
        severity: "severe",
        region: "Gaya & Nalanda, Bihar",
        exposure: 58,
      },
      {
        x: 60.0,
        y: 34.5,
        r: 105,
        severity: "severe",
        region: "Muzaffarpur & Darbhanga, North Bihar",
        exposure: 52,
      },
      {
        x: 51.1,
        y: 37.6,
        r: 105,
        severity: "warning",
        region: "Varanasi & Gorakhpur, East Uttar Pradesh",
        exposure: 39,
      },
      {
        x: 58.4,
        y: 43.3,
        r: 100,
        severity: "warning",
        region: "Ranchi & Hazaribagh, Jharkhand",
        exposure: 33,
      },
      {
        x: 68.1,
        y: 33.5,
        r: 95,
        severity: "warning",
        region: "Malda & Siliguri, West Bengal",
        exposure: 26,
      },
      {
        x: 44.7,
        y: 33.1,
        r: 95,
        severity: "safe",
        region: "Lucknow & Central Uttar Pradesh",
        exposure: 13,
      },
      {
        x: 59.9,
        y: 52.2,
        r: 90,
        severity: "safe",
        region: "Bhubaneswar & Coastal Odisha",
        exposure: 7,
      },
    ],

    broadcast: [
      {
        title: "Sachet / Damini — Zone A",
        detail: "6,410 people warned of imminent lightning activity in Hindi and Bhojpuri",
        active: true,
      },
      {
        title: "State Power Utility",
        detail: "NBPDCL switched feeders to storm-mode protection",
        active: true,
      },
      {
        title: "DGCA / AAI",
        detail: "Approach advisory issued for Patna and Gorakhpur airports",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "critical",
        label: "Lightning Safety",
        action:
          "Get indoors now. Stay off open fields, terraces and metal fencing for 30 minutes after the last strike.",
      },
      {
        occupation: "civilian",
        severity: "warning",
        label: "Power Loss",
        action:
          "Unplug TV, inverter and pump motors; expect short outages as the utility trips protection.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Leave the Field",
        action:
          "Stop all field work immediately — do not shelter under a lone tree. Cover litchi and mango orchards with nets.",
      },
      {
        occupation: "business",
        severity: "severe",
        label: "Site Standdown",
        action:
          "Halt crane and rooftop work; secure scaffolding, hoardings and loose tin sheeting.",
      },
      {
        occupation: "commuter",
        severity: "critical",
        label: "Pull Over Safely",
        action:
          "Stay inside the vehicle; expect 200m visibility in the gust front and falling trees on state highways.",
      },
      {
        occupation: "government",
        severity: "severe",
        label: "Line Crews",
        action:
          "Pre-position electrical restoration crews east of the corridor and alert PHCs for burn casualties.",
      },
    ],
  },
  {
    id: "airquality",
    name: "Air Quality",
    event: "Severe Smog — Delhi NCR",
    imdCode: "RED",
    states: "Delhi · Haryana · Punjab · Western UP",
    headline: "CPCB Severe AQI: GRAP escalation over Delhi NCR — inversion persists for",
    countdown: "18:00:00",
    ambient: "hazard-smog",
    severity: "severe",
    metrics: [
      { label: "AQI (CPCB)", value: "412 SEVERE", severity: "critical" },
      { label: "PM2.5", value: "268 µg/m³", severity: "critical" },
      { label: "Mixing Height", value: "210 M", severity: "severe" },
      { label: "Ventilation Index", value: "3 KM/H — POOR", severity: "warning" },
    ],
    briefing:
      "A shallow nocturnal inversion is trapping vehicular, industrial and paddy-stubble particulates over the NCR basin. SAFAR and CPCB stations report severe-category readings from Anand Vihar to Gurugram. Concentrations will hold until wind speeds recover. CAQM should consider GRAP Stage III curbs; children, elderly and asthma patients face the highest acute risk.",
    areaKm2: "2,240 KM²",
    expansion: "+2% / HR",
    coreRadius: "26.0 KM",
    cells: [
      {
        x: 33.0,
        y: 28.0,
        r: 170,
        severity: "critical",
        region: "Delhi Metropolitan Core",
        exposure: 86,
      },
      {
        x: 32.5,
        y: 25.5,
        r: 125,
        severity: "severe",
        region: "Panipat–Sonipat Kiln Cluster, Haryana",
        exposure: 62,
      },
      {
        x: 34.5,
        y: 30.5,
        r: 115,
        severity: "severe",
        region: "Noida–Ghaziabad, Western Uttar Pradesh",
        exposure: 59,
      },
      {
        x: 28.8,
        y: 21.3,
        r: 120,
        severity: "warning",
        region: "Ludhiana & Bathinda Stubble Belt, Punjab",
        exposure: 47,
      },
      {
        x: 25.7,
        y: 19.2,
        r: 105,
        severity: "warning",
        region: "Amritsar & Tarn Taran, Punjab",
        exposure: 41,
      },
      {
        x: 42.8,
        y: 34.3,
        r: 105,
        severity: "warning",
        region: "Kanpur & Lucknow Industrial Belt",
        exposure: 35,
      },
      {
        x: 28.6,
        y: 33.0,
        r: 100,
        severity: "safe",
        region: "Jaipur & Alwar, Rajasthan",
        exposure: 19,
      },
      {
        x: 31.7,
        y: 21.8,
        r: 90,
        severity: "safe",
        region: "Chandigarh & Shivalik Windward Ridge",
        exposure: 14,
      },
    ],

    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone D",
        detail: "31,200 residents advised on N95 use and exposure limits",
        active: true,
      },
      {
        title: "MCD & NCR Municipalities",
        detail: "Construction dust and waste-burning restrictions enforced city-wide",
        active: true,
      },
      {
        title: "CAQM — GRAP Stage III",
        detail: "Regional emission response plan awaiting commission order",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "critical",
        label: "Respiratory Protection",
        action:
          "Wear an N95 outdoors and keep windows shut between 20:00 and 09:00. Avoid morning walks.",
      },
      {
        occupation: "civilian",
        severity: "warning",
        label: "Activity Limits",
        action:
          "Cancel outdoor exercise; asthma patients should keep inhalers and relievers within reach.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Stop Stubble Burning",
        action:
          "Halt parali burning entirely — use Happy Seeder, mulching or baling; burning now worsens the inversion.",
      },
      {
        occupation: "business",
        severity: "warning",
        label: "Operations",
        action:
          "Enable work-from-home and suspend uncovered construction, RMC plants and material handling.",
      },
      {
        occupation: "commuter",
        severity: "severe",
        label: "Cabin Air",
        action:
          "Run recirculation with a cabin filter; shift to Metro and avoid two-wheeler commutes on Ring Road.",
      },
      {
        occupation: "government",
        severity: "critical",
        label: "GRAP Enforcement",
        action:
          "Enforce Stage III: halt diesel gensets, sprinkle arterial roads with anti-smog guns, add Metro/DTC trips.",
      },
    ],
  },
  {
    id: "rain",
    name: "Heavy Rain",
    event: "Monsoon Surge — Konkan & Mumbai",
    imdCode: "ORANGE",
    states: "Maharashtra (Konkan, Ghats) · Goa",
    headline: "IMD Orange Alert: Very heavy rainfall over Konkan — band arriving in",
    countdown: "03:15:00",
    ambient: "hazard-rain",
    severity: "warning",
    metrics: [
      { label: "Rain Rate", value: "62 MM/H", severity: "severe" },
      { label: "24H Accumulation", value: "185 MM", severity: "warning" },
      { label: "Soil Saturation", value: "94 %", severity: "severe" },
      { label: "Landslide Index (Ghats)", value: "MODERATE", severity: "warning" },
    ],
    briefing:
      "An active offshore trough is driving a monsoon band across Konkan and the Western Ghats over the next twelve hours. Soils are near saturation, so runoff will be immediate. High tide at Mumbai coincides with peak rainfall — the dominant risks are urban waterlogging at Hindmata, Sion and Andheri subway, plus hillside slips on the Mumbai–Pune ghat section.",
    areaKm2: "1,050 KM²",
    expansion: "+6% / HR",
    coreRadius: "15.2 KM",
    cells: [
      {
        x: 19.8,
        y: 55.5,
        r: 150,
        severity: "severe",
        region: "Mumbai & Thane Catchment",
        exposure: 70,
      },
      {
        x: 22.5,
        y: 57.4,
        r: 120,
        severity: "severe",
        region: "Pune & Khandala–Lonavala Ghats",
        exposure: 61,
      },
      {
        x: 22.3,
        y: 53.1,
        r: 110,
        severity: "warning",
        region: "Nashik & Palghar, Maharashtra",
        exposure: 52,
      },
      {
        x: 21.0,
        y: 62.0,
        r: 110,
        severity: "warning",
        region: "Ratnagiri Low Bridge Crossings",
        exposure: 48,
      },
      {
        x: 19.2,
        y: 49.6,
        r: 105,
        severity: "warning",
        region: "Surat & South Gujarat Coast",
        exposure: 38,
      },
      {
        x: 22.4,
        y: 66.2,
        r: 95,
        severity: "warning",
        region: "North Goa Coastal Talukas",
        exposure: 33,
      },
      {
        x: 28.0,
        y: 54.0,
        r: 100,
        severity: "safe",
        region: "Marathwada Interior Plains",
        exposure: 16,
      },
      {
        x: 30.1,
        y: 82.5,
        r: 90,
        severity: "safe",
        region: "Kochi & Malabar Coast, Kerala",
        exposure: 9,
      },
    ],

    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone B",
        detail: "11,780 residents alerted to waterlogging hotspots in Marathi and Hindi",
        active: true,
      },
      {
        title: "BMC Disaster Control",
        detail: "Dewatering pumps deployed at 18 chronic flooding points",
        active: true,
      },
      {
        title: "NDRF / SDRF",
        detail: "Two teams on standby at Andheri — no escalation required yet",
        active: false,
      },
    ],
    cards: [
      {
        occupation: "civilian",
        severity: "warning",
        label: "Waterlogging",
        action: "Avoid Hindmata, Sion and Andheri subway; do not park in basement levels tonight.",
      },
      {
        occupation: "farmer",
        severity: "severe",
        label: "Field Runoff",
        action:
          "Check bund integrity and clear outlet drains before the band arrives; stake young paddy.",
      },
      {
        occupation: "business",
        severity: "warning",
        label: "Logistics",
        action:
          "Add a 6-hour buffer on last-mile deliveries; reschedule open-yard loading at JNPT.",
      },
      {
        occupation: "commuter",
        severity: "severe",
        label: "Local Trains & Causeways",
        action:
          "Expect Central Line delays at Kurla; never cross a submerged causeway — 30cm of water can float a car.",
      },
      {
        occupation: "government",
        severity: "warning",
        label: "Slope Watch",
        action:
          "Monitor hillside bastis for cracking and seepage; keep the ghat evacuation route clear.",
      },
    ],
  },
];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  severe: "Severe",
  warning: "Elevated",
  safe: "Low",
};

export const severityText: Record<Severity, string> = {
  critical: "text-hazard-critical",
  severe: "text-hazard-severe",
  warning: "text-hazard-warning",
  safe: "text-hazard-safe",
};

export const severityBorder: Record<Severity, string> = {
  critical: "border-hazard-critical",
  severe: "border-hazard-severe",
  warning: "border-hazard-warning",
  safe: "border-hazard-safe",
};

export const severityBg: Record<Severity, string> = {
  critical: "bg-hazard-critical",
  severe: "bg-hazard-severe",
  warning: "bg-hazard-warning",
  safe: "bg-hazard-safe",
};
