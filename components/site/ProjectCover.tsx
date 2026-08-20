// components/site/ProjectCover.tsx
//
// Tenta carregar /images/projects/{id}.jpg (screenshot real, que você
// vai adicionar). Enquanto o arquivo não existir, mostra um padrão
// abstrato gerado por SVG — NUNCA uma tela falsa do produto, porque
// isso seria enganoso pra quem tá vendo o portfólio.
//
// No dia que colocar a imagem real em public/images/projects/{id}.jpg,
// ela aparece automaticamente, sem mexer em código.

'use client';

import { useState } from 'react';
import styles from './ProjectCover.module.css';

// Gera uma variação determinística (mesmo id = sempre o mesmo padrão)
// a partir do id do projeto, só pra cada card ficar visualmente distinto.
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/images/${id}.png`}
          alt={`Captura de tela do projeto ${name}`}
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
        >
          <defs>
            <linearGradient
              id={`grad-${id}`}
              gradientTransform={`rotate(${angle})`}
            >
              <stop offset="0%" stopColor="#e8efec" />
              <stop offset="100%" stopColor="#faf9f6" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill={`url(#grad-${id})`} />
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={(i + 1) * 40}
              x2={400}
              y2={(i + 1) * 40 + angle - 180}
              stroke="#2f5d50"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
          ))}
        </svg>
      )}
      {imageFailed && <span className={styles.label}>PREVIEW EM BREVE</span>}
    </div>
  );
}
