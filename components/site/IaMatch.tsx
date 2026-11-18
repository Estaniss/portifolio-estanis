"use client";

import { useState, type FormEvent } from "react";
import styles from "./IaMatch.module.css";
import { Reveal } from "./Reveal";
import { useRecordIaMatch } from "@/lib/analytics/use-ia-match";
import type { IaMatchResult } from "@/app/api/ia-match/analyze/route";

const MAX_LENGTH = 4000;

const EXAMPLE_JOB = `Frontend Developer Pleno

Estamos buscando uma pessoa desenvolvedora Frontend para construir e evoluir aplicações web modernas.

Requisitos:
- Experiência com React e TypeScript.
- Conhecimento em Next.js.
- Experiência com consumo e integração de APIs REST.
- Familiaridade com gerenciamento de estado.
- Conhecimento em HTML, CSS e interfaces responsivas.
- Experiência com Git e trabalho em equipe.

Diferenciais:
- Conhecimento em Node.js.
- Experiência com metodologias ágeis.
- Conhecimento em testes automatizados.
- Familiaridade com boas práticas de arquitetura e Clean Code.`;

const TEXT = {
  pt: {
    eyebrow: "Uma experiência com IA",
    index: "05 — EXPERIMENTE",
    titleStart: "E se a próxima vaga",
    titleHighlight: "fosse a certa?",
    intro:
      "Descubra o quanto uma oportunidade combina com minha experiência. Cole uma descrição de vaga e deixe a IA fazer uma análise honesta do meu perfil profissional.",
    benefitOne: "Compatibilidade com a vaga",
    benefitTwo: "Tecnologias e habilidades em comum",
    benefitThree: "Requisitos que merecem atenção",
    previewLabel: "O QUE VOCÊ VAI DESCOBRIR",
    previewTitle: "Uma análise além das palavras-chave.",
    previewDescription:
      "A IA considera experiência, stack e senioridade para identificar onde existe compatibilidade — e onde existem lacunas.",
    previewScore: "Nível de compatibilidade",
    previewStack: "Stack em comum",
    previewGaps: "Pontos de atenção",
    formEyebrow: "ANÁLISE PERSONALIZADA",
    formTitle: "Vamos testar uma vaga?",
    formDescription:
      "Preencha os campos abaixo. A descrição da vaga é tudo o que preciso para começar.",
    companyLabel: "EMPRESA",
    optional: "OPCIONAL",
    companyPlaceholder: "Ex.: Nubank, Stone, iFood...",
    jobLabel: "DESCRIÇÃO DA VAGA",
    jobPlaceholder:
      "Cole aqui a descrição completa da oportunidade: responsabilidades, requisitos, tecnologias e experiência esperada...",
    example: "Testar com uma vaga de exemplo",
    analyzing: "ANALISANDO SEU PERFIL...",
    submit: "Descobrir minha compatibilidade",
    scoreLabel: "COMPATIBILIDADE",
    stackTitle: "STACK EM COMUM",
    gapsTitle: "PONTOS DE ATENÇÃO",
    error: "Não foi possível concluir a análise. Tente novamente.",
    required: "Cole a descrição da vaga para iniciar a análise.",
    characterCount: "caracteres",
    resultEyebrow: "RESULTADO DA ANÁLISE",
    newAnalysis: "Analisar outra vaga",
  },
  en: {
    eyebrow: "An AI-powered experience",
    index: "05 — TRY IT",
    titleStart: "What if your next job",
    titleHighlight: "was the right one?",
    intro:
      "Find out how well an opportunity matches my experience. Paste a job description and let AI provide an honest assessment of my professional profile.",
    benefitOne: "Compatibility with the position",
    benefitTwo: "Shared technologies and skills",
    benefitThree: "Requirements worth considering",
    previewLabel: "WHAT YOU WILL DISCOVER",
    previewTitle: "An analysis beyond keywords.",
    previewDescription:
      "AI considers experience, stack and seniority to identify where there is a match — and where there are gaps.",
    previewScore: "Compatibility level",
    previewStack: "Shared stack",
    previewGaps: "Gaps to consider",
    formEyebrow: "PERSONALIZED ANALYSIS",
    formTitle: "Want to test a job?",
    formDescription:
      "Fill in the fields below. The job description is all I need to get started.",
    companyLabel: "COMPANY",
    optional: "OPTIONAL",
    companyPlaceholder: "e.g. Nubank, Stone, iFood...",
    jobLabel: "JOB DESCRIPTION",
    jobPlaceholder:
      "Paste the full job description here: responsibilities, requirements, technologies and expected experience...",
    example: "Try with a sample job",
    analyzing: "ANALYZING YOUR PROFILE...",
    submit: "Discover my compatibility",
    scoreLabel: "COMPATIBILITY",
    stackTitle: "SHARED STACK",
    gapsTitle: "GAPS TO CONSIDER",
    error: "The analysis could not be completed. Please try again.",
    required: "Paste a job description to start the analysis.",
    characterCount: "characters",
    resultEyebrow: "ANALYSIS RESULT",
    newAnalysis: "Analyze another job",
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

  function handleExample() {
    setCompanyName("");
    setJobDescription(EXAMPLE_JOB);
    setError(null);
    setResult(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError(t.required);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ia-match/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          company_name: companyName || undefined,
          language: lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t.error);
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
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="ia-match"
      className={styles.section}
      aria-labelledby="ia-match-title"
    >
      <div className={styles.glow} aria-hidden="true" />

      <div className="container">
        <Reveal>
          <div className={styles.heading}>
            <div className={styles.headingTop}>
              <p className="eyebrow">{t.eyebrow}</p>
              <span className={styles.sectionIndex}>{t.index}</span>
            </div>

            <h2 id="ia-match-title" className={styles.title}>
              {t.titleStart}
              <br />
              <span>{t.titleHighlight}</span>
            </h2>

            <p className={styles.intro}>{t.intro}</p>
          </div>

          <div className={styles.layout}>
            <div className={styles.presentation}>
              <div className={styles.previewHeader}>
                <span className={styles.previewDot} />
                <span>{t.previewLabel}</span>
              </div>

              <h3 className={styles.previewTitle}>{t.previewTitle}</h3>

              <p className={styles.previewDescription}>
                {t.previewDescription}
              </p>

              <div className={styles.previewCard}>
                <div className={styles.previewCardTop}>
                  <span className={styles.previewCardIcon}>01</span>
                  <span>{t.previewScore}</span>
                </div>

                <div className={styles.previewScore}>
                  <span>↗</span>
                  <strong>01</strong>
                  <small>/ 03</small>
                </div>

                <div className={styles.previewLine}>
                  <span />
                </div>

                <div className={styles.previewCardFooter}>
                  <span>{t.previewStack}</span>
                  <span>{t.previewGaps}</span>
                </div>
              </div>

              <ul className={styles.benefits}>
                <li>
                  <span className={styles.check}>✓</span>
                  {t.benefitOne}
                </li>
                <li>
                  <span className={styles.check}>✓</span>
                  {t.benefitTwo}
                </li>
                <li>
                  <span className={styles.check}>✓</span>
                  {t.benefitThree}
                </li>
              </ul>

              <span className={styles.presentationFoot}>
                AI POWERED · PROFILE MATCHING
              </span>
            </div>

            <div className={styles.formPanel}>
              <div className={styles.formHeader}>
                <span className={styles.formEyebrow}>
                  <span className={styles.liveDot} />
                  {t.formEyebrow}
                </span>

                <h3 className={styles.formTitle}>{t.formTitle}</h3>

                <p className={styles.formDescription}>{t.formDescription}</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="company">
                    {t.companyLabel}
                    <span>{t.optional}</span>
                  </label>

                  <input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.companyPlaceholder}
                    autoComplete="organization"
                    disabled={loading}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="job">{t.jobLabel}</label>

                    <span className={styles.requiredMark}>*</span>
                  </div>

                  <textarea
                    id="job"
                    rows={7}
                    required
                    maxLength={MAX_LENGTH}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={t.jobPlaceholder}
                    disabled={loading}
                  />

                  <div className={styles.fieldFooter}>
                    <button
                      type="button"
                      className={styles.exampleButton}
                      onClick={handleExample}
                      disabled={loading}
                    >
                      <span>✳</span>
                      {t.example}
                    </button>

                    <span className={styles.count}>
                      {jobDescription.length}/{MAX_LENGTH}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className={styles.error} role="alert">
                    <span>!</span>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading || !jobDescription.trim()}
                >
                  <span>{loading ? t.analyzing : t.submit}</span>
                  {!loading && <span className={styles.submitArrow}>↗</span>}
                  {loading && <span className={styles.spinner} />}
                </button>

                <p className={styles.formNote}>
                  {lang === "pt"
                    ? "Análise baseada no meu perfil profissional e na descrição informada."
                    : "Analysis based on my professional profile and the description provided."}
                </p>
              </form>

              {result && (
                <div
                  className={styles.result}
                  aria-live="polite"
                  aria-label={t.resultEyebrow}
                >
                  <div className={styles.resultHeader}>
                    <span className={styles.resultEyebrow}>
                      <span className={styles.liveDot} />
                      {t.resultEyebrow}
                    </span>

                    <span className={styles.resultScoreLabel}>
                      {t.scoreLabel}
                    </span>
                  </div>

                  <div className={styles.resultScore}>
                    {Math.round(result.compatibility_score)}
                    <span>%</span>
                  </div>

                  <p className={styles.summary}>{result.summary}</p>

                  {result.predominant_stack.length > 0 && (
                    <div className={styles.resultBlock}>
                      <p className={styles.blockTitle}>{t.stackTitle}</p>

                      <div className={styles.pills}>
                        {result.predominant_stack.map((item) => (
                          <span
                            key={item}
                            className={`${styles.pill} ${styles.pillMatch}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.gaps.length > 0 && (
                    <div className={styles.resultBlock}>
                      <p className={styles.blockTitle}>{t.gapsTitle}</p>

                      <div className={styles.pills}>
                        {result.gaps.map((item) => (
                          <span
                            key={item}
                            className={`${styles.pill} ${styles.pillGap}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles.newAnalysis}
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                  >
                    {t.newAnalysis} ↗
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
