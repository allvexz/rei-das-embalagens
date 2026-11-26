# Rei das Embalagens

Site estático da **Rei das Embalagens** (Betim-MG): catálogo com estoque, busca, filtros, carrinho e envio do pedido pelo WhatsApp. Feito só com HTML, CSS e JavaScript, **sem back end**, então roda direto no GitHub Pages.

## Como funciona

- O catálogo (produtos, preços e estoque) fica em [`assets/js/produtos.js`](assets/js/produtos.js).
- O carrinho fica no navegador do cliente (`localStorage`).
- Ao finalizar, o site monta a mensagem do pedido e abre o WhatsApp da loja com ela pronta para enviar.
- Não há login, banco de dados nem painel administrativo. O pedido só vale depois que a loja confirma pelo WhatsApp.

## Rodar no computador

Basta abrir o `index.html` no navegador. Se preferir um servidor local:

```bash
python -m http.server 8000
# abra http://localhost:8000
```

## Atualizar produtos, preços e estoque

Edite `assets/js/produtos.js`:

- `preco`: valor em reais, com ponto (ex.: `18.90`)
- `estoque`: quantidade disponível. `0` mostra "Esgotado"; `5` ou menos mostra "Restam N"
- `imagem`: arquivo dentro de `assets/img/`
- `whatsapp`: número da loja, só dígitos, com 55 + DDD

Depois, envie a alteração:

```bash
git add .
git commit -m "Atualiza estoque"
git push
```

> Os preços e estoques que vêm no projeto são **exemplos**. Confira com a loja antes de divulgar.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "Site da Rei das Embalagens"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git push -u origin main
   ```

2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Os caminhos dos arquivos são relativos, então funciona tanto em `usuario.github.io/repositorio/` quanto em domínio próprio. Também pode ser publicado em Netlify ou Vercel (site estático, sem build).

## Estrutura

```
index.html
assets/
  css/style.css
  js/produtos.js   ← catálogo (edite aqui)
  js/app.js        ← catálogo, carrinho e pedido
  img/             ← ilustrações dos produtos
```

## Contato da loja

Av. das Acácias, 486, Jardim das Alterosas (2ª Seção), Betim-MG · (31) 3532-1493 · [@rei.das.embalagens](https://www.instagram.com/rei.das.embalagens/)
