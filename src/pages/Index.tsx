import { AppHeader } from "@/components/AppHeader";
import { PageBackground } from "@/components/PageBackground";
import { TriviaCard } from "@/components/TriviaCard";
import heroArtists from "@/assets/Mindo y Song.png";
import lettering from "@/assets/Lettering.png";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="container pb-10 pt-0 md:pb-14 md:pt-0">
        <section className="mx-auto max-w-5xl text-center animate-fade-in-up">
          <div className="relative mx-auto mt-0 max-w-4xl md:-mt-4">
            <img
              src={heroArtists}
              alt="Mindo y Song"
              className="mx-auto w-full max-w-4xl select-none object-contain"
              draggable={false}
            />
          </div>

          <div className="relative z-10 mx-auto -mt-14 max-w-4xl md:-mt-28">
            <h1 className="text-3xl font-bold uppercase leading-none text-white md:text-[4.2rem]">
              LOS SUEÑOS SE CUMPLEN
            </h1>
            <p className="mx-auto mt-1 max-w-3xl text-base text-white/90 md:mt-2 md:text-[2.1rem] md:leading-none">
              y yo ya cumplí el mío con mi nuevo tema
            </p>
          </div>

          <div className="relative z-20 mx-auto -mt-2 max-w-[18rem] md:-mt-3 md:max-w-[32rem] lg:max-w-[36rem]">
            <img
              src={lettering}
              alt="Mona Rizada"
              className="relative z-10 w-full select-none object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.4)]"
              draggable={false}
            />
          </div>

          <p className="mx-auto -mt-2 max-w-5xl text-center text-sm font-medium leading-6 text-white/90 md:-mt-3 md:text-2xl md:leading-9">
            Sólo los <span className="font-score font-bold">10</span> primeros dentro del ranking podrán tener <span className="font-score font-bold">1</span> acceso* para acompañarme este <span className="font-score font-bold">4</span> de junio en el lanzamiento de mi canción en Cali.
            <br></br>
            ¡Concentradito que es una sola pregunta y solo tendrás una oportunidad!
          </p>
        </section>

        <section className="relative z-10 mt-20 md:mt-24">
          <TriviaCard />
        </section>

        
      </main>
      <footer className="container py-8 text-center text-xs text-white/55">
        <p>© {new Date().getFullYear()} Trivia oficial de la campaña.</p>
        <p className="mx-auto mt-4 max-w-5xl text-left text-[11px] leading-5 text-white/70 md:text-center md:text-xs md:leading-6">
          *Al inscribirte, autorizas que tus datos sean tratados exclusivamente para gestionar tu participación en la actividad promocional de fidelización del tema musical &quot;Mona Rizada&quot; (4 de junio de 2026), sin fines comerciales ni de mercadeo. El acceso a la invitación se asignará mediante una dinámica de selección digital en vivo, válida únicamente para mayores de edad residentes en Colombia que cuenten con un perfil público en la red social de la transmisión. El beneficio consiste única y exclusivamente en la entrada al evento de lanzamiento en la ciudad de Cali. Este incentivo no incluye tiquetes, transporte, hospedaje, viáticos ni alimentación; por lo tanto, si resides en cualquier otra ciudad, deberás asumir la totalidad de los costos de traslado por tu cuenta y riesgo, adicional al consumo fuera del evento. Esta dinámica no constituye un juego de suerte y azar ni sorteo, sino una actividad de interacción y cumplimiento de requisitos. El organizador se exime de cualquier responsabilidad por la imposibilidad del participante seleccionado para asistir al lugar del evento.
        </p>
      </footer>
    </div>
  );
};

export default Index;
