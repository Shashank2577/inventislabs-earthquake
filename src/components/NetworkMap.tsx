"use client";

import { useMemo } from "react";
import {
  CENTRAL_GAP,
  HIMALAYAN_ARC,
  NEPAL_FRONT,
  SENSOR_NODES,
  type Node,
} from "@/lib/data";

/* Equirectangular projection over India. Deliberately simple — the map is a
   locator, not a survey instrument. */
const LON0 = 67;
const LON1 = 98.5;
const LAT0 = 7;
const LAT1 = 38.2;

const px = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * 1000;
const py = (lat: number) => ((LAT1 - lat) / (LAT1 - LAT0)) * 1000;
const project = ([lon, lat]: [number, number]) =>
  `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`;

/* India outline: Natural Earth 1:50m admin-0, simplified with
   Douglas-Peucker at 0.1°. Real geometry, aggressively generalised. */
export const INDIA_OUTLINE: [number, number][] = [
  [68.165, 23.8573], [68.3812, 23.9509], [68.7241, 23.9647], [68.7281, 24.2656], [68.7812, 24.3137],
  [68.8283, 24.264], [69.5592, 24.2731], [69.8052, 24.1652], [70.0211, 24.1916], [70.0982, 24.2875],
  [70.4893, 24.4122], [70.5468, 24.4183], [70.5793, 24.2791], [70.7163, 24.238], [71.044, 24.4001],
  [70.9698, 24.5719], [71.0479, 24.6877], [70.6521, 25.4229], [70.6484, 25.6669], [70.2646, 25.7065],
  [70.1002, 25.9101], [70.0777, 26.072], [70.1477, 26.5064], [70.0594, 26.5788], [69.7359, 26.6271],
  [69.5069, 26.7427], [69.47, 26.8044], [69.537, 27.1229], [69.8963, 27.4736], [70.1445, 27.849],
  [70.4037, 28.025], [70.6291, 27.9375], [70.6916, 27.769], [70.7979, 27.7096], [71.8703, 27.9625],
  [71.948, 28.1773], [72.1285, 28.3463], [72.3419, 28.7519], [72.9033, 29.0288], [73.2312, 29.5506],
  [73.3816, 29.9344], [73.8092, 30.0934], [73.9334, 30.2221], [73.8993, 30.4354], [74.3394, 30.8936],
  [74.6328, 31.0347], [74.5177, 31.1856], [74.5939, 31.4654], [74.51, 31.7129], [74.5556, 31.8186],
  [75.3247, 32.2153], [75.3335, 32.2792], [75.2337, 32.3721], [74.6857, 32.4938], [74.6633, 32.7577],
  [74.3546, 32.7687], [74.3055, 32.8104], [74.3036, 32.9918], [74.0038, 33.1895], [74.15, 33.507],
  [73.9765, 33.7213], [74.001, 33.7882], [74.2509, 33.9461], [74.2465, 33.9902], [73.9499, 34.0188],
  [73.9041, 34.0757], [73.9724, 34.2366], [73.7945, 34.3782], [73.9612, 34.6535], [74.3004, 34.7654],
  [75.1875, 34.639], [75.7092, 34.5031], [76.041, 34.6699], [76.4567, 34.7561], [76.5944, 34.7358],
  [76.7829, 34.9002], [77.0009, 34.992], [77.0486, 35.1099], [77.7994, 35.4959], [77.8949, 35.449],
  [78.0427, 35.4798], [78.0122, 35.251], [78.327, 34.6064], [78.6708, 34.5182], [78.9701, 34.3026],
  [78.9706, 34.2282], [78.753, 34.0877], [78.7267, 34.0134], [78.8019, 33.4997], [79.1352, 33.1719],
  [79.1028, 33.0525], [79.2022, 32.946], [79.2193, 32.5011], [79.067, 32.3882], [78.9189, 32.3582],
  [78.7009, 32.597], [78.3896, 32.5199], [78.4959, 32.2158], [78.7354, 31.958], [78.6935, 31.7404],
  [78.8029, 31.6181], [78.7268, 31.4718], [78.7436, 31.3238], [78.9739, 31.3286], [79.0111, 31.4141],
  [79.1071, 31.4026], [79.3388, 31.1057], [79.4932, 30.9937], [79.5654, 30.9491], [79.7946, 30.9683],
  [80.0814, 30.7819], [80.1494, 30.7898], [80.1943, 30.7592], [80.1912, 30.5684], [80.6821, 30.4148],
  [80.9854, 30.2371], [81.0103, 30.1645], [80.8481, 30.1397], [80.4019, 29.7303], [80.2549, 29.4233],
  [80.233, 29.1946], [80.0846, 28.9942], [80.0707, 28.8302], [80.4186, 28.612], [80.587, 28.6496],
  [81.1689, 28.335], [81.3108, 28.1764], [81.8526, 27.8671], [81.9877, 27.9138], [82.4514, 27.6718],
  [82.6773, 27.6734], [82.7334, 27.519], [83.2897, 27.371], [83.4472, 27.4653], [83.8288, 27.3778],
  [84.091, 27.4914], [84.6102, 27.2987], [84.6854, 27.041], [85.1254, 26.861], [85.2402, 26.7503],
  [85.5685, 26.8398], [85.6999, 26.7816], [85.7945, 26.6042], [86.0073, 26.6494], [86.7014, 26.4351],
  [87.0164, 26.5554], [87.0896, 26.4332], [87.2874, 26.3603], [87.4136, 26.4229], [87.8492, 26.4369],
  [87.9951, 26.3824], [88.1615, 26.7248], [87.9844, 27.1339], [88.147, 27.7492], [88.0989, 27.9045],
  [88.1411, 27.9489], [88.5779, 28.0934], [88.8037, 28.0069], [88.8488, 27.8687], [88.749, 27.5219],
  [88.7648, 27.4299], [88.8914, 27.3161], [88.7388, 27.1756], [88.8576, 26.9615], [89.1482, 26.8162],
  [89.3321, 26.8486], [89.7639, 26.7016], [90.1229, 26.7546], [90.2061, 26.8475], [90.3459, 26.8903],
  [90.7396, 26.7717], [91.2865, 26.7899], [91.4268, 26.8671], [91.6716, 26.802], [91.9983, 26.855],
  [92.0734, 26.9148], [91.9923, 27.0999], [92.0834, 27.2906], [91.9908, 27.4502], [91.7431, 27.4425],
  [91.5947, 27.5577], [91.6319, 27.76], [91.9776, 27.7304], [92.1013, 27.8076], [92.5467, 27.8792],
  [92.6878, 27.989], [92.6435, 28.0615], [92.7019, 28.1471], [93.035, 28.3276], [93.252, 28.6295],
  [93.7607, 28.7298], [93.9736, 28.8608], [94.0177, 28.9595], [94.623, 29.3124], [94.7694, 29.1759],
  [95.3893, 29.0374], [95.5158, 29.2063], [96.0354, 29.4472], [96.235, 29.2458], [96.3559, 29.2491],
  [96.1224, 29.0821], [96.1371, 28.9226], [96.4357, 29.0507], [96.5809, 28.7637], [96.3956, 28.6065],
  [96.2814, 28.4121], [96.3891, 28.3679], [96.6026, 28.4599], [96.7758, 28.367], [97.0754, 28.3689],
  [97.3225, 28.218], [97.3352, 27.9377], [96.9628, 27.6983], [96.8769, 27.5867], [96.902, 27.4396],
  [97.1021, 27.1154], [96.9534, 27.1333], [96.7316, 27.3315], [96.1908, 27.2613], [96.0614, 27.2171],
  [95.9053, 27.0466], [95.4639, 26.7561], [95.1287, 26.5973], [95.0509, 26.3473], [95.1324, 26.0413],
  [95.0152, 25.9129], [94.9457, 25.7002], [94.5799, 25.3198], [94.553, 25.2157], [94.6753, 25.1386],
  [94.7076, 25.0487], [94.2931, 24.3219], [94.1276, 23.8765], [93.6834, 24.0065], [93.4938, 23.9729],
  [93.3263, 24.0642], [93.4149, 23.6821], [93.366, 23.1325], [93.308, 23.0304], [93.1642, 23.032],
  [93.0787, 22.7182], [93.1512, 22.2306], [93.043, 22.184], [92.9646, 22.0038], [92.9095, 21.9889],
  [92.721, 22.1324], [92.5749, 21.9781], [92.4914, 22.6854], [92.3616, 22.929], [92.2461, 23.6836],
  [92.1523, 23.7219], [91.9296, 23.686], [91.9379, 23.5047], [91.7542, 23.2873], [91.751, 23.0535],
  [91.6195, 22.9797], [91.5112, 23.0337], [91.4362, 23.1999], [91.3706, 23.198], [91.3687, 23.0746],
  [91.3152, 23.1044], [91.1655, 23.5811], [91.232, 23.9205], [91.3671, 24.0935], [91.5264, 24.0908],
  [91.7266, 24.2051], [91.877, 24.1953], [91.9517, 24.3567], [92.102, 24.4081], [92.2283, 24.8813],
  [92.4432, 24.8494], [92.4684, 24.9441], [92.0497, 25.1695], [90.4394, 25.1577], [89.8333, 25.2928],
  [89.7963, 25.3758], [89.8229, 25.9414], [89.6709, 26.2138], [89.5857, 26.186], [89.5499, 26.0053],
  [89.3697, 26.0061], [89.1864, 26.106], [89.0187, 26.4103], [88.9241, 26.3751], [88.9704, 26.2509],
  [88.828, 26.2522], [88.6828, 26.2917], [88.6201, 26.4307], [88.3699, 26.5641], [88.3515, 26.4826],
  [88.4367, 26.4371], [88.4404, 26.3695], [88.1508, 26.0872], [88.0846, 25.8882], [88.5024, 25.537],
  [88.7691, 25.4905], [88.8203, 25.3655], [88.9517, 25.2593], [88.8173, 25.1762], [88.4562, 25.1884],
  [88.3134, 24.8818], [88.1498, 24.9146], [88.0234, 24.6278], [88.1455, 24.4858], [88.2871, 24.4797],
  [88.397, 24.3893], [88.7235, 24.2749], [88.6998, 24.0025], [88.5674, 23.6744], [88.7408, 23.4366],
  [88.7244, 23.255], [88.9281, 23.1866], [88.8506, 23.0405], [88.9207, 22.632], [89.05, 22.2746],
  [89.0279, 21.9372], [88.9493, 21.9379], [89.0517, 21.6541], [88.9074, 21.6531], [88.8575, 21.7447],
  [88.745, 21.5844], [88.6912, 21.7335], [88.7402, 22.0054], [88.6416, 22.122], [88.5668, 21.8321],
  [88.5847, 21.6597], [88.446, 21.6143], [88.2875, 21.7582], [88.2537, 21.6223], [88.1221, 21.6358],
  [88.0568, 21.6941], [88.1963, 22.1396], [87.9944, 22.2657], [87.9414, 22.3743], [87.9616, 22.255],
  [88.1593, 22.1217], [87.9484, 21.8254], [87.6782, 21.6535], [87.1007, 21.5008], [86.8596, 21.2367],
  [86.8423, 21.1063], [86.9755, 20.7001], [86.7625, 20.4191], [86.7504, 20.3132], [86.4987, 20.1716],
  [86.3766, 20.0067], [86.2452, 20.053], [86.3119, 19.9878], [86.2162, 19.8958], [85.575, 19.6929],
  [85.4969, 19.6969], [85.5598, 19.7535], [85.5551, 19.8669], [85.5041, 19.8877], [85.2486, 19.7577],
  [85.1808, 19.5949], [85.3709, 19.6789], [85.4416, 19.6266], [84.771, 19.1254], [84.6908, 18.9647],
  [84.1041, 18.2927], [83.6543, 18.0699], [83.1983, 17.609], [82.3596, 17.0962], [82.2819, 16.9361],
  [82.3598, 16.7828], [82.2588, 16.5599], [81.7619, 16.3295], [81.2861, 16.3371], [81.1321, 15.9618],
  [80.9787, 15.7584], [80.826, 15.7659], [80.7818, 15.8673], [80.6466, 15.895], [80.2935, 15.7107],
  [80.1011, 15.3236], [80.0534, 15.074], [80.1787, 14.4783], [80.1117, 14.2122], [80.3065, 13.4851],
  [80.1562, 13.7138], [80.0621, 13.6062], [80.3424, 13.3613], [80.2291, 12.6903], [80.1431, 12.452],
  [79.8585, 11.9888], [79.7541, 11.5753], [79.7934, 11.4467], [79.6932, 11.3125], [79.799, 11.3387],
  [79.8486, 11.1969], [79.8382, 10.3226], [79.5316, 10.3296], [79.3146, 10.2567], [79.2536, 10.1748],
  [79.2578, 10.0352], [78.9399, 9.5658], [78.9191, 9.4529], [79.0199, 9.3333], [79.2755, 9.2846],
  [79.4114, 9.1924], [78.9796, 9.2686], [78.4215, 9.105], [78.1925, 8.8909], [78.0602, 8.3846],
  [77.5176, 8.0783], [77.3015, 8.1453], [77.0659, 8.3159], [76.5534, 8.9028], [76.3246, 9.4521],
  [76.2424, 9.9271], [76.3431, 9.8273], [76.3756, 9.5399], [76.4588, 9.5362], [76.3465, 9.9221],
  [76.1956, 10.0861], [76.2015, 10.2006], [75.9226, 10.7841], [75.7238, 11.3618], [75.5245, 11.7031],
  [75.1967, 12.0575], [74.9455, 12.5646], [74.7705, 13.0773], [74.6709, 13.6676], [74.4985, 14.0463],
  [74.3822, 14.4947], [73.9492, 15.0748], [73.8843, 15.3064], [73.8008, 15.397], [73.9319, 15.397],
  [73.7718, 15.573], [73.8328, 15.6594], [73.6799, 15.7089], [73.4761, 16.0542], [73.3376, 16.4599],
  [73.1561, 17.6219], [72.8755, 18.6428], [73.0056, 19.0211], [72.9721, 19.1533], [72.8347, 18.9756],
  [72.803, 19.0793], [72.8116, 19.2989], [72.9872, 19.2774], [72.7879, 19.363], [72.7564, 19.4505],
  [72.7994, 19.5198], [72.7266, 19.5783], [72.6678, 19.831], [72.8937, 20.6728], [72.8139, 21.1172],
  [72.6924, 21.1776], [72.6238, 21.372], [72.7348, 21.4708], [72.6133, 21.4618], [72.8105, 21.6199],
  [73.1125, 21.7504], [72.8397, 21.6873], [72.5431, 21.6966], [72.5925, 21.8776], [72.7002, 21.9719],
  [72.5223, 21.9762], [72.553, 22.16], [72.8092, 22.2333], [72.1828, 22.2697], [72.3064, 22.1892],
  [72.2744, 22.0897], [72.0372, 21.823], [72.2104, 21.7282], [72.254, 21.531], [72.0152, 21.1557],
  [71.0246, 20.7389], [70.7193, 20.7404], [70.1273, 21.0947], [69.1917, 21.9915], [68.9699, 22.2903],
  [69.0517, 22.4373], [69.2766, 22.2855], [70.1772, 22.5728], [70.4404, 22.9703], [70.5135, 23.0025],
  [70.4893, 23.0895], [70.3395, 22.9397], [70.1183, 22.947], [69.6646, 22.7591], [69.2359, 22.8485],
  [68.6407, 23.1899], [68.4175, 23.5715], [68.7768, 23.8521], [68.4969, 23.748], [68.3434, 23.6168],
  [68.235, 23.597], [68.192, 23.7289],
];


/**
 * Kashmir as India claims it. Natural Earth's admin-0 split the region three
 * ways, so the northern extension is restored here as two polygons that are
 * filled with the same landmass colour and drawn without a stroke — the three
 * shapes read as one continuous outline, with no internal boundary line.
 *
 *   KASHMIR_NW — Gilgit-Baltistan + Azad Kashmir, Pakistan-administered
 *   KASHMIR_NE — Aksai Chin, China-administered
 *
 * Coordinates are hand-traced and generalised for display, not survey-grade.
 */
const KASHMIR_NW: [number, number][] = [
  [74.05, 33.0], [74.4, 33.35], [74.22, 33.8], [74.7, 34.3], [75.0, 34.9],
  [75.6, 35.4], [76.2, 35.9], [76.8, 36.3], [77.2, 35.9], [77.4, 35.3],
  [78.0, 34.7], [77.6, 34.2], [77.0, 33.7], [76.5, 33.4], [76.0, 32.9],
  [75.3, 32.7], [74.6, 32.7], [74.2, 32.8],
];

const KASHMIR_NE: [number, number][] = [
  [78.05, 34.7], [78.8, 35.0], [79.4, 35.2], [80.0, 35.4], [80.4, 35.3],
  [80.3, 34.9], [79.9, 34.5], [79.3, 34.2], [78.7, 33.9], [78.2, 34.0],
  [77.9, 34.4],
];

const CRIMSON = "var(--sw)";

const STATUS_COLOR: Record<Node["status"], string> = {
  live: "var(--accent)",
  degraded: "var(--pw)",
  offline: "var(--ink-3)",
};

/** Nodes worth naming, with the side the label sits on. Fewer, clearer. */
const LABELLED: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  "RK-01": { dx: 14, dy: 20, anchor: "start" },
  "DD-16": { dx: -14, dy: 5, anchor: "end" },
  "JS-04": { dx: 10, dy: -18, anchor: "start" },
  "LH-22": { dx: 13, dy: -7, anchor: "start" },
  "NG-34": { dx: 13, dy: 5, anchor: "start" },
};

export type Origin = {
  lat: number;
  lon: number;
  /** Wavefront radii in km. 0 hides the front. */
  pKm: number;
  sKm: number;
};

export type CityPin = {
  name: string;
  lat: number;
  lon: number;
  active?: boolean;
  station?: boolean;
};

/** Dehradun and Roorkee sit ~15 units apart on this projection; without
    these their labels stack on top of each other. */
const CITY_LABEL_OFFSET: Record<string, number> = {
  Dehradun: -14,
  Roorkee: 22,
  Srinagar: 22,
  Leh: -14,
  Kolkata: 22,
  Nagpur: 22,
};

type NetworkMapProps = {
  nodes?: Node[];
  selectedId?: string | null;
  onSelect?: (node: Node) => void;
  origin?: Origin | null;
  /** Draws the tectonic front lines. Turn off for a clean locator view. */
  showTectonics?: boolean;
  /** Lets the user drop an epicentre anywhere on the map. */
  interactive?: boolean;
  onPick?: (p: { lat: number; lon: number }) => void;
  /** Free crosshair, for the playground's chosen epicentre. */
  picked?: { lat: number; lon: number } | null;
  cities?: CityPin[];
  onCity?: (name: string) => void;
  className?: string;
};

/** Inverse of the projection, for turning a click into lat/lon. */
function unproject(x: number, y: number) {
  return {
    lon: LON0 + (x / 1000) * (LON1 - LON0),
    lat: LAT1 - (y / 1000) * (LAT1 - LAT0),
  };
}

export function NetworkMap({
  nodes = SENSOR_NODES,
  selectedId = null,
  onSelect,
  origin = null,
  showTectonics = true,
  interactive = false,
  onPick,
  picked = null,
  cities = [],
  onCity,
  className,
}: NetworkMapProps) {
  const outline = useMemo(() => INDIA_OUTLINE.map(project).join(" "), []);
  const kashmirNW = useMemo(() => KASHMIR_NW.map(project).join(" "), []);
  const kashmirNE = useMemo(() => KASHMIR_NE.map(project).join(" "), []);
  const arc = useMemo(() => HIMALAYAN_ARC.map(project).join(" "), []);
  const gap = useMemo(() => CENTRAL_GAP.map(project).join(" "), []);
  const front = useMemo(() => NEPAL_FRONT.map(project).join(" "), []);

  // Wavefront radii in projected units. One degree of latitude spans
  // (1000 / (LAT1 - LAT0)) viewBox units; one degree is ~111 km.
  const KM_TO_UNITS = 1000 / (LAT1 - LAT0) / 111;
  const originXY = origin ? { x: px(origin.lon), y: py(origin.lat) } : null;

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role="img"
      aria-label="Map of India, with Kashmir shown as claimed, and the Inventis Labs seismic sensor network along the Himalayan belt"
    >
      <defs>
        <linearGradient id="landmass" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--land-hi)" />
          <stop offset="100%" stopColor="var(--land-lo)" />
        </linearGradient>
        <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Claimed Kashmir first, unstroked, so it merges with the outline below. */}
      <g fill="url(#landmass)">
        <polygon points={kashmirNW} />
        <polygon points={kashmirNE} />
      </g>

      <polygon
        points={outline}
        fill="url(#landmass)"
        stroke="var(--land-line)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Outer edge of the restored region, stroked on its own. */}
      <polygon
        points={kashmirNW}
        fill="none"
        stroke="var(--land-line)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <polygon
        points={kashmirNE}
        fill="none"
        stroke="var(--land-line)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {showTectonics && (
        <g>
          <polyline
            points={front}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1.5"
            strokeDasharray="7 6"
            opacity="0.7"
          />
          <polyline
            points={arc}
            fill="none"
            stroke="var(--color-pwave-dim)"
            strokeWidth="2"
            strokeDasharray="9 7"
            opacity="0.8"
          />
          {/* The unspent segment. */}
          <polyline
            points={gap}
            fill="none"
            stroke="var(--pw)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#soft-glow)"
          />
        </g>
      )}

      {/* Wavefronts from a live event. */}
      {originXY && origin && origin.pKm > 0 && (
        <circle
          cx={originXY.x}
          cy={originXY.y}
          r={origin.pKm * KM_TO_UNITS}
          fill="none"
          stroke="var(--pw)"
          strokeWidth="2"
          opacity="0.75"
        />
      )}
      {originXY && origin && origin.sKm > 0 && (
        <circle
          cx={originXY.x}
          cy={originXY.y}
          r={origin.sKm * KM_TO_UNITS}
          fill="none"
          stroke="var(--sw)"
          strokeWidth="2.5"
          opacity="0.85"
          filter="url(#soft-glow)"
        />
      )}

      {originXY && (
        <g>
          <circle cx={originXY.x} cy={originXY.y} r="13" fill="var(--sw)" opacity="0.18">
            <animate attributeName="r" values="8;30;8" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0;0.35" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={originXY.x} cy={originXY.y} r="5" fill="var(--sw)" />
        </g>
      )}

      {interactive && (
        <rect
          x="0"
          y="0"
          width="1000"
          height="1000"
          fill="transparent"
          style={{ cursor: "crosshair" }}
          onClick={(e) => {
            if (!onPick) return;
            const box = (e.target as SVGRectElement).ownerSVGElement!.getBoundingClientRect();
            const p = unproject(
              ((e.clientX - box.left) / box.width) * 1000,
              ((e.clientY - box.top) / box.height) * 1000,
            );
            onPick({
              lat: Math.round(p.lat * 100) / 100,
              lon: Math.round(p.lon * 100) / 100,
            });
          }}
        />
      )}

      {/* Free crosshair for the chosen epicentre. */}
      {picked && (
        <g>
          <line x1={px(picked.lon) - 14} y1={py(picked.lat)} x2={px(picked.lon) + 14} y2={py(picked.lat)} stroke={CRIMSON} strokeWidth="1.4" />
          <line x1={px(picked.lon)} y1={py(picked.lat) - 14} x2={px(picked.lon)} y2={py(picked.lat) + 14} stroke={CRIMSON} strokeWidth="1.4" />
          <circle cx={px(picked.lon)} cy={py(picked.lat)} r="9" fill="none" stroke={CRIMSON} strokeWidth="1.4" />
        </g>
      )}

      {/* City markers. */}
      <g>
        {cities.map((c) => {
          const cx = px(c.lon);
          const cy = py(c.lat);
          const fill = c.station ? "var(--sw)" : c.active ? "var(--accent)" : "var(--ink-3)";
          return (
            <g
              key={c.name}
              onClick={onCity ? () => onCity(c.name) : undefined}
              className={onCity ? "cursor-pointer" : undefined}
            >
              {c.active && (
                <circle cx={cx} cy={cy} r="13" fill="none" stroke="var(--accent)" strokeWidth="1.4">
                  <animate attributeName="r" values="8;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Squircle, not a circle — the generic dot is exactly what
                  every other map on the internet uses. */}
              <rect
                x={cx - 4.5}
                y={cy - 4.5}
                width="9"
                height="9"
                rx="2"
                fill={fill}
                stroke="var(--bg)"
                strokeWidth="1.5"
              />
              <text
                x={cx + 10}
                y={cy + 4.5 + (CITY_LABEL_OFFSET[c.name] ?? 0)}
                fontSize="16"
                fill={c.active ? "var(--ink)" : "var(--ink-2)"}
                fontFamily="var(--font-mono)"
                stroke="var(--bg)"
                strokeWidth="3.5"
                paintOrder="stroke"
                style={{ letterSpacing: "0.04em" }}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </g>

      <g>
        {nodes.map((n, i) => {
          const cx = px(n.lon);
          const cy = py(n.lat);
          const c = STATUS_COLOR[n.status];
          const selected = selectedId === n.id;
          return (
            <g
              key={n.id}
              onClick={onSelect ? () => onSelect(n) : undefined}
              className={onSelect ? "cursor-pointer" : undefined}
              role={onSelect ? "button" : undefined}
              aria-label={onSelect ? `${n.name}, ${n.status}` : undefined}
            >
              {n.status === "live" && !selected && (
                <circle cx={cx} cy={cy} r="4.5" fill="none" stroke={c} strokeWidth="1.4">
                  <animate
                    attributeName="r"
                    values="4;16"
                    dur="2.8s"
                    begin={`${(i % 7) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.55;0"
                    dur="2.8s"
                    begin={`${(i % 7) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={cx}
                cy={cy}
                r={selected ? 7 : 4}
                fill={n.status === "offline" ? "var(--bg)" : c}
                stroke={c}
                strokeWidth={selected ? 2.5 : 1.5}
              />
              {LABEL(n.id) && (
                <text
                  x={cx + LABEL(n.id)!.dx}
                  y={cy + LABEL(n.id)!.dy}
                  fontSize="15"
                  textAnchor={LABEL(n.id)!.anchor}
                  fill="var(--ink)"
                  fontFamily="var(--font-mono)"
                  stroke="var(--bg)"
                  strokeWidth="4"
                  paintOrder="stroke"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function LABEL(id: string) {
  return Object.prototype.hasOwnProperty.call(LABELLED, id) ? LABELLED[id] : null;
}

export function MapLegend() {
  const rows: [string, string][] = [
    ["live", "Streaming · < 2 s"],
    ["degraded", "Degraded link"],
    ["offline", "No heartbeat"],
  ];
  return (
    <ul className="space-y-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
      {rows.map(([k, v]) => (
        <li key={k} className="flex items-center gap-2.5">
          <span
            className="size-2 rounded-full"
            style={{ background: STATUS_COLOR[k as Node["status"]] }}
          />
          <span className="text-ink-dim">{v}</span>
        </li>
      ))}
    </ul>
  );
}