# Architecture Decision Records (ADRs)

Registros curtos de decisões arquiteturais que atravessam entregas. Use quando uma escolha tem impacto de longo prazo e precisa ser rastreável (por que decidimos assim, o que consideramos, o que revisitar).

- Crie um arquivo por decisão: `NNNN-titulo-curto.md`, a partir de [TEMPLATE-adr.md](TEMPLATE-adr.md).
- Numere sequencialmente (0001, 0002, ...).
- Não edite decisões aceitas; para mudar, crie uma nova ADR que substitua a anterior e atualize o status.

## Índice

Nenhuma ADR registrada ainda.

## Decisões candidatas (a formalizar)

Estas escolhas já estão implícitas no produto/código e merecem virar ADRs quando forem tocadas:

- Modelo local-first sem conta obrigatória (Dexie/IndexedDB). Ref: [PRD secao 12](../product/PRD.md).
- Extração de conteúdo em Cloudflare Worker remoto em vez de parsing no cliente. Ref: [arquitetura secao 4.2](../engineering/architecture-and-backlog.md).
- Estratégia do PWA share target (`GET` no manifest vs `POST` no service worker). Ref: [arquitetura secao 7.1](../engineering/architecture-and-backlog.md).
- Política de sanitização do HTML extraído renderizado com `dangerouslySetInnerHTML`. Ref: spec [seguranca-html-extraido](../superpowers/specs/2026-07-11-seguranca-html-extraido-design.md).
- Método de deploy (CI/CD via FTP para cPanel). Ref: [deploy](../operations/deploy.md).
