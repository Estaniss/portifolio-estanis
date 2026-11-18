"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProjectCover.module.css";

function hashToAngle(id: string): number {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 360;
  }

  return hash;
}

export function ProjectCover({ id, name }: { id: string; name: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const angle = hashToAngle(id);

  return (
    <div className={styles.cover}>
      {!imageFailed && (
        <Image
          src={`/images/projects/${id}.png`}
          alt={`Captura de tela do projeto ${name}`}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 560px"
          className={styles.image}
          onError={() => setImageFailed(true)}
        />
      )}

      {imageFailed && (
        <svg
          className={styles.abstract}
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`grad-${id}`}
              gradientTransform={`rotate(${angle})`}
            >
              <stop offset="0%" stopColor="#171c18" />
              <stop offset="100%" stopColor="#090b0a" />
            </linearGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#grad-${id})`} />

          {[...Array(7)].map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={(i + 1) * 40}
              x2={400}
              y2={(i + 1) * 40 + angle - 180}
              stroke="#c6f36b"
              strokeOpacity={0.13}
              strokeWidth={1}
            />
          ))}

          <circle
            cx="320"
            cy="55"
            r="65"
            fill="none"
            stroke="#c6f36b"
            strokeOpacity="0.12"
          />

          <circle
            cx="320"
            cy="55"
            r="42"
            fill="none"
            stroke="#c6f36b"
            strokeOpacity="0.1"
          />
        </svg>
      )}

      {imageFailed && <span className={styles.label}>PREVIEW EM BREVE</span>}

      <span className={styles.cornerMark} aria-hidden="true">
        EST. / 2026
      </span>
    </div>
  );
}
