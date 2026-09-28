import { ArrowDownRight } from "lucide-react";
import coast from "@/assets/california-coast-editorial.jpg";

const HeroSection = () => (
  <section className="relative isolate flex min-h-[390px] items-center overflow-hidden md:min-h-[490px]">
    <img src={coast} alt="Sunlit California coastline and a winding coastal path" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-center" />
    <div className="absolute inset-0" style={{ background: "var(--hero-veil)" }} />
    <div className="relative mx-auto w-full max-w-7xl px-6 py-12 text-primary-foreground md:px-10">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]">THE TRAVEL JOURNAL · CALIFORNIA EDITION</p>
      <h1 className="max-w-3xl text-6xl leading-[0.88] sm:text-7xl md:text-8xl">Quanturs<span className="text-accent">.</span><br /><em className="font-normal">Go your own way.</em></h1>
      <p className="mt-7 max-w-md text-base leading-relaxed md:text-lg">An itinerary shaped by your interests, your pace, and real places from our travel catalog.</p>
      <a href="#create-guide" className="mt-8 inline-flex items-center gap-3 border-b border-primary-foreground pb-2 text-sm font-semibold transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring">Create your itinerary <ArrowDownRight className="h-4 w-4" /></a>
    </div>
    <span className="absolute bottom-5 right-6 text-xs uppercase tracking-[0.16em] text-primary-foreground">California coast · A place to begin</span>
  </section>
);
export default HeroSection;
