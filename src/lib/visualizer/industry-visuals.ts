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
 * Builds a URL for an illustrative stock photo matching the industry, via
 * LoremFlickr — a free, keyless, keyword-based placeholder photo service.
 * This is demo/illustrative imagery for the concept preview only, never
 * presented as the visitor's actual business photos.
 */
export function stockImageUrl(industryKey: IndustryKey, seed: string, width: number, height: number): string {
  const keyword = imageKeywordFor(industryKey, seed);
  return `https://loremflickr.com/${Math.round(width)}/${Math.round(height)}/${encodeURIComponent(keyword)}`;
}
