// components/site/IaMatch.tsx
//
// Isso chama a API do Gemini a cada análise — tem custo real por uso,
// mesmo na camada gratuita (tem limite de requisições/minuto). O limite
// de caracteres no formulário e no backend é a proteção básica; se
// virar alvo de spam, o próximo passo é rate limit por IP.

"use client";

import { useState, type FormEvent } from "react";
import styles from "./IaMatch.module.css";
import { Reveal } from "./Reveal";
import { useRecordIaMatch } from "@/lib/analytics/use-ia-match";
import type { IaMatchResult } from "@/app/api/ia-match/analyze/route";

const MAX_LENGTH = 4000;

export function IaMatch() {
  const recordIaMatch = useRecordIaMatch();
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IaMatchResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ia-match/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          company_name: companyName || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível analisar agora.");
        return;
      }

      const analysis = data as IaMatchResult;
      setResult(analysis);

      recordIaMatch({
        compatibility_score: analysis.compatibility_score,
        company_name: companyName || undefined,
        seniority: analysis.seniority_estimate,
        predominant_stack: analysis.predominant_stack,
        hard_skills: analysis.hard_skills,
        soft_skills: analysis.soft_skills,
      });
    } catch {
      setError("Não foi possível analisar agora. Tenta de novo em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ia-match" className={styles.section}>
      <div className="container">
        <Reveal>
        <p className="eyebrow">IA Match</p>
        <h2 className={styles.title}>Sua vaga combina comigo?</h2>
        <p className={styles.intro}>
          Cola a descrição de uma vaga e uma IA compara com meu perfil real —
          stack, experiência e senioridade. Sem enfeite: se não bater, ela
          aponta onde não bate.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="company">EMPRESA (OPCIONAL)</label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="job">DESCRIÇÃO DA VAGA</label>
            <textarea
              id="job"
              rows={6}
              required
              maxLength={MAX_LENGTH}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className={styles.count}>
              {jobDescription.length}/{MAX_LENGTH}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "ANALISANDO..." : "ANALISAR COMPATIBILIDADE"}
          </button>
        </form>

        {result && (
          <div className={styles.result}>
            <div>
              <div className={styles.score}>{Math.round(result.compatibility_score)}%</div>
              <div className={styles.scoreLabel}>COMPATIBILIDADE</div>
            </div>
            <div>
              <p className={styles.summary}>{result.summary}</p>

              {result.predominant_stack.length > 0 && (
                <>
                  <p className={styles.blockTitle}>STACK EM COMUM</p>
                  <div className={styles.pills}>
                    {result.predominant_stack.map((item) => (
                      <span key={item} className={`${styles.pill} ${styles.pillMatch}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {result.gaps.length > 0 && (
                <>
                  <p className={styles.blockTitle}>PONTOS DE ATENÇÃO</p>
                  <div className={styles.pills}>
                    {result.gaps.map((item) => (
                      <span key={item} className={`${styles.pill} ${styles.pillGap}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        </Reveal>
      </div>
    </section>
  );
}
