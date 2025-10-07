# 📦 Instruções de Upload - cPanel

## Arquivo criado: `postr-cpanel.zip` (145 KB)

### 🚀 Passo a Passo:

1. **Acesse o cPanel**

   - URL: `https://alanvasconcelos.net/cpanel`
   - Faça login com suas credenciais

2. **Abra o File Manager** (Gerenciador de Arquivos)

   - Procure por "File Manager" ou "Gerenciador de Arquivos"
   - Clique para abrir

3. **Navegue até public_html**

   - No painel esquerdo, clique em `public_html/`

4. **Crie a pasta postr** (se não existir)

   - Clique em "+ Folder" ou "+ Nova Pasta"
   - Nome: `postr`
   - Clique em "Create" ou "Criar"

5. **Entre na pasta postr**

   - Clique duas vezes na pasta `postr` para abri-la

6. **Faça Upload do ZIP**

   - Clique em "Upload" no menu superior
   - Selecione o arquivo `postr-cpanel.zip`
   - Aguarde o upload completar (145 KB - deve ser rápido)

7. **Extraia o ZIP**

   - Volte para o File Manager
   - Clique com botão direito no arquivo `postr-cpanel.zip`
   - Selecione "Extract" ou "Extrair"
   - Confirme a extração

8. **Mova os arquivos**

   - Os arquivos estarão dentro de `dist/`
   - Selecione **TODOS** os arquivos dentro de `dist/` (incluindo `.htaccess`)
   - Clique em "Move" ou "Mover"
   - Destino: `/public_html/postr/`
   - Confirme

9. **Limpe os arquivos temporários**

   - Exclua a pasta `dist/` vazia
   - Exclua o arquivo `postr-cpanel.zip`

10. **Verifique os arquivos**
    - Certifique-se de que em `/public_html/postr/` você tem:
      - ✅ `.htaccess` (arquivo oculto)
      - ✅ `index.html`
      - ✅ `manifest.webmanifest`
      - ✅ `sw.js`
      - ✅ Pasta `assets/`
      - ✅ Arquivos de imagem (PNG)

## ✅ Teste

Acesse: `https://alanvasconcelos.net/postr/`

Se tudo estiver correto, você verá a aplicação funcionando!

## 📱 Teste o PWA

1. Abra no celular (Chrome/Edge)
2. Veja a opção "Instalar app" ou "Adicionar à tela inicial"
3. Instale o PWA
4. Teste compartilhar uma notícia via Share Target

## 🐛 Problemas?

### Site não carrega:

- Verifique se todos os arquivos foram extraídos
- Verifique se o caminho está correto: `/public_html/postr/`

### PWA não instala:

- Certifique-se de que o site está em HTTPS
- Verifique se o `manifest.webmanifest` está acessível
- Verifique se o `sw.js` está acessível

### Rotas não funcionam (404):

- Verifique se o `.htaccess` foi copiado
- Se não aparecer, mostre arquivos ocultos no File Manager
- Entre em contato com o suporte para ativar `mod_rewrite`

## 🔄 Atualizações Futuras

Para atualizar a aplicação:

1. Execute: `npm run build:cpanel`
2. Crie novo ZIP: `zip -r postr-cpanel.zip dist/`
3. Repita os passos 6-9 acima
