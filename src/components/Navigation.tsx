import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

const Navigation = () => (
  <header className="border-b border-border bg-background">
    <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4 md:px-10" aria-label="Main navigation">
      <Link to="/" className="editorial-serif text-3xl font-semibold leading-none text-primary">Quanturs<span className="text-accent">.</span></Link>
      <div className="flex items-center gap-3 sm:gap-7">
        <a href="/#create-guide" className="hidden text-sm font-medium hover:text-accent sm:inline">Plan a trip</a>
        <a href="/#explore" className="hidden text-sm font-medium hover:text-accent sm:inline">Explore</a>
        <UserMenu />
      </div>
    </nav>
  </header>
);
export default Navigation;
