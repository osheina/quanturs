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
  const diet = typeof b.diet === "string" && b.diet.trim() ? b.diet.trim().toLowerCase().slice(0, 40) : null;
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

/** Throws a user-actionable error when the city catalog cannot support the request. */
export function assertCatalogSufficient(cityPlaces: Place[], req: GuideRequest) {
  const need = requiredStops(req);
  if (cityPlaces.length < need) {
    const maxDays = Math.floor(cityPlaces.length / STOPS_PER_DAY[req.pace]);
    throw new ItineraryError(
      "insufficient_catalog",
      cityPlaces.length === 0
        ? `We don't have verified places in ${req.city} yet. Try Los Angeles, San Francisco or San Diego.`
        : `Only ${cityPlaces.length} verified places in ${req.city} — not enough for ${req.days} ${req.pace} day(s). Try ${Math.max(1, maxDays)} day(s) or a relaxed pace.`,
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

  const days = o.days.map((d, i) => {
    const day = d as Record<string, unknown>;
    if (!day || !Array.isArray(day.stops))
      throw new ItineraryError("malformed_ai_response", "The AI returned an itinerary in an unexpected format. Please try again.", 502);
    const stops: ValidatedStop[] = [];
    for (const s of day.stops as Record<string, unknown>[]) {
      const id = s?.place_id;
      if (typeof id !== "number" || !Number.isInteger(id)) continue;
      const place = byId.get(id);
      if (!place || used.has(id)) continue; // unknown, other-city, or duplicate -> dropped
      if (!TIME_SLOTS.includes(s.slot as (typeof TIME_SLOTS)[number])) continue;
      used.add(id);
      stops.push({
        place_id: id,
        slot: s.slot as string,
        why: clean(s.why, 240),
        name: place.name!,
        type: place.type,
        location: place.location,
        image_url: place.image_url,
        co2_kg: place.co2_kg,
        co2_rating: place.co2_rating,
      });
      if (stops.length >= perDay) break;
    }
    if (stops.length === 0)
      throw new ItineraryError("malformed_ai_response", `The AI couldn't match day ${i + 1} to verified places. Please try again.`, 502);
    stops.sort((a, b) => TIME_SLOTS.indexOf(a.slot as never) - TIME_SLOTS.indexOf(b.slot as never));
    return { title: `Day ${i + 1} – ${clean(day.theme, 80) || "Explore"}`, stops };
  });

  return {
    version: 2,
    city: req.city,
    pace: req.pace,
    title: clean(o.title, 100) || `${req.days}-day ${req.city} eco itinerary`,
    summary: clean(o.summary, 400),
    days,
  };
}

export function buildCatalogPrompt(places: Place[]) {
  return places
    .map((p) => `${p.id} | ${p.name} | ${p.type} | ${p.location ?? ""} | ${[p.vibe, p.diet_tags].filter(Boolean).join(", ")}`.slice(0, 220))
    .join("\n");
}
