# Arquitetura e Backlog Técnico - Postr

Status: Draft v0.1
Última atualização: 2026-04-04
Documento complementar a: `PRD.md`

## 1. Objetivo

Este documento traduz o estado atual do codebase em uma visão operacional de engenharia. Ele existe para responder:

- como a aplicação está organizada hoje
- quais são os fluxos principais do sistema
- quais problemas técnicos já identificados merecem correção
- quais refatorações devem acontecer antes de ampliar escopo
- quais specs técnicas e funcionais fazem mais sentido a seguir

O `PRD.md` define direção de produto. Este documento define contexto técnico e prioridades de estabilização.

## 2. Estado atual do sistema

O Postr já funciona como POC operacional com os seguintes blocos:

- frontend PWA em React/Vite
- armazenamento local em IndexedDB via Dexie
- parser remoto em Cloudflare Worker
- fluxo de compartilhamento via PWA share target
- leitura limpa de conteúdo extraído
- biblioteca local com busca e tags

Em termos práticos, a base já prova valor. O problema agora não é mais "a ideia funciona?". O problema agora é "como transformar a POC em produto mantendo clareza, confiabilidade e capacidade de evolução?".

## 3. Visão de arquitetura

### 3.1 Camadas atuais

1. Interface e navegação
   Frontend React com rotas para home, leitura, biblioteca, share target, conta e página institucional.

2. Aplicação e fluxos
   Lógica concentrada nas próprias páginas e em alguns componentes de apoio.

3. Persistência local
   IndexedDB via Dexie para armazenar artigos, tags e metadados locais.

4. Extração de conteúdo
   Worker Cloudflare recebe URL, faz fetch da página, roda `Readability`, corrige imagens e devolve HTML limpo.

5. Infra de distribuição
   Deploy do frontend via cPanel/FTP e backend separado via Cloudflare Worker.

### 3.2 Características arquiteturais atuais

- arquitetura simples e direta
- forte acoplamento entre UI e lógica de casos de uso
- pouca separação entre domínio, infraestrutura e apresentação
- ausência de camada explícita de serviços do frontend
- baixa cobertura de testes e documentação técnica parcial
- design local-first coerente com a proposta do produto

## 4. Mapa do sistema

### 4.1 Frontend

- `src/main.tsx`
  Define o roteador e monta a aplicação.

- `src/App.tsx`
  Shell principal, topbar e navegação global.

- `src/pages/Home.tsx`
  Entrada principal para colar URL e salvar artigo.

- `src/pages/Reader.tsx`
  Leitura de artigo salvo.

- `src/pages/ReadOnly.tsx`
  Leitura temporária via link Postr sem salvar previamente.

- `src/pages/Articles.tsx`
  Biblioteca local, busca e filtro por tags.

- `src/pages/ShareTarget.tsx`
  Fluxo de entrada para compartilhamento do sistema.

- `src/db/schema.ts`
  Banco local e utilitários de tags.

- `src/lib/parser.ts`
  Cliente frontend para o serviço de extração.

### 4.2 Backend de parsing

- `cloudflare/src/index.ts`
  Worker responsável por:
  - receber `url`
  - seguir redirecionamentos intermediários
  - obter HTML
  - executar `Readability`
  - normalizar imagens
  - responder JSON para o frontend

### 4.3 PWA

- `vite.config.ts`
  Manifest, `share_target`, plugin PWA e estratégia de build.

- `public/sw-custom.js`
  Service worker customizado com tratamento especial para share target.

### 4.4 Documentação atual

- `PRD.md`
  Fonte de verdade para direção de produto.

- `README.md`
  Hoje está parcialmente desatualizado e precisa ser revisado.

## 5. Fluxos principais

### 5.1 Fluxo A - salvar artigo pela home

1. Usuário cola uma URL ou texto contendo URL.
2. A home tenta extrair a URL real.
3. O frontend chama o parser remoto.
4. O parser devolve `title`, `content`, `excerpt`, `author`, `image`.
5. O frontend cria um `id`, salva localmente e navega para a leitura.
6. O usuário pode adicionar tags após o salvamento.

### 5.2 Fluxo B - ler artigo salvo

1. Usuário abre um item salvo na biblioteca.
2. O app busca o artigo no IndexedDB.
3. O HTML salvo é renderizado na tela.
4. O usuário pode:
   - abrir original
   - excluir
   - editar tags
   - compartilhar

### 5.3 Fluxo C - compartilhar um link com o Postr

1. Usuário está em outro app e escolhe compartilhar.
2. O PWA recebe dados via share target.
3. O app tenta inferir a URL correta.
4. O frontend chama o parser.
5. O resultado é salvo localmente.
6. O usuário cai na leitura do artigo salvo.

### 5.4 Fluxo D - compartilhar um artigo já convertido

1. Usuário está lendo um artigo salvo.
2. Escolhe compartilhar:
   - link original
   - link Postr `/read?url=...`
3. A pessoa que recebe o link Postr abre a versão limpa e pode salvá-la.

### 5.5 Fluxo E - reencontrar artigo

1. Usuário abre a biblioteca.
2. Busca por texto ou filtra por tag.
3. Seleciona o artigo.
4. Reabre a leitura limpa.

## 6. Qualidades da base atual

### 6.1 Pontos fortes

- escopo da POC é claro e já demonstra valor real
- escolha de PWA faz sentido para distribuição leve e mobile-first
- abordagem local-first é coerente com a proposta de privacidade
- uso de Dexie simplifica persistência sem backend de conta
- parser remoto já resolve a limitação fundamental do frontend puro
- fluxo de compartilhar para ler depois é um diferencial promissor

### 6.2 Pontos que já merecem endurecimento

- lógica de produto espalhada em páginas
- tratamento de erro inconsistente entre fluxos
- documentação técnica e comportamento real fora de sincronia
- sinais de código de POC ainda expostos em produção
- ausência de contratos formais entre frontend e parser

## 7. Problemas técnicos identificados

## 7.1 Inconsistências funcionais

- `README.md` descreve o parser como stub a implementar, mas o worker já existe e está em uso.
- o manifest define `share_target` com `GET`, enquanto o service worker trata `POST`; a intenção do fluxo precisa ser formalizada.
- o menu exibe ação de tema, mas não há implementação real conectada ao shell principal.
- existe infraestrutura de atualização PWA, mas o componente correspondente está desligado.

## 7.2 Problemas de código

- `Home` e `ShareTarget` duplicam lógica de extração de URL.
- a lógica principal do caso de uso "salvar artigo" está espalhada em várias páginas.
- `ShareTarget` parece conter um bug de escopo em tratamento de erro com `cleanUrl`.
- `Reader` e `ReadOnly` renderizam HTML com `dangerouslySetInnerHTML` sem estratégia explícita de sanitização no frontend.
- navegação global usa `href` em alguns pontos onde `Link` seria mais consistente dentro de SPA.
- `alert` e `confirm` ainda aparecem em fluxos de usuário, o que é aceitável em POC, mas fraco para produto.

## 7.3 Problemas de estrutura

- o worker Cloudflare ainda contém testes e asset estático de template.
- há artefatos de legado/POC como `src/old-pwa`, arquivos de teste manual e documentação duplicada de deploy.
- não existe diretório de specs ainda, apesar do processo SDD já ter começado no nível do PRD.

## 7.4 Problemas de qualidade

- ausência de testes úteis cobrindo fluxo principal
- falta de observabilidade mínima para falhas do parser e do share target
- falta de contrato formal para resposta do parser
- build do frontend passa sem necessariamente capturar problemas de type-checking mais estritos

## 8. Backlog técnico priorizado

## 8.1 P0 - estabilizar a base antes de crescer

- corrigir o bug potencial de `ShareTarget` no tratamento de erro
- alinhar documentação com o comportamento real do sistema
- remover ou isolar código/template legado do worker
- definir e documentar o contrato do parser
- consolidar a lógica de salvar artigo em um serviço reutilizável de frontend
- decidir e documentar a estratégia real de share target: `GET`, `POST` ou compatibilidade híbrida
- documentar a política de segurança para HTML extraído

## 8.2 P1 - tornar o sistema mais sustentável

- criar uma camada de `services` ou `use-cases` no frontend
- extrair utilitário único de normalização/extração de URL compartilhada
- padronizar tratamento de loading, erro e fallback entre Home, ShareTarget e ReadOnly
- substituir `alert` e `confirm` por componentes de UI coerentes com o app
- reativar ou remover conscientemente o sistema de update PWA
- implementar tema de forma real ou remover o affordance do menu

## 8.3 P2 - preparar a evolução do produto

- adicionar observabilidade mínima por domínio e tipo de falha
- criar testes de integração para parser e fluxos críticos
- criar migrações/versionamento mais explícito do banco local
- revisar a estratégia de compartilhamento da URL Postr para longo prazo
- preparar pontos de extensão para futura sincronização opcional

## 9. Prioridades de refatoração

## 9.1 Refatoração 1 - casos de uso explícitos no frontend

Objetivo:
- sair da lógica dispersa em páginas para uma camada mais previsível

Refatorações sugeridas:
- `saveArticleFromUrl`
- `saveSharedArticle`
- `loadSavedArticle`
- `shareArticle`
- `updateArticleTags`

Resultado esperado:
- menos duplicação
- fluxos mais testáveis
- pages mais focadas em UI

## 9.2 Refatoração 2 - contrato formal do parser

Objetivo:
- tratar parser como boundary real entre sistemas

Refatorações sugeridas:
- criar tipo compartilhado do payload de resposta
- definir status e mensagens esperadas
- formalizar categorias de falha
- documentar campos obrigatórios e opcionais

Resultado esperado:
- frontend mais robusto
- menos comportamento implícito
- specs técnicas mais precisas

## 9.3 Refatoração 3 - endurecer o fluxo de share target

Objetivo:
- transformar o fluxo mais delicado da POC em fluxo confiável de produto

Refatorações sugeridas:
- eliminar caminhos ambíguos
- centralizar parse dos dados compartilhados
- definir fallback explícito por plataforma
- remover UI de debug do caminho principal de produção

Resultado esperado:
- menor fragilidade em mobile
- menos branches especiais difíceis de manter

## 9.4 Refatoração 4 - higiene de repositório

Objetivo:
- reduzir ruído e ambiguidade

Refatorações sugeridas:
- remover ou arquivar material legado
- revisar documentação de deploy
- eliminar arquivos de teste manual que não fazem parte do fluxo oficial
- separar documentação de produto, engenharia e operações

Resultado esperado:
- repositório mais legível
- onboarding melhor
- menor risco de operar sobre artefatos errados

## 10. Specs técnicas sugeridas

Além das specs de produto, faz sentido ter specs com recorte técnico quando o comportamento atravessa múltiplas camadas.

### 10.1 Ordem sugerida

1. `specs/001-salvar-artigo/spec.md`
   Fluxo principal de captura e persistência.

2. `specs/002-parser-contract/spec.md`
   Contrato do parser, categorias de erro e resposta esperada.

3. `specs/003-share-target-pwa/spec.md`
   Fluxo de compartilhamento mobile e comportamento por ambiente.

4. `specs/004-biblioteca-e-tags/spec.md`
   Busca, filtros e gestão de tags.

5. `specs/005-seguranca-html-extraido/spec.md`
   Política para renderização segura do conteúdo extraído.

## 11. Proposta de organização futura do repositório

Estrutura sugerida:

- `PRD.md`
- `ARQUITETURA-E-BACKLOG-TECNICO.md`
- `specs/`
- `docs/operations/`
- `docs/decisions/`
- `src/services/`
- `src/features/` ou `src/use-cases/`

Isto não precisa acontecer de uma vez. O importante é começar a mover o projeto para um layout onde produto, decisão e implementação tenham fronteiras mais claras.

## 12. Recomendações operacionais imediatas

### 12.1 O que fazer já

- manter `PRD.md` como norte de produto
- criar o primeiro spec do fluxo de salvar artigo
- corrigir os problemas P0 antes de expandir escopo
- escolher uma convenção de documentação para specs e decisões

### 12.2 O que evitar agora

- adicionar autenticação ou sync antes de estabilizar o core
- crescer a UI sem formalizar fluxos
- continuar corrigindo comportamento diretamente nas páginas sem extrair casos de uso
- tratar o parser como detalhe de implementação em vez de boundary do sistema

## 13. Definição prática de prontidão técnica para próxima fase

Considerar a base pronta para a próxima fase quando:

- o fluxo principal estiver documentado por spec
- parser e share target tiverem comportamento previsível e documentado
- principais inconsistências de POC tiverem sido removidas
- a lógica de salvar artigo estiver centralizada
- houver pelo menos testes mínimos cobrindo fluxos críticos

## 14. Relação entre documentos

- `PRD.md`
  Define por que o produto existe, para quem e qual escopo faz sentido.

- `ARQUITETURA-E-BACKLOG-TECNICO.md`
  Define como o sistema está hoje e o que precisa ser estabilizado.

- `specs/*/spec.md`
  Definem entregas concretas, critérios de aceitação e decisões por fatia.

Esse trio deve virar a espinha dorsal do processo SDD no projeto.

