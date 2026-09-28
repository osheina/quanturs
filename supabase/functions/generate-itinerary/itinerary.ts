// Pure, dependency-free itinerary logic (unit-tested in itinerary.test.ts).

export const SUPPORTED_CITIES = ["Los Angeles", "San Francisco", "San Diego"] as const;
export type City = (typeof SUPPORTED_CITIES)[number];
export const PACES = ["relaxed", "balanced", "packed"] as const;
export type Pace = (typeof PACES)[number];
export const MAX_DAYS = 5;
export const STOPS_PER_DAY: Record<Pace, number> = { relaxed: 2, balanced: 3, packed: 4 };
export const TIME_SLOTS = ["morning", "midday", "afternoon", "evening"] as const;

export interface Place {
  id: number;
  name: string | null;
  type: string;
  vibe: string | null;
  location: string | null;
  notes: string | null;
  diet_tags: string | null;
  city: string | null;
  image_url: string | null;
  co2_kg: number | null;
  co2_rating: number | null;
}

export interface GuideRequest {
  city: City;
  days: number;
  pace: Pace;
  interests: string[];
  diet: string | null;
  prompt: string;
}

export class ItineraryError extends Error {
  constructor(public code: string, message: string, public status = 422) {
    super(message);
  }
}

/** Validate and normalize the client body. Throws ItineraryError(400). */
export function parseGuideRequest(body: unknown): GuideRequest {
  if (!body || typeof body !== "object") throw new ItineraryError("bad_request", "Request body must be a JSON object.", 400);
  const b = body as Record<string, unknown>;
  const city = SUPPORTED_CITIES.find((c) => c === b.city);
  if (!city) throw new ItineraryError("unsupported_city", `City must be one of: ${SUPPORTED_CITIES.join(", ")}.`, 400);
  const days = Number(b.days);
  if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS)
    throw new ItineraryError("bad_days", `Days must be a whole number from 1 to ${MAX_DAYS}.`, 400);
  const pace = PACES.find((p) => p === b.pace);
  if (!pace) throw new ItineraryError("bad_pace", `Pace must be one of: ${PACES.join(", ")}.`, 400);
  const rawInterests = Array.isArray(b.interests) ? b.interests : [];
  if (rawInterests.length > 8) throw new ItineraryError("bad_interests", "At most 8 interests.", 400);
  const interests = rawInterests
    .filter((i): i is string => typeof i === "string")
    .map((i) => i.trim().toLowerCase().slice(0, 40))
    .filter(Boolean);
  let diet: string | null = null;
  if (b.diet !== undefined && b.diet !== null && b.diet !== "") {
    diet = DIETS.find((d) => d === b.diet) ?? null;
    if (!diet) throw new ItineraryError("bad_diet", `Diet must be one of: ${DIETS.join(", ")}.`, 400);
  }
  const prompt = typeof b.prompt === "string" ? b.prompt.trim() : "";
  if (prompt.length > 500) throw new ItineraryError("prompt_too_long", "Description must be 500 characters or fewer.", 400);
  return { city, days, pace, interests, diet, prompt };
}

/** Strict city isolation: only places whose city column exactly equals the requested city. */
export function filterByCity(places: Place[], city: City): Place[] {
  return places.filter((p) => p.city === city && typeof p.id === "number" && !!p.name);
}

const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);

/** Rank catalog by keyword overlap with preferences; deterministic. */
export function rankPlaces(places: Place[], req: GuideRequest): Place[] {
  const keys = new Set([...req.interests.flatMap(tokenize), ...(req.diet ? tokenize(req.diet) : []), ...tokenize(req.prompt)]);
  const score = (p: Place) => {
    const text = tokenize([p.type, p.vibe, p.diet_tags, p.notes, p.location].filter(Boolean).join(" "));
    return text.reduce((n, w) => n + (keys.has(w) ? 1 : 0), 0);
  };
  return places.map((p) => ({ p, s: score(p) })).sort((a, b) => b.s - a.s || a.p.id - b.p.id).map((x) => x.p);
}

export function requiredStops(req: GuideRequest) {
  return req.days * STOPS_PER_DAY[req.pace];
}

export const DIETS = ["vegan", "vegetarian", "pescatarian", "gluten-free"] as const;
export type Diet = (typeof DIETS)[number];
export const FOOD_TYPES = new Set(["cafe", "restaurant", "brunch", "brunch spot", "rooftop bar", "market"]);
const COMPATIBLE_TAGS: Record<Diet, string[]> = {
  vegan: ["vegan"],
  vegetarian: ["vegan", "vegetarian"],
  pescatarian: ["vegan", "vegetarian", "pescatarian"],
  "gluten-free": ["gluten-free"],
};
export const isFood = (p: Place) => FOOD_TYPES.has(p.type.toLowerCase().trim());
const tagsOf = (p: Place) => (p.diet_tags ?? "").toLowerCase().split(/[;,]/).map((t) => t.trim()).filter(Boolean);
/** A place is diet-compatible if it is not a food venue, or its catalog diet_tags explicitly list a compatible tag. */
export function isDietCompatible(p: Place, diet: string | null): boolean {
  if (!diet || !isFood(p)) return true;
  const ok = COMPATIBLE_TAGS[diet as Diet];
  if (!ok) return false;
  return tagsOf(p).some((t) => ok.includes(t));
}
export function filterByDiet(places: Place[], diet: string | null): Place[] {
  return places.filter((p) => isDietCompatible(p, diet));
}

/** Throws a user-actionable error when the city catalog cannot support the request. */
export function assertCatalogSufficient(cityPlaces: Place[], req: GuideRequest) {
  const need = requiredStops(req);
  if (cityPlaces.length < need) {
    const maxDays = Math.floor(cityPlaces.length / STOPS_PER_DAY[req.pace]);
    throw new ItineraryError(
      "insufficient_catalog",
      cityPlaces.length === 0
        ? `We don't have catalog places in ${req.city} yet. Try Los Angeles, San Francisco or San Diego.`
        : req.diet
        ? `Only ${cityPlaces.length} catalog places in ${req.city} match a ${req.diet} diet (food spots must be tagged ${req.diet} in our catalog) — not enough for ${req.days} ${req.pace} day(s). Try ${Math.max(1, maxDays)} day(s), a relaxed pace, or no diet filter.`
        : `Only ${cityPlaces.length} catalog places in ${req.city} — not enough for ${req.days} ${req.pace} day(s). Try ${Math.max(1, maxDays)} day(s) or a relaxed pace.`,
    );
  }
}

export const AI_OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "days"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["theme", "stops"],
        properties: {
          theme: { type: "string" },
          stops: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["place_id", "slot", "why"],
              properties: {
                place_id: { type: "integer" },
                slot: { type: "string", enum: [...TIME_SLOTS] },
                why: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export interface ValidatedStop {
  place_id: number;
  slot: string;
  why: string;
  name: string;
  type: string;
  location: string | null;
  image_url: string | null;
  co2_kg: number | null;
  co2_rating: number | null;
}
export interface ValidatedGuide {
  version: 2;
  city: City;
  pace: Pace;
  title: string;
  summary: string;
  days: { title: string; stops: ValidatedStop[] }[];
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/**
 * Validate raw AI output text against the catalog offered for this city.
 * Every venue fact in the result comes from the DB row, never from the model.
 */
export function validateAIItinerary(rawText: string, offered: Place[], req: GuideRequest): ValidatedGuide {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new ItineraryError("malformed_ai_response", "The AI returned an unreadable itinerary. Please try again.", 502);
  }
  const o = parsed as Record<string, unknown>;
  if (!o || typeof o !== "object" || !Array.isArray(o.days))
    throw new ItineraryError("malformed_ai_response", "The AI returned an itinerary in an unexpected format. Please try again.", 502);
  if (o.days.length !== req.days)
    throw new ItineraryError("malformed_ai_response", `The AI planned ${o.days.length} day(s) instead of ${req.days}. Please try again.`, 502);

  const byId = new Map(offered.filter((p) => p.city === req.city).map((p) => [p.id, p]));
  const used = new Set<number>();
  const perDay = STOPS_PER_DAY[req.pace];
  const bad = (msg: string) => new ItineraryError("malformed_ai_response", `${msg} Please try again.`, 502);
  const title = clean(o.title, 100);
  const summary = clean(o.summary, 400);
  if (!title || !summary) throw bad("The AI itinerary was missing a title or summary.");

  const days = o.days.map((d, i) => {
    const day = d as Record<string, unknown>;
    if (!day || typeof day !== "object" || !Array.isArray(day.stops)) throw bad("The AI returned an itinerary in an unexpected format.");
    const theme = clean(day.theme, 80);
    if (!theme) throw bad(`Day ${i + 1} had no theme.`);
    if (day.stops.length !== perDay) throw bad(`Day ${i + 1} had ${day.stops.length} stops instead of ${perDay}.`);
    const slots = new Set<string>();
    const stops: ValidatedStop[] = (day.stops as unknown[]).map((raw) => {
      const s = raw as Record<string, unknown>;
      if (!s || typeof s !== "object") throw bad("A stop was malformed.");
      const id = s.place_id;
      if (typeof id !== "number" || !Number.isInteger(id)) throw bad("A stop had an invalid place id.");
      const place = byId.get(id);
      if (!place) throw bad("The AI picked a place outside the catalog for this city.");
      if (used.has(id)) throw bad("The AI repeated a place.");
      if (!isDietCompatible(place, req.diet)) throw bad("The AI picked a food spot that doesn't match your diet.");
      if (typeof s.slot !== "string" || !TIME_SLOTS.includes(s.slot as (typeof TIME_SLOTS)[number])) throw bad("A stop had an invalid time slot.");
      if (slots.has(s.slot)) throw bad(`Day ${i + 1} used the same time slot twice.`);
      const why = clean(s.why, 240);
      if (!why) throw bad("A stop was missing its description.");
      used.add(id);
      slots.add(s.slot);
      return {
        place_id: id, slot: s.slot, why, name: place.name!, type: place.type, location: place.location,
        image_url: place.image_url, co2_kg: place.co2_kg, co2_rating: place.co2_rating,
      };
    });
    stops.sort((a, b) => TIME_SLOTS.indexOf(a.slot as never) - TIME_SLOTS.indexOf(b.slot as never));
    return { title: `Day ${i + 1} – ${theme}`, stops };
  });

  return {
    version: 2,
    city: req.city,
    pace: req.pace,
    title,
    summary,
    days,
  };
}

export function buildCatalogPrompt(places: Place[]) {
  return places
    .map((p) => `${p.id} | ${p.name} | ${p.type} | ${p.location ?? ""} | ${[p.vibe, p.diet_tags].filter(Boolean).join(", ")}`.slice(0, 220))
    .join("\n");
}
