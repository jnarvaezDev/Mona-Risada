import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase. Revisá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
}

if (supabaseUrl.includes("/rest/v1")) {
  throw new Error("VITE_SUPABASE_URL debe ser la URL base del proyecto (ej: https://tu-proyecto.supabase.co), sin /rest/v1/.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
