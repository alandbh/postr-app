# 🚀 Deploy Automático GitHub Actions + cPanel

## Visão Geral

Sistema de CI/CD onde GitHub Actions builda automaticamente e commita `dist-cpanel/`, depois aciona `hook.php` no cPanel que faz `git pull` apenas da pasta buildada usando sparse checkout.

## 📋 Configuração Inicial

### 1. Configurar GitHub Secret

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Nome: `CPANEL_HOOK_KEY`
5. Valor: Sua chave de autenticação (ex: `minha_chave_super_secreta_123`)
6. Clique em **Add secret**

### 2. Configurar cPanel

#### 2.1. SSH no cPanel

```bash
ssh usuario@alanvasconcelos.net
```

#### 2.2. Ir para o diretório

```bash
cd ~/public_html/postr/
```

#### 2.3. Clonar repositório

```bash
git clone https://github.com/seu-usuario/postr-repo.git .
```

#### 2.4. Configurar sparse checkout

```bash
git sparse-checkout init --cone
git sparse-checkout set dist-cpanel
git pull origin main
```

#### 2.5. Criar hook.php

```bash
nano hook.php
```

Cole o conteúdo do arquivo `hook.php` fornecido e ajuste a chave de autenticação:

```php
<?php
// Define a chave de autenticação
define("AUTH_KEY", "minha_chave_super_secreta_123");

// Verifica autenticação
if (!isset($_GET['auth']) || $_GET['auth'] !== AUTH_KEY) {
    http_response_code(403);
    die("Acesso negado.");
}

// Define o diretório
$dir = __DIR__;
chdir($dir);

$output = [];
$return_var = 0;

// Configura sparse checkout na primeira execução
if (!file_exists('.git/info/sparse-checkout')) {
    exec("git sparse-checkout init --cone 2>&1", $output, $return_var);
    exec("git sparse-checkout set dist-cpanel 2>&1", $output, $return_var);
    echo "Sparse checkout configurado.\n";
}

// Executa git pull
exec("git pull origin main 2>&1", $output, $return_var);

// Retorna resultado
header('Content-Type: text/plain');
if ($return_var === 0) {
    http_response_code(200);
    echo "✅ Deploy executado com sucesso!\n\n";
} else {
    http_response_code(500);
    echo "❌ Erro ao executar deploy!\n\n";
}

echo "Log:\n";
echo implode("\n", $output);
?>
```

#### 2.6. Definir permissões

```bash
chmod 644 hook.php
```

### 3. Configurar Apache (se necessário)

Se o Apache não estiver apontando para `dist-cpanel/`, crie um `.htaccess` em `~/public_html/postr/`:

```apache
RewriteEngine On
RewriteBase /postr/
RewriteRule ^$ dist-cpanel/ [L]
RewriteCond %{REQUEST_URI} !^/postr/dist-cpanel/
RewriteRule ^(.*)$ dist-cpanel/$1 [L]
```

## 🧪 Testar Deploy

1. **Fazer alteração no código** (ex: mudar título em `src/pages/Home.tsx`)
2. **Commit e push:**
   ```bash
   git add .
   git commit -m "teste deploy automático"
   git push origin main
   ```
3. **Verificar GitHub Actions:**
   - Vá na aba **Actions** do seu repositório
   - Veja o workflow executando
4. **Verificar site:**
   - Acesse `https://alanvasconcelos.net/postr/`
   - Deve estar atualizado automaticamente

## 📁 Estrutura no cPanel

Após setup completo:

```
~/public_html/postr/
├── .git/                    ← repositório git
├── dist-cpanel/            ← apenas esta pasta é baixada
│   ├── index.html
│   ├── assets/
│   │   ├── index-xxx.js
│   │   └── index-xxx.css
│   ├── manifest.webmanifest
│   ├── sw-custom.js
│   ├── pwa-192.png
│   ├── pwa-512.png
│   └── .htaccess
└── hook.php               ← webhook para deploy
```

## 🔄 Fluxo Completo

1. **Desenvolvedor** edita código e faz push para `main`
2. **GitHub Actions** é acionado automaticamente
3. **Actions** instala dependências e roda `npm run build:cpanel`
4. **Actions** commita `dist-cpanel/` no repositório
5. **Actions** faz push do commit
6. **Actions** chama `hook.php?auth=...`
7. **cPanel** executa `git pull` (só baixa `dist-cpanel/`)
8. **Site** atualizado automaticamente

## ✅ Vantagens

- ✅ **Build sempre consistente** (Node 18, ambiente limpo)
- ✅ **Não precisa buildar localmente**
- ✅ **cPanel só baixa arquivos necessários** (sparse checkout)
- ✅ **Deploy automático** em cada push
- ✅ **Rollback fácil** via git
- ✅ **Logs disponíveis** no GitHub Actions

## 🛠️ Troubleshooting

### Problema: "Acesso negado" no hook.php

- Verifique se a chave `CPANEL_HOOK_KEY` no GitHub é igual à `AUTH_KEY` no `hook.php`

### Problema: "Erro ao executar git pull"

- Verifique se o repositório foi clonado corretamente
- Verifique se as credenciais SSH estão configuradas no cPanel

### Problema: Site não atualiza

- Verifique se o `.htaccess` está redirecionando para `dist-cpanel/`
- Verifique se o sparse checkout foi configurado corretamente

### Problema: GitHub Actions falha

- Verifique se o secret `CPANEL_HOOK_KEY` foi criado
- Verifique se o URL do hook está correto no workflow

## 📝 Comandos Úteis

```bash
# Verificar sparse checkout
git sparse-checkout list

# Reconfigurar sparse checkout
git sparse-checkout disable
git sparse-checkout init --cone
git sparse-checkout set dist-cpanel

# Verificar logs do git pull
git log --oneline -5

# Testar hook manualmente
curl "https://alanvasconcelos.net/postr/hook.php?auth=SUA_CHAVE"
```
