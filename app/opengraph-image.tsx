import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Thomas Estanislau — Desenvolvedor Fullstack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [serifData, monoData] = await Promise.all([
    readFile(join(process.cwd(), 'assets/og-fonts/IBMPlexSerif-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/og-fonts/IBMPlexMono-Regular.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: '#FAF9F6',
        fontFamily: 'Plex Mono',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: 2,
          color: '#5B6169',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}
      >
        Desenvolvedor Fullstack
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Plex Serif',
          fontSize: 76,
          color: '#14161A',
          lineHeight: 1.1,
        }}
      >
        Thomas Estanislau
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 32,
          fontSize: 24,
          color: '#333333',
          maxWidth: 900,
        }}
      >
        React, React Native, TypeScript e Node.js
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          width: 120,
          height: 6,
          background: '#2F5D50',
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Plex Serif', data: serifData, style: 'normal', weight: 500 },
        { name: 'Plex Mono', data: monoData, style: 'normal', weight: 400 },
      ],
    }
  );
}
