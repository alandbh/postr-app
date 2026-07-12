# Segurança do HTML extraído - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P0
Relacionado: [PRD secao 13.3 e 22](../../product/PRD.md) | [Arquitetura secao 7.2 e 8.1](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

`Reader` e `ReadOnly` renderizam o HTML extraído com `dangerouslySetInnerHTML` sem estratégia explícita de sanitização no frontend. Como o conteúdo vem de páginas arbitrárias da web, isso é um risco de segurança (XSS) e precisa de uma política clara.

## 2. Objetivos e não-objetivos

- Objetivos: definir onde e como sanitizar (frontend, worker ou ambos); lista de tags/atributos permitidos; tratamento de imagens e links.
- Não-objetivos: preservar 100% da fidelidade visual do site original.

## 3. Abordagens consideradas

_A definir no brainstorming._ (ex.: sanitizar no Worker vs no cliente; biblioteca de sanitização.)

## 4. Design proposto

_A definir._

## 5. Impacto no código

Candidatos: `src/pages/Reader.tsx`, `src/pages/ReadOnly.tsx`, `cloudflare/src/index.ts`, `src/lib/parser.ts`.

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Casos com scripts/handlers maliciosos no HTML de entrada.

## 8. Riscos e questões em aberto

- Trade-off entre segurança e fidelidade do conteúdo renderizado (questão aberta no PRD secao 22).

## 9. Referências

- Plano: `../plans/2026-07-11-seguranca-html-extraido-plan.md` (a criar)
- ADR candidata: política de sanitização (ver [decisions](../../decisions/README.md)).
