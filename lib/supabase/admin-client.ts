// lib/supabase/admin-client.ts
//
// Client com a service role key — SÓ pode ser importado em código
// server-side (Route Handlers, jobs). Nunca importar isso em um
// componente "use client".
//
// A service role ignora RLS, por isso o schema (001_schema_fase1.sql)
// não cria nenhuma policy: o acesso é controlado inteiramente aqui,
// nunca pelo client do navegador.

import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidos. A service role NUNCA leva prefixo NEXT_PUBLIC_."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
