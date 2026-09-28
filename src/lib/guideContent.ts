// Safe, defensive parsing of stored guide JSON (new v2 AI format and legacy format).

export interface GuideItemView { time: string; name: string; meta: string; notes: string; co2: string }
export interface GuideView {
  summary: string;
  days: { title: string; items: GuideItemView[] }[];
  recommendations: [string, string[]][];
}

const str = (v: unknown, max = 300) => (typeof v === "string" || typeof v === "number" ? String(v).slice(0, max) : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export function safeParseGuide(raw: unknown): GuideView | null {
  let c: unknown = raw;
  if (typeof raw === "string") {
    try { c = JSON.parse(raw); } catch { return null; }
  }
  if (!c || typeof c !== "object") return null;
  const o = c as Record<string, unknown>;

  const days = arr(o.days).slice(0, 10).map((d, i) => {
    const day = (d && typeof d === "object" ? d : {}) as Record<string, unknown>;
    const source = arr(day.stops).length ? arr(day.stops) : arr(day.activities);
    const items = source.slice(0, 12).map((it) => {
      const x = (it && typeof it === "object" ? it : {}) as Record<string, unknown>;
      const co2 = typeof x.co2_kg === "number" ? `≈ ${x.co2_kg} kg CO₂e (catalog estimate)` : "";
      return {
        time: str(x.slot ?? x.time, 40),
        name: str(x.name ?? x.activity, 120),
        meta: [str(x.type, 40), str(x.location, 120)].filter(Boolean).join(" · "),
        notes: str(x.why ?? x.notes, 300),
        co2,
      };
    }).filter((x) => x.name);
    return { title: str(day.title, 120) || `Day ${i + 1}`, items };
  });

  const recommendations: [string, string[]][] =
    o.recommendations && typeof o.recommendations === "object" && !Array.isArray(o.recommendations)
      ? Object.entries(o.recommendations as Record<string, unknown>)
          .map(([k, v]) => [str(k, 40), arr(v).map((x) => str(x, 200)).filter(Boolean)] as [string, string[]])
          .filter(([, v]) => v.length > 0)
      : [];

  return { summary: str(o.summary, 400), days, recommendations };
}
