# Protótipo: Home Consulta Pé-de-Meia

Abra `index.html` direto no navegador. Não há build: Tailwind 3.4.17 carrega por CDN e as fontes vêm do Google Fonts.

**Design System**: https://claude.ai/artifact/6W8yWCQKeypYnzYhDnbrkF
`css/tokens.css` é gerado a partir de `tokens.json`. `css/pdm.css` e `js/pdm.js` são cópias de `components/bundle.css` e `components/bundle.js` do DS.

## Estrutura da página

1. **Navbar flutuante** (DS Navbar): logo, 3 âncoras e o botão **Entrar** (único acesso ao login; dispara a moeda na meia).
2. **Hero**: chip "Acesso apenas para autorizados", título com "Pé-de-Meia" em `azul-pdm` sublinhado por um rabisco amarelo, descrição oficial e um só CTA, **Conheça o programa** (rola até a carteira e a moeda dá um pulinho). Ao lado, **uma meia** (`assets/pe-de-meia-meia.svg`, peça oficial do logo) sobre a laje azul, com as pílulas "Frequência mensal", "Elegibilidade" e "Dados do SGP".
3. **O sistema**: as 6 funcionalidades do site atual condensadas em 3 cards.
4. **Sobre o programa**: a **carteira** (CSS puro; a descrição do programa fica na aba, com uma moeda grande de destaque, metade dentro e metade fora; clicar nela faz a moeda pular) e 3 pilares em lista compacta.
5. **Fonte dos dados**: 3 passos (SGP → exportação → consulta). O card "Sobre a origem dos dados" foi removido, porque o passo 1 já cita o Gestão Presente.
6. **Rodapé institucional** de ponta a ponta (DS Rodape).

A chamada "Você é gestor ou servidor autorizado?" foi removida. A página ficou cerca de 1/3 mais curta no desktop (de ~3.550px para ~2.370px de altura a 1366px).

**Versão anterior** (bloco amarelo sem carteira, botão "Entrar no sistema" no hero): `index-v2-meia.html`. A versão com a moeda caindo do botão até a carteira foi descartada por ser mais complexa de desenvolver.

**Comentários no código**: o `index.html` traz, no topo, um mapa do arquivo e um guia de reaproveitamento. As camadas da meia e da carteira estão comentadas no CSS. Cada animação tem um bloco no `<script>` explicando o que acontece, etapa por etapa, quando não anima e onde ajustar (constantes nomeadas: `DUR_VOO`, `ALTURA_ARCO`, `ALTURA_PULO` etc.).

## Botão "voltar ao topo" e navbar não fixa

- **Navbar**: deixou de ser fixa nesta página (`.pdm-nav-wrap { position: relative }`) e rola com o conteúdo. A sombra ao rolar foi removida.
- **Voltar ao topo** (`#voltar-topo`, script parte D): é um botão redondo de 52px, fixo no canto inferior direito, no mesmo recuo lateral da navbar, com o gradiente do botão primário. Aparece só quando o hero sai inteiro da tela e some ao voltar a ele (fade + leve subida, 250ms). Ao clicar, rola suave até o topo (instantâneo com "reduzir movimento"), devolve o foco ao logo e limpa o #âncora da URL. Testado: no topo está oculto; com o hero ainda aparecendo, continua oculto; com o hero fora da tela, aparece; depois do clique, volta a scrollY 0, some e o foco fica no logo.

## Atualizações: pulo ao aparecer, marca d'água e eyebrow com meia

- **Moeda da carteira pula ao aparecer na tela** (script, parte C3). Usa IntersectionObserver, uma API nativa. A moeda pula quando fica 60% visível, com a faixa de 8% de baixo da tela descontada. Espera 300ms, para a carteira terminar de entrar. Pula uma vez por entrada e só rearma depois de sair totalmente da tela. Fica quieta enquanto o "Conheça o programa" está rolando, para não pular duas vezes. Testado com observador simulado: 30% visível → não pula; 60% → pula; parada na tela → não repete; saiu e voltou → pula de novo; via CTA → 1 pulo só. Ajustes: `VISIVEL_MIN`, `MARGEM_INFERIOR`, `DEMORA_APARECER`, `REPETIR_AO_VOLTAR`.
- **Marca d'água "impressão digital" na seção "O sistema"**: `assets/marca-dagua.svg`. As cristas são curvas de nível em torno de 7 núcleos (redemoinhos), com falhas que geram segmentos e pontos de pontas arredondadas. Cor azul-pdm a 2,5%, bem suave para não competir com o texto. É um ladrilho de 640px que se repete sem emenda. Para regerar ou ajustar (espaçamento, espessura, opacidade, núcleos), edite as constantes no topo de `assets/marca-dagua.gerador.js` e rode `node assets/marca-dagua.gerador.js assets/marca-dagua.svg`. O zigue-zague e o X que ficavam nessa seção saíram.
- **Eyebrow com meia**: em "O sistema" e "Fonte dos dados", o tracinho amarelo virou a meia do logo (classe `pdm-eyebrow--meia`).

## Grafismos (SVG autorais, inspirados nas referências)

- **Laje digital** (bloco azul atrás da meia): grade de linhas brancas a 8% (CSS `linear-gradient`, passo de 32px), círculos concêntricos no canto superior esquerdo e zigue-zague branco no canto inferior direito.
- **Formas espalhadas**: X grosso, pontilhado de círculos vazados, zigue-zague duplo e arcos concêntricos. São 9 no desktop; abaixo de 768px ficam 3 (os marcados com `grafismo--desktop` somem).

| Onde | Forma | Cor |
| --- | --- | --- |
| Arte do hero | X / pontilhado | amarelo / verde |
| O sistema | zigue-zague / X pequeno | azul-pdm / amarelo |
| Sobre o programa | X / pontilhado | verde / azul-pdm |
| Fonte dos dados | arcos saindo da borda direita / zigue-zague | amarelo / verde |

**Como funciona**: cada forma é um `<symbol>` na "biblioteca de grafismos" (SVG oculto no início do `<body>`) e é reutilizada com `<svg class="grafismo text-COR"><use href="#g-FORMA"/></svg>`. A cor vem de `currentColor`. Os grafismos ficam atrás do conteúdo (z-index 0), não recebem clique e são ocultos para leitores de tela. Para mover um grafismo, altere o `style` (right/left/top/bottom, width/height).

## Meia com moedinhas e login no lugar da arte

- **Meia clicável** (script, parte B): a meia é um `<button>`. Cada clique solta **uma** moeda: a meia dá um "cuspe" (estica e volta), a moeda sobe por dentro do cano, atrás da meia, sai pela boca, faz um arco para um dos lados (mais vezes para a direita), gira e some caindo. Cliques seguidos geram moedas independentes. Ajustes: `ALTURA_SALTO`, `DISTANCIA_LADO`, `QUEDA`, `DUR_SUBIDA`, `DUR_ARCO`, `DUR_CUSPE`.
- **Entrar** (navbar, `data-acao="abrir-login"`, script parte F): **não navega mais** e **não tem mais a moeda entrando na meia**. As peças da ilustração (pílulas, X, pontilhado, laje azul com círculos, discos e meia) saem em sequência, afastando-se do centro e sumindo, e no lugar entra o **card de login**, com o foco no e-mail. Se a página estiver rolada, ela sobe antes. O X do card (ou a tecla Esc) fecha o card, devolve a ilustração pelo mesmo caminho e volta o foco ao Entrar.
- **Card de login** (baseado na versão legada): "Acessar Sistema", "Entre com suas credenciais para acessar", E-mail, Senha, "Esqueceu sua senha?" (no azul do botão) e o botão **Fazer login**, que não se chama "Entrar" para não repetir o da navbar. Os campos são obrigatórios e têm validação nativa e autocomplete.
- **Integração do login**: fica no envio do formulário, no script parte F: `entrar(dados)` / `concluirEntrar()` / `falharEntrar()`. Hoje não há requisição; o card mostra "Protótipo: o login ainda não está conectado ao sistema." A regra antiga, "animação da moeda antes do login", deixou de existir junto com a animação do Entrar.
- **Pendente:** a rota de "Esqueceu sua senha?" (hoje `#`).

## Bibliotecas e o que instalar

O topo do `index.html` traz a seção **BIBLIOTECAS E DEPENDÊNCIAS**. Em resumo:

| Item | Para quê | Neste protótipo | Num projeto real |
| --- | --- | --- | --- |
| Tailwind CSS 3.4.17 | Layout e utilitários | CDN | **Instalar**: `npm i -D tailwindcss@3.4.17 postcss autoprefixer` |
| Inter + Plus Jakarta Sans | Texto / títulos | @import do Google Fonts | **Configurar**: `next/font/google` ou `@fontsource/*` |
| Lucide Icons | Ícones | Paths embutidos em `js/pdm.js` | **Instalar**: `lucide-react` (ou `lucide-vue-next` / `lucide`) |
| Web Animations API | Moeda na meia, pulinhos | Nativa | Não instala |
| IntersectionObserver | Fade-up das seções | Nativa | Não instala |
| CSS transitions + prefers-reduced-motion | Hovers, navbar, acessibilidade | Nativo | Não instala |

Anime.js, ScrollReveal e Chart.js **não** são usados nesta página.

## Portabilidade (React, Next.js, Vue etc.)

O `index.html` foi preparado para ser convertido por pessoas ou IAs:

- **Guia no topo do arquivo**:
  - convenções de marcação;
  - árvore de componentes com as props de cada um e quais precisam de JS no navegador (`'use client'` no Next);
  - equivalência de cada efeito em hooks React;
  - onde colocar cada CSS e cada asset;
  - regras que não podem se perder na conversão.
- **`data-component`**: marca a raiz de cada um dos 11 componentes (PaginaHome, Navbar, Hero, HeroArte, SecaoSistema, SecaoPrograma, Carteira, MoedaCarteira, ListaPilares, SecaoFonteDados, Rodape).
- **`data-item`**: marca os itens que se repetem e viram arrays (NavLink, Pilula, CardFuncionalidade, Pilar, Passo, RedeSocial).
- **`data-prop`**: marca o conteúdo variável. O que não tem `data-prop` é estrutura fixa.
- **CSS**: cada bloco do `<style>` indica a qual componente pertence.

## Efeitos e camadas

| Recurso | Origem / tecnologia | Funcionamento | Onde está | Como ajustar |
| --- | --- | --- | --- | --- |
| Fade-up nas seções | Autoral · CSS + IntersectionObserver API | Elementos `[data-pdm-reveal]` começam com `opacity:0` e `translateY(18px)`. Ao entrar na tela (10% visível, margem inferior de −10%), ganham `.is-visible` e transicionam em 600ms com `cubic-bezier(.2,.7,.2,1)`. Cada elemento é observado só uma vez. | `css/pdm.css` (`[data-pdm-reveal]`) · `js/pdm.js` (`revelar`) | Atraso: `style="--pdm-delay:120ms"`. Duração e deslocamento na regra CSS. |
| Sombra da navbar ao rolar | Autoral · CSS + JS | Com `scrollY > 8`, a navbar ganha `.is-scrolled`: a borda some e entra `shadow-nav` (250ms). | `pdm.css` (`.pdm-nav.is-scrolled`) · `pdm.js` (`navScroll`) | Limite em `navScroll`; sombra no token `shadow-nav`. |
| Hover dos cards | Autoral · CSS | O card sobe 4px e troca para `shadow-card-hover`; o tile do ícone gira −6° e cresce 5%. 250ms. | `pdm.css` (`.pdm-card:hover`) | Valores de `translateY` / `rotate` / `scale`. |
| Hover dos botões | Autoral · CSS | O primário sobe 1px com sombra azul; a seta (`.pdm-icon--seta`) desliza 3px. 200ms. | `pdm.css` (`.pdm-btn`) | Regra `transition` de `.pdm-btn`. |
| **Pulinho da moeda na carteira** (clique em Conheça o programa **ou na própria moeda**) | Autoral · Web Animations API | 1) O link rola normalmente até `#programa` (âncora + `scroll-behavior: smooth`); o clique não é interceptado. 2) Quando a página fica 150ms sem rolar (`PAUSA_FIM`), a moeda que já está na boca da carteira (`.carteira__moeda`, camada 2, atrás da aba) dá um pulinho: sobe 48px girando −12°, cai acelerando, achata ao bater (`scale 1.12/.86`) e volta, em 650ms. Teto de espera de 4s. Clicar na moeda (um `<button>`, acessível por teclado) pula na hora. Uma trava ignora cliques enquanto um pulo está rodando. Com movimento reduzido, só a rolagem acontece. | `index.html`: CSS `.carteira…` e o script, parte **C** | `ALTURA_PULO`, `DUR_PULO_CARTEIRA`, `PAUSA_FIM`, `ESPERA_MAX`; tamanho da moeda na variável CSS `--moeda` (184px; 128px no celular). O centro da moeda fica sempre na borda da aba. |
| **Moeda na meia** (clique em Entrar) | Autoral · **Web Animations API** (nativa do navegador, sem biblioteca), https://developer.mozilla.org/docs/Web/API/Web_Animations_API | 1) Clique em `[data-moeda="meia"]`: nasce uma moeda SVG no ponto do mouse (pelo teclado, no centro do botão). 2) Ela voa em arco (Bézier quadrática amostrada em 14 quadros, controle 160px acima) até logo acima da boca da meia, girando 360°, numa camada fixa (`z-index 60`) por cima da página; 900ms. 3) Ao chegar, é movida para `.moedas` (`z-index 2`), que fica **atrás** da meia (`z-index 3`), e desce pelo cano em 380ms. A meia cobre a moeda até ela sumir. 4) A meia faz um "gole" (`scale 1.06/.94 → .98/1.03 → 1`, 420ms) e o link segue para o `href` (hoje `#`, o login ainda não tem URL). Se a meia estiver fora da tela ou o usuário preferir menos movimento, o link funciona direto, sem animação. | `index.html`, último `<script>` (bloco "Moeda na meia") e CSS `.moeda-voo`, `.hero-arte .moedas`, `.hero-arte .meia` | Pontos da boca em unidades do viewBox 156×278: `p(144,-20)` acima, `p(86,86)` dentro. Altura do arco: `- 160`. Durações: `900` (voo), `380` (descida), `420` (gole). Tamanho: `TAM = 44`. |
| Composição do hero | Autoral · CSS (posicionamento absoluto) | Camadas (z-index): 1 disco `azul-50`, laje azul `radius-xl` com grade de pontos e meia-lua verde → 2 camada das moedas → 3 a meia (com `drop-shadow`) → 4 três pílulas brancas giradas (−4°, 3°, −2°). Abaixo de 480px, a pílula "Dados do SGP" é ocultada. | `index.html`, bloco `<style>` (`.hero-arte …`) | Posições em `.f1/.f2/.f3`; tamanho da meia em `.hero-arte .meia { height }`. |
| Rabisco sob o título | Autoral · SVG inline | Curva Bézier com traço `amarelo` de 7px, esticada (`preserveAspectRatio="none"`) sob a palavra. Inspirado no rabisco da referência Spark Kids. | `index.html` (`.hero-titulo .marca svg`) | Atributo `d` do path e `stroke-width`. |
| Linha tracejada dos passos | Autoral · CSS | Um `::before` com `repeating-linear-gradient` liga os 3 números. Só aparece a partir de 768px. | `index.html` (`.passos::before`) | Tamanho do traço e do intervalo (8px/14px). |
| Ícones | **Lucide Icons** (ISC), https://lucide.dev | Os paths SVG estão embutidos em `pdm.js`. `hidratarIcones()` troca cada `<i data-icon>` pelo SVG. | `js/pdm.js` | Para acrescentar um ícone, copie o path de lucide.dev para o objeto `P`. |

Todos os efeitos animam só `transform`, `opacity` e `box-shadow`, e são desligados com `prefers-reduced-motion: reduce`. Anime.js e ScrollReveal não foram necessários.

## Pendências

- **E-mail de contato** do rodapé: placeholder `[e-mail de suporte do sistema]`. Não há e-mail do Pé-de-Meia nos materiais (o do rodapé de referência é do SIGEFCON).
- **Links** Entrar, Gestão Presente e redes sociais estão com `#`.
- A moeda da animação é um SVG autoral; `moeda.jpg` não é mais usado na home.
