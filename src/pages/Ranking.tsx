import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { DecorativeText } from "@/components/DecorativeText";
import { PageBackground } from "@/components/PageBackground";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy, Medal, Award, Crown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = { name: string; score: number };
type RankingCacheEntry = {
  full_name: string | null;
  score: number | null;
  rank: number | null;
  refreshed_at: string | null;
};

const REFRESH_COOLDOWN_MS = 30_000;

const podiumStyles = [
  { gradient: "bg-gradient-gold", ring: "ring-gold/40", text: "text-gold", icon: Crown, label: "Oro" },
  { gradient: "bg-gradient-silver", ring: "ring-silver/40", text: "text-silver", icon: Medal, label: "Plata" },
  { gradient: "bg-gradient-bronze", ring: "ring-bronze/40", text: "text-bronze", icon: Award, label: "Bronce" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const createPendingRows = (start: number, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    kind: "pending" as const,
    position: start + index,
  }));

const pendingCopy = (isLoading: boolean) =>
  isLoading
    ? { title: "Cargando ranking", subtitle: "Trayendo puntajes reales" }
    : { title: "Lugar disponible", subtitle: "Esperando nuevos participantes" };

const formatElapsedSeconds = (timestamp: string, now: number) => {
  const updatedAt = new Date(timestamp).getTime();

  if (!Number.isFinite(updatedAt)) return null;

  const elapsedSeconds = Math.max(0, Math.floor((now - updatedAt) / 1000));

  if (elapsedSeconds === 1) return "Actualizado hace 1 segundo";

  return `Actualizado hace ${elapsedSeconds} segundos`;
};

const Ranking = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const isMountedRef = useRef(true);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchRanking = async (mode: "initial" | "manual") => {
      if (mode === "initial") {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setLoadError(null);

      const { data, error } = await supabase
        .from("ranking_cache")
        .select("full_name, score, rank, refreshed_at")
        .order("rank", { ascending: true })
        .limit(10);

      if (!isMountedRef.current) return;

      if (error) {
        setLoadError("No pudimos cargar el ranking en este momento.");
        if (mode === "initial") {
          setRows([]);
          setLastUpdatedAt(null);
        }

        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const nextRows = (data as RankingCacheEntry[])
        .sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER))
        .map((entry) => ({
          name: entry.full_name?.trim() ?? "",
          score: entry.score ?? 0,
        }))
        .filter((entry) => entry.name);

      const cacheTimestamp = (data as RankingCacheEntry[]).find((entry) => entry.refreshed_at)?.refreshed_at ?? null;

      setRows(nextRows);
      setLastUpdatedAt(cacheTimestamp);
      setIsLoading(false);
      setIsRefreshing(false);
    };

    void fetchRanking("initial");
  }, []);

  const cooldownRemainingSeconds = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000)) : 0;
  const isRefreshBlocked = cooldownRemainingSeconds > 0;
  const updatedAgoLabel = useMemo(
    () => (lastUpdatedAt ? formatElapsedSeconds(lastUpdatedAt, now) : null),
    [lastUpdatedAt, now],
  );

  const handleRefresh = async () => {
    if (isRefreshing || isRefreshBlocked) return;

    setCooldownUntil(Date.now() + REFRESH_COOLDOWN_MS);
    setIsRefreshing(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("ranking_cache")
      .select("full_name, score, rank, refreshed_at")
      .order("rank", { ascending: true })
      .limit(10);

    if (!isMountedRef.current) return;

    if (error) {
      setLoadError("No pudimos cargar el ranking en este momento.");
      setIsRefreshing(false);
      return;
    }

    const nextRows = (data as RankingCacheEntry[])
      .sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER))
      .map((entry) => ({
        name: entry.full_name?.trim() ?? "",
        score: entry.score ?? 0,
      }))
      .filter((entry) => entry.name);

    const cacheTimestamp = (data as RankingCacheEntry[]).find((entry) => entry.refreshed_at)?.refreshed_at ?? null;

    setRows(nextRows);
    setLastUpdatedAt(cacheTimestamp);
    setIsRefreshing(false);
  };

  const [first, second, third, ...rest] = rows;
  const pendingState = pendingCopy(isLoading);
  const restItems = [
    ...rest.map((row, index) => ({ kind: "filled" as const, position: index + 4, row })),
    ...createPendingRows(rest.length + 4, Math.max(0, 7 - rest.length)),
  ];

  return (
      <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="container pb-8 pt-0 md:pb-14 md:pt-0">
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <p className="inline-block rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary md:text-sm">
            Ranking general
          </p>
          <h1 className="mt-4 text-balance font-display text-3xl text-foreground md:text-5xl lg:text-6xl">
            Ranking <span className="text-primary">TOP <span className="font-score">10</span></span>
          </h1>
          <p className="mt-3 text-base text-white/75 md:text-lg">
            Acá se ven los fans que mejor combinaron aciertos y velocidad en la trivia de la campaña.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 md:flex-row">
            <Button
              type="button"
              size="sm"
              onClick={() => void handleRefresh()}
              disabled={isRefreshing || isRefreshBlocked}
              className="rounded-full bg-white/10 px-4 text-white hover:bg-white/15"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Actualizando..." : isRefreshBlocked ? `Disponible en ${cooldownRemainingSeconds}s` : "Actualizar ranking"}
            </Button>
            {updatedAgoLabel && (
              <p className="text-xs font-medium text-white/55 md:text-sm">{updatedAgoLabel}</p>
            )}
          </div>
          {loadError && <p className="mt-3 text-sm font-medium text-primary">{loadError}</p>}
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto mb-10 md:mb-14">
          {[second, first, third].map((p, i) => {
            const rank = i === 1 ? 0 : i === 0 ? 1 : 2;
            const style = podiumStyles[rank];
            const heights = ["h-44 md:h-56", "h-56 md:h-72", "h-36 md:h-48"];

            if (!p) {
              return (
                <div
                  key={`pending-podium-${rank}`}
                  className="flex flex-col items-center animate-fade-in-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="relative mb-3 grid h-20 w-20 place-items-center rounded-full border border-dashed border-white/15 bg-white/5 ring-4 ring-white/5 ring-offset-4 ring-offset-[#52111a] shadow-card md:h-24 md:w-24">
                    <Skeleton className="h-8 w-8 rounded-full bg-white/10 md:h-10 md:w-10" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded-full bg-white/10" />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/45">{pendingState.title}</p>
                  <div className={cn(
                    "mt-3 grid w-full place-items-center rounded-t-[1.75rem] border border-dashed border-white/15 bg-white/5 text-white/45 shadow-card",
                    heights[i]
                  )}>
                    <div className="text-center">
                      <p className="font-score text-3xl font-bold leading-none md:text-5xl">#{rank + 1}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wider">{pendingState.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            }

            const Icon = style.icon;

            return (
              <div
                key={p.name}
                className="flex flex-col items-center animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={cn(
                  "relative mb-3 grid h-20 w-20 place-items-center rounded-full ring-4 ring-offset-4 ring-offset-[#52111a] shadow-card md:h-24 md:w-24",
                  style.gradient, style.ring
                )}>
                  <span className="font-display text-3xl md:text-4xl text-white drop-shadow">
                    {getInitials(p.name)}
                  </span>
                  <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white grid place-items-center shadow-md">
                    <Icon className={cn("w-5 h-5", style.text)} strokeWidth={2.5} />
                  </div>
                </div>
                <p className="max-w-full truncate text-sm font-bold text-foreground md:text-base">{p.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/65">{style.label}</p>
                <div className={cn(
                  "mt-3 grid w-full place-items-center rounded-t-[1.75rem] border border-white/10 text-white shadow-card",
                  style.gradient, heights[i]
                )}>
                  <div className="text-center">
                     <p className="font-score text-3xl font-bold leading-none md:text-5xl">#{rank + 1}</p>
                     <p className="font-score mt-2 text-xl font-bold md:text-2xl">{p.score}</p>
                     <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">pts</p>
                   </div>
                 </div>
              </div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-card shadow-card backdrop-blur-sm">
          <div className="border-b border-white/10 bg-black/10 p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <DecorativeText as="h2" className="text-lg md:text-xl" text="Posiciones 4 a 10" />
            </div>
          </div>
          <ul className="divide-y divide-white/10">
            {restItems.map((item, i) => (
              <li
                key={item.kind === "filled" ? item.row.name : `pending-${item.position}`}
                className={cn(
                  "flex items-center gap-4 p-4 transition-smooth animate-slide-in-right md:p-5",
                  item.kind === "filled" ? "hover:bg-white/5" : "bg-white/[0.02]"
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={cn(
                  "grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-base",
                  item.kind === "filled" ? "bg-white/10 font-score text-white/75" : "border border-dashed border-white/15 bg-white/5 font-score text-white/45"
                )}>
                  {item.position}
                </div>

                {item.kind === "filled" ? (
                  <>
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-lg text-primary">
                      {getInitials(item.row.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-foreground">{item.row.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-score text-lg font-bold text-foreground md:text-xl">{item.row.score}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">pts</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-dashed border-white/15 bg-white/5">
                      <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-36 max-w-full rounded-full bg-white/10" />
                      <p className="mt-1 text-xs font-medium text-white/45">{pendingState.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-score text-lg font-bold text-white/35 md:text-xl">--</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">pts</p>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

      </main>
      <footer className="container py-8 text-center text-xs text-white/55">
        <p>© {new Date().getFullYear()} Ranking oficial de la campaña.</p>
        <p className="mx-auto mt-4 max-w-5xl text-left text-[11px] leading-5 text-white/70 md:text-center md:text-xs md:leading-6">
          *Al inscribirte, autorizas que tus datos sean tratados exclusivamente para gestionar tu participación en la actividad promocional de fidelización del tema musical &quot;Mona Rizada&quot; (4 de junio de 2026), sin fines comerciales ni de mercadeo. El acceso a la invitación se asignará mediante una dinámica de selección digital en vivo, válida únicamente para mayores de edad residentes en Colombia que cuenten con un perfil público en la red social de la transmisión. El beneficio consiste única y exclusivamente en la entrada al evento de lanzamiento en la ciudad de Cali. Este incentivo no incluye tiquetes, transporte, hospedaje, viáticos ni alimentación; por lo tanto, si resides en cualquier otra ciudad, deberás asumir la totalidad de los costos de traslado por tu cuenta y riesgo, adicional al consumo fuera del evento. Esta dinámica no constituye un juego de suerte y azar ni sorteo, sino una actividad de interacción y cumplimiento de requisitos. El organizador se exime de cualquier responsabilidad por la imposibilidad del participante seleccionado para asistir al lugar del evento.
        </p>
      </footer>
    </div>
  );
};

export default Ranking;
