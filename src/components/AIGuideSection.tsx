import { ArrowRight, Check, Loader2, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { safeParseGuide } from "@/lib/guideContent";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateAIGuide, fetchPremadeGuides, GuideError, GUIDE_CITIES, type GuideCity, type GuidePace } from "@/services/guideService";
import type { TravelGuide } from "@/models/TravelGuide";
import { useQuery, useMutation } from "@tanstack/react-query";

const moods = ["Slow & restorative", "Art & design", "Outside all day", "Local food", "Hidden corners"];
const examples = ["Vegan restaurants and art galleries", "Hikes, farmers markets and secondhand shopping", "Wellness, parks and cozy cafes"];

const AIGuideSection = () => {
  const [prompt, setPrompt] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [city, setCity] = useState<GuideCity>("Los Angeles");
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<GuidePace>("balanced");
  const [diet, setDiet] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedGuide, setGeneratedGuide] = useState<TravelGuide | null>(null);
  const [activeGuide, setActiveGuide] = useState<TravelGuide | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { data: premadeGuides = [], isLoading: isLoadingGuides } = useQuery({ queryKey: ["premadeGuides"], queryFn: fetchPremadeGuides });
  const createGuideMutation = useMutation({
    mutationFn: generateAIGuide,
    onSuccess: (guide) => { setGeneratedGuide(guide); setActiveGuide(guide); setErrorMsg(null); },
    onError: (error: unknown) => setErrorMsg(error instanceof GuideError ? error.message : "Could not create your guide. Please try again."),
  });

  const toggleMood = (mood: string) => setInterests((current) => current.includes(mood) ? current.filter((item) => item !== mood) : [...current, mood]);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    if (!user) { setErrorMsg("Sign in to create and save your itinerary."); return; }
    if (prompt.length > 500) { setErrorMsg("Please keep your description under 500 characters."); return; }
    createGuideMutation.mutate({ city, days, pace, prompt: prompt.trim(), diet: diet || null, interests });
  };

  const content = activeGuide ? safeParseGuide(activeGuide.content) : null;

  return (
    <section id="create-guide" className="scroll-mt-4 px-6 py-8 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-14 lg:gap-24">
          <div className="md:pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">FIELD NOTES / 01</p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight md:mt-4 md:text-4xl lg:text-5xl">A journey with <span className="font-medium">your name on it.</span></h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-base">Tell us how you want to travel. We’ll put together a multi-day itinerary from places in the Quanturs catalog.</p>
            <div className="mt-10 hidden items-center gap-4 border-t border-border pt-6 md:flex">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent text-accent"><MapPin className="h-5 w-5" /></div>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">Your destination. Your rhythm. A different way to see the familiar.</p>
            </div>
          </div>
          <div className="border-t-2 border-primary pt-6">
            <div className="mb-7 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">YOUR ITINERARY</p>
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="guide-prompt" className="block text-sm font-semibold">What would make this trip yours?</label>
                <textarea id="guide-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="An afternoon in a gallery, a good meal, time to wander…" maxLength={500} disabled={createGuideMutation.isPending} rows={3} className="mt-2 block w-full resize-y rounded-sm border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" />
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2"><span className="text-xs text-muted-foreground">Try:</span>{examples.map((example) => <Button key={example} type="button" variant="link" size="sm" onClick={() => setPrompt(example)} disabled={createGuideMutation.isPending} className="h-auto whitespace-normal p-0 text-left text-xs text-primary underline underline-offset-4">{example}</Button>)}</div>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold">What should this trip feel like?</legend>
                <div className="mt-3 flex flex-wrap gap-2">{moods.map((mood) => <Button key={mood} type="button" variant={interests.includes(mood) ? "default" : "outline"} aria-pressed={interests.includes(mood)} onClick={() => toggleMood(mood)} disabled={createGuideMutation.isPending} className="h-auto min-h-10 whitespace-normal rounded-full px-4 py-2 text-sm">{interests.includes(mood) && <Check className="h-4 w-4" aria-hidden="true" />}{mood}</Button>)}</div>
              </fieldset>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="text-xs font-semibold" htmlFor="guide-city">Destination<select id="guide-city" value={city} onChange={(event) => setCity(event.target.value as GuideCity)} disabled={createGuideMutation.isPending} className="mt-2 h-11 w-full rounded-sm border border-input bg-card px-2 text-sm font-normal text-foreground">{GUIDE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
                <label className="text-xs font-semibold" htmlFor="guide-days">Days<select id="guide-days" value={days} onChange={(event) => setDays(Number(event.target.value))} disabled={createGuideMutation.isPending} className="mt-2 h-11 w-full rounded-sm border border-input bg-card px-2 text-sm font-normal text-foreground">{[1,2,3,4,5].map((d) => <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>)}</select></label>
                <label className="text-xs font-semibold" htmlFor="guide-pace">Pace<select id="guide-pace" value={pace} onChange={(event) => setPace(event.target.value as GuidePace)} disabled={createGuideMutation.isPending} className="mt-2 h-11 w-full rounded-sm border border-input bg-card px-2 text-sm font-normal text-foreground"><option value="relaxed">Relaxed</option><option value="balanced">Balanced</option><option value="packed">Packed</option></select></label>
                <label className="text-xs font-semibold" htmlFor="guide-diet">Food preference<select id="guide-diet" value={diet} onChange={(event) => setDiet(event.target.value)} disabled={createGuideMutation.isPending} className="mt-2 h-11 w-full rounded-sm border border-input bg-card px-2 text-sm font-normal text-foreground"><option value="">Any diet</option><option value="vegan">Vegan</option><option value="vegetarian">Vegetarian</option><option value="pescatarian">Pescatarian</option><option value="gluten-free">Gluten-free</option></select></label>
              </div>
              {errorMsg && <p role="alert" className="border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMsg} {!user && <Link to="/auth" className="font-semibold underline">Sign in</Link>}</p>}
              {createGuideMutation.isPending && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Choosing places from our catalog… this can take up to a minute.</p>}
              {!authLoading && !user && <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted-foreground">An account is needed to create and save your itinerary. You can still explore the catalog below.</p>}
              {!authLoading && !user ? <Button asChild className="h-12 w-full text-sm"><Link to="/auth">Sign in to create your itinerary <ArrowRight className="ml-2 h-4 w-4" /></Link></Button> : <Button type="submit" disabled={authLoading || createGuideMutation.isPending} className="h-12 w-full text-sm">{createGuideMutation.isPending ? "Creating your itinerary…" : "Create my itinerary"}<ArrowRight className="ml-2 h-4 w-4" /></Button>}
            </form>
            {generatedGuide && <div role="status" className="mt-6 border-t border-border pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">YOUR GUIDE IS READY</p><h3 className="mt-2 text-2xl font-semibold">{generatedGuide.title}</h3><div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => setActiveGuide(generatedGuide)}>Open itinerary <ArrowRight className="ml-2 h-4 w-4" /></Button><Button variant="outline" onClick={() => { setGeneratedGuide(null); setPrompt(""); setInterests([]); document.getElementById("guide-prompt")?.focus(); }}>Plan another trip</Button></div></div>}
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 md:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">FROM THE ARCHIVE</p><h3 className="mt-2 text-3xl font-semibold md:text-4xl">Featured guides</h3></div></div>
          {isLoadingGuides ? <p className="text-sm text-muted-foreground">Loading guides…</p> : premadeGuides.length === 0 ? <p className="text-sm text-muted-foreground">No featured guides available at the moment.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{premadeGuides.map((guide, index) => <article key={guide.id} className="border-t border-border pt-4"><p className="mb-3 text-xs uppercase tracking-[0.16em] text-accent">GUIDE {String(index + 1).padStart(2, "0")}</p>{guide.image_url && <img src={guide.image_url} alt={guide.title} loading="lazy" className="mb-4 aspect-[4/3] w-full object-cover" />}<h4 className="text-2xl font-semibold leading-tight">{guide.title}</h4><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.description}</p><Button type="button" variant="link" onClick={() => setActiveGuide(guide)} className="mt-2 h-auto p-0 text-sm">Read guide <ArrowRight className="h-4 w-4" /></Button></article>)}</div>}
        </div>
      </div>
      <Dialog open={activeGuide !== null} onOpenChange={(open) => { if (!open) setActiveGuide(null); }}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-background px-5 py-8 sm:px-8">
          <DialogHeader><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">YOUR ITINERARY</p><DialogTitle className="text-2xl font-semibold leading-tight sm:text-3xl">{activeGuide?.title}</DialogTitle></DialogHeader>
          {activeGuide && (content ? <div className="mt-3 space-y-8">{content.summary && <p className="leading-relaxed text-muted-foreground">{content.summary}</p>}{content.days.map((day, index) => <section key={index} className="border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">DAY {String(index + 1).padStart(2, "0")}</p><h3 className="mt-1 text-2xl font-semibold">{day.title}</h3><div className="mt-5 space-y-5 border-l border-border pl-5">{day.items.map((item, i) => <div key={i}><p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{item.time}</p><h4 className="mt-1 text-xl font-semibold">{item.name}</h4>{item.meta && <p className="text-sm text-muted-foreground">{item.meta}</p>}{item.notes && <p className="mt-1 text-sm">{item.notes}</p>}{item.co2 && <p className="mt-1 text-xs text-muted-foreground">{item.co2}</p>}</div>)}</div></section>)}{content.recommendations.length > 0 && <section className="border-t border-border pt-5"><h3 className="text-2xl font-semibold">Recommendations</h3>{content.recommendations.map(([key, values]) => <div key={key} className="mt-3"><h4 className="font-semibold capitalize">{key}</h4><ul className="list-disc pl-5 text-sm text-muted-foreground">{values.map((value, i) => <li key={i}>{value}</li>)}</ul></div>)}</section>}<p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">Places come from the Quanturs catalog. Diet matches are based on catalog tags only; always confirm allergies, hours and prices with each venue.</p><Button variant="outline" onClick={() => setActiveGuide(null)}>Back to planning</Button></div> : <p role="alert" className="mt-4 text-destructive">This guide could not be displayed.</p>)}
        </DialogContent>
      </Dialog>
    </section>
  );
};
export default AIGuideSection;
