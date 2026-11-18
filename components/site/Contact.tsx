"use client";

import { useState, type FormEvent } from "react";
import styles from "./Contact.module.css";
import { Reveal } from "./Reveal";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { TrackedDownloadLink } from "@/components/analytics/TrackedDownloadLink";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";

type Status = "idle" | "sending" | "sent" | "error";

const TEXT = {
  pt: {
    eyebrow: "Vamos conversar",
    index: "06 — CONTATO",
    title: "Boas ideias começam com uma conversa.",
    intro:
      "Tem um projeto, uma oportunidade ou simplesmente quer trocar uma ideia? Estou aberto a conhecer novos desafios.",
    availability: "ABERTO A OPORTUNIDADES",
    emailLabel: "PREFERE UM EMAIL?",
    socialLabel: "ME ENCONTRE TAMBÉM",
    linkedin: "LinkedIn",
    github: "GitHub",
    whatsapp: "WhatsApp",
    resumeLabel: "MATERIAIS PROFISSIONAIS",
    cvAts: "Currículo ATS",
    cvVisual: "Currículo visual",
    formEyebrow: "ENVIE UMA MENSAGEM",
    formTitle: "Vamos tirar sua ideia do papel?",
    formDescription: "Preencha os campos abaixo. Retorno assim que possível.",
    nameLabel: "SEU NOME",
    emailLabelField: "SEU EMAIL",
    messageLabel: "SUA MENSAGEM",
    namePlaceholder: "Como posso te chamar?",
    emailPlaceholder: "seu@email.com",
    messagePlaceholder:
      "Conte um pouco sobre o projeto, oportunidade ou assunto...",
    sending: "ENVIANDO MENSAGEM...",
    submit: "Enviar mensagem",
    sentTitle: "Mensagem enviada!",
    sent: "Obrigado pelo contato. Vou retornar assim que possível.",
    genericError:
      "Não foi possível enviar agora. Tente novamente em instantes.",
    errorTitle: "Não foi possível enviar",
    retry: "Tente novamente",
    footer: "FEITO COM INTENÇÃO · DISPONÍVEL PARA NOVOS DESAFIOS",
  },
  en: {
    eyebrow: "Let's connect",
    index: "06 — CONTACT",
    title: "Great ideas start with a conversation.",
    intro:
      "Have a project, an opportunity, or simply want to exchange ideas? I'm open to new challenges.",
    availability: "OPEN TO OPPORTUNITIES",
    emailLabel: "PREFER EMAIL?",
    socialLabel: "FIND ME ELSEWHERE",
    linkedin: "LinkedIn",
    github: "GitHub",
    whatsapp: "WhatsApp",
    resumeLabel: "PROFESSIONAL MATERIALS",
    cvAts: "ATS Resume",
    cvVisual: "Visual Resume",
    formEyebrow: "SEND A MESSAGE",
    formTitle: "Let's bring your idea to life.",
    formDescription:
      "Fill in the fields below. I'll get back to you as soon as possible.",
    nameLabel: "YOUR NAME",
    emailLabelField: "YOUR EMAIL",
    messageLabel: "YOUR MESSAGE",
    namePlaceholder: "What should I call you?",
    emailPlaceholder: "you@email.com",
    messagePlaceholder:
      "Tell me a little about your project, opportunity or idea...",
    sending: "SENDING MESSAGE...",
    submit: "Send message",
    sentTitle: "Message sent!",
    sent: "Thanks for reaching out. I'll get back to you as soon as possible.",
    genericError: "Couldn't send it right now. Please try again shortly.",
    errorTitle: "Couldn't send your message",
    retry: "Try again",
    footer: "MADE WITH INTENTION · OPEN TO NEW CHALLENGES",
  },
} as const;

export function Contact({ lang = "pt" }: { lang?: "pt" | "en" }) {
  const t = TEXT[lang];
  const { track } = useTracker();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("sending");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? t.genericError);
        setStatus("error");
        return;
      }

      track(EVENT_TYPES.CONTACT_SUBMIT);
      setStatus("sent");
    } catch {
      setErrorMessage(t.genericError);
      setStatus("error");
    }
  }

  return (
    <section
      id="contato"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className="container">
        <Reveal>
          <div className={styles.heading}>
            <div className={styles.headingTop}>
              <p className="eyebrow">{t.eyebrow}</p>
              <span className={styles.sectionIndex}>{t.index}</span>
            </div>

            <div className={styles.availability}>
              <span className={styles.statusDot} />
              {t.availability}
            </div>

            <h2 id="contact-title" className={styles.title}>
              {t.title}
              <span>.</span>
            </h2>

            <p className={styles.intro}>{t.intro}</p>
          </div>

          <div className={styles.layout}>
            <div className={styles.contactInfo}>
              <div className={styles.emailBlock}>
                <p className={styles.blockLabel}>{t.emailLabel}</p>

                <a
                  className={styles.emailLink}
                  href="mailto:estanislau124@hotmail.com"
                >
                  estanislau124
                  <span>@hotmail.com</span>
                  <span className={styles.emailArrow}>↗</span>
                </a>
              </div>

              <div className={styles.socialBlock}>
                <p className={styles.blockLabel}>{t.socialLabel}</p>

                <div className={styles.socialLinks}>
                  <TrackedContactLink
                    href="https://www.linkedin.com/in/thomas-estanislau-45ab05124/"
                    channel="linkedin"
                  >
                    <span className={styles.socialLink}>
                      <span>{t.linkedin}</span>
                      <span className={styles.linkArrow}>↗</span>
                    </span>
                  </TrackedContactLink>

                  <TrackedContactLink
                    href="https://github.com/estaniss"
                    channel="github"
                  >
                    <span className={styles.socialLink}>
                      <span>{t.github}</span>
                      <span className={styles.linkArrow}>↗</span>
                    </span>
                  </TrackedContactLink>

                  <TrackedContactLink
                    href="https://wa.me/5516997137932"
                    channel="whatsapp"
                  >
                    <span className={styles.socialLink}>
                      <span>{t.whatsapp}</span>
                      <span className={styles.linkArrow}>↗</span>
                    </span>
                  </TrackedContactLink>
                </div>
              </div>

              <div className={styles.resumeBlock}>
                <p className={styles.blockLabel}>{t.resumeLabel}</p>

                <div className={styles.resumeLinks}>
                  <TrackedDownloadLink
                    href="/docs/cv-ats-pt.pdf"
                    download
                    documentType="cv_ats"
                    language="pt"
                  >
                    <span className={styles.resumeLink}>
                      <span className={styles.documentIcon}>PDF</span>
                      <span>{t.cvAts}</span>
                      <span className={styles.downloadArrow}>↓</span>
                    </span>
                  </TrackedDownloadLink>

                  <TrackedDownloadLink
                    href="/docs/cv-visual-pt.pdf"
                    download
                    documentType="cv_visual"
                    language="pt"
                  >
                    <span className={styles.resumeLink}>
                      <span className={styles.documentIcon}>PDF</span>
                      <span>{t.cvVisual}</span>
                      <span className={styles.downloadArrow}>↓</span>
                    </span>
                  </TrackedDownloadLink>
                </div>
              </div>

              <div className={styles.contactFoot}>
                <span>THOMAS ESTANISLAU</span>
                <span>© 2026</span>
              </div>
            </div>

            <div className={styles.formPanel}>
              {status === "sent" ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✓</div>

                  <span className={styles.formEyebrow}>MESSAGE DELIVERED</span>

                  <h3>{t.sentTitle}</h3>

                  <p>{t.sent}</p>
                </div>
              ) : (
                <>
                  <div className={styles.formHeader}>
                    <span className={styles.formEyebrow}>
                      <span className={styles.statusDot} />
                      {t.formEyebrow}
                    </span>

                    <h3 className={styles.formTitle}>{t.formTitle}</h3>

                    <p className={styles.formDescription}>
                      {t.formDescription}
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className={styles.honeypot}
                    />

                    <div className={styles.field}>
                      <label htmlFor="name">{t.nameLabel}</label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t.namePlaceholder}
                        autoComplete="name"
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="email">{t.emailLabelField}</label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="message">{t.messageLabel}</label>

                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        minLength={10}
                        required
                        placeholder={t.messagePlaceholder}
                      />
                    </div>

                    {status === "error" && errorMessage && (
                      <div className={styles.error} role="alert">
                        <span>!</span>
                        <p>{errorMessage}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setStatus("idle");
                            setErrorMessage(null);
                          }}
                        >
                          {t.retry}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={styles.submit}
                      disabled={status === "sending"}
                    >
                      <span>{status === "sending" ? t.sending : t.submit}</span>

                      {status === "sending" ? (
                        <span className={styles.spinner} />
                      ) : (
                        <span className={styles.submitArrow}>↗</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <span>{t.footer}</span>
            <span>SÃO PAULO - SP · BRASIL</span>
          </div>
          <footer className={styles.footer}>
            Developed with ❤️ by Thomas Estanislau.
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
