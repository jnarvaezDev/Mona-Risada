import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Clock, Trophy, Sparkles, Zap } from "lucide-react";
import { DecorativeText } from "@/components/DecorativeText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePoints, useTimer } from "@/hooks/use-timer";
import questions from "@/data/questions.json";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category?: string;
  date?: string;
};

const MAX_TIME = 15; // visual bar cap

type ParticipantForm = {
  fullName: string;
  document: string;
  phone: string;
  instagramUrl: string;
};

export const TriviaCard = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [question] = useState<Question>(questions[0]);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState<"register" | "trivia">("register");
  const [timerArmed, setTimerArmed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [participant, setParticipant] = useState<ParticipantForm>({
    fullName: "",
    document: "",
    phone: "",
    instagramUrl: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const elapsed = useTimer(loaded && step === "trivia" && timerArmed && selected === null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step !== "trivia") {
      setTimerArmed(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setTimerArmed(true);
    }, 450);

    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.clearTimeout(timer);
  }, [step]);

  const answered = selected !== null;
  const correct = answered && selected === question.correctIndex;
  const points = answered ? calculatePoints(correct, finalTime ?? 0) : 0;

  const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
  const normalizeInstagram = (value: string) => value.trim().replace(/^@+/, "");
  const sanitizePhoneInput = (value: string) => {
    const trimmed = value.replace(/[^\d\s()+-]/g, "");
    const hasLeadingPlus = trimmed.trimStart().startsWith("+");
    const withoutPlus = trimmed.replace(/\+/g, "");

    return hasLeadingPlus ? `+${withoutPlus}` : withoutPlus;
  };
  const sanitizeDocumentInput = (value: string) => value.replace(/\D/g, "");

  const validateRegistration = () => {
    if (!participant.fullName.trim()) {
      return "Ingresá tu nombre para participar.";
    }

    if (!participant.phone.trim()) {
      return "Ingresá tu celular para participar.";
    }

    if (!participant.document.trim()) {
      return "Ingresá tu documento para participar.";
    }

    if (!/^\+?[\d\s()-]+$/.test(participant.phone)) {
      return "El celular debe contener solo números (podés usar prefijo +).";
    }

    if (!normalizePhone(participant.phone)) {
      return "El celular no es válido.";
    }

    if (!participant.instagramUrl.trim()) {
      return "Ingresá tu usuario de Instagram.";
    }

    const instagramHandle = normalizeInstagram(participant.instagramUrl);

    if (!/^[a-zA-Z0-9._]{1,30}$/.test(instagramHandle)) {
      return "Ingresá un usuario de Instagram válido.";
    }

    return null;
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateRegistration();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setStep("trivia");
  };

  const handleSelect = async (idx: number) => {
    if (answered) return;
    const capturedTime = elapsed;
    const isCorrect = idx === question.correctIndex;
    const responseTimeMs = Math.round(capturedTime * 1000);

    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("trivia_entries").insert({
      full_name: participant.fullName.trim(),
      document: participant.document.trim(),
      phone: normalizePhone(participant.phone),
      instagram_url: `@${normalizeInstagram(participant.instagramUrl)}`,
      question_id: question.id,
      selected_option: question.options[idx],
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
    });

    if (error) {
      if (error.code === "23505") {
        setSubmitError("Ya participaste con ese celular o Instagram.");
      } else {
        setSubmitError("No pudimos guardar tu intento. Revisá tu conexión e intentá de nuevo.");
      }
      setIsSubmitting(false);
      return;
    }

    setFinalTime(capturedTime);
    setSelected(idx);
    setIsSubmitting(false);
  };

  const timerPct = Math.min((elapsed / MAX_TIME) * 100, 100);

  if (!loaded) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-card shadow-card p-10 md:p-12 animate-fade-in backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-brand animate-pulse-glow" />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest">Cargando trivia diaria</p>
              <p className="text-muted-foreground mt-2">Preparando tu próximo reto...</p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-brand animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" style={{ backgroundImage: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-card shadow-card backdrop-blur-sm">
        <div className="relative h-2 bg-muted overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-[width] duration-100 ease-linear",
              answered ? "bg-muted-foreground/30" : "bg-gradient-brand"
            )}
            style={{ width: `${answered ? timerPct : timerPct}%` }}
          />
        </div>

        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Trophy className="w-3.5 h-3.5" />
                Pregunta del día
              </span>
              {question.category && (
                <span className="hidden sm:inline-flex rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/80">
                  {question.category}
                </span>
              )}
            </div>
            <div className={cn(
              "flex items-center gap-1.5 font-mono font-bold tabular-nums text-sm md:text-base px-3 py-1.5 rounded-full transition-smooth",
               answered
                 ? "bg-white/10 text-white/75"
                 : elapsed > 10 ? "bg-destructive/20 text-white"
                 : elapsed > 5 ? "bg-primary/20 text-primary"
                 : "bg-success/20 text-white"
             )}>
              <Clock className="w-4 h-4" />
              {(answered ? finalTime ?? 0 : elapsed).toFixed(1)}s
            </div>
          </div>

          {step === "register" ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <p className="text-sm md:text-base text-foreground font-medium">
                Completá tus datos para habilitar la trivia.
                <br />
                Si aciertas, podrás sumar hasta 50 puntos, pero el tiempo juega... si te demorás te iré restando puntos.
                Si no acertás no sumarás puntos.
              </p>

              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-white/85">Nombre y apellido</Label>
                <Input
                  id="full-name"
                  value={participant.fullName}
                  onChange={(e) => setParticipant((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Ej: Martina Perez"
                  className="h-12 rounded-2xl border-white/10 bg-black/15 px-4 text-white placeholder:text-white/35"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document" className="text-white/85">Documento de Identidad (Cédula)</Label>
                <Input
                  id="document"
                  value={participant.document}
                  onChange={(e) => setParticipant((prev) => ({ ...prev, document: sanitizeDocumentInput(e.target.value) }))}
                  placeholder="Ej: 12345678"
                  inputMode="numeric"
                  className="h-12 rounded-2xl border-white/10 bg-black/15 px-4 text-white placeholder:text-white/35"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/85">Celular</Label>
                <Input
                  id="phone"
                  value={participant.phone}
                  onChange={(e) => setParticipant((prev) => ({ ...prev, phone: sanitizePhoneInput(e.target.value) }))}
                  placeholder="Ej: +57 000 0000000"
                  inputMode="tel"
                  className="h-12 rounded-2xl border-white/10 bg-black/15 px-4 text-white placeholder:text-white/35"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram-url" className="text-white/85">Instagram</Label>
                <Input
                  id="instagram-url"
                  value={participant.instagramUrl}
                  onChange={(e) => setParticipant((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                  placeholder="@username"
                  className="h-12 rounded-2xl border-white/10 bg-black/15 px-4 text-white placeholder:text-white/35"
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive font-medium">{formError}</p>
              )}

              <Button type="submit" size="lg" className="h-12 w-full rounded-2xl font-bold text-primary-foreground bg-gradient-brand hover:opacity-90">
                Continuar a la trivia
              </Button>
              <p className="text-center text-xs text-white/55">
                Al continuar aceptás los términos y condiciones de la experiencia.
              </p>
            </form>
          ) : (
            <>
          <DecorativeText
            as="h2"
            className="mb-8 text-balance text-2xl leading-tight text-foreground md:text-4xl"
            text={question.question}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {question.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrectOpt = idx === question.correctIndex;
              const showCorrect = answered && isCorrectOpt;
              const showWrong = answered && isSelected && !isCorrectOpt;

              return (
                <button
                  key={idx}
                  disabled={answered || isSubmitting}
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "group relative text-left p-4 md:p-5 rounded-2xl border-2 transition-bounce overflow-hidden",
                    "disabled:cursor-not-allowed",
                    !answered && "border-white/10 bg-black/15 hover:border-primary hover:-translate-y-1 hover:shadow-card active:translate-y-0",
                    showCorrect && "border-success bg-gradient-success text-success-foreground animate-bounce-in shadow-lg-soft",
                    showWrong && "border-destructive bg-gradient-error text-destructive-foreground animate-shake shadow-lg-soft",
                    answered && !showCorrect && !showWrong && "border-white/10 bg-white/10 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-xl grid place-items-center font-display text-sm transition-smooth",
                      !answered && "bg-white/10 text-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                      showCorrect && "bg-white/25 text-white",
                      showWrong && "bg-white/25 text-white",
                      answered && !showCorrect && !showWrong && "bg-white/10 text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 font-semibold text-base md:text-lg">
                      {opt}
                    </span>
                    {showCorrect && <Check className="w-6 h-6 flex-shrink-0" strokeWidth={3} />}
                    {showWrong && <X className="w-6 h-6 flex-shrink-0" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {submitError && !answered && (
            <p className="mt-4 text-sm text-destructive font-medium">{submitError}</p>
          )}

          {answered && (
            <div className="mt-8 animate-scale-in">
              <div className={cn(
                "rounded-2xl p-6 md:p-7 border-2",
                correct
                  ? "bg-gradient-success border-success/30 text-success-foreground"
                  : "bg-gradient-error border-destructive/30 text-destructive-foreground"
              )}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 grid place-items-center backdrop-blur-sm">
                    {correct ? (
                      <Trophy className="w-7 h-7" strokeWidth={2.5} />
                    ) : (
                      <X className="w-7 h-7" strokeWidth={3} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-90">
                      {correct ? "¡Respuesta correcta!" : "Respuesta incorrecta"}
                    </p>
                    <p className="font-score mt-1 text-2xl font-bold md:text-3xl">
                   {correct ? `+${points} puntos` : "0 puntos"}
                     </p>
                    <p className="text-sm md:text-base opacity-95 mt-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Respondiste en <span className="font-bold">{(finalTime ?? 0).toFixed(1)} segundos</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  onClick={() => navigate("/ranking")}
                  className="h-14 w-full rounded-2xl bg-gradient-brand text-base font-bold text-primary-foreground shadow-md transition-smooth hover:opacity-90 hover:shadow-glow"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Ver ranking
                </Button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
