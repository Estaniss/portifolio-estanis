import type { Metadata } from "next";
import { RootProviders } from "@/components/site/RootProviders";
import { fontVariables } from "@/lib/site-fonts";
import { SITE_URL } from "@/lib/site-config";
import "../globals.css";

const title = "Thomas Estanislau — Fullstack Developer";

const description =
  "React, React Native, TypeScript and Node.js. Modern interfaces, clean code, from the frontend to the infrastructure.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/en`,
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
