-- ============================================================
-- Ajuste: funil de conversão para portfólio single-page
-- Rodar no SQL Editor do Supabase, depois do 004_schema_fase5.sql
-- ============================================================

-- path_prefix só fazia sentido pra pageview por rota. Renomeado pra
-- match_value porque agora também é usado por section_view (compara
-- contra event_payload->>'section' em vez de page_path).
alter table funnel_steps rename column path_prefix to match_value;

-- Remove o passo "Home": numa página só, ele é idêntico a "Visitante"
-- (todo mundo que chega já está na home). Não carrega informação nova.
delete from funnel_steps;

insert into funnel_steps (step_order, step_name, event_type, match_value) values
  (1, 'Projetos', 'section_view', 'projetos'),
  (2, 'Projeto', 'project_view', null),
  (3, 'Download Currículo', 'download_cv', null),
  (4, 'IA Match', 'ia_match_run', null),
  (5, 'Contato', 'contact_click', null);

-- Se o seu portfólio tiver outras seções que valha rastrear no funil
-- (ex: "Sobre"), é só inserir mais uma linha com event_type='section_view'
-- e match_value = o mesmo valor passado em <TrackedSection section="...">.
