export type ServiceSlug =
  | "flatbed"
  | "step-deck"
  | "dry-van"
  | "power-only"
  | "box-truck"
  | "hotshot";

export type Service = {
  slug: ServiceSlug;
  name: string;
  image: string;
  summary: string;
  description: string;
  benefits: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "flatbed",
    name: "Flatbed",
    image: "Flatbed.webp",
    summary: "Specialized and open-deck freight for flatbed trailers.",
    description:
      "Open-deck freight, from standard secured boards to oversized or specialized pieces that need careful handling and securement.",
    benefits: [
      "Loads screened against your trailer configuration",
      "Dimensions and securement details checked before booking",
      "Oversized and tarp requirements handled in the paperwork",
    ],
  },
  {
    slug: "step-deck",
    name: "Step Deck",
    image: "Stepdack.webp",
    summary: "Lower-deck and specialized freight with extra clearance.",
    description:
      "Taller and heavier pieces that need the added height and capacity of a step-deck trailer.",
    benefits: [
      "Freight matched to your deck configuration and load limits",
      "Height and dimension details verified before you commit",
      "Drop and live-load coordination included",
    ],
  },
  {
    slug: "dry-van",
    name: "Dry Van",
    image: "Dryvan.webp",
    summary: "General freight for enclosed trailers.",
    description:
      "Enclosed, general freight — the day-to-day loads that keep a dry van running.",
    benefits: [
      "Freight search across your preferred lanes",
      "Pickup and delivery windows confirmed up front",
      "Rate confirmation handled before dispatch",
    ],
  },
  {
    slug: "power-only",
    name: "Power Only",
    image: "poweronly.webp",
    summary: "Tractor-only operations.",
    description:
      "You bring the tractor, and we handle the search for trailer and drop-and-hook freight that fits your operation.",
    benefits: [
      "Trailer and drop-and-hook loads matched to your setup",
      "Appointment windows coordinated ahead of time",
      "Paperwork organized so you can hook and go",
    ],
  },
  {
    slug: "box-truck",
    name: "Box Truck",
    image: "Box-Truck.webp",
    summary: "Smaller freight operations for regional runs.",
    description:
      "Regional and last-mile freight sized for box-truck capacity and schedule.",
    benefits: [
      "Freight sized to your box and route patterns",
      "Stops and appointment windows confirmed before you roll",
      "Documentation handled so you can focus on deliveries",
    ],
  },
  {
    slug: "hotshot",
    name: "Hotshot",
    image: "Hotshot.webp",
    summary: "Expedited and smaller freight on tight timelines.",
    description:
      "Fast-moving, smaller freight for hotshot setups that need to get there sooner.",
    benefits: [
      "Expedited loads matched to your schedule",
      "Pickup and delivery windows confirmed live",
      "One dedicated dispatcher from pickup through delivery",
    ],
  },
];