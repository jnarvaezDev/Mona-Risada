# Mona Rizada — Trivia de fans

Aplicación web para registrar participantes, resolver una trivia y mostrar un ranking en tiempo real para la campaña **Mona Rizada**.

## Quick path

1. Instalá dependencias con `npm install`.
2. Creá un archivo `.env` con las variables de Supabase.
3. Levantá el proyecto con `npm run dev`.

## Qué hace

- Muestra una landing visual de campaña.
- Registra participantes con nombre, celular e Instagram.
- Permite responder una única trivia.
- Calcula puntaje por velocidad de respuesta.
- Guarda resultados en Supabase.
- Construye un ranking real con placeholders cuando aún no hay 10 participantes.

## Stack

| Tema | Decisión |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + componentes Radix/shadcn |
| Datos | Supabase |
| Routing | React Router |
| Testing | Vitest |

## Variables de entorno

Creá un archivo `.env` con:

```bash
VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
VITE_SUPABASE_ANON_KEY="<tu-anon-key>"
```

> `VITE_SUPABASE_URL` debe ser la URL base del proyecto, sin `/rest/v1/`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Sistema de puntuación

- Respuesta incorrecta: `0 puntos`
- Respuesta correcta antes de `10s`: puntaje continuo
- Respuesta correcta desde `10s` en adelante: `5 puntos`

Fórmula actual:

```ts
if (!correct) return 0;
if (seconds >= 10) return 5;

const normalizedRemainingTime = (10 - seconds) / 10;
return Math.max(5, Math.ceil(5 + 45 * normalizedRemainingTime ** 2));
```

## Estructura principal

```text
src/
  assets/           # imágenes y fuentes de campaña
  components/       # header, card de trivia, utilidades visuales
  hooks/            # timer y cálculo de puntaje
  pages/            # home y ranking
  lib/              # cliente/config compartida
```

## Checklist rápida

- [ ] `.env` configurado con credenciales válidas de Supabase
- [ ] `npm run dev` abre la app sin errores
- [ ] `npm run build` compila correctamente
- [ ] La tabla/colección de Supabase acepta los registros de trivia

## Notas

- El ranking usa data real; si faltan participantes, muestra placeholders.
- La identidad visual usa assets y tipografías locales de la campaña.
- El proyecto hoy está pensado para **un intento por usuario**.
