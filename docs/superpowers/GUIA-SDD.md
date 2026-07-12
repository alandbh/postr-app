# Guia SDD / Superpowers — Postr

Referência rápida para implementar features seguindo Spec-Driven Development no Postr.

Documentos relacionados:

- [AGENTS.md](../../AGENTS.md) — regras para agentes de IA
- [docs/superpowers/README.md](README.md) — processo detalhado
- [docs/product/PRD.md](../product/PRD.md) — direção de produto
- [docs/engineering/architecture-and-backlog.md](../engineering/architecture-and-backlog.md) — estado técnico

---

## Fluxo completo

```
Ideia → Brainstorming → Spec (design doc) → Plano → Implementação (TDD) → Verificação → Review → Merge
```

**Regra de ouro:** não implemente código de produto antes de ter a **spec aprovada**. Entregas com vários passos exigem também o **plano aprovado**.

---

## Três situações (qual comando usar)

| Situação | Próximo passo | Prompt no chat (Cursor) |
| --- | --- | --- |
| Feature **nova**, sem spec | Brainstorming | `/brainstorming` + descreva a ideia e cite PRD/backlog |
| **Stub** em `docs/superpowers/specs/` | Brainstorming no stub | `/brainstorming @docs/superpowers/specs/YYYY-MM-DD-<topico>-design.md` |
| Spec **já aprovada** | Plano (não brainstorming de novo) | `Use writing-plans para a spec aprovada em docs/superpowers/specs/...` |
| Plano **já aprovado** | Implementação | `Implemente o plano @docs/superpowers/plans/.... Subagent-Driven. Branch feat/<topico>.` |

**Stub** = rascunho com contexto e seções “a definir”. **Spec aprovada** = design completo e você já disse “aprovado”.

---

## Passo a passo por fase

### Fase 1 — Brainstorming (design)

**Modo Cursor:** Agent (ou Plan só para discutir, sem escrever).

1. Escolha um item do backlog ou uma ideia nova.
2. Invoque brainstorming referenciando o stub (se existir).
3. Responda **uma pergunta por vez** do agente.
4. Revise as 2–3 abordagens propostas e escolha/aprove.
5. Agente escreve a spec em `docs/superpowers/specs/YYYY-MM-DD-<topico>-design.md`.
6. **Você revisa o arquivo** e aprova antes do plano.
7. Commit da spec (quando satisfeito).

**Não peça código de produto nesta fase.**

---

### Fase 2 — Plano de implementação

**Modo Cursor:** Agent.

```
Use a skill writing-plans. A spec <topico> está aprovada em docs/superpowers/specs/...
Escreva o plano em docs/superpowers/plans/ usando TEMPLATE-plan.md.
```

1. Revise o plano (`docs/superpowers/plans/YYYY-MM-DD-<topico>-plan.md`).
2. Aprove explicitamente: “Aprovado. Pode implementar.”
3. Commit do plano (opcional, junto com spec ou separado).

---

### Fase 3 — Implementação

**Modo Cursor:** Agent.

**Isolamento (recomendado):**

```
Crie a branch feat/<topico> a partir da main e implemente o plano.
```

**Execução do plano:**

| Abordagem | Prompt |
| --- | --- |
| Subagent-Driven (recomendado) | `Implemente o plano @docs/superpowers/plans/.... Subagent-Driven.` |
| Inline (mesma sessão) | `Execute o plano task por task com TDD.` |

Skills que entram automaticamente ou podem ser citadas:

- `test-driven-development` — teste antes do código
- `verification-before-completion` — rodar testes/build antes de “pronto”
- `systematic-debugging` — bugs e falhas de teste
- `using-git-worktrees` — worktree isolado (alternativa à branch)

---

### Fase 4 — Verificação

Antes de merge, confirme (você ou o agente):

```bash
npm test           # testes em src/
npm run typecheck  # TypeScript (pode haver erros pré-existentes fora do escopo)
npm run build      # build de produção
```

Peça evidência: “Mostre a saída de npm test e npm run build.”

---

### Fase 5 — Review e integração

```
Revise a implementação contra a spec e o plano (code review).
```

Depois:

```
Merge feat/<topico> na main e push
```

Push na `main` dispara deploy (GitHub Actions → cPanel). Ver [docs/operations/deploy.md](../operations/deploy.md).

Skill opcional: `finishing-a-development-branch` — merge local, PR, ou manter branch.

---

## O que pular

| Mudança | SDD completo? |
| --- | --- |
| Typo, cópia, correção óbvia (1–2 linhas) | Não — só verificar |
| Nova feature, refactor de fluxo, parser, PWA, segurança | **Sim** |

---

## Onde ficam os artefatos

```
docs/superpowers/
├── README.md
├── GUIA-SDD.md                          ← este guia
├── specs/
│   ├── TEMPLATE-design.md
│   └── YYYY-MM-DD-<topico>-design.md    ← O QUÊ e POR QUÊ (spec)
└── plans/
    ├── TEMPLATE-plan.md
    └── YYYY-MM-DD-<topico>-plan.md      ← COMO (passo a passo)

src/... + *.test.ts                       ← código + testes
docs/decisions/                           ← ADRs (decisões que atravessam entregas)
```

---

## Backlog de specs (stubs P0/P1)

Ver tabela em [docs/superpowers/README.md](README.md#backlog-de-specs-stubs-criados).

**Já entregue:** salvar-artigo

**Próximos P0 sugeridos:**

- parser-contract
- share-target-pwa
- seguranca-html-extraido

---

## Modos do Cursor

| Modo | Use para |
| --- | --- |
| **Ask** | Entender código, tirar dúvidas — sem editar |
| **Plan** | Planejar/refinar docs — sem executar |
| **Agent** | Brainstorm que escreve spec, plano, implementação, git |

---

## Cheat sheet — uma linha por fase

```
/brainstorming @docs/superpowers/specs/<stub>-design.md
→ (aprovar design) → (revisar spec escrita) → commit spec

Use writing-plans para a spec aprovada de <topico>
→ (aprovar plano) → commit plano

Implemente o plano @docs/superpowers/plans/<topico>-plan.md Subagent-Driven branch feat/<topico>
→ npm test && npm run build

Merge feat/<topico> na main e push
```

---

## Exemplo real (salvar-artigo)

1. `/brainstorming @docs/superpowers/specs/2026-07-11-salvar-artigo-design.md`
2. Perguntas → abordagens → design aprovado → spec escrita
3. `Escreva o plano` → `2026-07-11-salvar-artigo-plan.md`
4. `Subagent-Driven` → branch `feat/salvar-artigo` → 4 tasks + testes
5. Merge `main` + push

Referência:

- [2026-07-11-salvar-artigo-design.md](specs/2026-07-11-salvar-artigo-design.md)
- [2026-07-11-salvar-artigo-plan.md](plans/2026-07-11-salvar-artigo-plan.md)

---

## Dicas

1. **Uma spec por ciclo longo** — não misture parser + share target na mesma sessão.
2. Use **@** para anexar arquivos (`@PRD.md`, stub da spec, plano).
3. **Agent** implementa; **Ask** explica.
4. Exija **saída de comandos** antes de aceitar “pronto”.
5. **Branch por feature:** `feat/<topico>`.
6. Brainstorming **conduz com você** — não substitui sua aprovação.

---

Última atualização: 2026-07-12
