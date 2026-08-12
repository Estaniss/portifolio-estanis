// components/analytics/TrackedDownloadLink.tsx
//
// Uso: envolve o botão/link de download do CV ou carta de apresentação.
//
//   <TrackedDownloadLink
//     href="/docs/cv-ats-pt.pdf"
//     download
//     documentType="cv_ats"
//     language="pt"
//   >
//     Baixar Currículo (ATS)
//   </TrackedDownloadLink>

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useTracker } from "@/lib/analytics/tracker";
import { EVENT_TYPES } from "@/lib/analytics/events";
import type { DocumentType, DocumentLanguage } from "@/lib/analytics/events";

interface TrackedDownloadLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  documentType: DocumentType;
  language: DocumentLanguage;
  children: ReactNode;
}

export function TrackedDownloadLink({
  documentType,
  language,
  children,
  onClick,
  ...anchorProps
}: TrackedDownloadLinkProps) {
  const { track } = useTracker();

  return (
    <a
      {...anchorProps}
      onClick={(event) => {
        track(EVENT_TYPES.DOWNLOAD_CV, {
          document_type: documentType,
          language,
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
