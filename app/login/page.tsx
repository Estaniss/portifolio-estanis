// app/login/page.tsx — login simples só pra você (dono do portfólio) acessar /admin

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Alert,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Login — Painel Analytics
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={loading} fullWidth>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </Stack>
    </Container>
  );
}
