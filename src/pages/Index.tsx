import { AppHeader } from "@/components/AppHeader";
import { PageBackground } from "@/components/PageBackground";
import { TriviaCard } from "@/components/TriviaCard";
import heroArtists from "@/assets/Mindo y Song.png";
import lettering from "@/assets/Lettering.png";
import sparkle from "@/assets/destello.png";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="container pb-10 pt-2 md:pb-14 md:pt-4">
        <section className="mx-auto max-w-5xl text-center animate-fade-in-up">
          <p className="mx-auto max-w-2xl text-sm font-bold uppercase tracking-[0.35em] text-white/80 md:text-base">
            Trivia oficial de fans
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            LOS SUEÑOS SE CUMPLEN<br></br>y yo ya cumplí el mío con mi nuevo tema MONA RIZADA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 md:text-lg">
            Acompáñame a su lanzamiento en mi bar Callao, solo debes inscribirte y podrás ser uno de los elegidos.
          </p>

          <div className="relative mx-auto mt-8 max-w-4xl">
            <img
              src={heroArtists}
              alt="Mindo y Song"
              className="mx-auto w-full max-w-4xl select-none object-contain"
              draggable={false}
            />
            <div className="absolute inset-x-0 -bottom-8 md:-bottom-12">
              <div className="relative mx-auto w-[18rem] max-w-[72vw] md:w-[28rem] lg:w-[32rem]">
                <img
                  src={sparkle}
                  alt=""
                  className="pointer-events-none absolute -right-3 -top-6 w-24 select-none md:-right-8 md:-top-10 md:w-36"
                  draggable={false}
                />
                <img
                  src={lettering}
                  alt="Lettering de campaña"
                  className="relative z-10 w-full select-none object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.4)]"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <p className="mx-auto mt-14 max-w-4xl text-center text-sm font-medium leading-6 text-white/90 md:mt-16 md:text-xl md:leading-8">
            Sólo los <span className="font-score font-bold">10</span> primeros dentro del ranking podrán tener <span className="font-score font-bold">1</span> acceso* para acompañarme este <span className="font-score font-bold">4</span> de junio en el lanzamiento de mi canción en Cali.
          </p>
        </section>

        <section className="relative z-10 mt-20 md:mt-24">
          <TriviaCard />
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-white/70 md:text-sm">
          Dejá tus datos, resolvé la trivia diaria y sumá todo lo que puedas: cada acierto rápido puede darte hasta 50 puntos, con un mínimo de 5 si acertás después de 10 segundos.
        </p>
      </main>
      <footer className="container py-8 text-center text-xs text-white/55">
        © {new Date().getFullYear()} Trivia oficial de la campaña.
      </footer>
    </div>
  );
};

export default Index;
