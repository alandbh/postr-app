# Compartilhar artigo - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P1
Relacionado: [PRD secao 18.4 e 19.3-D](../../product/PRD.md) | [Arquitetura secao 5.4](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

Diferencial do produto: a partir de um artigo salvo, o usuário compartilha o link original ou um link Postr `/read?url=...`. Quem recebe o link Postr abre a versão limpa (`src/pages/ReadOnly.tsx`) e pode salvá-la. Precisamos encantar o destinatário novato (persona 18.4) e definir o comportamento do link compartilhado a longo prazo.

## 2. Objetivos e não-objetivos

- Objetivos: opções de compartilhamento (original vs Postr); leitura via link sem salvar previamente; caminho de salvar para o destinatário.
- Não-objetivos: rede social; comentários.

## 3. Abordagens consideradas

_A definir no brainstorming._ (ex.: estrutura da URL Postr; onde o parse acontece para o destinatário.)

## 4. Design proposto

_A definir._

## 5. Impacto no código

Candidatos: `src/pages/ReadOnly.tsx`, `src/components/ShareBottomSheet.tsx`, `src/lib/parser.ts`.

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Fluxo de destinatário (abrir link Postr, ler, salvar).

## 8. Riscos e questões em aberto

- Estratégia de compartilhamento da URL Postr a longo prazo (arquitetura secao 8.3).

## 9. Referências

- Plano: `../plans/2026-07-11-compartilhar-artigo-plan.md` (a criar)
- Depende de: [seguranca-html-extraido](2026-07-11-seguranca-html-extraido-design.md), [parser-contract](2026-07-11-parser-contract-design.md)
