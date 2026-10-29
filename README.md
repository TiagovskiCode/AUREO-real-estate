# AUREO — Real Estate (conceito)

Site de imobiliário de luxo, fictício, feito como projeto de design e desenvolvimento.
HTML, CSS e JavaScript simples, com GSAP (ScrollTrigger e SplitText) e Lenis para o scroll suave.

**Ver online:** https://tiagovskicode.github.io/AUREO-real-estate/

> Todos os imóveis, preços e contactos são fictícios. O formulário é uma demonstração e não envia nada.

## Estrutura

```
index.html            página única
css/styles.css        todo o estilo (variáveis de cor e tipografia no topo)
js/
  data.js             conteúdo dos imóveis (editar aqui para mudar imóveis)
  core.js             modo de movimento, Lenis, scroll, utilitários
  properties.js       showcase horizontal, vista de detalhe, galeria, favoritos
  main.js             header, menu, hero, animações de scroll, formulário
  images.js           lista de tamanhos WebP (gerado)
  vendor/             GSAP, ScrollTrigger, SplitText e Lenis (ficheiros locais)
images/               fotografias originais (JPG)
images/opt/           versões WebP em 640, 1200 e 1920 px (geradas)
docs/ART-DIRECTION.md direção de arte e decisões de design
assets/               imagens originais da referência no Figma
tools/optimize-images.cjs   gera as versões WebP
```

## Ver no computador

Não precisa de build. Abrir `index.html` funciona, mas um servidor local é mais fiel ao site online:

```bash
npm start
```

e abrir http://localhost:5174.

## Movimento

O site respeita a definição "reduzir movimento" do sistema. Se estiver ligada, aparece um aviso na primeira visita
e há sempre um interruptor "Cinematic motion" no rodapé para ligar as animações.

## Adicionar ou trocar fotografias

1. Colocar o JPG em `images/`.
2. `npm install` (uma vez) e `npm run images` para gerar os WebP e atualizar `js/images.js`.
3. Referenciar a foto em `js/data.js` (imóveis) ou em `index.html`.

## Publicar no GitHub Pages

Settings → Pages → *Deploy from a branch* → branch `main`, pasta `/ (root)`.
O ficheiro `.nojekyll` garante que os ficheiros são servidos tal como estão.

Fotografias: Unsplash (ver direitos de cada imagem) e imagens fornecidas no projeto.
