import type { Metadata } from 'next';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { About } from '@/components/site/About';
import { Skills } from '@/components/site/Skills';
import { Experience } from '@/components/site/Experience';
import { Projects } from '@/components/site/Projects';
import { IaMatch } from '@/components/site/IaMatch';
import { Contact } from '@/components/site/Contact';

export const metadata: Metadata = {
  title: 'Thomas Estanislau — Fullstack Developer',
  description:
    'React, React Native, TypeScript and Node.js. Modern interfaces, clean code, from the frontend to the infrastructure.',
  alternates: {
    languages: { 'pt-BR': '/', en: '/en' },
  },
};

export default function HomeEn() {
  return (
    <>
      <Header lang="en" />
      <Hero lang="en" />
      <About lang="en" />
      <Skills lang="en" />
      <Experience lang="en" />
      <Projects lang="en" />
      <IaMatch lang="en" />
      <Contact lang="en" />
    </>
  );
}
