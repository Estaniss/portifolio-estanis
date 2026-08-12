// components/contact/ContactSection.tsx — exemplo de integração das Fases 3 e 4

"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TrackedContactLink } from "@/components/analytics/TrackedContactLink";
import { TrackedDownloadLink } from "@/components/analytics/TrackedDownloadLink";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";

export function ContactSection() {
  const { track } = useTracker();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui entraria o envio real (API route própria, serviço de email, etc.)
    track(EVENT_TYPES.CONTACT_SUBMIT);
    setSubmitted(true);
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Contato
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <TrackedContactLink
              href="https://wa.me/5516997137932"
              channel="whatsapp"
            >
              WhatsApp
            </TrackedContactLink>
            <TrackedContactLink
              href="https://www.linkedin.com/in/thomas-estanislau-45ab05124/"
              channel="linkedin"
            >
              LinkedIn
            </TrackedContactLink>
            <TrackedContactLink href="https://github.com/estaniss" channel="github">
              GitHub
            </TrackedContactLink>
            <TrackedContactLink
              href="mailto:estanislau124@hotmail.com"
              channel="email"
              target="_self"
            >
              Email
            </TrackedContactLink>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <TrackedDownloadLink
              href="/docs/cv-ats-pt.pdf"
              download
              documentType="cv_ats"
              language="pt"
            >
              Baixar Currículo (ATS)
            </TrackedDownloadLink>
            <TrackedDownloadLink
              href="/docs/cv-visual-pt.pdf"
              download
              documentType="cv_visual"
              language="pt"
            >
              Baixar Currículo (Visual)
            </TrackedDownloadLink>
          </Stack>

          {submitted ? (
            <Alert severity="success">
              Mensagem enviada (simulado) — evento contact_submit registrado.
            </Alert>
          ) : (
            <Stack component="form" spacing={2} onSubmit={handleSubmit}>
              <TextField label="Seu email" type="email" required fullWidth />
              <TextField label="Mensagem" multiline rows={3} required fullWidth />
              <Button type="submit" variant="contained">
                Enviar
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
