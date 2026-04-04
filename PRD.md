# PRD - Postr

Status: Draft v0.1
Última atualização: 2026-04-04
Fase do produto: Transição de POC para produto

## 1. Resumo executivo

Postr é um leitor de artigos sem distrações que permite salvar links da web, extrair o conteúdo principal e oferecer uma experiência de leitura limpa, focada e privada. Hoje o projeto existe como uma POC funcional com frontend PWA, armazenamento local e um parser baseado em Cloudflare Worker. O objetivo desta nova fase é transformar essa base em um produto real, com definição clara de proposta de valor, escopo, qualidade mínima e critérios de evolução.

Este documento define a direção de produto como um todo. Os detalhes de cada entrega deverão ser registrados em arquivos de especificações separados.

## 2. Visão

Ser a forma mais simples e confiável de salvar e ler artigos da web com foco, sem anúncios, pop-ups e ruído visual.

## 3. Problema

A leitura de artigos na web moderna é prejudicada por:

- excesso de anúncios, banners, overlays e elementos de distração
- páginas lentas, poluídas e inconsistentes entre sites
- dificuldade de guardar conteúdo para ler depois de forma organizada
- experiência ruim ao compartilhar links entre apps e dispositivos
- pouca confiança sobre privacidade quando se usam read-it-later tradicionais

O usuário quer abrir um artigo e ler o conteúdo principal com rapidez, clareza e controle, sem precisar lutar contra a página original.

## 4. Público-alvo inicial

### 4.1 Perfil principal

- pessoas que consomem notícias, artigos, posts e textos longos no celular
- usuários que frequentemente encontram conteúdo em redes sociais, mensageiros e apps de notícia
- pessoas que valorizam foco, simplicidade e privacidade

### 4.2 Perfil secundário

- profissionais e estudantes que salvam material para leitura posterior
- usuários de PWA que querem um fluxo rápido de compartilhamento no Android

## 5. Jobs to be Done

- Quando eu encontro um artigo interessante, quero salvá-lo em poucos segundos para ler depois sem distrações.
- Quando eu abro um artigo salvo, quero ver apenas o conteúdo relevante em um layout confortável.
- Quando eu compartilho um link com outra pessoa, quero poder enviar uma versão já pronta para leitura limpa.
- Quando eu organizo minha biblioteca, quero reencontrar rapidamente um conteúdo por busca ou tags.

## 6. Proposta de valor

Postr oferece:

- leitura limpa sem depender da página original em tempo real
- biblioteca pessoal local-first
- compartilhamento rápido a partir do celular via PWA
- organização simples com tags
- privacidade por padrão, sem conta obrigatória

## 7. Objetivos do produto

### 7.1 Objetivos de curto prazo

- transformar a POC em uma base de produto consistente
- garantir que o fluxo principal de salvar e ler artigos seja confiável
- definir um escopo enxuto e defensável para uma primeira versão pública
- estabelecer um processo Spec-Driven Development para novas entregas

### 7.2 Objetivos de médio prazo

- elevar taxa de sucesso de extração de artigos
- melhorar organização da biblioteca e recorrência de uso
- preparar o produto para sincronização opcional entre dispositivos

## 8. Não-objetivos nesta fase

- construir uma plataforma social ou rede de conteúdo
- competir com navegadores generalistas
- suportar todos os tipos de página web desde o início
- implementar login, billing e colaboração antes do fluxo principal estar sólido
- criar um parser perfeito para sites extremamente dinâmicos ou protegidos por paywall forte

## 9. Estado atual da POC

Hoje a POC já demonstra:

- captura de URL manual
- compartilhamento via PWA share target
- parsing de conteúdo via Cloudflare Worker
- leitura limpa do artigo extraído
- salvamento local com IndexedDB
- organização com tags e busca básica
- compartilhamento do link original ou da versão Postr

Limitações atuais observadas:

- documentação do produto ainda não existe formalmente
- há inconsistências entre partes do código e da documentação
- qualidade do parser e dos fluxos de erro ainda não foi definida por critérios de produto
- conta e sincronização existem apenas como intenção futura
- parte do projeto ainda carrega sinais de template, debug e legado de POC

## 10. Escopo do produto inicial

### 10.1 Capacidades centrais

- salvar artigo por colagem de URL
- salvar artigo via compartilhamento do sistema no celular
- extrair conteúdo principal do artigo com título, autor, imagem e corpo quando disponível
- ler o artigo em interface limpa
- abrir o link original quando necessário
- salvar artigos localmente para leitura posterior
- organizar artigos com tags
- buscar artigos por texto
- instalar o app como PWA

### 10.2 Requisitos funcionais de alto nível

1. O usuário deve conseguir salvar um artigo com no máximo poucos passos.
2. O sistema deve mostrar uma visão limpa e legível do conteúdo extraído.
3. O artigo salvo deve permanecer acessível localmente após o salvamento.
4. O usuário deve conseguir excluir artigos.
5. O usuário deve conseguir adicionar, editar e reaproveitar tags.
6. O usuário deve conseguir reencontrar artigos por busca e tags.
7. O produto deve oferecer um fluxo razoável de fallback quando a extração falhar.

## 11. Fora de escopo do produto inicial

- sincronização em nuvem
- autenticação e perfil completo
- comentários, highlights e anotações
- leitura em voz alta
- recomendações personalizadas
- importação em massa de serviços externos
- extensões de navegador

## 12. Princípios de produto

- Local-first: os dados do usuário pertencem ao usuário e devem funcionar sem conta.
- Menos fricção: salvar um artigo deve ser rápido e previsível.
- Foco radical: a experiência de leitura deve priorizar conteúdo e tipografia.
- Privacidade por padrão: não coletar mais dados do que o estritamente necessário.
- Clareza de falha: quando o parser não funcionar, o usuário deve entender o que aconteceu e o que pode fazer.

## 13. Requisitos não funcionais

### 13.1 Performance

- abertura da aplicação deve ser rápida em rede móvel
- artigo salvo deve abrir sem depender de nova extração
- a leitura deve funcionar bem em dispositivos móveis intermediários

### 13.2 Confiabilidade

- o fluxo principal não deve perder dados após artigo salvo
- falhas de parser devem ser tratadas com mensagens claras
- atualizações do PWA não devem quebrar artigos já armazenados

### 13.3 Privacidade e segurança

- nenhuma conta obrigatória no escopo inicial
- armazenamento de artigos e organização local no dispositivo
- links e conteúdo devem ser tratados com cuidado por causa de HTML extraído

### 13.4 UX

- experiência mobile-first
- interface simples, com pouco ruído visual
- acessibilidade básica em navegação, contraste e semântica

## 14. Métricas de sucesso

### 14.1 Métricas principais

- taxa de sucesso de salvamento de artigo
- taxa de sucesso de extração de conteúdo utilizável
- tempo mediano entre colar URL e abrir leitura
- percentual de artigos salvos que são efetivamente abertos para leitura
- retenção de usuários que salvam mais de um artigo por semana

### 14.2 Métricas secundárias

- quantidade média de artigos salvos por usuário ativo
- uso de tags por artigo salvo
- uso do share target no mobile
- taxa de falha por domínio ou classe de site

## 15. Premissas

- existe demanda por uma experiência de leitura limpa e privada
- um modelo local-first reduz atrito no início
- o share target PWA é uma vantagem importante para mobile
- a primeira versão não precisa resolver sincronização para gerar valor

## 16. Riscos

- qualidade inconsistente do parser entre sites
- sites com bloqueios, paywalls e renderização client-side pesada
- limitação do modelo local-first para usuários multi-dispositivo
- complexidade de PWA/share target variar entre navegadores e ambientes
- acoplamento excessivo entre decisões de frontend e parser antes de specs claros

## 17. Dependências

- serviço de extração de conteúdo confiável
- manutenção do worker/parsing
- configuração correta de PWA, manifest e service worker
- estratégia mínima de observabilidade para falhas do parser e fluxo de compartilhamento

## 18. Personas resumidas

### 18.1 Leitor casual mobile

Encontra links em redes sociais e quer guardar para depois sem criar conta ou instalar um app pesado.

### 18.2 Leitor frequente

Lê artigos longos com frequência, usa tags para organizar e valoriza foco e biblioteca pessoal.

### 18.3 Leitor destinatário

Recebe um artigo compartilhado por outro usuário Postr, a fim de conseguir fazer a leitura com o conforto e a usabilidade características da aplicação

### 18.4 Leitor novato

Recebe, pela primeira vez, um artigo compartilhado por outro usuário Postr. Este é o seu primeiro contato com a aplicação e, por isso, precisamos encantá-lo com a facilidade e o design incrível que o Postr oferece.

## 19. Jornadas prioritárias

### 19.1 Jornada A - salvar pela home

1. Usuário copia um link.
2. Cola no Postr.
3. O sistema extrai e salva.
4. O usuário abre a leitura limpa.
5. Opcionalmente adiciona tags.

### 19.2 Jornada B - compartilhar do celular

1. Usuário abre um artigo em outro app.
2. Escolhe compartilhar com o Postr.
3. O sistema processa o link.
4. O artigo é salvo e aberto no modo leitura.

### 19.3 Jornada C - reencontrar artigo salvo

1. Usuário abre a biblioteca.
2. Usa busca ou tags.
3. Reabre o artigo.

### 19.3 Jornada D - receber artigo de outro usuário

1. Usuário recebe, de um amigo, um link de um artigo compartilhado via Postr.
2. Usuário clica no link.
3. O usuário abre a leitura limpa.
4. Opcionalmente salva o artigo em sua biblioteca.
5. Opcionalmente adiciona tags.

## 20. Critérios para considerar a POC evoluída para produto inicial

- fluxo principal definido por specs e critérios de aceitação
- parser com comportamento esperado documentado
- principais erros e edge cases conhecidos documentados
- backlog priorizado por impacto de produto, não apenas por implementação
- documentação do produto e das features mantida no repositório

## 21. Backlog de specs sugeridas

- `specs/001-salvar-artigo/spec.md`
- `specs/002-leitura-limpa/spec.md`
- `specs/003-biblioteca-e-tags/spec.md`
- `specs/004-share-target-pwa/spec.md`
- `specs/005-parser-service/spec.md`
- `specs/006-compartilhar-artigo/spec.md`

## 22. Questões em aberto

- qual é a definição exata de "artigo salvo com sucesso" para sites problemáticos
- quais domínios e formatos de conteúdo entram no escopo inicial
- haverá analytics desde o início ou apenas logging técnico mínimo
- qual será a estratégia futura de sincronização opcional
- como tratar sanitização e segurança do HTML extraído no frontend

## 23. Processo SDD proposto para este projeto

1. Manter este `PRD.md` como documento-mestre de produto.
2. Criar um `spec.md` para cada entrega relevante.
3. Quebrar cada spec em tarefas implementáveis e testáveis.
4. Atualizar código, testes e documentação juntos.
5. Revisar o PRD quando houver mudança de direção, não a cada detalhe de implementação.
