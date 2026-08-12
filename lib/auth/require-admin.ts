// lib/auth/require-admin.ts
//
// Verifica se quem está chamando a rota é você (autenticado via
// Supabase Auth). Usado em toda rota /api/analytics/dashboard/*.
//
// Pré-requisito: já ter um usuário criado no Supabase Auth
// (Authentication > Users > Add user) — é só você, não precisa
// de fluxo de cadastro.

import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Route Handlers de leitura não precisam re-escrever cookies.
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false as const };
  }

  return { authorized: true as const, user };
}
