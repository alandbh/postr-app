# Deploy - Postr

Status: consolida `DEPLOY-CPANEL.md`, `DEPLOY-SETUP.md` e `INSTRUCOES-UPLOAD.md` (arquivos antigos removidos).
Documento de operações. Direção de produto em [docs/product/PRD.md](../product/PRD.md); arquitetura em [docs/engineering/architecture-and-backlog.md](../engineering/architecture-and-backlog.md).

O frontend PWA é hospedado em `https://alanvasconcelos.net/postr/` (cPanel). O backend de parsing é um Cloudflare Worker separado (`https://postr-worker.postr-worker.workers.dev`) e tem seu próprio ciclo de deploy via Wrangler (ver `cloudflare/`).

## 1. Método canônico - CI/CD automático (GitHub Actions + FTP)

Este é o método real em uso, definido em [.github/workflows/deploy-cpanel.yml](../../.github/workflows/deploy-cpanel.yml). A cada push na branch `main`:

1. GitHub Actions faz checkout e configura Node 20.
2. Roda `npm ci`.
3. Roda `npm run build:cpanel` com `VITE_API_BASE=https://postr-worker.postr-worker.workers.dev`.
   - Esse script builda com `vite build --outDir dist-cpanel` e copia `public/.htaccess-dist` para `dist-cpanel/.htaccess`.
4. Faz upload de `dist-cpanel/` para o servidor via `SamKirkland/FTP-Deploy-Action`, para o `server-dir` `/`.

### Secrets necessários no GitHub

Configurados em Settings -> Secrets and variables -> Actions:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

### Como publicar

Basta fazer merge/push na `main`. Acompanhe em Actions e valide em `https://alanvasconcelos.net/postr/`.

## 2. Fallback manual (upload de ZIP via File Manager)

Use apenas se o CI/CD estiver indisponível.

1. Build local:

   ```bash
   npm run build:cpanel-zip
   ```

   Esse script roda `vite build` (saída em `dist/`), copia `public/.htaccess` para `dist/.htaccess` e gera `postr-cpanel.zip`.

2. No cPanel (`https://alanvasconcelos.net/cpanel`) abra o File Manager e vá para `public_html/postr/`.
3. Faça upload do `postr-cpanel.zip` e extraia.
4. Mova todo o conteúdo de `dist/` (incluindo o `.htaccess` oculto) para `public_html/postr/`.
5. Remova a pasta `dist/` vazia e o ZIP.
6. Valide em `https://alanvasconcelos.net/postr/`.

Permissões esperadas: diretórios `755`, arquivos `644`.

## 3. O que o `.htaccess` faz

- Redirecionamento de rotas para o SPA (`mod_rewrite` necessário)
- Cache correto do service worker
- `Content-Type` do manifest
- Compressão de arquivos

## 4. Verificação pós-deploy

- App: `https://alanvasconcelos.net/postr/`
- Manifest: `https://alanvasconcelos.net/postr/manifest.webmanifest`
- Service worker acessível na raiz do app
- PWA instalável no celular (requer HTTPS)
- Share Target: compartilhar uma notícia de outro app

## 5. Troubleshooting

- PWA não instala: confirmar HTTPS, manifest e service worker acessíveis.
- Rotas 404: confirmar que o `.htaccess` foi publicado e que `mod_rewrite` está habilitado.
- Assets não carregam: confirmar que todos os arquivos foram enviados e limpar cache.
- Actions falha: conferir os secrets `FTP_*`.

## 6. Pendências a verificar (VERIFICAR)

A documentação antiga era inconsistente. Confirmar contra o build real antes de tratar como fato:

- Nome do service worker publicado: `sw.js` (gerado pelo vite-plugin-pwa) vs `sw-custom.js` (em `public/`). Verificar qual é servido em produção e qual o manifest referencia.
- `DEPLOY-SETUP.md` (removido) descrevia um método via `hook.php` + `git sparse-checkout` de `dist-cpanel/`. Esse método NÃO corresponde ao workflow atual (que usa FTP) e foi considerado obsoleto. Se algum dia o `hook.php` for reintroduzido, documentar aqui.
- `server-dir` do FTP é `/`; confirmar que o alvo real no servidor é `public_html/postr/` (mapeamento do usuário FTP).
