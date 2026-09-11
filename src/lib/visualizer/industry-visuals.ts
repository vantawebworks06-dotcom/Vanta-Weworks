import type { IndustryKey } from "@/lib/validations/concept";

/**
 * Curated, safe-for-work search keywords per industry, used to pull
 * relevant illustrative stock photography into the AI Visualizer preview
 * (see PreviewVisual) instead of one generic abstract gradient for every
 * business type. Deliberately hand-picked rather than derived from
 * arbitrary visitor text — keeps results on-topic and predictable.
 *
 * Several keywords per industry so a single concept's hero/gallery/listing
 * images vary instead of repeating the same photo everywhere.
 */
export const INDUSTRY_KEYWORDS: Record<IndustryKey, string[]> = {
  automotive: ["car dealership", "car showroom", "luxury car", "sports car", "car lot"],
  "car-rental": ["rental car fleet", "suv rental", "convertible car", "car rental agency", "tropical road trip"],
  "auto-repair": ["auto repair shop", "mechanic garage", "car engine", "car service"],
  "restaurant-pizza": ["pizza", "pizzeria", "italian restaurant", "wood fired pizza"],
  "restaurant-general": ["restaurant food", "fine dining", "restaurant interior", "gourmet plate"],
  "bakery-cafe": ["bakery", "coffee shop", "pastries", "cafe interior"],
  "bar-nightlife": ["nightclub", "cocktail bar", "lounge", "nightlife party"],
  construction: ["construction site", "building construction", "construction crew", "architecture blueprint"],
  "real-estate": ["luxury house", "modern home exterior", "real estate property", "apartment interior"],
  barber: ["barbershop", "barber haircut", "barber chair", "mens grooming"],
  "beauty-salon": ["beauty salon", "hair salon", "spa treatment", "manicure"],
  "gym-fitness": ["gym fitness", "weightlifting", "fitness training", "yoga studio"],
  "hotel-hospitality": ["hotel lobby", "hotel room", "resort pool", "luxury hotel"],
  "clothing-fashion": ["fashion boutique", "clothing store", "fashion model", "clothing rack"],
  legal: ["law office", "courtroom", "lawyer desk", "law books"],
  dental: ["dental clinic", "dentist office", "dental care", "teeth whitening"],
  "medical-health": ["medical clinic", "doctor office", "healthcare", "hospital"],
  cleaning: ["house cleaning", "cleaning service", "commercial cleaning", "cleaning supplies"],
  landscaping: ["landscaping garden", "lawn care", "garden design", "landscape architecture"],
  events: ["event decoration", "wedding event", "party decoration", "event venue"],
  photography: ["photography studio", "camera photographer", "photo shoot", "portrait photography"],
  electronics: ["electronics store", "gadgets technology", "computer store", "smartphone"],
  travel: ["travel destination", "tropical beach", "airplane travel", "vacation resort"],
  education: ["classroom", "university campus", "students learning", "library books"],
  "technology-saas": ["technology office", "software development", "tech startup", "computer coding"],
  "home-services": ["home renovation", "plumber", "electrician", "handyman tools"],
  "retail-general": ["retail store", "shopping mall", "boutique shop", "storefront"],
  nonprofit: ["community volunteer", "charity event", "nonprofit organization", "helping hands"],
  general: ["modern office", "business meeting", "professional team", "office building"],
};

/** Human-readable label per industry key, for the visualizer's debug panel
 * and anywhere else a person (not just the render code) needs to see what
 * category the AI actually classified the business as. */
export const INDUSTRY_LABELS: Record<IndustryKey, string> = {
  automotive: "Automotive / Car Dealership",
  "car-rental": "Car Rental",
  "auto-repair": "Auto Repair / Mechanic",
  "restaurant-pizza": "Restaurant — Pizza",
  "restaurant-general": "Restaurant",
  "bakery-cafe": "Bakery / Café",
  "bar-nightlife": "Bar / Nightlife",
  construction: "Construction",
  "real-estate": "Real Estate",
  barber: "Barber Shop",
  "beauty-salon": "Beauty Salon / Spa",
  "gym-fitness": "Gym / Fitness",
  "hotel-hospitality": "Hotel / Hospitality",
  "clothing-fashion": "Clothing / Fashion",
  legal: "Legal Services",
  dental: "Dental",
  "medical-health": "Medical / Healthcare",
  cleaning: "Cleaning Services",
  landscaping: "Landscaping",
  events: "Events",
  photography: "Photography",
  electronics: "Electronics",
  travel: "Travel",
  education: "Education",
  "technology-saas": "Technology / SaaS",
  "home-services": "Home Services",
  "retail-general": "Retail",
  nonprofit: "Nonprofit",
  general: "General Business",
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

/** Deterministically picks one of an industry's keywords from a seed string
 * (a section/item id) so repeated renders of the same concept are stable,
 * while different items still get visual variety. */
export function imageKeywordFor(industryKey: IndustryKey, seed: string): string {
  const list = INDUSTRY_KEYWORDS[industryKey] ?? INDUSTRY_KEYWORDS.general;
  return list[hashSeed(seed) % list.length];
}

/**
 * LoremFlickr expects a comma-separated list of single-word tags in the URL
 * path (e.g. "/900/700/car,rental"), matching photos tagged with ALL of
 * them — not a %20-encoded phrase. A URL-encoded multi-word phrase (e.g.
 * "car%20rental") reliably fails outright rather than degrading gracefully,
 * which is exactly what most of our curated keywords are ("car dealership",
 * "construction site", ...), since they read naturally as phrases. Convert
 * here rather than rewriting every keyword list as literal tag arrays.
 */
function toTagPath(keyword: string): string {
  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => encodeURIComponent(word))
    .join(",");
}

/**
 * Builds a URL for an illustrative stock photo matching the industry, via
 * LoremFlickr — a free, keyless, keyword-based placeholder photo service.
 * This is demo/illustrative imagery for the concept preview only, never
 * presented as the visitor's actual business photos.
 *
 * LoremFlickr is best-effort and can fail a fetch outright, not just be
 * slow. `viaProxy` routes the same request through images.weserv.nl, a
 * separate, independent image CDN/proxy — different DNS, different edge
 * network — as a second attempt with a real chance of succeeding when a
 * direct hit didn't, rather than retrying the exact same path twice. See
 * GradientPlaceholder, which uses this for its one retry after a direct
 * attempt fails.
 */
export function stockImageUrl(
  industryKey: IndustryKey,
  seed: string,
  width: number,
  height: number,
  viaProxy = false
): string {
  const tagPath = toTagPath(imageKeywordFor(industryKey, seed));
  const w = Math.round(width);
  const h = Math.round(height);
  const direct = `https://loremflickr.com/${w}/${h}/${tagPath}`;
  if (!viaProxy) return direct;
  return `https://images.weserv.nl/?url=${encodeURIComponent(`loremflickr.com/${w}/${h}/${tagPath}`)}&w=${w}&h=${h}&fit=cover`;
}
