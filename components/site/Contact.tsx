// components/site/Contact.tsx
//
// ⚠️ Os links de download apontam pra /docs/cv-*.pdf, que ainda não
// existem — quando os PDFs estiverem prontos, coloca em public/docs/
// com esses nomes exatos (ou ajusta o href aqui).

"use client";

import { useState, type FormEvent } from "react";
import styles from "./Contact.module.css";
import { Reveal } from "./Reveal";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { TrackedDownloadLink } from "@/components/analytics/TrackedDownloadLink";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";

export function Contact() {
  const { track } = useTracker();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: trocar por envio real (API route própria, Resend, etc.)
    track(EVENT_TYPES.CONTACT_SUBMIT);
    setSubmitted(true);
  }

  return (
    <section id="contato" className={styles.section}>
      <div className="container">
        <Reveal>
        <p className="eyebrow">Contato</p>
        <h2 className={styles.title}>Bora conversar sobre o próximo projeto.</h2>

        <a className={styles.emailLink} href="mailto:estanislau124@hotmail.com">
          estanislau124@hotmail.com
        </a>

        <div className={styles.row}>
          <TrackedContactLink
            href="https://www.linkedin.com/in/thomas-estanislau-45ab05124/"
            channel="linkedin"
          >
            <span className="text-link">LinkedIn →</span>
          </TrackedContactLink>
          <TrackedContactLink href="https://github.com/estaniss" channel="github">
            <span className="text-link">GitHub →</span>
          </TrackedContactLink>
          <TrackedContactLink
            href="https://wa.me/5516997137932"
            channel="whatsapp"
          >
            <span className="text-link">WhatsApp →</span>
          </TrackedContactLink>
        </div>

        <div className={styles.downloads}>
          <TrackedDownloadLink
            href="/docs/cv-ats-pt.pdf"
            download
            documentType="cv_ats"
            language="pt"
          >
            <span className="text-link">Currículo (ATS) ↓</span>
          </TrackedDownloadLink>
          <TrackedDownloadLink
            href="/docs/cv-visual-pt.pdf"
            download
            documentType="cv_visual"
            language="pt"
          >
            <span className="text-link">Currículo (visual) ↓</span>
          </TrackedDownloadLink>
        </div>

        <div className={styles.formWrap}>
          {submitted ? (
            <p className={styles.success}>MENSAGEM ENVIADA — RESPONDO EM BREVE.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="email">SEU EMAIL</label>
                <input id="email" type="email" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="message">MENSAGEM</label>
                <textarea id="message" rows={4} required />
              </div>
              <button type="submit" className={styles.submit}>
                ENVIAR MENSAGEM
              </button>
            </form>
          )}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
