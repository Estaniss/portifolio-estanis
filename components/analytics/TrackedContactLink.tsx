// components/analytics/TrackedContactLink.tsx
//
// Uso: envolve os links de WhatsApp, LinkedIn, GitHub e Email do rodapé/seção de contato.
//
//   <TrackedContactLink href="https://wa.me/5516997137932" channel="whatsapp">
//     WhatsApp
//   </TrackedContactLink>
//
// O envio do formulário de contato NÃO usa esse componente — é um evento
// separado (CONTACT_SUBMIT), disparado no onSubmit do form. Ver README.

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";
import type { ContactChannel } from "@/lib/analytics/events";

interface TrackedContactLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  channel: ContactChannel;
  children: ReactNode;
}

export function TrackedContactLink({
  channel,
  children,
  onClick,
  ...anchorProps
}: TrackedContactLinkProps) {
  const { track } = useTracker();

  return (
    <a
      {...anchorProps}
      target={anchorProps.target ?? "_blank"}
      rel={anchorProps.rel ?? "noopener noreferrer"}
      onClick={(event) => {
        track(EVENT_TYPES.CONTACT_CLICK, { channel });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
