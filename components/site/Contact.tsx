// components/site/Contact.tsx

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
    eyebrow: "Contato",
    title: "Bora conversar sobre o próximo projeto.",
    linkedin: "LinkedIn →",
    github: "GitHub →",
    whatsapp: "WhatsApp →",
    cvAts: "Currículo (ATS) ↓",
    cvVisual: "Currículo (visual) ↓",
    nameLabel: "SEU NOME",
    emailLabel: "SEU EMAIL",
    messageLabel: "MENSAGEM",
    sending: "ENVIANDO...",
    submit: "ENVIAR MENSAGEM",
    sent: "MENSAGEM ENVIADA — RESPONDO EM BREVE.",
    genericError: "Não foi possível enviar agora. Tenta de novo em instantes.",
  },
  en: {
    eyebrow: "Contact",
    title: "Let's talk about the next project.",
    linkedin: "LinkedIn →",
    github: "GitHub →",
    whatsapp: "WhatsApp →",
    cvAts: "Resume (ATS) ↓",
    cvVisual: "Resume (visual) ↓",
    nameLabel: "YOUR NAME",
    emailLabel: "YOUR EMAIL",
    messageLabel: "MESSAGE",
    sending: "SENDING...",
    submit: "SEND MESSAGE",
    sent: "MESSAGE SENT — I'LL GET BACK TO YOU SOON.",
    genericError: "Couldn't send it right now. Try again in a moment.",
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
    <section id="contato" className={styles.section}>
      <div className="container">
        <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className={styles.title}>{t.title}</h2>

        <a className={styles.emailLink} href="mailto:estanislau124@hotmail.com">
          estanislau124@hotmail.com
        </a>

        <div className={styles.row}>
          <TrackedContactLink href="https://www.linkedin.com/in/thomas-estanislau-45ab05124/" channel="linkedin">
            <span className="text-link">{t.linkedin}</span>
          </TrackedContactLink>
          <TrackedContactLink href="https://github.com/estaniss" channel="github">
            <span className="text-link">{t.github}</span>
          </TrackedContactLink>
          <TrackedContactLink href="https://wa.me/5516997137932" channel="whatsapp">
            <span className="text-link">{t.whatsapp}</span>
          </TrackedContactLink>
        </div>

        <div className={styles.downloads}>
          <TrackedDownloadLink href="/docs/cv-ats-pt.pdf" download documentType="cv_ats" language="pt">
            <span className="text-link">{t.cvAts}</span>
          </TrackedDownloadLink>
          <TrackedDownloadLink href="/docs/cv-visual-pt.pdf" download documentType="cv_visual" language="pt">
            <span className="text-link">{t.cvVisual}</span>
          </TrackedDownloadLink>
        </div>

        <div className={styles.formWrap}>
          {status === "sent" ? (
            <p className={styles.success}>{t.sent}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />

              <div className={styles.field}>
                <label htmlFor="name">{t.nameLabel}</label>
                <input id="name" name="name" type="text" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">{t.emailLabel}</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="message">{t.messageLabel}</label>
                <textarea id="message" name="message" rows={4} required minLength={10} />
              </div>

              {status === "error" && errorMessage && <p className={styles.error}>{errorMessage}</p>}

              <button type="submit" className={styles.submit} disabled={status === "sending"}>
                {status === "sending" ? t.sending : t.submit}
              </button>
            </form>
          )}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
