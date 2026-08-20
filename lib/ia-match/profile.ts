// lib/ia-match/profile.ts
//
// Perfil condensado usado como contexto pra IA comparar contra a vaga.
// Mantém aqui (e não espalhado no prompt) porque é o tipo de coisa que
// você vai querer atualizar sozinho conforme muda de projeto/cargo,
// sem precisar mexer na lógica da análise.

export const THOMAS_PROFILE = `
Nome: Thomas Estanislau
Cargo atual: Desenvolvedor Fullstack (Analista Desenvolvedor na Mitra, desde set/2024)
Localização: São Paulo, SP, Brasil

Stack principal: React, React Native, TypeScript, Next.js, Node.js
Também: PHP Laravel, PostgreSQL, MySQL, Oracle, SQL, NoSQL, AWS, Docker, PM2, Nginx, CI/CD
Ferramentas e práticas: Git, Scrum, Jira, Monday, Clean Code, Arquitetura de Software

Experiência:
- Mitra (set/2024–presente): front-end com React, Next.js, TypeScript, MUI;
  APIs em PHP Laravel; PostgreSQL; autenticação/autorização com integração
  gov.br e JWT; criptografia AES-GCM; Scrum.
- BeOnUp (jul/2022–ago/2024): front-end web com ReactJS, TypeScript, Styled
  Components, ANTD, a partir de design no Figma; mobile com React Native;
  back-end com Node.js e TypeScript; deploy em AWS (Docker, PM2, Nginx).

Formação: Pós-graduação em Desenvolvimento de Sistemas para Dispositivos
Móveis (IFSP), Tecnólogo em Análise e Desenvolvimento de Sistemas (UNIARA),
Bacharelado em Administração (UNESP).

Projetos pessoais: sistema de analytics para portfólio com IA generativa de
insights (Next.js, Supabase, Gemini API), simulador de finanças com IA
(React, Gemini API), plataforma de busca de vagas com busca semântica
(Next.js, Prisma, pgvector, Redis), app de RSVP para eventos (Next.js,
Supabase).

Nível de senioridade real: pleno, com forte autonomia em front-end e
capacidade de atuar em back-end e infraestrutura quando necessário.
`.trim();
