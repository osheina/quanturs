import { assert, assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  assertCatalogSufficient,
  filterByCity,
  filterByDiet,
  isDietCompatible,
  ItineraryError,
  parseGuideRequest,
  type Place,
  validateAIItinerary,
} from "./itinerary.ts";

const mk = (id: number, city: string | null, type = "cafe", diet_tags: string | null = "vegan"): Place => ({
  id, name: `Place ${id}`, type, vibe: null, location: "Somewhere", notes: null, diet_tags,
  city, image_url: null, co2_kg: 0.49, co2_rating: 1,
});

const catalog: Place[] = [
  ...[1, 2, 3, 4, 5, 6].map((i) => mk(i, "Los Angeles")),
  mk(7, "Los Angeles", "restaurant", "keto"),
  mk(8, "Los Angeles", "gallery", null),
  ...[101, 102, 103].map((i) => mk(i, "San Francisco")),
  mk(900, null),
];
// relaxed = 2 stops/day, 2 days
const req = parseGuideRequest({ city: "Los Angeles", days: 2, pace: "relaxed", diet: "vegan", prompt: "vegan food" });
const offered = filterByDiet(filterByCity(catalog, "Los Angeles"), req.diet);

const stop = (place_id: unknown, slot: unknown = "morning", why: unknown = "Fits you") => ({ place_id, slot, why });
const guide = (days: unknown[], extra: Record<string, unknown> = {}) =>
  JSON.stringify({ title: "Green LA", summary: "A calm plan", days, ...extra });
const expectMalformed = (raw: string, r = req, o = offered) => {
  const e = assertThrows(() => validateAIItinerary(raw, o, r), ItineraryError);
  assertEquals(e.code, "malformed_ai_response");
};

Deno.test("filterByCity excludes other cities and null-city rows", () => {
  assertEquals(filterByCity(catalog, "Los Angeles").map((p) => p.id), [1, 2, 3, 4, 5, 6, 7, 8]);
});

Deno.test("valid itinerary passes; facts come from DB and slots are ordered", () => {
  const g = validateAIItinerary(guide([
    { theme: "A", stops: [stop(2, "evening"), stop(1, "morning")] },
    { theme: "B", stops: [stop(3, "midday"), stop(8, "afternoon")] },
  ]), offered, req);
  assertEquals(g.days.map((d) => d.stops.map((s) => s.place_id)), [[1, 2], [3, 8]]);
  assert(g.days.every((d) => d.stops.every((s) => s.name === `Place ${s.place_id}`)));
});

Deno.test("cross-city, unknown, null-city and duplicate IDs are rejected", () => {
  for (const bad of [101, 424242, 900]) {
    expectMalformed(guide([{ theme: "A", stops: [stop(bad), stop(1, "evening")] }, { theme: "B", stops: [stop(2), stop(3, "evening")] }]));
  }
  expectMalformed(guide([{ theme: "A", stops: [stop(1), stop(2, "evening")] }, { theme: "B", stops: [stop(1), stop(3, "evening")] }]));
});

Deno.test("exact stop count per day is required", () => {
  expectMalformed(guide([{ theme: "A", stops: [stop(1)] }, { theme: "B", stops: [stop(2), stop(3, "evening")] }]));
  expectMalformed(guide([{ theme: "A", stops: [stop(1), stop(4, "midday"), stop(5, "evening")] }, { theme: "B", stops: [stop(2), stop(3, "evening")] }]));
  expectMalformed(guide([{ theme: "A", stops: [stop(1), stop(4, "evening")] }]));
});

Deno.test("invalid or duplicate slots and empty text are rejected", () => {
  expectMalformed(guide([{ theme: "A", stops: [stop(1, "noon"), stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }]));
  expectMalformed(guide([{ theme: "A", stops: [stop(1), stop(2)] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }]));
  expectMalformed(guide([{ theme: "A", stops: [stop(1, "morning", "  "), stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }]));
  expectMalformed(guide([{ theme: "", stops: [stop(1), stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }]));
  expectMalformed(guide([{ theme: "A", stops: [stop(1), stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }], { title: "" }));
});

Deno.test("malformed JSON / shapes / id types are rejected", () => {
  for (const bad of ["not json", "{}", JSON.stringify({ title: "t", summary: "s", days: "x" }),
    guide([{ theme: "A", stops: [stop("1"), stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }]),
    guide([{ theme: "A", stops: [null, stop(2, "evening")] }, { theme: "B", stops: [stop(3), stop(4, "evening")] }])]) {
    expectMalformed(bad);
  }
});

Deno.test("diet: incompatible food excluded from candidates and rejected by validator", () => {
  assert(!offered.some((p) => p.id === 7)); // keto restaurant
  assert(offered.some((p) => p.id === 8)); // gallery (non-food) allowed
  assert(!isDietCompatible(mk(1, "Los Angeles", "cafe", null), "vegan"));
  assert(isDietCompatible(mk(1, "Los Angeles", "cafe", "vegan;keto"), "vegetarian"));
  const all = filterByCity(catalog, "Los Angeles");
  expectMalformed(guide([{ theme: "A", stops: [stop(7), stop(1, "evening")] }, { theme: "B", stops: [stop(2), stop(3, "evening")] }]), req, all);
});

Deno.test("insufficient catalog produces actionable error (incl. diet)", () => {
  const sf = filterByCity(catalog, "San Francisco");
  const e = assertThrows(() => assertCatalogSufficient(sf, { ...req, city: "San Francisco", days: 3, diet: null }), ItineraryError);
  assertEquals(e.code, "insufficient_catalog");
  assert(e.message.includes("Try 1 day"));
  const e2 = assertThrows(() => assertCatalogSufficient(sf, { ...req, city: "San Francisco", days: 3 }), ItineraryError);
  assert(e2.message.includes("vegan diet"));
});

Deno.test("request bounds enforced", () => {
  assertThrows(() => parseGuideRequest({ city: "Paris", days: 2, pace: "balanced" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 9, pace: "balanced" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 2, pace: "turbo" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 2, pace: "relaxed", diet: "carnivore" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 2, pace: "relaxed", prompt: "x".repeat(501) }), ItineraryError);
});
