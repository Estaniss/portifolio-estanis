import type { Metadata } from "next";
import localFont from "next/font/local";
import { CVDocument } from "@/components/site/cv/CVDocument";

const fraunces = localFont({ src: "../../../assets/cv-fonts/Fraunces.ttf", variable: "--cv-font-display" });
const workSans = localFont({ src: "../../../assets/cv-fonts/WorkSans.ttf", variable: "--cv-font-body" });
const plexMono = localFont({
  src: [
    { path: "../../../assets/cv-fonts/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../../../assets/cv-fonts/IBMPlexMono-Medium.ttf", weight: "500" },
  ],
  variable: "--cv-font-mono",
});

export const metadata: Metadata = {
  title: "Resume — Thomas Estanislau",
};

export default function CVPageEn() {
  return (
    <CVDocument
      lang="en"
      fontClassNames={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}
    />
  );
}
