export type Severity = "critical" | "severe" | "warning" | "safe";

export type HazardId = "cyclone" | "flood" | "heat" | "thunderstorm" | "airquality" | "rain";

export type Occupation = "civilian" | "farmer" | "business" | "commuter" | "government";

export type DisasterPhase = "before" | "during" | "after";

export interface Flashcard {
  phase?: DisasterPhase;
  occupation: Occupation;
  severity: Severity;
  label: string;
  action: string;
  details?: string;
}

export interface DistrictConcern {
  name: string;
  state: string;
  severity: Severity;
  exposure: number;
  lat: number;
  lon: number;
  x: number;
  y: number;
  dangerSummary: string;
  evacuationPriority: "immediate" | "standby" | "advisory";
  bulletin: string;
  safeSheltersCount: number;
}

export interface StateHazardGroup {
  state: string;
  severity: Severity;
  exposure: number;
  activeAlertsCount: number;
  center: { x: number; y: number; lat: number; lon: number };
  districts: DistrictConcern[];
}

export interface RelocationHub {
  name: string;
  type:
    | "cyclone_shelter"
    | "flood_relief_camp"
    | "district_hospital"
    | "community_hall"
    | "heat_relief_center"
    | "lightning_safety_shelter"
    | string;
  state: string;
  district: string;
  capacity: number;
  elevationMeters: number;
  contactNumber: string;
  facilities: string[];
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
  stateGroups?: StateHazardGroup[];
  relocationHubs?: RelocationHub[];
  broadcast: { title: string; detail: string; active: boolean }[];
  cards: Flashcard[];
}

export const OCCUPATIONS: { id: Occupation; label: string }[] = [
  { id: "civilian", label: "Civilian / Residents" },
  { id: "farmer", label: "Kisan / Agriculture" },
  { id: "business", label: "Business / MSME" },
  { id: "commuter", label: "Transport & Logistics" },
  { id: "government", label: "Government / First Responders" },
];

export const DISASTER_PHASES: {
  id: DisasterPhase;
  label: string;
  iconLabel: string;
  desc: string;
}[] = [
  {
    id: "before",
    label: "Phase 1: Before (Preparation)",
    iconLabel: "🛡️ Proactive Risk Prevention",
    desc: "Early warning, structural securing, emergency supply kits, and pre-impact evacuation readiness.",
  },
  {
    id: "during",
    label: "Phase 2: During (Emergency Response)",
    iconLabel: "⚡ In-Situ Survival & SOS",
    desc: "Active impact survival actions, isolation of power/gas, safe interior shelters, and emergency helpline dispatch.",
  },
  {
    id: "after",
    label: "Phase 3: After (Relocation & Recovery)",
    iconLabel: "🔄 Relief & Relocation Needs",
    desc: "Damage verification, immediate relocation camps, waterborne disease prevention, and NDRF relief compensation.",
  },
];

export const EMERGENCY_HELPLINES = [
  {
    agency: "National Disaster Management Helpline",
    number: "1078 / 1070",
    description: "Toll-free NDMA 24x7 control room",
  },
  {
    agency: "Unified National Emergency Number",
    number: "112",
    description: "Police, Fire, and Ambulance SOS integration",
  },
  {
    agency: "District Emergency Operations Center (DEOC)",
    number: "1077",
    description: "Local District Collector disaster desk",
  },
  {
    agency: "Medical Emergency Ambulance",
    number: "108 / 102",
    description: "Advanced Life Support & Patient Transport",
  },
  {
    agency: "Fire & Rescue Services",
    number: "101",
    description: "Urban search, dewatering & structural rescue",
  },
  {
    agency: "Women & Child Disaster Support",
    number: "1098 / 181",
    description: "Specialized shelter support & protection",
  },
];

export const HAZARDS: Hazard[] = [
  {
    id: "cyclone",
    name: "Cyclone",
    event: "Very Severe Cyclone 'Tejas' — Bay of Bengal Landfall",
    imdCode: "RED",
    states: "Odisha · West Bengal · Andhra Pradesh",
    headline: "IMD Red Warning: Cyclone 'Tejas' landfall near Puri in",
    countdown: "04:22:15",
    ambient: "hazard-cyclone",
    severity: "critical",
    metrics: [
      { label: "Wind Velocity Max", value: "185 KM/H", severity: "critical" },
      { label: "Central Pressure", value: "962 HPA", severity: "critical" },
      { label: "Storm Surge", value: "+2.4 M ABOVE TIDE", severity: "critical" },
      { label: "Rainfall Peak", value: "420MM / 24H", severity: "severe" },
    ],
    briefing:
      "INSAT-3DR radar confirms rapid deepening into an Extremely Severe Cyclonic Storm over the west-central Bay of Bengal. Destructive storm surge is projected to penetrate 3.5 km inland in Puri and Kendrapara districts. Mandatory coastal evacuation is active across coastal Odisha and Sundarbans delta.",
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
        region: "Visakhapatnam & Srikakulam, Andhra Pradesh",
        exposure: 48,
      },
    ],
    stateGroups: [
      {
        state: "Odisha",
        severity: "critical",
        exposure: 92,
        activeAlertsCount: 6,
        center: { x: 58.5, y: 53.5, lat: 20.29, lon: 85.82 },
        districts: [
          {
            name: "Puri",
            state: "Odisha",
            severity: "critical",
            exposure: 96,
            lat: 19.81,
            lon: 85.83,
            x: 59.9,
            y: 52.2,
            dangerSummary: "Direct eyewall passage; 185 km/h gale winds & +2.4m storm surge",
            evacuationPriority: "immediate",
            bulletin:
              "Mandatory red-alert evacuation of all coastal settlements within 5km shoreline.",
            safeSheltersCount: 38,
          },
          {
            name: "Jagatsinghpur & Paradip",
            state: "Odisha",
            severity: "critical",
            exposure: 91,
            lat: 20.26,
            lon: 86.16,
            x: 60.5,
            y: 51.5,
            dangerSummary: "Port operations suspended; heavy saline inundation in Mahanadi delta",
            evacuationPriority: "immediate",
            bulletin:
              "Harbor craft grounded; dewatering pumps mobilized for port residential colonies.",
            safeSheltersCount: 24,
          },
          {
            name: "Kendrapara",
            state: "Odisha",
            severity: "severe",
            exposure: 84,
            lat: 20.5,
            lon: 86.42,
            x: 61.2,
            y: 50.8,
            dangerSummary: "High tide tidal surge flooding mangrove estuaries and mud bunds",
            evacuationPriority: "immediate",
            bulletin: "Bhitarkanika area residents shifted to multi-purpose cyclone shelters.",
            safeSheltersCount: 29,
          },
          {
            name: "Ganjam (Gopalpur)",
            state: "Odisha",
            severity: "severe",
            exposure: 74,
            lat: 19.31,
            lon: 84.88,
            x: 57.5,
            y: 55.5,
            dangerSummary: "Rough sea swell 5.5m; flash waterlogging in Rushikulya basin",
            evacuationPriority: "standby",
            bulletin: "Fishing boats anchored in safety berths; relief centers provisioned.",
            safeSheltersCount: 31,
          },
        ],
      },
      {
        state: "West Bengal",
        severity: "severe",
        exposure: 68,
        activeAlertsCount: 4,
        center: { x: 66.5, y: 46.5, lat: 22.57, lon: 88.36 },
        districts: [
          {
            name: "Purba Medinipur (Digha)",
            state: "West Bengal",
            severity: "severe",
            exposure: 78,
            lat: 21.62,
            lon: 87.51,
            x: 65.5,
            y: 47.8,
            dangerSummary: "Sea wall overtopping expected; gale gusts up to 105 km/h",
            evacuationPriority: "immediate",
            bulletin: "All sea resort tourists evacuated; fishermen warning flag hoisted.",
            safeSheltersCount: 22,
          },
          {
            name: "South 24 Parganas (Sundarbans)",
            state: "West Bengal",
            severity: "severe",
            exposure: 72,
            lat: 22.15,
            lon: 88.62,
            x: 68.2,
            y: 46.2,
            dangerSummary: "River embankment breaching risk in Sagar & Gosaba islands",
            evacuationPriority: "immediate",
            bulletin: "Earthen embankments reinforced with wire netting and sandbags.",
            safeSheltersCount: 45,
          },
          {
            name: "Kolkata Metropolitan",
            state: "West Bengal",
            severity: "warning",
            exposure: 54,
            lat: 22.57,
            lon: 88.36,
            x: 67.9,
            y: 45.6,
            dangerSummary: "Urban waterlogging & tree branch fall risk; flight ops on advisory",
            evacuationPriority: "advisory",
            bulletin:
              "Municipal high-capacity drainage pumps stationed at Thanthania & Park Circus.",
            safeSheltersCount: 15,
          },
        ],
      },
      {
        state: "Andhra Pradesh",
        severity: "warning",
        exposure: 48,
        activeAlertsCount: 3,
        center: { x: 52.5, y: 60.5, lat: 17.68, lon: 83.21 },
        districts: [
          {
            name: "Srikakulam",
            state: "Andhra Pradesh",
            severity: "warning",
            exposure: 58,
            lat: 18.29,
            lon: 83.89,
            x: 54.8,
            y: 58.2,
            dangerSummary: "High breakers 4.2m; squall winds 65 km/h along coastal NH-16",
            evacuationPriority: "standby",
            bulletin: "Low-lying fishing hamlets alerted; community halls stocked.",
            safeSheltersCount: 18,
          },
          {
            name: "Visakhapatnam",
            state: "Andhra Pradesh",
            severity: "warning",
            exposure: 45,
            lat: 17.68,
            lon: 83.21,
            x: 52.1,
            y: 59.8,
            dangerSummary: "Port alert Signal No. 6 hoisted; sea bathing strictly prohibited",
            evacuationPriority: "advisory",
            bulletin: "Coast Guard hovercraft on maritime coastal patrol.",
            safeSheltersCount: 20,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "Puri Multi-Purpose Cyclone Shelter #12",
        type: "cyclone_shelter",
        state: "Odisha",
        district: "Puri",
        capacity: 1800,
        elevationMeters: 14,
        contactNumber: "+91-6752-223400",
        facilities: [
          "Solar Power Generator",
          "Reverse Osmosis Potable Water",
          "Medical Bay",
          "Child Care Area",
          "Cattle Enclosure",
        ],
      },
      {
        name: "Paradip Port Community Rehabilitation Complex",
        type: "cyclone_shelter",
        state: "Odisha",
        district: "Jagatsinghpur",
        capacity: 2500,
        elevationMeters: 18,
        contactNumber: "+91-6722-222100",
        facilities: [
          "Diesel Generator",
          "Emergency Kitchen",
          "SDRF Taskforce Desk",
          "Satellite SAT-Phone Comms",
        ],
      },
      {
        name: "Aul High-School Multi-Purpose Safe Shelter",
        type: "cyclone_shelter",
        state: "Odisha",
        district: "Kendrapara",
        capacity: 1600,
        elevationMeters: 16,
        contactNumber: "+91-6727-230100",
        facilities: [
          "Reinforced Concrete Roof",
          "Water Purification Plant",
          "Dedicated Female Ward",
        ],
      },
      {
        name: "Gopalpur Coastal Safe Haven Complex",
        type: "cyclone_shelter",
        state: "Odisha",
        district: "Ganjam",
        capacity: 1400,
        elevationMeters: 19,
        contactNumber: "+91-6811-260100",
        facilities: ["Emergency First-Aid", "Dry Food Rations", "Helipad Vicinity"],
      },
      {
        name: "Digha Coastal High-School Multi-Hazard Shelter #4",
        type: "cyclone_shelter",
        state: "West Bengal",
        district: "Purba Medinipur",
        capacity: 1500,
        elevationMeters: 12,
        contactNumber: "+91-3220-266200",
        facilities: [
          "First Aid Post",
          "Chlorine Tablets",
          "Dry Ration Bundles",
          "24x7 Power Backup",
        ],
      },
      {
        name: "Sagar Island Block Relief Center",
        type: "cyclone_shelter",
        state: "West Bengal",
        district: "South 24 Parganas",
        capacity: 2400,
        elevationMeters: 15,
        contactNumber: "+91-3210-240100",
        facilities: [
          "Reinforced RCC Frame",
          "Helipad Access",
          "Emergency Drug Store",
          "Cattle Evacuation Ground",
        ],
      },
      {
        name: "Salt Lake Stadium Emergency Disaster Shelter Pavilion",
        type: "community_hall",
        state: "West Bengal",
        district: "Kolkata Metropolitan",
        capacity: 3500,
        elevationMeters: 16,
        contactNumber: "+91-33-23351000",
        facilities: ["Mass Dormitories", "Paramedic Triage", "Emergency Supply Depot"],
      },
      {
        name: "Srikakulam Zilla Parishad Cyclone Shelter",
        type: "cyclone_shelter",
        state: "Andhra Pradesh",
        district: "Srikakulam",
        capacity: 1200,
        elevationMeters: 17,
        contactNumber: "+91-8942-240100",
        facilities: ["High-Level Plinth", "Solar Lighting", "Drinking Water Reservoir"],
      },
    ],
    broadcast: [
      {
        title: "Sachet / Cell Broadcast — Zone A (Odisha)",
        detail: "342,000 residents in Puri & Kendrapara alerted in Odia, Hindi, and English",
        active: true,
      },
      {
        title: "District Disaster Control Rooms",
        detail: "DEOC Puri (1077), Jagatsinghpur, and Kendrapara 24x7 hotlines linked with OSDMA",
        active: true,
      },
      {
        title: "NDRF / ODRAF Staging",
        detail: "18 NDRF Battalions and 24 ODRAF rescue units deployed with mechanized boats",
        active: true,
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "critical",
        label: "Secure Dwellings & Evacuate",
        action:
          "Board up windows, secure loose tin roofs, and move immediately to designated Cyclone Shelters if in kutchha homes.",
        details:
          "Pack emergency bag: Aadhaar cards/land papers in waterproof bag, 3-day non-perishable food, torch, spare batteries, essential medicines.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "critical",
        label: "Harvest Readiness & Livestock Shift",
        action:
          "Harvest mature standing paddy immediately; untether and herd livestock to elevated community concrete shelters.",
        details:
          "Move tractor/power tillers to elevated ground; store seeds and urea fertilizers on high wooden rafters.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "severe",
        label: "Supply Chain & Power Lockdown",
        action:
          "Anchor outdoor machinery, shut off main electrical breakers, and move inventory 2 meters above ground level.",
        details:
          "Back up digital transaction ledgers to off-site cloud servers; secure diesel for standby backup generators.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "critical",
        label: "Route Suspension & Vehicle Parking",
        action:
          "Avoid coastal highways NH-16 & SH-35; park vehicles in multi-story concrete lots away from large trees.",
        details:
          "Check East Coast Railway bulletin for train diversions; all coastal ferry and fishing vessel transit is strictly cancelled.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "critical",
        label: "Enforce Mandatory Evacuation",
        action:
          "Achieve 100% evacuation of vulnerable 0-5km coastal zones into reinforced Multi-Purpose Cyclone Shelters.",
        details:
          "Test satellite phones (SAT-phone network) and position heavy tree-clearing JCBs along arterial highways.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "critical",
        label: "In-Situ Survival & Safe Room",
        action:
          "Stay inside the strongest interior room without windows; do not venture outside during the deceptive calm of the 'Eye'.",
        details:
          "Keep battery radio tuned to All India Radio / IMD updates; turn off gas cylinders and main power switch.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "critical",
        label: "Do Not Enter Open Fields",
        action:
          "Stay sheltered inside cyclone center; do not attempt to rescue stray cattle during active gale force winds (> 100 km/h).",
        details:
          "High danger of flying corrugated iron sheets and uprooted trees acting as lethal projectiles.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "severe",
        label: "Emergency SOS & Facility Lockdown",
        action:
          "Ensure all staff are confined to reinforced shelters; activate internal emergency roll-call register.",
        details:
          "If flooding starts, evacuate to upper floors immediately; never touch damp electrical conduits.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "critical",
        label: "Pull Over & Halt in Concrete Structures",
        action:
          "Never drive through gust fronts; if caught on the road, pull inside a reinforced concrete fuel station or building.",
        details:
          "Do not shelter under transformers, billboards, or tall neem/banyan trees that could crush vehicles.",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "critical",
        label: "Live EOC Monitoring & Tactical Deployment",
        action:
          "Track radar landfall coordinates from IMD Paradip/Visakhapatnam doppler stations; dispatch quick response NDRF teams.",
        details:
          "Maintain real-time telemetry link with DEOCs; log distress signals received on 112 / 1077.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "severe",
        label: "Relocation, Water Safety & Damage Claims",
        action:
          "Do not return home until officially cleared; boil all drinking water vigorously to prevent cholera/diarrhea outbreaks.",
        details:
          "Watch out for downed live electric wires and venomous snakes seeking dry shelter; photograph structural damage for SDRF compensation.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "critical",
        label: "Drain Saline Water & File PMFBY Claims",
        action:
          "Drain saline seawater inundation from paddy fields quickly; file crop loss claims under PMFBY within 72 hours.",
        details:
          "Contact local Krishi Vigyan Kendra for gypsum treatment to restore soil salinity balance; vaccinate surviving cattle.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "warning",
        label: "Structural Audit & Relief Claims",
        action:
          "Conduct professional structural and electrical inspection before restoring power; file insurance claims with photos.",
        details:
          "Coordinate with district MSME taskforce for emergency low-interest working capital rehabilitation schemes.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "warning",
        label: "Roadway Clearance & Route Verification",
        action:
          "Wait for NDRF tree-cutting crews to clear main arterial routes; check state transport portal before traveling.",
        details:
          "Beware of weakened bridge culverts and submerged roadway potholes filled with debris.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "critical",
        label: "Relocation Camps & Epidemic Prevention",
        action:
          "Operate community kitchens and distribute chlorine tablets / ORS packets in relief camps; restore telecommunications.",
        details:
          "Deploy mobile medical vans for vector-borne disease fogging and disburse immediate gratuitous relief funds.",
      },
    ],
  },

  {
    id: "flood",
    name: "Basin Flood",
    event: "Brahmaputra & Ganga River Basin Major Flood Inundation",
    imdCode: "RED",
    states: "Assam · Bihar · Odisha · Uttar Pradesh",
    headline: "IMD Red Inundation Warning: Major rivers breaching Danger Level in",
    countdown: "03:45:00",
    ambient: "hazard-flood",
    severity: "critical",
    metrics: [
      { label: "River Discharge Rate", value: "38,500 M³/S", severity: "critical" },
      { label: "Water Level Above Danger", value: "+1.85 METERS", severity: "critical" },
      { label: "Submerged Acreage", value: "142,000 HECTARES", severity: "severe" },
      { label: "Displaced Population", value: "580,000 PERSONS", severity: "critical" },
    ],
    briefing:
      "Continuous torrential catchment rainfall in the upper Himalayas has pushed the Brahmaputra at Dhubri and the Ganga at Patna past highest flood levels (HFL). Over 45 embankments are reporting severe scouring. Red alert flood evacuation orders are active in 14 riverine districts.",
    areaKm2: "3,100 KM²",
    expansion: "+18% / HR",
    coreRadius: "28.0 KM",
    cells: [
      {
        x: 77.2,
        y: 34.8,
        r: 160,
        severity: "critical",
        region: "Barpeta, Dhubri & Lower Assam",
        exposure: 94,
      },
      {
        x: 62.4,
        y: 39.5,
        r: 135,
        severity: "critical",
        region: "Patna, Vaishali & Begusarai, Bihar",
        exposure: 88,
      },
      {
        x: 58.5,
        y: 53.5,
        r: 120,
        severity: "severe",
        region: "Cuttack & Kendrapara (Mahanadi Delta), Odisha",
        exposure: 76,
      },
    ],
    stateGroups: [
      {
        state: "Assam",
        severity: "critical",
        exposure: 94,
        activeAlertsCount: 5,
        center: { x: 77.2, y: 34.8, lat: 26.32, lon: 91.0 },
        districts: [
          {
            name: "Barpeta & Dhubri",
            state: "Assam",
            severity: "critical",
            exposure: 95,
            lat: 26.32,
            lon: 91.0,
            x: 77.2,
            y: 34.8,
            dangerSummary: "Brahmaputra flowing 1.85m above danger level; 120 villages inundated",
            evacuationPriority: "immediate",
            bulletin: "State SDRF relief camps opened in higher embankment schools.",
            safeSheltersCount: 34,
          },
          {
            name: "Kamrup (Guwahati)",
            state: "Assam",
            severity: "warning",
            exposure: 64,
            lat: 26.14,
            lon: 91.74,
            x: 78.5,
            y: 35.1,
            dangerSummary: "Brahmaputra gauge at DC Court crossing warning mark (49.68m)",
            evacuationPriority: "standby",
            bulletin: "Ferry services between Guwahati and North Guwahati suspended.",
            safeSheltersCount: 16,
          },
        ],
      },
      {
        state: "Bihar",
        severity: "severe",
        exposure: 78,
        activeAlertsCount: 3,
        center: { x: 62.4, y: 39.5, lat: 25.59, lon: 85.14 },
        districts: [
          {
            name: "Patna (Diara)",
            state: "Bihar",
            severity: "severe",
            exposure: 80,
            lat: 25.59,
            lon: 85.14,
            x: 62.4,
            y: 39.5,
            dangerSummary: "Ganga water entering Diara lowlands; Gandak spillage alert active",
            evacuationPriority: "immediate",
            bulletin: "SDRF motorboats stationed at Danapur and Digha ghats.",
            safeSheltersCount: 22,
          },
          {
            name: "Vaishali & Hajipur",
            state: "Bihar",
            severity: "severe",
            exposure: 76,
            lat: 25.68,
            lon: 85.22,
            x: 62.8,
            y: 39.2,
            dangerSummary: "Lowland ring-bund breach risk along Gandak river confluence",
            evacuationPriority: "immediate",
            bulletin:
              "Safe high-school shelters provisioned with dry rations and halazone tablets.",
            safeSheltersCount: 18,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "Barpeta District Community Elevated Relief Hub",
        type: "flood_relief_camp",
        state: "Assam",
        district: "Barpeta & Dhubri",
        capacity: 1800,
        elevationMeters: 42,
        contactNumber: "+91-3665-252100",
        facilities: [
          "Medical Camp",
          "Anti-Snake Venom (ASV)",
          "Dry Rations",
          "Motorboat Jetty Access",
        ],
      },
      {
        name: "Sarusajai Indoor Sports Complex Flood Safe Camp",
        type: "flood_relief_camp",
        state: "Assam",
        district: "Kamrup (Guwahati)",
        capacity: 2800,
        elevationMeters: 55,
        contactNumber: "+91-361-2237100",
        facilities: ["24/7 Power Backup", "Reverse Osmosis Potable Water", "Maternal Health Bay"],
      },
      {
        name: "Danapur Cantonment High-School Flood Relief Base",
        type: "flood_relief_camp",
        state: "Bihar",
        district: "Patna (Diara)",
        capacity: 2000,
        elevationMeters: 54,
        contactNumber: "+91-612-2219100",
        facilities: ["Elevated Plinth", "Free Community Kitchen", "Halazone Water Purification"],
      },
      {
        name: "Hajipur Community Evacuation Safe Hall",
        type: "flood_relief_camp",
        state: "Bihar",
        district: "Vaishali & Hajipur",
        capacity: 1350,
        elevationMeters: 52,
        contactNumber: "+91-6224-272100",
        facilities: ["First-Aid Nurses", "Mobile Phone Charging Kiosks", "Baby Milk Supply"],
      },
    ],
    broadcast: [
      {
        title: "CWC Live River Forecast Relay",
        detail: "Mahanadi & Brahmaputra discharge warning transmitted to 88 riverside panchayats",
        active: true,
      },
      {
        title: "NDRF / SDRF Inundation Teams",
        detail: "24 boat squads deployed for marooned village evacuations",
        active: true,
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "critical",
        label: "Elevate Valuables & Turn Off Mains",
        action:
          "Move electronics, gas cylinders, and rations to upper floors; turn off main electrical switchboard before water enters.",
        details:
          "Identify highest nearby concrete school or flood shelter; keep waterproof emergency grab-bag ready with Aadhaar & medicines.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "severe",
        label: "Clear Drainage & Secure Seed Stock",
        action:
          "Clear farm drainage outlets; store certified seeds and harvested grain on high elevated wooden platforms.",
        details:
          "Relocate cows, buffaloes, and goats to high embankment bunds with 4 days of dry fodder; untether animals so they can swim if water surges.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "severe",
        label: "Inventory Elevation & Hazardous Chemical Lockdown",
        action:
          "Elevate ground-floor inventory onto upper racking; safely isolate and seal industrial chemicals and solvent drums.",
        details:
          "Shut off underground diesel fuel tank valves to prevent groundwater contamination; back up GST accounting records.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "critical",
        label: "Never Cross Submerged Roads",
        action:
          "Heed the universal rule: 'Turn Around, Don't Drown'. Never attempt to drive or walk across waterlogged causeways.",
        details:
          "Just 15 cm of moving floodwater can knock down an adult; 30 cm can float small cars and sweep them into deep currents.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "critical",
        label: "Reinforce Embankment Slices & Stage Rescue Boats",
        action:
          "Place geo-textile bags and sandbags along vulnerable river bends; pre-position inflatable SDRF motorized boats.",
        details:
          "Issue sirens and voice alerts across riverside habitations; verify stock of halogen tablets and anti-venom vials in primary health centers.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "critical",
        label: "Move to Roof / High Ground & Signal SOS",
        action:
          "Climb to reinforced roof/high ground if trapped; wave a bright colored cloth or flash a torch for rescue boats.",
        details:
          "Do not drink floodwater; use chlorine tablets or boiled water; beware of snakes swimming toward dry structures.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "critical",
        label: "Protect Livestock on High Bunds",
        action:
          "Stay with herd on elevated highlands; never enter rushing flood currents to recover submerged farm machinery.",
        details:
          "Provide dry straw and clean water; keep animals away from dangling electrical wires or water-contacted poles.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "severe",
        label: "Facility Shutdown & Worker Evacuation",
        action:
          "Order immediate complete plant evacuation; disconnect master grid transformers to prevent electrical fires.",
        details:
          "Activate remote work protocols; report facility status to local District Disaster Management Authority.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "critical",
        label: "Halt at Elevated Highway Plazas",
        action:
          "Park on elevated highway toll plazas or flyovers; never drive onto flooded bridge decks or rail underpasses.",
        details:
          "If vehicle stalls in rising water, abandon vehicle immediately and climb to higher ground or nearest building.",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "critical",
        label: "Deploy Rescue Boats & Air-Drop Rations",
        action:
          "Coordinate NDRF/SDRF motorboats to evacuate marooned households; drop halogen-sealed food packets to isolated roofs.",
        details:
          "Keep district 1077 helpline operators updated on operational shelters and boat staging points.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "severe",
        label: "Boil Drinking Water & Check Foundation",
        action:
          "Boil all drinking water for at least 3 minutes; check walls and foundations for structural cracks before stepping inside.",
        details:
          "Wear sturdy boots to prevent nail punctures and snakebites while cleaning flood mud and silt.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "critical",
        label: "De-Silt Fields & File Crop Loss 72-Hour Claim",
        action:
          "De-silt standing crop fields quickly to prevent root rot; take geo-tagged photos and submit PMFBY loss notice in 72 hours.",
        details:
          "Administer enterotoxemia and blackquarter vaccines to surviving livestock; seek subsidized replacement seeds from Krishi department.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "warning",
        label: "Industrial Drying & Electrical Certification",
        action:
          "Never energize flooded motors or electrical switchgear until professionally dried and megger-tested by licensed engineers.",
        details:
          "Document flood watermark levels on machinery for insurance survey; dispose of contaminated perishables responsibly.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "warning",
        label: "Bridge Integrity Checks & Highway Reopening",
        action:
          "Follow state traffic police advisories for highway bridge clearances; do not use eroded road shoulders.",
        details:
          "Inspect vehicle brake pads and wheel bearings after driving through deep mud before highway cruising.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "critical",
        label: "Disinfect Water Sources & Disburse Relief",
        action:
          "Super-chlorinate all community borewells and open wells; distribute halogen tablets and ORS packets in every village.",
        details:
          "Initiate fast-track assessment of damaged kutchha houses and release immediate SDRF gratuitous relief.",
      },
    ],
  },

  {
    id: "heat",
    name: "Heatwave",
    event: "Severe Loo & Extreme Thermal Stress — Northern & Central India",
    imdCode: "ORANGE",
    states: "Rajasthan · Delhi · Uttar Pradesh · Madhya Pradesh",
    headline: "IMD Orange Heatwave Warning: Peak surface temperatures crossing 44.5°C in",
    countdown: "02:18:00",
    ambient: "hazard-heat",
    severity: "severe",
    metrics: [
      { label: "Max Air Temp", value: "45.2°C", severity: "critical" },
      { label: "Apparent Temp (Heat Index)", value: "48.6°C", severity: "critical" },
      { label: "UV Radiation Index", value: "11+ EXTREME", severity: "severe" },
      { label: "Night Minimum Temp", value: "31.4°C (WARM NIGHT)", severity: "warning" },
    ],
    briefing:
      "Intense anticyclonic flow is driving blistering westerly winds from the Thar desert. Consecutive days above 44°C combined with warm nocturnal minimums represent severe heatstroke hazard. Heat Action Plan (HAP) Phase II is activated across Delhi NCR, Rajasthan, and western UP.",
    areaKm2: "2,400 KM²",
    expansion: "+4% / HR",
    coreRadius: "24.0 KM",
    cells: [
      {
        x: 38.4,
        y: 32.5,
        r: 145,
        severity: "critical",
        region: "Churu, Bikaner & Western Rajasthan",
        exposure: 90,
      },
      {
        x: 44.2,
        y: 28.6,
        r: 135,
        severity: "critical",
        region: "Delhi NCR & Gurugram / Noida",
        exposure: 86,
      },
      {
        x: 48.5,
        y: 31.8,
        r: 120,
        severity: "severe",
        region: "Agra, Mathura & Western Uttar Pradesh",
        exposure: 76,
      },
    ],
    stateGroups: [
      {
        state: "Rajasthan",
        severity: "critical",
        exposure: 90,
        activeAlertsCount: 6,
        center: { x: 38.4, y: 32.5, lat: 26.91, lon: 75.78 },
        districts: [
          {
            name: "Churu & Bikaner",
            state: "Rajasthan",
            severity: "critical",
            exposure: 94,
            lat: 28.29,
            lon: 74.96,
            x: 38.4,
            y: 32.5,
            dangerSummary: "Extreme ambient temp 46.4°C; severe hot dust winds (Loo)",
            evacuationPriority: "standby",
            bulletin:
              "Water tankers dispatched to desert settlements; hospital cooling wards active.",
            safeSheltersCount: 14,
          },
          {
            name: "Jaipur",
            state: "Rajasthan",
            severity: "severe",
            exposure: 82,
            lat: 26.91,
            lon: 75.78,
            x: 41.5,
            y: 34.2,
            dangerSummary: "Urban asphalt reflection pushing surface temp > 52°C",
            evacuationPriority: "advisory",
            bulletin: "Public parks opened as shaded cooling centers during 12-4 PM.",
            safeSheltersCount: 20,
          },
        ],
      },
      {
        state: "Delhi",
        severity: "critical",
        exposure: 86,
        activeAlertsCount: 3,
        center: { x: 44.2, y: 28.6, lat: 28.61, lon: 77.2 },
        districts: [
          {
            name: "New Delhi & Najafgarh",
            state: "Delhi",
            severity: "critical",
            exposure: 88,
            lat: 28.61,
            lon: 77.2,
            x: 44.2,
            y: 28.6,
            dangerSummary: "Intense heat island; wet-bulb thermal index reaching dangerous 29.8°C",
            evacuationPriority: "advisory",
            bulletin: "Outdoor physical labor prohibited between 11 AM and 4 PM by Labour Dept.",
            safeSheltersCount: 28,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "Churu District Hospital Thermal Cooling Ward & Public Oasis",
        type: "heat_relief_center",
        state: "Rajasthan",
        district: "Churu & Bikaner",
        capacity: 800,
        elevationMeters: 286,
        contactNumber: "+91-1562-250100",
        facilities: [
          "Air-Conditioned Cooling Bays",
          "Chilled Electrolyte Kiosks",
          "24/7 Heatstroke Specialists",
        ],
      },
      {
        name: "Bikaner Central Community Shaded Hydration Center",
        type: "heat_relief_center",
        state: "Rajasthan",
        district: "Churu & Bikaner",
        capacity: 950,
        elevationMeters: 242,
        contactNumber: "+91-151-2226100",
        facilities: ["Shaded Misting Fans", "Free ORS & Chaas Stations", "Emergency Ice Baths"],
      },
      {
        name: "Jaipur SMS Stadium Air-Cooled Emergency Shelter Hall",
        type: "heat_relief_center",
        state: "Rajasthan",
        district: "Jaipur",
        capacity: 1400,
        elevationMeters: 431,
        contactNumber: "+91-141-2740100",
        facilities: [
          "High-Capacity Chillers",
          "Paramedic First-Aid Ward",
          "Continuous Cold Potable Water",
        ],
      },
      {
        name: "Delhi Municipal Shaded Cooling Center #4 (Central Delhi)",
        type: "heat_relief_center",
        state: "Delhi",
        district: "New Delhi & Najafgarh",
        capacity: 950,
        elevationMeters: 216,
        contactNumber: "+91-11-23378800",
        facilities: [
          "Industrial Air Coolers",
          "Chilled ORS Dispensers",
          "First-Aid Nursing Desk",
          "Free Potable Water",
        ],
      },
    ],
    broadcast: [
      {
        title: "Heat Action Plan (HAP) Broadcast",
        detail:
          "Advisories sent to 1.8M outdoor laborers, gig delivery workers, and senior citizens",
        active: true,
      },
      {
        title: "District Cooling Centers",
        detail: "Air-cooled public libraries and community halls open for public shelter",
        active: true,
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "severe",
        label: "Pre-Hydration & Shading Prep",
        action:
          "Stock ORS, lemon, glucose and buttermilk (chaas); hang damp bamboo/cotton curtains on west-facing windows.",
        details:
          "Schedule all outdoor errands before 10:30 AM; check on elderly neighbors and young children.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "severe",
        label: "Night Irrigation & Cattle Shed Shading",
        action:
          "Irrigate standing crops strictly during late evening or early morning to prevent soil moisture shock.",
        details:
          "Provide thick thatch roofs and continuous fresh drinking water troughs for cattle; spray water on buffaloes twice daily.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "severe",
        label: "Shift Rescheduling & Hydration Stations",
        action:
          "Shift heavy factory and construction shifts to early morning (5 AM - 10:30 AM) and evening (5 PM - 9 PM).",
        details:
          "Install shaded rest areas, water coolers, and mandatory 15-minute hydration breaks every hour for on-site staff.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "warning",
        label: "Vehicle Radiator & Tire Pressure Check",
        action:
          "Check vehicle coolant levels, radiator hoses, and ensure tire pressures are not overinflated on blistering asphalt.",
        details:
          "Carry at least 3 liters of potable water and oral rehydration salts in vehicle at all times.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "critical",
        label: "Deploy Water Tankers & Activate Cooling Wards",
        action:
          "Position municipal water tankers at high-density bus stands, slums, and markets; reserve dedicated AC beds in district hospitals.",
        details:
          "Enforce work ban for outdoor physical laborers between 11:30 AM and 4 PM across all government projects.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "critical",
        label: "Avoid Direct Sun & Recognize Heatstroke",
        action:
          "Stay indoors between 11:30 AM and 4:30 PM; if dizziness, high body temp or cessation of sweating occurs, call 108 immediately.",
        details:
          "Cool a heatstroke victim rapidly: move to shade, apply ice packs to neck/armpits/groin, and fan vigorously.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "critical",
        label: "Do Not Work in Open Fields During Peak Loo",
        action:
          "Halt all open field manual labor between 11 AM and 4:30 PM when dry desert winds (Loo) cause rapid dehydration.",
        details:
          "Keep livestock in shaded enclosures with adequate ventilation; never tether animals under unshaded tin sheets.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "severe",
        label: "Enforce Shaded Breaks & Electrolyte Supply",
        action:
          "Mandate that no delivery rider or factory worker performs heavy outdoor tasks without protective headgear and cool water.",
        details:
          "Keep a certified first-aid officer trained in recognizing heat exhaustion and administering oral rehydration therapy.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "warning",
        label: "Avoid Midday Travel & Park in Shade",
        action:
          "Avoid non-essential transit between 12 PM and 4 PM; never leave children or pets inside parked vehicles even with windows cracked.",
        details:
          "Interior car temperatures can exceed 65°C within 15 minutes under direct 45°C sun.",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "critical",
        label: "Enforce Work Restrictions & Operate Misting Points",
        action:
          "Inspect construction sites and penalize non-compliant contractors; operate water misting cannons along arterial avenues.",
        details: "Broadcast heat index warnings via mobile SMS towers and state information radio.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "warning",
        label: "Electrolyte Replenishment & Cool Down",
        action:
          "Continue sipping electrolyte fluids throughout the evening; take cool sponge baths to lower core body temperature.",
        details:
          "Avoid alcohol, caffeine, and heavy spicy meals that increase metabolic heat production.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "safe",
        label: "Foliar Nutrition & Soil Moisture Conservation",
        action:
          "Apply anti-transpirant sprays or mulch cover on fruit orchards and vegetables to reduce moisture loss.",
        details:
          "Monitor livestock milk yield and provide mineral mixture supplements to counter thermal stress.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "safe",
        label: "HVAC & Electrical Load Inspection",
        action:
          "Inspect industrial transformers and AC compressor units to prevent heat-triggered electrical fires.",
        details:
          "Review thermal safety logs and restock electrolyte first-aid kits for upcoming heatwave days.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "safe",
        label: "Vehicle Inspection & Night Transit",
        action:
          "Schedule freight transit and heavy haulage during nocturnal hours (8 PM - 6 AM) to reduce vehicle thermal breakdown.",
        details: "Inspect engine belts and tire treads for heat blistering before daytime travel.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "warning",
        label: "Heat-Related Morbidity Audit & Water Replenishment",
        action:
          "Audit hospital admissions for heat hyperpyrexia; refill groundwater recharge pits and community water kiosks.",
        details:
          "Review district Heat Action Plan implementation metrics with health and municipal commissioners.",
      },
    ],
  },

  {
    id: "thunderstorm",
    name: "Severe Storm",
    event: "Kalbaisakhi Squalls & Cloud-to-Ground Lightning",
    imdCode: "ORANGE",
    states: "Jharkhand · West Bengal · Odisha · Bihar",
    headline: "IMD Orange Warning: Violent convective squall line & lightning strike risk in",
    countdown: "01:45:00",
    ambient: "hazard-storm",
    severity: "severe",
    metrics: [
      { label: "Squall Peak Gusts", value: "85 KM/H", severity: "critical" },
      { label: "Lightning Density", value: "140 STRIKES / MIN", severity: "critical" },
      { label: "Hailstone Diameter", value: "25-35 MM", severity: "severe" },
      { label: "Convective Instability (CAPE)", value: "3,400 J/KG", severity: "warning" },
    ],
    briefing:
      "Doppler radar at Ranchi and Kolkata indicates a rapidly propagating squall line with intense vertical updrafts. Damini Lightning Network indicates extreme cloud-to-ground flash density across the Chota Nagpur plateau and Lower Gangetic plain.",
    areaKm2: "920 KM²",
    expansion: "+22% / HR",
    coreRadius: "9.5 KM",
    cells: [
      {
        x: 58.4,
        y: 43.3,
        r: 120,
        severity: "critical",
        region: "Ranchi & East Singhbhum, Jharkhand",
        exposure: 86,
      },
      {
        x: 65.5,
        y: 44.2,
        r: 110,
        severity: "severe",
        region: "Bankura, Purulia & Paschim Medinipur, West Bengal",
        exposure: 78,
      },
    ],
    stateGroups: [
      {
        state: "Jharkhand",
        severity: "critical",
        exposure: 86,
        activeAlertsCount: 4,
        center: { x: 58.4, y: 43.3, lat: 23.34, lon: 85.3 },
        districts: [
          {
            name: "Ranchi & East Singhbhum",
            state: "Jharkhand",
            severity: "critical",
            exposure: 88,
            lat: 23.34,
            lon: 85.3,
            x: 58.4,
            y: 43.3,
            dangerSummary: "140 strikes/min cloud-to-ground lightning & 85 km/h squalls",
            evacuationPriority: "immediate",
            bulletin: "Open agricultural fields in plateau region under immediate lightning alert.",
            safeSheltersCount: 20,
          },
        ],
      },
      {
        state: "West Bengal",
        severity: "severe",
        exposure: 78,
        activeAlertsCount: 3,
        center: { x: 65.5, y: 44.2, lat: 23.23, lon: 87.07 },
        districts: [
          {
            name: "Bankura & Purulia",
            state: "West Bengal",
            severity: "severe",
            exposure: 80,
            lat: 23.23,
            lon: 87.07,
            x: 65.5,
            y: 44.2,
            dangerSummary: "Convective Kalbaisakhi squall line; heavy hail damage risk",
            evacuationPriority: "standby",
            bulletin: "Disaster warning sirens triggered in rural block headquarters.",
            safeSheltersCount: 17,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "Birsa Munda Indoor Stadium Surge-Protected Safe Center",
        type: "lightning_safety_shelter",
        state: "Jharkhand",
        district: "Ranchi & East Singhbhum",
        capacity: 1600,
        elevationMeters: 650,
        contactNumber: "+91-651-2200112",
        facilities: [
          "Faraday Cage Lightning Protection",
          "Medical Trauma Bay",
          "Solar Generator Backup",
        ],
      },
      {
        name: "Keenan Stadium Community Lightning Safety Hall",
        type: "lightning_safety_shelter",
        state: "Jharkhand",
        district: "Ranchi & East Singhbhum",
        capacity: 1200,
        elevationMeters: 160,
        contactNumber: "+91-657-2431100",
        facilities: [
          "Lightning Arresters Installed",
          "Paramedic First-Aid",
          "Drinking Water Supply",
        ],
      },
      {
        name: "Bankura Zilla Parishad Safe Lightning Hall",
        type: "lightning_safety_shelter",
        state: "West Bengal",
        district: "Bankura & Purulia",
        capacity: 1100,
        elevationMeters: 78,
        contactNumber: "+91-3242-250300",
        facilities: ["Surge Protectors", "Emergency Radio Comms", "Blankets and Dry Rations"],
      },
    ],
    broadcast: [
      {
        title: "Damini App Lightning Early Warning",
        detail: "Real-time 20-minute advance lightning alerts sent to 620,000 rural residents",
        active: true,
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "severe",
        label: "Unplug Sensitive Electronics & Secure Roofs",
        action:
          "Unplug all TVs, modems, and computers; secure rooftop solar panels, tin sheets, and flower pots against 85 km/h gusts.",
        details:
          "Ensure Damini Lightning App is installed; do not schedule outdoor activities when dark convective anvil clouds form.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "critical",
        label: "Leave Open Fields & Bring Cattle Under Concrete Shelter",
        action:
          "Leave open fields immediately upon hearing thunder; herd cattle inside pukka reinforced sheds (never under isolated trees).",
        details:
          "Disconnect irrigation pumps from overhead electrical lines to prevent motor burnouts from lightning surges.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "severe",
        label: "Anchor Outdoor Signboards & Test Surge Arresters",
        action:
          "Inspect rooftop billboards, crane arms, and external wiring; verify lightning arresters and surge protection devices (SPDs).",
        details: "Halt all outdoor scaffolding and metal welding operations immediately.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "warning",
        label: "Park Away From Trees & Billboards",
        action:
          "Park four-wheelers inside garages or clear open parking lots; avoid parking under eucalyptus, neem, or frail roadside hoardings.",
        details:
          "Motorcyclists should seek substantial concrete shelter before the squall front arrives.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "critical",
        label: "Activate Damini Siren Network & Standby Power Crews",
        action:
          "Trigger block-level lightning warning sirens; place state electricity board (DISCOM) line repair teams on hot standby.",
        details:
          "Disseminate audio alerts across rural gram panchayats through community radio and loudspeaker towers.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "critical",
        label: "The 30-30 Rule & Indoor Lightning Safety",
        action:
          "Follow the 30-30 rule: If time between lightning flash and thunder is < 30 seconds, stay inside for 30 minutes after last rumble.",
        details:
          "Avoid plumbing fixtures, wired phones, and concrete walls with rebar; never take shelter in tin sheds or bus stops.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "critical",
        label: "Lightning Crouch Protocol in Open Terrain",
        action:
          "If caught in open terrain with no shelter: Crouch low on balls of feet with heels touching, head tucked, hands over ears.",
        details:
          "Never lie flat on the ground; do not hold metal tools like sickles, spades, or umbrellas with metal tips.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "severe",
        label: "Power Grid Isolation & Indoor Containment",
        action:
          "Switch to uninterruptible power supply (UPS); keep all warehouse staff away from corrugated steel roofs and exterior walls.",
        details: "Check for any hail damage to skylights and report immediate emergencies to 112.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "critical",
        label: "Stay Inside Hard-Topped Vehicle (Faraday Cage)",
        action:
          "Remain inside enclosed, hard-topped vehicles with windows rolled up; the metal frame acts as a protective Faraday cage.",
        details:
          "Do not touch metal interior handles or radio dials; pull off the roadway if horizontal hail obscures visibility.",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "critical",
        label: "Emergency Dispatch & Rapid Trauma Triage",
        action:
          "Respond to lightning strike distress calls; dispatch ambulances equipped with automated external defibrillators (AEDs).",
        details:
          "Lightning victims carry no residual electrical charge and can be administered immediate CPR safely.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "warning",
        label: "Watch For Snapped Power Lines",
        action:
          "Stay at least 10 meters away from fallen power lines; assume all downed cables are live and notify power authorities.",
        details:
          "Check roof tiles and solar panels for hail cracks once winds completely die down.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "warning",
        label: "Hail Damage Assessment & Fodder Care",
        action:
          "Inspect standing crops for lodging and hail bruising; apply protective fungicide sprays recommended by Krishi Kendra.",
        details:
          "Check cattle sheds for structural integrity and ensure no galvanized wires have broken into animal feed areas.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "safe",
        label: "Facility Structural & Roof Audit",
        action:
          "Inspect gutters, drainage downspouts, and rooftop HVAC units for hail or wind damage before resuming full operations.",
        details: "File commercial storm damage reports with photographic evidence.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "warning",
        label: "Watch For Uprooted Trees & Road Obstructions",
        action:
          "Drive slowly and watch for fallen branches, crushed traffic signals, and snapped overhead cables on highways.",
        details: "Report blocked district roads to the municipal disaster control room.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "critical",
        label: "Restore Power Feeders & Clear Roadways",
        action:
          "Mobilize quick response teams to chainsaw fallen trees from main corridors and repair tripped 33kV sub-stations.",
        details: "Disburse SDRF ex-gratia compensation for lightning casualties within 48 hours.",
      },
    ],
  },

  {
    id: "airquality",
    name: "Air Pollution",
    event: "Post-Harvest Crop Residue & Severe Meteorological Inversion",
    imdCode: "RED",
    states: "Delhi NCR · Punjab · Haryana · Uttar Pradesh",
    headline: "CAQM / CPCB Emergency: Severe+ Air Quality Index (AQI > 450) across",
    countdown: "08:00:00",
    ambient: "hazard-smog",
    severity: "critical",
    metrics: [
      { label: "US AQI Real-time", value: "442 SEVERE+", severity: "critical" },
      { label: "PM2.5 Concentration", value: "385 µG/M³ (15X WHO LIMIT)", severity: "critical" },
      { label: "Atmospheric Inversion Depth", value: "85 METERS", severity: "severe" },
      { label: "Surface Wind Velocity", value: "< 3 KM/H (STAGNANT)", severity: "warning" },
    ],
    briefing:
      "A shallow planetary boundary layer coupled with calm surface winds and agricultural residue burning has trapped particulate pollutants across the National Capital Region. Commission for Air Quality Management (CAQM) has invoked Stage IV (Severe+) of the Graded Response Action Plan (GRAP).",
    areaKm2: "1,600 KM²",
    expansion: "+3% / HR",
    coreRadius: "15.0 KM",
    cells: [
      {
        x: 44.2,
        y: 28.6,
        r: 150,
        severity: "critical",
        region: "Delhi NCR (Anand Vihar, Jahangirpuri & Noida)",
        exposure: 95,
      },
      {
        x: 42.8,
        y: 27.2,
        r: 120,
        severity: "severe",
        region: "Gurugram & Faridabad, Haryana",
        exposure: 84,
      },
      {
        x: 46.5,
        y: 29.8,
        r: 110,
        severity: "severe",
        region: "Ghaziabad & Meerut, Uttar Pradesh",
        exposure: 80,
      },
    ],
    stateGroups: [
      {
        state: "Delhi NCR",
        severity: "critical",
        exposure: 95,
        activeAlertsCount: 5,
        center: { x: 44.2, y: 28.6, lat: 28.61, lon: 77.23 },
        districts: [
          {
            name: "Central & East Delhi (Anand Vihar)",
            state: "Delhi",
            severity: "critical",
            exposure: 98,
            lat: 28.65,
            lon: 77.31,
            x: 44.5,
            y: 28.4,
            dangerSummary: "AQI 485 (Severe+); extreme PM2.5 and diesel particulate accumulation",
            evacuationPriority: "immediate",
            bulletin: "Vulnerable individuals advised to stay indoors in air-filtered spaces.",
            safeSheltersCount: 16,
          },
          {
            name: "North Delhi (Jahangirpuri & Bawana)",
            state: "Delhi",
            severity: "critical",
            exposure: 94,
            lat: 28.73,
            lon: 77.16,
            x: 44.1,
            y: 28.1,
            dangerSummary: "Industrial emission stagnation; toxic VOC and secondary sulfate levels",
            evacuationPriority: "immediate",
            bulletin: "Mechanical road sweeping and anti-smog water cannons operating 24x7.",
            safeSheltersCount: 14,
          },
        ],
      },
      {
        state: "Haryana",
        severity: "severe",
        exposure: 84,
        activeAlertsCount: 3,
        center: { x: 42.8, y: 27.2, lat: 28.45, lon: 77.02 },
        districts: [
          {
            name: "Gurugram (Cyber City & Manesar)",
            state: "Haryana",
            severity: "severe",
            exposure: 86,
            lat: 28.45,
            lon: 77.02,
            x: 42.8,
            y: 27.2,
            dangerSummary: "AQI 410; thermal inversion trapping highway transit pollutants",
            evacuationPriority: "standby",
            bulletin: "50% corporate remote work implemented; diesel DG sets switched off.",
            safeSheltersCount: 15,
          },
          {
            name: "Faridabad",
            state: "Haryana",
            severity: "severe",
            exposure: 82,
            lat: 28.4,
            lon: 77.31,
            x: 43.2,
            y: 27.8,
            dangerSummary: "Heavy industrial furnace particulate concentration exceeding WHO 18x",
            evacuationPriority: "standby",
            bulletin: "Hospital respiratory triage units on standby.",
            safeSheltersCount: 12,
          },
        ],
      },
      {
        state: "Uttar Pradesh",
        severity: "severe",
        exposure: 80,
        activeAlertsCount: 3,
        center: { x: 46.5, y: 29.8, lat: 28.66, lon: 77.45 },
        districts: [
          {
            name: "Noida & Greater Noida",
            state: "Uttar Pradesh",
            severity: "severe",
            exposure: 84,
            lat: 28.57,
            lon: 77.32,
            x: 46.1,
            y: 29.2,
            dangerSummary: "AQI 425; construction dust suspension & calm winds",
            evacuationPriority: "standby",
            bulletin: "All construction and demolition activities strictly halted under GRAP-IV.",
            safeSheltersCount: 18,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "AIIMS Delhi Clean-Air Respiratory Care Pavilion",
        type: "district_hospital",
        state: "Delhi NCR",
        district: "Central & East Delhi (Anand Vihar)",
        capacity: 950,
        elevationMeters: 215,
        contactNumber: "+91-11-26588500",
        facilities: [
          "HEPA Medical Air Cleaners",
          "Oxygen Concentrators",
          "Nebulizer Stations",
          "24x7 Pulmonologists",
        ],
      },
      {
        name: "Delhi Govt Community Air-Filtered Relief Hall (Jahangirpuri)",
        type: "community_hall",
        state: "Delhi NCR",
        district: "North Delhi (Jahangirpuri & Bawana)",
        capacity: 700,
        elevationMeters: 218,
        contactNumber: "+91-11-27631100",
        facilities: [
          "Double-Filter HEPA Filtration",
          "Clean Drinking Water",
          "N95 Mask Distribution Desk",
        ],
      },
      {
        name: "Gurugram Mini Secretariat Air-Conditioned Safe Hall",
        type: "community_hall",
        state: "Haryana",
        district: "Gurugram (Cyber City & Manesar)",
        capacity: 600,
        elevationMeters: 220,
        contactNumber: "+91-124-2321100",
        facilities: ["Central Air Purification", "First-Aid Inhalation Support", "Rest Area"],
      },
      {
        name: "Noida Sector 39 District Hospital Respiratory Care Wing",
        type: "district_hospital",
        state: "Uttar Pradesh",
        district: "Noida & Greater Noida",
        capacity: 650,
        elevationMeters: 200,
        contactNumber: "+91-120-2500112",
        facilities: [
          "Air Filtration System",
          "High-Flow Oxygen Therapy",
          "Emergency Bronchodilator Units",
        ],
      },
    ],
    broadcast: [
      {
        title: "CAQM GRAP Stage IV Emergency Notification",
        detail:
          "Entry of non-BS VI diesel trucks banned into Delhi; primary schools shifted to online mode",
        active: true,
      },
      {
        title: "Municipal Smog Guns & Anti-Dust",
        detail: "85 mobile anti-smog water cannons deployed on heavy traffic corridors",
        active: true,
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "critical",
        label: "Fit N95 / FFP2 Masks & Seal Windows",
        action:
          "Wear certified N95 or N99 masks outdoors; standard cloth and surgical masks cannot filter PM2.5 particles.",
        details:
          "Run HEPA air purifiers indoors on recirculate mode; keep room windows tightly closed during early morning and night hours.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "severe",
        label: "Adopt In-Situ Straw Management & Super Seeder",
        action:
          "Do not burn paddy crop residue (parali); use Happy Seeders, Super Seeders, or bio-decomposer sprays subsidized by Agriculture Dept.",
        details:
          "Bale straw for sale to biomass pellet plants; open burning attracts heavy environmental compensation penalties.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "severe",
        label: "GRAP Compliance & Switch to Piped Gas / Grid",
        action:
          "Immediately halt all industrial boilers running on unapproved fuels; switch entirely to PNG or electricity.",
        details:
          "Halt all construction, demolition, and excavation work; cover all sand and aggregate piles with tarpaulins.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "warning",
        label: "Check Vehicle PUC Certificate & Cabin Air Filter",
        action:
          "Ensure valid Pollution Under Control (PUC) certificate; replace vehicle cabin AC pollen filter with an activated carbon filter.",
        details:
          "Set car air-conditioning to internal re-circulation mode to avoid sucking in dense toxic highway exhaust.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "critical",
        label: "Enforce GRAP-IV & Deploy Anti-Smog Guns",
        action:
          "Enforce ban on medium and heavy diesel commercial vehicles entering Delhi; mobilize all mobile anti-smog water cannons.",
        details:
          "Order 50% government office staff to work from home; conduct round-the-clock drone surveillance of industrial clusters.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "critical",
        label: "Avoid Morning Jogging & Outdoor Workouts",
        action:
          "Strictly avoid morning walks and outdoor exercise when ground-level inversion smog is most concentrated (5 AM - 9 AM).",
        details:
          "Patients with asthma, COPD, or cardiovascular disease should keep rescue inhalers immediately accessible.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "critical",
        label: "Protect Farm Livestock From Smog Inhalation",
        action:
          "Keep cattle inside well-ventilated sheds away from burning fields; provide clean water to prevent respiratory distress in animals.",
        details: "Avoid working in dense stubble smoke without protective N95 respirators.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "severe",
        label: "Implement Remote Work & Stop Diesel DG Sets",
        action:
          "Shift 50% office workforce to Work-From-Home (WFH); diesel generator sets are legally prohibited under GRAP-IV.",
        details:
          "Switch to dedicated battery UPS or grid power; halt all open construction, demolition, and marble-cutting activities.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "warning",
        label: "Use Public Metro Transit & Avoid Peak Smog Hours",
        action:
          "Use electric metro trains instead of private vehicles; drive with low-beam fog lights in low-visibility smog corridors.",
        details: "Never idle vehicle engine at traffic signals for more than 15 seconds.",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "critical",
        label: "Intensify Mechanized Sweeping & Hospital Triage",
        action:
          "Conduct round-the-clock water sprinkling with chemical dust suppressants on high-density vehicular ring roads.",
        details:
          "Open dedicated clean-air breathing rooms in government hospitals for acute respiratory distress patients.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "safe",
        label: "Ventilate Indoors When Winds Pick Up",
        action:
          "Open windows for cross-ventilation only when surface wind speeds increase and AQI improves to Moderate levels.",
        details:
          "Rinse eyes with clean water and steam inhale to clear upper respiratory passage irritation.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "safe",
        label: "Soil Health Incorporation & Rabi Sowing",
        action:
          "Incorporate decomposed organic matter into soil to enrich organic carbon before sowing wheat crop.",
        details: "Collect custom hiring center incentives for zero-till machinery usage.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "safe",
        label: "Gradual Resumption of Operations Under GRAP-III",
        action:
          "Resume permissible commercial activities while maintaining strict dust mitigation and wet-suppression norms.",
        details:
          "Inspect rooftop exhaust scrubbers and maintain continuous emission monitoring system (CEMS) telemetry.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "safe",
        label: "Vehicle Emission Tuning & Filter Cleaning",
        action:
          "Clean vehicle air intake filters and check spark plugs/injectors to ensure optimal fuel combustion efficiency.",
        details: "Continue carpooling to prevent sudden traffic smog rebounds.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "warning",
        label: "Air Quality CAQM Review & Long-Term Transition",
        action:
          "Review compliance reports across industrial zones; incentivize electric fleet conversions for last-mile logistics.",
        details: "Maintain strict vigil against open garbage burning across municipal dumpsites.",
      },
    ],
  },

  {
    id: "rain",
    name: "Heavy Rain",
    event: "Monsoon Offshore Trough Inundation & Western Ghats Torrential Surge",
    imdCode: "YELLOW",
    states: "Gujarat · Chhattisgarh · Madhya Pradesh · Maharashtra · Karnataka · Kerala",
    headline: "IMD Yellow / Orange Alert: Heavy to very heavy rainfall spells across",
    countdown: "05:10:00",
    ambient: "hazard-rain",
    severity: "warning",
    metrics: [
      { label: "Precipitation 24h", value: "110 MM", severity: "warning" },
      { label: "Wind Velocity", value: "48 KM/H", severity: "warning" },
      { label: "High Tide Height", value: "4.45 M", severity: "severe" },
      { label: "Urban Drainage Status", value: "72% SATURATION", severity: "warning" },
    ],
    briefing:
      "A well-marked low-pressure area over the Arabian Sea is sustaining an active offshore trough along the Konkan, Gujarat, and Malabar coasts, with convective rain bands extending across Central India (Chhattisgarh & MP). Moderate to heavy rainfall with localized waterlogging and ghat road landslide risks is forecast.",
    areaKm2: "1,850 KM²",
    expansion: "+6% / HR",
    coreRadius: "14.0 KM",
    cells: [
      {
        x: 35.5,
        y: 46.2,
        r: 130,
        severity: "warning",
        region: "Navsari, Valsad & The Dangs, Gujarat",
        exposure: 78,
      },
      {
        x: 55.2,
        y: 44.8,
        r: 120,
        severity: "warning",
        region: "Surajpur, Balrampur & Koriya, Chhattisgarh",
        exposure: 72,
      },
      {
        x: 37.8,
        y: 55.4,
        r: 120,
        severity: "warning",
        region: "Mumbai, Thane & Raigad, Maharashtra",
        exposure: 74,
      },
      {
        x: 38.2,
        y: 64.2,
        r: 100,
        severity: "warning",
        region: "Dakshina Kannada & Udupi, Karnataka",
        exposure: 58,
      },
    ],
    broadcast: [
      {
        title: "State Disaster Management Urban Waterlogging Alert",
        detail:
          "Dewatering pumps deployed at chronic flooding points across coastal and riverine towns",
        active: true,
      },
    ],
    stateGroups: [
      {
        state: "Gujarat",
        severity: "warning",
        exposure: 78,
        activeAlertsCount: 3,
        center: { x: 35.5, y: 46.2, lat: 20.95, lon: 72.93 },
        districts: [
          {
            name: "Navsari",
            state: "Gujarat",
            severity: "warning",
            exposure: 80,
            lat: 20.95,
            lon: 72.93,
            x: 35.5,
            y: 46.2,
            dangerSummary:
              "Purna river level rising near danger mark; low-lying agricultural flooding",
            evacuationPriority: "standby",
            bulletin: "District dewatering pumps mobilized; fishermen warned against high surf.",
            safeSheltersCount: 22,
          },
          {
            name: "Valsad",
            state: "Gujarat",
            severity: "warning",
            exposure: 76,
            lat: 20.61,
            lon: 72.93,
            x: 35.6,
            y: 47.5,
            dangerSummary: "Auranga river inundation alert; 140mm rainfall in 12 hours",
            evacuationPriority: "standby",
            bulletin: "Coastal hamlets placed on alert; emergency shelters equipped.",
            safeSheltersCount: 19,
          },
          {
            name: "The Dangs (Ahwa)",
            state: "Gujarat",
            severity: "warning",
            exposure: 68,
            lat: 20.76,
            lon: 73.68,
            x: 36.8,
            y: 46.8,
            dangerSummary: "Ghat road landslide surveillance active on Saputara hill corridor",
            evacuationPriority: "standby",
            bulletin: "Heavy transport vehicles diverted through safe plains bypass.",
            safeSheltersCount: 15,
          },
        ],
      },
      {
        state: "Chhattisgarh",
        severity: "warning",
        exposure: 72,
        activeAlertsCount: 3,
        center: { x: 55.2, y: 44.8, lat: 23.14, lon: 82.87 },
        districts: [
          {
            name: "Surajpur",
            state: "Chhattisgarh",
            severity: "warning",
            exposure: 74,
            lat: 23.14,
            lon: 82.87,
            x: 55.2,
            y: 44.8,
            dangerSummary: "Rihand river tributaries swelling; localized causeway submergence",
            evacuationPriority: "standby",
            bulletin: "Rural culverts barricaded; SDRF teams monitoring bridge markers.",
            safeSheltersCount: 16,
          },
          {
            name: "Balrampur",
            state: "Chhattisgarh",
            severity: "warning",
            exposure: 72,
            lat: 23.61,
            lon: 83.61,
            x: 56.4,
            y: 43.8,
            dangerSummary: "Kanhar river surge; flash runoff in hilly catchment streams",
            evacuationPriority: "standby",
            bulletin: "Village kotwars alerting low-lying riverside hamlets.",
            safeSheltersCount: 18,
          },
          {
            name: "Koriya (Baikunthpur)",
            state: "Chhattisgarh",
            severity: "warning",
            exposure: 65,
            lat: 23.27,
            lon: 82.55,
            x: 54.5,
            y: 44.5,
            dangerSummary: "Hasdeo river upper catchment saturation; coalfield runoff monitoring",
            evacuationPriority: "advisory",
            bulletin: "DEOC 1077 in active 24x7 monitoring mode.",
            safeSheltersCount: 14,
          },
        ],
      },
      {
        state: "Maharashtra",
        severity: "warning",
        exposure: 74,
        activeAlertsCount: 4,
        center: { x: 37.8, y: 55.4, lat: 19.07, lon: 72.87 },
        districts: [
          {
            name: "Mumbai & Suburbs",
            state: "Maharashtra",
            severity: "warning",
            exposure: 78,
            lat: 19.07,
            lon: 72.87,
            x: 37.8,
            y: 55.4,
            dangerSummary:
              "High-tide 4.45m coincide with 110mm rainfall; Hindmata & Milan subway inundation",
            evacuationPriority: "standby",
            bulletin: "Suburban train slow lines speed restricted; dewatering pumps mobilized.",
            safeSheltersCount: 28,
          },
          {
            name: "Thane & Raigad",
            state: "Maharashtra",
            severity: "warning",
            exposure: 70,
            lat: 19.21,
            lon: 72.97,
            x: 38.4,
            y: 54.8,
            dangerSummary: "Ghat road landslide surveillance active on Mumbai-Goa corridor",
            evacuationPriority: "standby",
            bulletin: "Heavy transport vehicles diverted through bypass routes.",
            safeSheltersCount: 19,
          },
        ],
      },
      {
        state: "Karnataka",
        severity: "warning",
        exposure: 58,
        activeAlertsCount: 2,
        center: { x: 38.2, y: 64.2, lat: 12.91, lon: 74.85 },
        districts: [
          {
            name: "Dakshina Kannada (Mangaluru)",
            state: "Karnataka",
            severity: "warning",
            exposure: 60,
            lat: 12.91,
            lon: 74.85,
            x: 38.2,
            y: 64.2,
            dangerSummary: "Netravati river rising; coastal squally winds 50 km/h",
            evacuationPriority: "standby",
            bulletin: "Fishermen advised not to venture into deep sea along Karnataka coast.",
            safeSheltersCount: 16,
          },
        ],
      },
    ],
    relocationHubs: [
      {
        name: "Navsari District Sports Complex Multi-Purpose Relief Shelter",
        type: "flood_relief_camp",
        state: "Gujarat",
        district: "Navsari",
        capacity: 2200,
        elevationMeters: 24,
        contactNumber: "+91-2637-259100",
        facilities: [
          "Emergency Kitchen",
          "Pure Drinking Water",
          "Medical First-Aid Post",
          "Standby Generator",
        ],
      },
      {
        name: "Valsad Coastal Community Safe Haven & Relief Hub",
        type: "flood_relief_camp",
        state: "Gujarat",
        district: "Valsad",
        capacity: 1800,
        elevationMeters: 21,
        contactNumber: "+91-2632-243200",
        facilities: ["Dewatering Pumps On-site", "Chlorine Tablets", "Infant Care Bay"],
      },
      {
        name: "Ahwa Tribal Residential Ashram School Relief Camp",
        type: "community_hall",
        state: "Gujarat",
        district: "The Dangs (Ahwa)",
        capacity: 1200,
        elevationMeters: 480,
        contactNumber: "+91-2631-220200",
        facilities: ["High-Elevation Safe Plinth", "Hot Food Supplies", "Emergency Medicine Depot"],
      },
      {
        name: "Surajpur Zilla Panchayat Community Multi-Purpose Hall",
        type: "flood_relief_camp",
        state: "Chhattisgarh",
        district: "Surajpur",
        capacity: 1600,
        elevationMeters: 340,
        contactNumber: "+91-7775-266100",
        facilities: ["24/7 Power Backup", "Clean Drinking Water", "SDRF Staging Desk"],
      },
      {
        name: "Balrampur Model Higher Secondary Emergency Safe Camp",
        type: "flood_relief_camp",
        state: "Chhattisgarh",
        district: "Balrampur",
        capacity: 1400,
        elevationMeters: 360,
        contactNumber: "+91-7831-273100",
        facilities: ["Reinforced Concrete Hall", "Dry Food Ration Stock", "First-Aid Attendant"],
      },
      {
        name: "BMC Dadar Flood Transit Safe Shelter",
        type: "flood_relief_camp",
        state: "Maharashtra",
        district: "Mumbai & Suburbs",
        capacity: 1800,
        elevationMeters: 14,
        contactNumber: "+91-22-24141100",
        facilities: ["Emergency Kitchen", "Dry Clothing Bundles", "Medical First Aid Post"],
      },
      {
        name: "Mangaluru Town Hall Coastal Relief Center",
        type: "flood_relief_camp",
        state: "Karnataka",
        district: "Dakshina Kannada (Mangaluru)",
        capacity: 1100,
        elevationMeters: 22,
        contactNumber: "+91-824-2220300",
        facilities: ["Drinking Water Tank", "SDRF Staging Point", "Power Generator"],
      },
    ],
    cards: [
      // PHASE 1: BEFORE
      {
        phase: "before",
        occupation: "civilian",
        severity: "warning",
        label: "Check High-Tide Timings & Avoid Basement Parking",
        action:
          "Check municipal high-tide schedule; move vehicles from low-lying basement parking lots to elevated ground.",
        details:
          "Keep umbrella, waterproof rain cover, and power banks charged in case of local train or municipal power delays.",
      },
      {
        phase: "before",
        occupation: "farmer",
        severity: "warning",
        label: "Clear Field Furrows & Secure Pump Motors",
        action:
          "Open field drainage furrows to prevent water stagnation in cash crops; elevate irrigation pump motors above high flood line.",
        details:
          "Store harvested grains and fertilizers in elevated dry storage rooms on wooden pallets.",
      },
      {
        phase: "before",
        occupation: "business",
        severity: "warning",
        label: "Clear Storm Drains & Elevate Shop Stock",
        action:
          "Clean shop-front stormwater grates; elevate ground-level retail merchandise and electrical strips at least 60 cm.",
        details: "Inspect basement sumps and test automatic submersible dewatering pumps.",
      },
      {
        phase: "before",
        occupation: "commuter",
        severity: "warning",
        label: "Check Transit Bulletins & Avoid Ghat Roads",
        action:
          "Monitor suburban railway and state highway traffic alerts before heading out; avoid ghat roads prone to mudslides.",
        details:
          "Ensure vehicle windshield wipers, defoggers, and tires have sufficient tread depth for wet braking.",
      },
      {
        phase: "before",
        occupation: "government",
        severity: "warning",
        label: "Deploy Dewatering Pumps & Clear Silt Traps",
        action:
          "Position high-capacity diesel dewatering pumps at chronic inundation spots and subways; clear all culvert silt traps.",
        details:
          "Place municipal quick-response monsoon teams on standby with tree-clearing equipment.",
      },

      // PHASE 2: DURING
      {
        phase: "during",
        occupation: "civilian",
        severity: "warning",
        label: "Avoid Waterlogged Subways & Open Manholes",
        action:
          "Never walk through murky waterlogged streets where uncovered manholes or dislodged drainage covers cannot be seen.",
        details:
          "Stay away from damp lampposts and electric junction boxes to prevent accidental electrocution.",
      },
      {
        phase: "during",
        occupation: "farmer",
        severity: "warning",
        label: "Monitor Farm Bunds & Avoid Lightning Exposure",
        action:
          "Inspect field bunds from safe vantage points; do not handle metal fencing or farm implements during active thunder spells.",
        details: "Keep livestock safely tethered in covered sheds with dry bedding.",
      },
      {
        phase: "during",
        occupation: "business",
        severity: "warning",
        label: "Isolate Damp Wiring & Sandbag Entryways",
        action:
          "Place sandbags or flood barriers at shop thresholds; switch off main electrical circuits if water begins seeping in.",
        details: "Allow employees to leave early ahead of coincident high-tide deluge hours.",
      },
      {
        phase: "during",
        occupation: "commuter",
        severity: "warning",
        label: "Drive With Low-Beams & Maintain Safe Distance",
        action:
          "Drive with low-beam headlights; double braking distance on slick roads and never attempt to cross submerged causeways.",
        details:
          "If vehicle engine stalls in water, do NOT try to restart it to avoid hydraulic engine lock (hydro-lock).",
      },
      {
        phase: "during",
        occupation: "government",
        severity: "warning",
        label: "Operate Flood Gates & Traffic Diversions",
        action:
          "Coordinate tidal floodgate operations with coastal high-tide timings; implement traffic diversions away from submerged subways.",
        details:
          "Maintain 24x7 helplines (1916 / 1077) for rapid localized civic distress response.",
      },

      // PHASE 3: AFTER
      {
        phase: "after",
        occupation: "civilian",
        severity: "safe",
        label: "Prevent Mosquito Breeding & Boil Drinking Water",
        action:
          "Drain accumulated water from coolers, flowerpots, and discarded containers to prevent dengue and malaria outbreaks.",
        details:
          "Boil water or use chlorine drops until municipal water pipelines are fully flushed.",
      },
      {
        phase: "after",
        occupation: "farmer",
        severity: "safe",
        label: "Field Drainage & Pest Surveillance",
        action:
          "Ensure excess water drains smoothly from crop root zones; inspect leaves for fungal blast, sheath blight, or stem borer pests.",
        details:
          "Apply recommended foliar nutrients once continuous rainfall subsides to restore vigorous growth.",
      },
      {
        phase: "after",
        occupation: "business",
        severity: "safe",
        label: "Sanitize Premises & Inspect Electricals",
        action:
          "Disinfect commercial premises and wash mud silt; have qualified electricians test circuits before power restoration.",
        details: "Check commercial insurance policies for rainwater inundation claim provisions.",
      },
      {
        phase: "after",
        occupation: "commuter",
        severity: "safe",
        label: "Check Brakes & Report Pothole Hazards",
        action:
          "Gently tap brakes to dry out wet brake rotors before resuming normal driving; report dangerous potholes to civic helpline.",
        details: "Wash vehicle undercarriage to remove corrosive mud and street debris.",
      },
      {
        phase: "after",
        occupation: "government",
        severity: "safe",
        label: "Anti-Larval Fogging & Pothole Road Repairs",
        action:
          "Conduct extensive anti-larval chemical spraying in stagnant water pockets; initiate cold-mix asphalt patch repairs on major roads.",
        details:
          "Survey damaged rural culverts and sanction immediate local infrastructure restoration funds.",
      },
    ],
  },
];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical (Red)",
  severe: "Severe (Orange)",
  warning: "Watch (Yellow)",
  safe: "Normal (Green)",
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
