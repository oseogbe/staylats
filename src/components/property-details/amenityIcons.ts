import {
  Wifi,
  Car,
  Shield,
  Dumbbell,
  Waves,
  Zap,
  ChefHat,
  Sparkles,
  Home,
  TreePine,
  Utensils,
  Tv,
  WashingMachine,
  AirVent,
} from "lucide-react";

/** Direct amenity name → icon mapping */
const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  "Wi-Fi": Wifi,
  "High-Speed WiFi": Wifi,
  AC: AirVent,
  "Air Conditioning": AirVent,
  Pool: Waves,
  "Swimming Pool": Waves,
  Gym: Dumbbell,
  "Fitness Center": Dumbbell,
  Security: Shield,
  "24/7 Security": Shield,
  Parking: Car,
  "Parking Space": Car,
  Kitchen: ChefHat,
  "Fully Equipped Kitchen": ChefHat,
  Housekeeping: Sparkles,
  "Beach Access": Waves,
  BQ: Home,
  Garden: TreePine,
  Generator: Zap,
  "24/7 Electricity": Zap,
  "Power Supply": Zap,
  "Backup Generator": Zap,
  Balcony: Home,
  TV: Tv,
  "Smart TV": Tv,
  "Cable TV": Tv,
  "Washing Machine": WashingMachine,
  Laundry: WashingMachine,
  "Dining Area": Utensils,
};

/** Resolve an amenity string to its best-matching icon component */
export function getAmenityIcon(amenity: string): React.ElementType {
  if (amenityIcons[amenity]) return amenityIcons[amenity];

  const lc = amenity.toLowerCase();
  if (lc.includes("wifi") || lc.includes("wi-fi") || lc.includes("internet")) return Wifi;
  if (lc.includes("pool") || lc.includes("swim")) return Waves;
  if (lc.includes("gym") || lc.includes("fitness")) return Dumbbell;
  if (lc.includes("security") || lc.includes("guard")) return Shield;
  if (lc.includes("parking") || lc.includes("garage")) return Car;
  if (lc.includes("kitchen") || lc.includes("cook")) return ChefHat;
  if (lc.includes("clean") || lc.includes("housekeep")) return Sparkles;
  if (lc.includes("garden") || lc.includes("lawn")) return TreePine;
  if (lc.includes("generator") || lc.includes("electric") || lc.includes("power")) return Zap;
  if (lc.includes("air") || lc.includes("ac") || lc.includes("conditioning")) return AirVent;
  if (lc.includes("tv") || lc.includes("television")) return Tv;
  if (lc.includes("laundry") || lc.includes("washing")) return WashingMachine;
  if (lc.includes("balcon")) return Home;
  return Home;
}
