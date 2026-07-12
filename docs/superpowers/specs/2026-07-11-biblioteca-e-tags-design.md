# Biblioteca e tags - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P1
Relacionado: [PRD secao 10 e 19.3](../../product/PRD.md) | [Arquitetura secao 5.5](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

O usuário precisa reencontrar artigos salvos por busca de texto e filtro por tags, e gerenciar tags (adicionar, editar, reaproveitar). Hoje isso vive em `src/pages/Articles.tsx` e utilitários de `src/db/schema.ts`. Formalizar comportamento de busca, filtros e gestão de tags.

## 2. Objetivos e não-objetivos

- Objetivos: busca por texto; filtro por uma ou mais tags; CRUD de tags; excluir artigos.
- Não-objetivos: tags hierárquicas; recomendações.

## 3. Abordagens consideradas

_A definir no brainstorming._

## 4. Design proposto

_A definir._

## 5. Impacto no código

Candidatos: `src/pages/Articles.tsx`, `src/db/schema.ts`, componentes de tags (`TagChip`, `TagInput`, `TagModal`, `TagsDrawer`, `TagsBottomSheet`).

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Cobrir busca, filtro por tag e gestão de tags.

## 8. Riscos e questões em aberto

- Performance de busca conforme a biblioteca cresce.

## 9. Referências

- Plano: `../plans/2026-07-11-biblioteca-e-tags-plan.md` (a criar)
