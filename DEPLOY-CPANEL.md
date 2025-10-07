# Deploy no cPanel

## 📦 Preparação

1. **Build da aplicação:**

   ```bash
   npm run build
   ```

2. **Copiar o .htaccess:**
   ```bash
   cp public/.htaccess dist/.htaccess
   ```

## 🚀 Upload para o cPanel

1. **Acesse o cPanel** em `https://alanvasconcelos.net/cpanel`

2. **Vá para File Manager** (Gerenciador de Arquivos)

3. **Navegue até** `public_html/`

4. **Crie a pasta** `postr` (se não existir)

5. **Upload dos arquivos:**
   - Faça upload de **TODO** o conteúdo da pasta `dist/` para `public_html/postr/`
   - Certifique-se de que o `.htaccess` foi incluído

## 📁 Estrutura final no servidor

```
public_html/
└── postr/
    ├── .htaccess
    ├── _redirects
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    ├── workbox-b833909e.js
    ├── share-target.html
    ├── assets/
    │   ├── index-*.js
    │   ├── index-*.css
    │   └── workbox-window.prod.es5-*.js
    ├── apple-touch-icon.png
    ├── pwa-192.png
    ├── pwa-512.png
    └── maskable-512.png
```

## ✅ Verificação

1. **Acesse:** `https://alanvasconcelos.net/postr/`
2. **Teste o PWA:** Instale no celular
3. **Teste Share Target:** Compartilhe uma notícia

## 🔧 Configurações importantes

### .htaccess

O arquivo `.htaccess` configura:

- ✅ Redirecionamento de rotas para o SPA
- ✅ Cache correto para service worker
- ✅ Content-Type para manifest
- ✅ Compressão de arquivos

### Permissões

Certifique-se de que as permissões estão corretas:

- Diretórios: `755`
- Arquivos: `644`

## 🐛 Troubleshooting

### Se o PWA não instalar:

1. Verifique se o site está em HTTPS
2. Verifique se o manifest está acessível: `https://alanvasconcelos.net/postr/manifest.webmanifest`
3. Verifique se o service worker está acessível: `https://alanvasconcelos.net/postr/sw.js`

### Se as rotas não funcionarem:

1. Verifique se o `.htaccess` foi copiado
2. Verifique se o mod_rewrite está habilitado no servidor
3. Entre em contato com o suporte do cPanel

### Se os assets não carregarem:

1. Verifique se todos os arquivos foram copiados
2. Limpe o cache do navegador
3. Verifique as permissões dos arquivos

## 📱 URLs importantes

- **App:** https://alanvasconcelos.net/postr/
- **Manifest:** https://alanvasconcelos.net/postr/manifest.webmanifest
- **Service Worker:** https://alanvasconcelos.net/postr/sw.js
- **Share Target:** https://alanvasconcelos.net/postr/share-target

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça o build novamente: `npm run build`
2. Copie o .htaccess: `cp public/.htaccess dist/.htaccess`
3. Substitua todos os arquivos no servidor
4. O service worker atualizará automaticamente nos dispositivos dos usuários
