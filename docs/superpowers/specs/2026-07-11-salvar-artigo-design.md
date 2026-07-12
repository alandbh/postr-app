# Salvar artigo - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P0
Relacionado: [PRD secao 10 e 19.1](../../product/PRD.md) | [Arquitetura secao 5.1 e 9.1](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

Fluxo principal e mais importante do produto: capturar uma URL (colada na Home) e persistir o artigo extraído localmente para leitura posterior. Hoje a lógica está espalhada entre `src/pages/Home.tsx` e `src/pages/ShareTarget.tsx`, com duplicação de extração de URL. O objetivo é consolidar isso em um caso de uso reutilizável e confiável.

## 2. Objetivos e não-objetivos

- Objetivos: capturar URL, chamar o parser, criar `id`, salvar em IndexedDB, navegar para a leitura; fallback claro quando a extração falhar.
- Não-objetivos: sincronização em nuvem; conta.

## 3. Abordagens consideradas

_A definir no brainstorming._

## 4. Design proposto

_A definir._ Provável extração de um serviço `saveArticleFromUrl` em `src/services`.

## 5. Impacto no código

Candidatos: `src/pages/Home.tsx`, `src/pages/ShareTarget.tsx`, `src/db/schema.ts`, `src/lib/parser.ts`, novo `src/services/`.

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Cobrir salvamento bem-sucedido e falha de parser.

## 8. Riscos e questões em aberto

- Definição exata de "artigo salvo com sucesso" para sites problemáticos (questão aberta no PRD secao 22).

## 9. Referências

- Plano: `../plans/2026-07-11-salvar-artigo-plan.md` (a criar)
