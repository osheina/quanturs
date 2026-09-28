import { assert, assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  assertCatalogSufficient,
  filterByCity,
  ItineraryError,
  parseGuideRequest,
  type Place,
  validateAIItinerary,
} from "./itinerary.ts";

const mk = (id: number, city: string | null, type = "cafe"): Place => ({
  id, name: `Place ${id}`, type, vibe: null, location: "Somewhere", notes: null, diet_tags: "vegan",
  city, image_url: null, co2_kg: 0.49, co2_rating: 1,
});

const catalog: Place[] = [
  ...[1, 2, 3, 4, 5, 6].map((i) => mk(i, "Los Angeles")),
  ...[101, 102, 103].map((i) => mk(i, "San Francisco")),
  mk(900, null),
];
const req = parseGuideRequest({ city: "Los Angeles", days: 2, pace: "balanced", interests: ["vegan"], prompt: "vegan food" });

Deno.test("filterByCity excludes other cities and null-city rows", () => {
  const la = filterByCity(catalog, "Los Angeles");
  assertEquals(la.map((p) => p.id), [1, 2, 3, 4, 5, 6]);
});

Deno.test("AI-selected IDs from another city are dropped, facts come from DB", () => {
  const offered = filterByCity(catalog, "Los Angeles");
  const ai = JSON.stringify({
    title: "T", summary: "S",
    days: [
      { theme: "A", stops: [{ place_id: 101, slot: "morning", why: "x" }, { place_id: 1, slot: "morning", why: "y" }, { place_id: 2, slot: "evening", why: "z" }] },
      { theme: "B", stops: [{ place_id: 900, slot: "midday", why: "x" }, { place_id: 1, slot: "midday", why: "dup" }, { place_id: 3, slot: "midday", why: "ok" }] },
    ],
  });
  const g = validateAIItinerary(ai, offered, req);
  const ids = g.days.flatMap((d) => d.stops.map((s) => s.place_id));
  assertEquals(ids, [1, 2, 3]);
  assert(g.days.every((d) => d.stops.every((s) => s.name.startsWith("Place ") && s.co2_kg === 0.49)));
});

Deno.test("invented IDs never appear", () => {
  const ai = JSON.stringify({ title: "", summary: "", days: [
    { theme: "", stops: [{ place_id: 424242, slot: "morning", why: "" }, { place_id: 4, slot: "morning", why: "" }] },
    { theme: "", stops: [{ place_id: 5, slot: "evening", why: "" }] },
  ] });
  const g = validateAIItinerary(ai, filterByCity(catalog, "Los Angeles"), req);
  assertEquals(g.days.flatMap((d) => d.stops.map((s) => s.place_id)), [4, 5]);
});

Deno.test("malformed AI responses are rejected", () => {
  const offered = filterByCity(catalog, "Los Angeles");
  for (const bad of ["not json", "{}", JSON.stringify({ days: "x" }), JSON.stringify({ days: [{ stops: [] }] }),
    JSON.stringify({ days: [{ stops: [{ place_id: 101, slot: "morning" }] }, { stops: [{ place_id: 1, slot: "morning" }] }] }),
    JSON.stringify({ days: [{ stops: [{ place_id: "1", slot: "morning" }] }, { stops: [{ place_id: 2, slot: "noon" }] }] })]) {
    const e = assertThrows(() => validateAIItinerary(bad, offered, req), ItineraryError);
    assertEquals(e.code, "malformed_ai_response");
  }
});

Deno.test("insufficient catalog produces actionable error", () => {
  const sf = filterByCity(catalog, "San Francisco");
  const e = assertThrows(() => assertCatalogSufficient(sf, { ...req, city: "San Francisco", days: 3 }), ItineraryError);
  assertEquals(e.code, "insufficient_catalog");
  assert(e.message.includes("Try 1 day"));
});

Deno.test("request bounds enforced", () => {
  assertThrows(() => parseGuideRequest({ city: "Paris", days: 2, pace: "balanced" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 9, pace: "balanced" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 2, pace: "turbo" }), ItineraryError);
  assertThrows(() => parseGuideRequest({ city: "San Diego", days: 2, pace: "relaxed", prompt: "x".repeat(501) }), ItineraryError);
});
