# Share Target PWA - Design

Status: Stub (aguardando brainstorming)
Data: 2026-07-11
Autor(es): -
Prioridade: P0
Relacionado: [PRD secao 19.2](../../product/PRD.md) | [Arquitetura secao 5.3, 7.1 e 9.3](../../engineering/architecture-and-backlog.md)

> Stub criado a partir do backlog. Preencher via brainstorming (ver [../README.md](../README.md)) e remover este bloco quando aprovado.

## 1. Contexto e problema

O fluxo mais delicado da POC: receber um link compartilhado do sistema (Android) e salvar/abrir o artigo. Há uma incoerência entre o manifest (`share_target` com `GET`) e o service worker (`public/sw-custom.js`, que trata `POST`), além de um possível bug de escopo no tratamento de erro com `cleanUrl` em `ShareTarget`. É preciso formalizar a intenção do fluxo e endurecê-lo.

## 2. Objetivos e não-objetivos

- Objetivos: decidir e documentar a estratégia real (`GET`, `POST` ou híbrido); centralizar o parse dos dados compartilhados; fallback explícito por plataforma; remover UI de debug do caminho de produção.
- Não-objetivos: suportar todas as plataformas/navegadores desde já.

## 3. Abordagens consideradas

_A definir no brainstorming._

## 4. Design proposto

_A definir._ Reutilizar o mesmo caso de uso `saveSharedArticle`/`saveArticleFromUrl` da spec salvar-artigo.

## 5. Impacto no código

Candidatos: `vite.config.ts` (manifest), `public/sw-custom.js`, `src/pages/ShareTarget.tsx`, utilitário único de extração de URL.

## 6. Critérios de aceitação

- [ ] _A definir._

## 7. Plano de testes

_A definir._ Cobrir recebimento de dados compartilhados e inferência de URL.

## 8. Riscos e questões em aberto

- Variação de comportamento de share target entre navegadores/ambientes.

## 9. Referências

- Plano: `../plans/2026-07-11-share-target-pwa-plan.md` (a criar)
- ADR candidata: estratégia GET vs POST do share target (ver [decisions](../../decisions/README.md)).
