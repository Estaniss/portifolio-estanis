// components/site/IaMatch.tsx

"use client";

import { useState, type FormEvent } from "react";
import styles from "./IaMatch.module.css";
import { Reveal } from "./Reveal";
import { useRecordIaMatch } from "@/lib/analytics/use-ia-match";
import type { IaMatchResult } from "@/app/api/ia-match/analyze/route";

const MAX_LENGTH = 4000;

const TEXT = {
  pt: {
    eyebrow: "IA Match",
    title: "Sua vaga combina comigo?",
    intro: "Cola a descrição de uma vaga e uma IA compara com meu perfil real — stack, experiência e senioridade. Sem enfeite: se não bater, ela aponta onde não bate.",
    companyLabel: "EMPRESA (OPCIONAL)",
    jobLabel: "DESCRIÇÃO DA VAGA",
    analyzing: "ANALISANDO...",
    submit: "ANALISAR COMPATIBILIDADE",
    scoreLabel: "COMPATIBILIDADE",
    stackTitle: "STACK EM COMUM",
    gapsTitle: "PONTOS DE ATENÇÃO",
  },
  en: {
    eyebrow: "IA Match",
    title: "Does your job match me?",
    intro: "Paste a job description and an AI compares it against my real profile — stack, experience and seniority. No sugarcoating: if it doesn't fit, it says where.",
    companyLabel: "COMPANY (OPTIONAL)",
    jobLabel: "JOB DESCRIPTION",
    analyzing: "ANALYZING...",
    submit: "ANALYZE COMPATIBILITY",
    scoreLabel: "COMPATIBILITY",
    stackTitle: "SHARED STACK",
    gapsTitle: "GAPS TO NOTE",
  },
} as const;

export function IaMatch({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];
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
          language: lang, // pede pra IA responder no mesmo idioma da página
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "—");
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
      setError("—");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ia-match" className={styles.section}>
      <div className="container">
        <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.intro}>{t.intro}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="company">{t.companyLabel}</label>
            <input id="company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="job">{t.jobLabel}</label>
            <textarea
              id="job"
              rows={6}
              required
              maxLength={MAX_LENGTH}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className={styles.count}>{jobDescription.length}/{MAX_LENGTH}</div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? t.analyzing : t.submit}
          </button>
        </form>

        {result && (
          <div className={styles.result}>
            <div>
              <div className={styles.score}>{Math.round(result.compatibility_score)}%</div>
              <div className={styles.scoreLabel}>{t.scoreLabel}</div>
            </div>
            <div>
              <p className={styles.summary}>{result.summary}</p>

              {result.predominant_stack.length > 0 && (
                <>
                  <p className={styles.blockTitle}>{t.stackTitle}</p>
                  <div className={styles.pills}>
                    {result.predominant_stack.map((item) => (
                      <span key={item} className={`${styles.pill} ${styles.pillMatch}`}>{item}</span>
                    ))}
                  </div>
                </>
              )}

              {result.gaps.length > 0 && (
                <>
                  <p className={styles.blockTitle}>{t.gapsTitle}</p>
                  <div className={styles.pills}>
                    {result.gaps.map((item) => (
                      <span key={item} className={`${styles.pill} ${styles.pillGap}`}>{item}</span>
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
