# Petzão Pet Shop — Landing page

Site institucional do **Petzão Pet Shop** (Timbó/Maracanaú e Maraponga/Fortaleza).
HTML, CSS e JavaScript puros: sem build, sem dependências e sem custo de hospedagem.

```
index.html          → página principal
404.html            → página de erro personalizada (autocontida)
assets/css/style.css
assets/js/main.js   → menu mobile, carrossel de avaliações, animações
assets/img/         → fotos do Instagram @pet_zao, logo, favicon e imagem de compartilhamento
.nojekyll           → avisa o GitHub Pages para servir os arquivos como estão
robots.txt
```

## Custo: R$ 0

| Ferramenta | Para quê | Plano |
|---|---|---|
| Git | versionamento local | gratuito |
| GitHub | guardar o código | gratuito |
| GitHub Pages | hospedagem + HTTPS | gratuito (repositório público) |
| Google Fonts / Google Maps (embed) | fontes e mapas | gratuitos, sem chave de API |

Domínio próprio (ex.: `petzao.com.br`) é **opcional** e é a única parte paga (~R$ 40/ano no registro.br).
Sem ele o site fica em `https://SEU-USUARIO.github.io/petzao/`.

## Publicar no GitHub Pages (uma vez só)

1. Crie uma conta gratuita em <https://github.com>.
2. Clique em **New repository**, dê o nome **`petzao`**, deixe **Public** e **não** marque nenhuma opção de README/.gitignore.
3. Nesta pasta, rode (trocando `SEU-USUARIO`):

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/petzao.git
   git push -u origin main
   ```

4. No GitHub, abra **Settings → Pages**. Em **Build and deployment**, escolha
   **Source: Deploy from a branch**, **Branch: `main`** e pasta **`/ (root)`**. Clique em **Save**.
5. Em 1–2 minutos o site estará em `https://SEU-USUARIO.github.io/petzao/`.
6. Teste a página de erro abrindo qualquer endereço inexistente, ex.: `https://SEU-USUARIO.github.io/petzao/teste`.

### Depois de publicar

Troque os caminhos relativos abaixo pelo endereço completo, para a prévia aparecer bonita no WhatsApp/Facebook:

- `index.html` → `<meta property="og:image" content="https://SEU-USUARIO.github.io/petzao/assets/img/og-image.jpg">`
- `index.html` → no bloco `application/ld+json`, os dois `"image"` → `https://SEU-USUARIO.github.io/petzao/assets/img/logo.jpg`

## Atualizar o site

Edite os arquivos, depois:

```bash
git add .
git commit -m "Descreva a mudança"
git push
```

O GitHub Pages republica sozinho em ~1 minuto.

### Onde mexer

- **Avaliações do carrossel**: em `index.html`, seção `id="avaliacoes"`. Cada `<li class="review-card">` é uma avaliação; copie um bloco para adicionar outra. O carrossel se ajusta sozinho.
- **Telefones / WhatsApp**: procure por `wa.me/55...` em `index.html` e `404.html`.
- **Horários e endereços**: seção `id="unidades"` e o bloco `application/ld+json` no topo do `index.html` (usado pelo Google).
- **Cores**: variáveis no topo de `assets/css/style.css` (`--green-700`, `--orange-500`, `--magenta-700`). A `404.html` tem as mesmas variáveis no próprio `<style>`.
- **Fotos**: substitua os arquivos em `assets/img/` mantendo o mesmo nome (formato vertical funciona melhor).
- **Logo**: `assets/img/logo.jpg` (hoje 150×150, tirada do Instagram). Se tiver o arquivo original em alta resolução, substitua mantendo o nome. A `404.html` usa a logo embutida em base64 — para trocar, gere o base64 da nova imagem e substitua os dois `data:image/jpeg;base64,...`.

## Por que a 404.html é "autocontida"?

O servidor entrega a `404.html` para **qualquer** endereço que não existe, inclusive em subpastas
(`/petzao/servicos/antigo`). Nesses casos, caminhos relativos como `assets/css/style.css` quebrariam.
Por isso o CSS e a logo ficam dentro do próprio arquivo, e um pequeno script descobre a raiz do site
para o botão "Voltar para o início" funcionar tanto em `usuario.github.io/petzao/` quanto em domínio próprio.

## Alternativas gratuitas de hospedagem

O site funciona sem nenhuma alteração em:

- **Cloudflare Pages** (banda ilimitada): conecte o repositório do GitHub, *Framework preset: None*, deixe o comando de build vazio e a pasta de saída como `/`. Endereço: `petzao.pages.dev`.
- **Netlify**: conecte o repositório ou arraste a pasta em <https://app.netlify.com/drop>. Endereço: `petzao.netlify.app`.

Os dois servem a `404.html` automaticamente.

## Testar localmente

Abra o `index.html` direto no navegador, ou sirva a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
```

## Créditos

- Fotos e logo: Instagram oficial [@pet_zao](https://www.instagram.com/pet_zao/).
- Avaliações: clientes no Google (nome abreviado para preservar a privacidade).
- Fontes: Baloo 2 e Nunito (Google Fonts, licença OFL).
