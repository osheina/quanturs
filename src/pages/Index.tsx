import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AIGuideSection from '@/components/AIGuideSection';
import MainContent from '@/components/MainContent';
import SearchBar from '@/components/SearchBar';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <HeroSection />
    <main>
      <AIGuideSection />
      <section id="explore" className="border-t border-border px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">FIELD NOTES / 02</p>
          <div className="mt-3 grid gap-5 border-b border-border pb-8 md:grid-cols-[1fr_1fr] md:items-end">
            <h2 className="text-5xl leading-none md:text-6xl">Find your kind of place.</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">Search the catalog, then browse stays, dining, and things to do.</p>
          </div>
          <div className="mt-8"><SearchBar /></div>
        </div>
      </section>
      <MainContent />
      <section className="border-t border-border px-6 py-12 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl md:text-4xl">Immersive VR Experiences</h2>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Interactive previews · Coming soon</p>
        </div>
      </section>
    </main>
    <footer className="border-t border-border px-6 py-6 text-sm text-muted-foreground md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><span className="editorial-serif text-2xl text-foreground">Quanturs.</span><span>Travel with intention.</span></div></footer>
  </div>
);
export default Index;
