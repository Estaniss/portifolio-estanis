# Portfolio Analytics — Projeto completo (Fases 1-5)

Next.js criado do zero, com as 5 fases integradas, buildadas e testadas
neste ambiente. Falta só apontar pro seu Supabase e Anthropic reais.

## Estrutura

```
app/
├── page.tsx                        → home de teste (projetos + IA Match + contato)
├── login/page.tsx                  → login do admin
├── admin/
│   ├── layout.tsx                  → navegação entre as páginas do painel
│   ├── page.tsx                    → visão geral (Fase 1)
│   ├── projetos/page.tsx           → projetos e tecnologias (Fase 2)
│   ├── conversoes/page.tsx         → funil, downloads, contatos (Fase 3)
│   ├── ia-match/page.tsx           → IA Match Analytics (Fase 4)
│   └── relatorios/page.tsx         → relatórios de IA (Fase 5)
└── api/
    ├── analytics/
    │   ├── events/route.ts                    → ingestão em lote
    │   ├── ia-match/route.ts                   → grava cada análise
    │   └── dashboard/*/route.ts                → uma rota de agregação por página admin
    └── cron/generate-report/route.ts           → gerado pelo Vercel Cron

lib/
├── analytics/    → tracker, fila/batch, tipos de evento, hooks de projeto/ia-match
├── supabase/     → client server-side (service role)
├── auth/         → proteção das rotas /admin
└── ai/           → resumo compacto + chamada à Anthropic

components/
├── admin/        → KpiCard, gráficos (Bar/Line/Funnel), ReportCard
├── analytics/    → TrackedProjectLink, TrackedDownloadLink, TrackedContactLink
├── projects/     → ProjectCard de exemplo
├── contact/      → ContactSection de exemplo (downloads + canais + form)
└── ia-match/     → IaMatchTool de exemplo (simula uma análise)

sql/
├── 001_schema_fase1.sql   → sessions, events
├── 002_schema_fase3.sql   → funnel_steps
├── 003_schema_fase4.sql   → ia_match_runs
└── 004_schema_fase5.sql   → ai_reports

vercel.json                → agenda dos 3 cron jobs de relatório
```

## Passo a passo pra testar com dados reais

### 1. Supabase
1. Cria o projeto (ou usa um existente).
2. SQL Editor → roda os 4 arquivos de `sql/` **nessa ordem** (001 → 002 → 003 → 004).
3. Authentication → Users → cria seu usuário admin.

### 2. Anthropic
Pega uma API key em console.anthropic.com — é o que alimenta a Fase 5.

### 3. Variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Preenche com os valores reais:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
CRON_SECRET=qualquer-string-aleatoria-longa
AI_REPORT_MODEL=claude-sonnet-5
```

### 4. Instalar e rodar
```bash
npm install
npm run dev
```

### 5. Gerar dados de teste
1. Abre `http://localhost:3000`, navega pelos projetos (gera `pageview` e `project_view`).
2. Clica em "Analisar compatibilidade" no card IA Match (gera um registro em `ia_match_runs`).
3. Clica num canal de contato e/ou baixa um CV (os links de download apontam pra
   `/docs/*.pdf`, que não existem nesse projeto de teste — o clique é rastreado
   mesmo assim, só o download em si vai dar 404; troque pelos PDFs reais quando
   integrar no seu portfólio).
4. Envia o formulário de contato (simulado, mas dispara `contact_submit`).
5. Loga em `/login`, navega pelas 5 abas do `/admin`.
6. Gera um relatório na mão (não precisa esperar o cron):
   ```bash
   curl "http://localhost:3000/api/cron/generate-report?period=weekly" \
     -H "Authorization: Bearer SEU_CRON_SECRET"
   ```
   Depois recarrega `/admin/relatorios`.

## O que foi validado neste ambiente (build + testes reais)

- ✅ `npm run build` — 18 rotas, todas classificadas corretamente (estáticas vs. dinâmicas).
- ✅ Todas as 5 páginas `/admin/*` redirecionam pra `/login` sem sessão (307) — auth gating funcionando em todas.
- ✅ `POST /api/analytics/events` e `POST /api/analytics/ia-match` chegam até chamar o Supabase (falham só por credencial placeholder).
- ✅ `GET /api/cron/generate-report` sem header → 401 (proteção por `CRON_SECRET` funcionando).
- ✅ `GET /api/cron/generate-report` com header certo → chega a chamar a **Anthropic API de verdade** (`api.anthropic.com`) e recebe um erro de autenticação real (`invalid x-api-key`) — confirma que a chamada está correta, só falta uma key válida.
- 🐛→✅ **Bug real encontrado e corrigido durante esse teste**: `build-summary.ts` engolia silenciosamente erros do Supabase e geraria um relatório com dados vazios em vez de falhar. Corrigido pra abortar a geração (e não gastar a chamada da Anthropic) quando a consulta falha.

## Próximos passos pra você

- Trocar os PDFs placeholder (`/docs/cv-ats-pt.pdf` etc.) pelos seus currículos reais, ou os caminhos no `ContactSection.tsx`.
- Trocar `IaMatchTool.tsx` (simulado) pela sua ferramenta real de análise via LLM — só a chamada a `recordIaMatch(...)` no final importa pro analytics.
- Decidir a estrutura de rotas do funil (`funnel_steps.path_prefix`) — sinalizado desde a Fase 3, ainda em aberto.
- Mover `useProjectView` pro modal/detalhe do projeto, se sua Home só mostra prévias.
