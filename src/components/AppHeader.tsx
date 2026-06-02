import logo from "@/assets/logo-trivia.png";
import { Link, useLocation } from "react-router-dom";

export const AppHeader = () => {
  const location = useLocation();
  return (
    <header className="relative z-20">
      <div className="container flex items-center justify-between gap-3 py-4 md:gap-4 md:py-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 group">
          <img
            src={logo}
            alt="Logo de la campaña"
            className="h-[4.5rem] md:h-24 w-auto transition-bounce group-hover:scale-105 drop-shadow-[0_8px_18px_rgba(0,0,0,0.3)]"
            draggable={false}
          />
        </Link>
        <nav className="flex shrink-0 items-center self-center gap-2 rounded-full border border-white/10 bg-black/15 px-2 py-2 backdrop-blur-sm md:gap-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-smooth ${
              location.pathname === "/"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-white/75 hover:text-white hover:bg-white/10"
            }`}
          >
            Trivia
          </Link>
          <Link
            to="/ranking"
            className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-smooth ${
              location.pathname === "/ranking"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-white/75 hover:text-white hover:bg-white/10"
            }`}
          >
            Ranking
          </Link>
        </nav>
      </div>
    </header>
  );
};
