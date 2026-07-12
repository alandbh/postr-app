# Contrato do parser - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P0
Relacionado: [PRD secao 17 e 22](../../product/PRD.md) | [Arquitetura secao 4.2 e 9.2](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

O parser (Cloudflare Worker em `cloudflare/src/index.ts`) é o boundary entre frontend e extração de conteúdo, mas não há contrato formal: o frontend assume campos e comportamento implícitos. É preciso formalizar payload, status, categorias de falha e campos obrigatórios/opcionais.

## 2. Objetivos e não-objetivos

- Objetivos: tipo compartilhado do payload de resposta; categorias de erro; mensagens esperadas; campos obrigatórios vs opcionais.
- Não-objetivos: reescrever o algoritmo de extração; suportar sites protegidos por paywall forte.

## 3. Abordagens consideradas

_A definir no brainstorming._

## 4. Design proposto

_A definir._ Provável tipo compartilhado (`{ title, content, excerpt, author, image }`) e enum de categorias de falha.

## 5. Impacto no código

Candidatos: `src/lib/parser.ts`, `cloudflare/src/index.ts`, tipos compartilhados.

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Testes de integração para respostas de sucesso e cada categoria de erro.

## 8. Riscos e questões em aberto

- Como versionar o contrato entre Worker e frontend sem deploy acoplado.

## 9. Referências

- Plano: `../plans/2026-07-11-parser-contract-plan.md` (a criar)
- ADR candidata: parser remoto como boundary (ver [decisions](../../decisions/README.md)).
