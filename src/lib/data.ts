/**
 * Inventis Labs — content + demo data.
 *
 * Wave velocities and warning-time figures follow a crustal average of
 * Vp = 6.0 km/s, Vs = 3.5 km/s. Warning time is computed, not asserted:
 *   t_warn = d / Vs - d / Vp
 * Zone geometry on the network map is indicative, not survey-grade.
 */

export const COMPANY = {
  name: "Inventis Labs",
  tagline: "Earthquake early warning, built in India, for India.",
  hq: "Roorkee, Uttarakhand",
  incubatedAt: "CREATE Incubation Center, IIIT Lucknow",
  research: "Department of Earthquake Engineering, IIT Roorkee",
} as const;

export const PRODUCTS = [
  {
    code: "EQ-ALERT",
    name: "Regional & site-specific early warning",
    blurb:
      "A modular EEW kit — MEMS sensor nodes, sirens and control interfaces — for campuses, industrial clusters and smart cities.",
  },
  {
    code: "MARS",
    name: "Multi Function Alert & Response System",
    blurb:
      "Detection and response in one loop: sense, decide, actuate, log. The auto-trigger layer is what turns a warning into an outcome.",
  },
  {
    code: "SHM",
    name: "Always-on structural health monitoring",
    blurb:
      "Continuous vibration, strain, tilt and displacement tracking on bridges, high-rises, dams and industrial foundations — with ML models that flag degradation long before damage is visible.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Wave physics                                                        */
/* ------------------------------------------------------------------ */

export const VP = 6.0; // km/s
export const VS = 3.5; // km/s

/** Warning time in seconds for a given source distance. */
export function warningTime(distanceKm: number) {
  return distanceKm / VS - distanceKm / VP;
}

/** Arrival times of the P and S fronts, in seconds. */
export function arrivalTimes(distanceKm: number) {
  return { p: distanceKm / VP, s: distanceKm / VS };
}

/** Energy ratio for one unit of magnitude: 10^(1.5 * ΔM). */
export const ENERGY_PER_MAGNITUDE = Math.pow(10, 1.5); // ≈ 31.6×
export const AMPLITUDE_PER_MAGNITUDE = 10; // ≈ 10×

/* ------------------------------------------------------------------ */
/* Warning-time ladder — the core chart of the story                  */
/* ------------------------------------------------------------------ */

export const DISTANCES = [25, 50, 100, 150, 200, 300, 400, 600, 800, 1200];

/** Human-meaningful consequence of each warning budget. */
export const WARNING_LADDER = [
  {
    d: 25,
    act: "Get under a table.",
    detail:
      "Onsite protection only. Enough time to drop, cover and hold — not enough to leave a building.",
  },
  {
    d: 100,
    act: "Drop, cover, hold. Stop the machine.",
    detail:
      "The first distance where both human response and machine shutdown are realistic.",
  },
  {
    d: 200,
    act: "Evacuate, isolate, shut down.",
    detail:
      "Gas lines close, elevators floor, process trains stop. The full automatic response ladder engages.",
  },
  {
    d: 400,
    act: "Stand down from the site.",
    detail:
      "Full evacuation with margin. This is the distance regional networks are designed around.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Story chapters                                                      */
/* ------------------------------------------------------------------ */

export type StoryChapter = {
  index: string;
  kicker: string;
  title: string;
  body: string;
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    index: "01",
    kicker: "The rupture",
    title: "It starts underground, where no one is looking.",
    body: "A fault slips. The rock either side of it moves, and a huge amount of stored strain energy becomes elastic waves. That is the earthquake. Everything after this point is a race between two waves travelling through rock, and the people who built sensors to notice them.",
  },
  {
    index: "02",
    kicker: "Two waves",
    title: "The first one is harmless. The second one is not.",
    body: "The Primary wave compresses and rarefies the rock as it goes — fast, roughly 6 km/s. The Secondary wave shears it side to side — slower, roughly 3.5 km/s, and vastly more destructive. P gets there first. S gets there angry. The entire premise of early warning is that the gap between those two arrivals is time you can spend.",
  },
  {
    index: "03",
    kicker: "The sensor",
    title: "A ₹-scale MEMS node hears the quiet one.",
    body: "Tri-axial MEMS accelerometers — silicon, not seismograph — are rugged, cheap and good enough to resolve a P arrival at regional distances. Each node filters its own signal at the edge, which means the decision is made on site, not on a server three time zones away.",
  },
  {
    index: "04",
    kicker: "The estimate",
    title: "Magnitude, location, depth — in under a second.",
    body: "From the time difference between P and S at each node, the server triangulates origin and magnitude. This is the step most systems get wrong: a bus braking, a construction pile driver or a quarry blast also shakes the ground. Edge AI classifiers exist to reject the false positives so the network does not cry wolf — because a network nobody trusts is a network nobody acts on.",
  },
  {
    index: "05",
    kicker: "The gap",
    title: "This is all the time you actually get.",
    body: "Warning time is simply distance divided by the difference between the two speeds. It is not a design decision — it is arithmetic. The chart below is the honest budget for a source at each distance, computed at 6.0 and 3.5 km/s.",
  },
  {
    index: "06",
    kicker: "The siren",
    title: "A warning nobody receives is only a log entry.",
    body: "Dissemination is the half of the problem that is not seismology. Sirens on rooftops, phones in pockets, control-room screens, and hardwired interlocks into plant equipment. The last one is the only one that works when the building is already moving.",
  },
  {
    index: "07",
    kicker: "The action",
    title: "Drop. Isolate. Floor. Stop.",
    body: "The response ladder is a fixed sequence, and it runs on the clock rather than on judgement: elevators to the nearest floor and open, gas valves closed, process trains tripped, sirens sounding, screens showing the countdown. Everything on that list is a thing a machine can do better and faster than a person under adrenaline.",
  },
  {
    index: "08",
    kicker: "The network",
    title: "One sensor proves nothing. A network is a system.",
    body: "India sits on one of the most active seismic belts on the planet. Uttarakhand already runs a 170-sensor state network developed at IIT Roorkee. The next problem is not detection — it is coverage of the Central Himalayan gap, and interoperation across state systems that were built separately.",
  },
  {
    index: "09",
    kicker: "The cost",
    title: "The LED moment.",
    body: "Swapping one lightbulb for an LED does not change the grid. Swapping every one does. Seismic safety works the same way: a single early warning system protects one campus. A connected regional layer protects the industrial corridor, the hospital, the school and the city — and it is the layer that has never been funded at scale.",
  },
];

/* ------------------------------------------------------------------ */
/* Network — real coordinates, projected in the map component          */
/* ------------------------------------------------------------------ */

export type Node = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: "live" | "degraded" | "offline";
  depth: string;
  lastSeen: string;
};

export const SENSOR_NODES: Node[] = [
  { id: "RK-01", name: "Roorkee Core", lat: 29.85, lon: 77.89, status: "live", depth: "0 m", lastSeen: "0.4 s" },
  { id: "DD-02", name: "Dehradun", lat: 30.32, lon: 78.03, status: "live", depth: "12 m", lastSeen: "0.5 s" },
  { id: "HW-03", name: "Haridwar", lat: 29.95, lon: 78.16, status: "live", depth: "8 m", lastSeen: "0.6 s" },
  { id: "JS-04", name: "Joshimath", lat: 30.56, lon: 79.56, status: "live", depth: "6 m", lastSeen: "0.5 s" },
  { id: "MO-05", name: "Mori", lat: 31.02, lon: 78.04, status: "degraded", depth: "10 m", lastSeen: "3.1 s" },
  { id: "CM-06", name: "Chamoli", lat: 30.4, lon: 79.33, status: "live", depth: "7 m", lastSeen: "0.5 s" },
  { id: "RP-07", name: "Rudraprayag", lat: 30.53, lon: 78.75, status: "live", depth: "5 m", lastSeen: "0.4 s" },
  { id: "PR-08", name: "Pauri", lat: 30.13, lon: 78.74, status: "live", depth: "9 m", lastSeen: "0.7 s" },
  { id: "TH-09", name: "Tehri", lat: 30.55, lon: 78.48, status: "live", depth: "4 m", lastSeen: "0.5 s" },
  { id: "UK-10", name: "Uttarkashi", lat: 31.09, lon: 78.32, status: "live", depth: "11 m", lastSeen: "0.6 s" },
  { id: "BG-11", name: "Bageshwar", lat: 29.83, lon: 80.11, status: "live", depth: "14 m", lastSeen: "0.8 s" },
  { id: "PT-12", name: "Pithoragarh", lat: 29.58, lon: 80.19, status: "live", depth: "16 m", lastSeen: "0.8 s" },
  { id: "CH-13", name: "Champawat", lat: 29.52, lon: 80.36, status: "live", depth: "13 m", lastSeen: "0.9 s" },
  { id: "NL-14", name: "Nainital", lat: 29.38, lon: 79.45, status: "live", depth: "18 m", lastSeen: "0.7 s" },
  { id: "BL-15", name: "Bareilly", lat: 28.37, lon: 79.43, status: "offline", depth: "22 m", lastSeen: "18 m" },
  { id: "DD-16", name: "New Delhi", lat: 28.61, lon: 77.21, status: "live", depth: "20 m", lastSeen: "0.6 s" },
  { id: "CB-17", name: "Chandigarh", lat: 30.73, lon: 76.78, status: "live", depth: "19 m", lastSeen: "0.6 s" },
  { id: "AM-18", name: "Ambala", lat: 30.38, lon: 76.78, status: "live", depth: "17 m", lastSeen: "0.6 s" },
  { id: "KG-19", name: "Kangra", lat: 32.06, lon: 76.27, status: "live", depth: "15 m", lastSeen: "0.7 s" },
  { id: "JM-20", name: "Jammu", lat: 32.73, lon: 74.87, status: "live", depth: "23 m", lastSeen: "0.9 s" },
  { id: "SK-21", name: "Srinagar", lat: 34.08, lon: 74.8, status: "degraded", depth: "26 m", lastSeen: "2.4 s" },
  { id: "LH-22", name: "Leh", lat: 34.15, lon: 77.58, status: "live", depth: "21 m", lastSeen: "1.1 s" },
  { id: "AG-23", name: "Agra", lat: 27.17, lon: 78.01, status: "live", depth: "28 m", lastSeen: "0.7 s" },
  { id: "LU-24", name: "Lucknow", lat: 26.85, lon: 80.95, status: "live", depth: "31 m", lastSeen: "0.9 s" },
  { id: "KP-25", name: "Kanpur", lat: 26.45, lon: 80.33, status: "live", depth: "29 m", lastSeen: "0.8 s" },
  { id: "JN-26", name: "Jaipur", lat: 26.91, lon: 75.79, status: "degraded", depth: "34 m", lastSeen: "4.2 s" },
  { id: "PR2-27", name: "Prayagraj", lat: 25.44, lon: 81.85, status: "live", depth: "30 m", lastSeen: "0.9 s" },
  { id: "VS-28", name: "Varanasi", lat: 25.32, lon: 82.97, status: "live", depth: "33 m", lastSeen: "1.0 s" },
  { id: "PT3-29", name: "Patna", lat: 25.59, lon: 85.14, status: "offline", depth: "38 m", lastSeen: "41 m" },
  { id: "DG-30", name: "Deoghar", lat: 24.48, lon: 86.69, status: "live", depth: "35 m", lastSeen: "1.2 s" },
  { id: "IN-31", name: "Indore", lat: 22.72, lon: 75.86, status: "live", depth: "40 m", lastSeen: "1.1 s" },
  { id: "BP-32", name: "Bhopal", lat: 23.26, lon: 77.41, status: "live", depth: "42 m", lastSeen: "1.1 s" },
  { id: "JB-33", name: "Jabalpur", lat: 23.18, lon: 79.99, status: "live", depth: "44 m", lastSeen: "1.3 s" },
  { id: "NG-34", name: "Nagpur", lat: 21.15, lon: 79.09, status: "live", depth: "48 m", lastSeen: "1.4 s" },
  { id: "IT-35", name: "Itanagar", lat: 27.1, lon: 93.62, status: "degraded", depth: "36 m", lastSeen: "5.6 s" },
  { id: "GA-36", name: "Guwahati", lat: 26.14, lon: 91.73, status: "live", depth: "39 m", lastSeen: "1.5 s" },
];

export const HIMALAYAN_ARC: [number, number][] = [
  [74.2, 34.6],
  [75.4, 34.1],
  [76.3, 33.4],
  [77.1, 32.7],
  [78.2, 31.7],
  [79.3, 30.8],
  [80.5, 30.3],
  [81.8, 30.1],
  [83.2, 29.7],
  [84.7, 29.3],
  [86.1, 28.6],
  [87.4, 27.9],
  [88.7, 27.3],
  [90.2, 26.9],
  [91.8, 26.6],
  [93.4, 26.9],
  [95.2, 27.6],
];

/** The unfractured Central Himalayan segment — indicative extents. */
export const CENTRAL_GAP: [number, number][] = [
  [79.3, 30.8],
  [80.5, 30.3],
  [81.8, 30.1],
  [83.2, 29.7],
  [84.7, 29.3],
];

export const NEPAL_FRONT: [number, number][] = [
  [80.4, 30.3],
  [81.4, 29.6],
  [82.4, 29.0],
  [83.3, 28.6],
  [84.2, 28.2],
  [85.2, 27.8],
];

/* ------------------------------------------------------------------ */
/* Structural health assets                                            */
/* ------------------------------------------------------------------ */

export type Asset = {
  name: string;
  kind: string;
  metric: string;
  value: string;
  trend: "flat" | "up" | "down";
  status: "nominal" | "watch" | "alert";
  detail: string;
};

export const ASSETS: Asset[] = [
  {
    name: "Tehri Dam — Crest Array",
    kind: "Dam",
    metric: "Peak base acceleration",
    value: "0.041 g",
    trend: "flat",
    status: "nominal",
    detail: "24 channels · 200 Hz · crest uplift within seasonal band",
  },
  {
    name: "Lakhanpur Viaduct S-4",
    kind: "Bridge",
    metric: "Span natural frequency",
    value: "2.84 Hz",
    trend: "down",
    status: "watch",
    detail: "Drift −4% over 90 days — fatigue progression, inspect at next closure",
  },
  {
    name: "Unit-4 Refinery Stack",
    kind: "Industrial",
    metric: "Cyclic load count",
    value: "1.42 M",
    trend: "up",
    status: "nominal",
    detail: "Base acceleration trace nominal · C1/C2 interlocks armed",
  },
  {
    name: "Sector 42 Tower B",
    kind: "High-rise",
    metric: "Crest tilt",
    value: "11.4 mm",
    trend: "flat",
    status: "nominal",
    detail: "Settlement stable across 3 seasons · tilt sensor pair agreeing",
  },
  {
    name: "Nainital Hospital Block C",
    kind: "Critical",
    metric: "Shear demand ratio",
    value: "0.38",
    trend: "up",
    status: "alert",
    detail: "Response spectrum exceeded design basis at MCE — retrofit scope open",
  },
];

/* ------------------------------------------------------------------ */
/* Response ladder                                                     */
/* ------------------------------------------------------------------ */

export const RESPONSE_LADDER = [
  { t: "T+0.0 s", actor: "Sensor network", act: "P-wave picked on nearest nodes", channel: "edge" },
  { t: "T+0.6 s", actor: "EEW server", act: "Magnitude, epicentre, depth estimated", channel: "core" },
  { t: "T+1.4 s", actor: "Sirens + phones", act: "Public warning issued district-wide", channel: "radio" },
  { t: "T+1.9 s", actor: "Elevator controller", act: "Car recalled to nearest floor, doors opened", channel: "hardwire" },
  { t: "T+2.3 s", actor: "Gas safety system", act: "Main valves closed, leak detectors armed", channel: "hardwire" },
  { t: "T+2.7 s", actor: "Plant PLC", act: "Process trains tripped, reactors scrammed", channel: "hardwire" },
  { t: "T+S", actor: "Structure", act: "Strong motion arrives", channel: "—" },
];

export const INDIA_FACTS = [
  { value: "550", unit: "km", label: "Unfractured length of the Central Himalayan seismic gap — the largest concentration of unspent seismic energy in India." },
  { value: "170", unit: "sensors", label: "State EEWS already operational in Uttarakhand, engineered at IIT Roorkee." },
  { value: "6.0", unit: "km/s", label: "Speed of the Primary wave. The only reason a warning is possible at all." },
  { value: "2.5", unit: "km/s", label: "The difference between P and S. Divide distance by it and you have your warning time." },
];
/* ------------------------------------------------------------------ */
/* Cities — for the playground                                         */
/* ------------------------------------------------------------------ */

/** ISRO seismic zones, per the national hazard map. */
export type City = {
  name: string;
  lat: number;
  lon: number;
  zone: "II" | "III" | "IV" | "V";
};

export const CITIES: City[] = [
  { name: "Leh", lat: 34.15, lon: 77.58, zone: "V" },
  { name: "Srinagar", lat: 34.08, lon: 74.8, zone: "V" },
  { name: "Guwahati", lat: 26.14, lon: 91.73, zone: "V" },
  { name: "Dehradun", lat: 30.32, lon: 78.03, zone: "IV" },
  { name: "Roorkee", lat: 29.85, lon: 77.89, zone: "IV" },
  { name: "Delhi", lat: 28.61, lon: 77.21, zone: "IV" },
  { name: "Lucknow", lat: 26.85, lon: 80.95, zone: "III" },
  { name: "Kolkata", lat: 22.57, lon: 88.36, zone: "III" },
  { name: "Ahmedabad", lat: 23.02, lon: 72.57, zone: "III" },
  { name: "Nagpur", lat: 21.15, lon: 79.09, zone: "III" },
  { name: "Mumbai", lat: 19.08, lon: 72.88, zone: "III" },
  { name: "Hyderabad", lat: 17.39, lon: 78.49, zone: "III" },
  { name: "Bengaluru", lat: 12.97, lon: 77.59, zone: "III" },
  { name: "Chennai", lat: 13.08, lon: 80.27, zone: "II" },
];

export const ZONE_NOTE: Record<City["zone"], string> = {
  II: "lowest hazard on the national map",
  III: "moderate — designed for shaking that can cause damage",
  IV: "high — design for severe shaking",
  V: "severe — the core of the Himalayan belt",
};
