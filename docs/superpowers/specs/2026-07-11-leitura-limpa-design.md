# Leitura limpa - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P1
Relacionado: [PRD secao 10, 12 e 13.4](../../product/PRD.md) | [Arquitetura secao 5.2](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

A experiência central do produto: ler o conteúdo extraído em um layout confortável, focado em conteúdo e tipografia, mobile-first. Envolve `src/pages/Reader.tsx` (artigo salvo) e ações de leitura (abrir original, excluir, editar tags, compartilhar, ajuste de fonte).

## 2. Objetivos e não-objetivos

- Objetivos: layout de leitura limpo e acessível; controles de leitura; abertura sem depender de nova extração.
- Não-objetivos: highlights/anotações; leitura em voz alta.

## 3. Abordagens consideradas

_A definir no brainstorming._

## 4. Design proposto

_A definir._ Depende da política de sanitização (ver spec seguranca-html-extraido).

## 5. Impacto no código

Candidatos: `src/pages/Reader.tsx`, componentes de leitura, estilos de tipografia (Tailwind typography).

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Renderização, controles de fonte e acessibilidade básica.

## 8. Riscos e questões em aberto

- Consistência de tipografia entre conteúdos de origens diferentes.

## 9. Referências

- Plano: `../plans/2026-07-11-leitura-limpa-plan.md` (a criar)
- Depende de: [seguranca-html-extraido](2026-07-11-seguranca-html-extraido-design.md)
