// components/ia-match/IaMatchTool.tsx
//
// Versão de teste da ferramenta IA Match: simula uma análise (sem chamar
// LLM de verdade) só pra exercitar o registro via useRecordIaMatch().
// No projeto real, troque handleAnalyze pela chamada de verdade à sua
// lógica de análise — o que importa pro analytics é só o resultado final.

"use client";

import { useState } from "react";
import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useRecordIaMatch } from "@/lib/analytics/use-ia-match";

export function IaMatchTool() {
  const recordIaMatch = useRecordIaMatch();
  const [result, setResult] = useState<{ score: number } | null>(null);

  function handleAnalyze() {
    // Simulação — no projeto real, isso vem da resposta do LLM.
    const score = Math.round(60 + Math.random() * 35);

    recordIaMatch({
      compatibility_score: score,
      company_name: "Empresa Teste",
      seniority: "pleno",
      predominant_stack: ["React", "Node.js", "TypeScript"],
      hard_skills: ["TypeScript", "AWS", "PostgreSQL"],
      soft_skills: ["Comunicação", "Trabalho em equipe"],
    });

    setResult({ score });
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            IA Match (teste)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clica no botão pra simular uma análise e gerar um registro em
            ia_match_runs.
          </Typography>
          <Button variant="contained" onClick={handleAnalyze} sx={{ alignSelf: "flex-start" }}>
            Analisar compatibilidade
          </Button>
          {result && (
            <Chip label={`Compatibilidade: ${result.score}%`} color="primary" sx={{ alignSelf: "flex-start" }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
