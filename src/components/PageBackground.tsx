import background from "@/assets/fondo.png";

export const PageBackground = () => {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,213,74,0.18),_transparent_28%),linear-gradient(180deg,rgba(64,8,14,0.35),rgba(64,8,14,0.85))]" />
      <img
        src={background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-55 pointer-events-none select-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,10,17,0.1),rgba(66,10,17,0.68)_55%,rgba(41,5,9,0.95))]" />
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#25060a] via-[#25060a]/70 to-transparent" />
    </div>
  );
};
