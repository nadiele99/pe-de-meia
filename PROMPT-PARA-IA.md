# Prompt para IA: replicar esta home em outro projeto

Copie o texto abaixo e cole na IA junto com a pasta `prototipo`. Troque o que está entre colchetes pelos dados do seu projeto.

```text
Você vai receber a pasta "prototipo" com a home do Sistema de Consulta Pé-de-Meia (Seduc-AM).
Sua tarefa é replicar essa home no meu projeto, em [Next.js 14 com App Router / React + Vite / Vue 3 — escolha], usando [TypeScript / JavaScript].

ANTES DE ESCREVER QUALQUER CÓDIGO
1. Leia o index.html inteiro, começando pelo comentário do topo. Ele é a referência técnica completa.
   O README.md é só um resumo; se os dois discordarem, vale o index.html.
2. Siga o "GUIA DE PORTABILIDADE" do topo do index.html:
   - Árvore de componentes: crie um componente para cada data-component, com o mesmo nome.
   - data-item = item que se repete (vira lista/array); data-prop = conteúdo variável (vira prop).
   - Os componentes marcados com "C" precisam de JavaScript no navegador ('use client' no Next).
   - "ESTADO E EFEITOS → EQUIVALENTE EM REACT" diz como converter cada animação e interação.
   - "REGRAS QUE NÃO PODEM SE PERDER" deve ser respeitado à risca.
3. Me apresente um plano curto (componentes, arquivos que vai criar, dependências que vai instalar) e espere minha confirmação.

AO IMPLEMENTAR
- Instale o que o comentário "BIBLIOTECAS E DEPENDÊNCIAS" marca como [INSTALAR]:
  Tailwind CSS 3.4.17 (copie o theme.extend do index.html para o tailwind.config, com preflight: false),
  fontes Inter e Plus Jakarta Sans e lucide-react para os ícones.
  NÃO instale Anime.js, ScrollReveal nem Chart.js: as animações usam APIs nativas (Web Animations API e IntersectionObserver).
- Copie css/tokens.css e css/pdm.css como CSS global e mova a pasta assets/ para [public/].
  Não use assets/marca-dagua.gerador.js nem assets/moeda.jpg (não fazem parte da página).
- Mantenha os textos, cores, espaçamentos, ordem das camadas (z-index) e durações exatamente como no index.html.
  Os valores ajustáveis têm nomes (DUR_*, ALTURA_*, etc.): preserve-os como constantes.
- Preserve: a moeda que sai da meia a cada clique e as 2 de boas-vindas; o "Entrar" trocando a ilustração
  pelo card de login (com X/Esc para voltar); a carteira com a moeda que pula (clique, botão
  "Conheça o programa" e ao aparecer na tela); a marca d'água; os grafismos; a dica do cadeado;
  o botão voltar ao topo; e o comportamento no celular (descrição oculta, topo e rodapé centralizados).
- Respeite "prefers-reduced-motion" e a acessibilidade já prevista (aria-*, foco, labels, Esc).
- O login NÃO deve ser inventado: deixe a função entrar() como ponto de integração,
  conforme "PONTO DE INTEGRAÇÃO DO LOGIN", e me pergunte a rota/API real.
- Mantenha os comentários explicativos no código convertido.

AO TERMINAR
- Compare lado a lado com o index.html original no desktop (1280px) e no celular (375px) e liste qualquer diferença.
- Liste as pendências que continuam em aberto (rota do "Esqueceu sua senha?", e-mail do rodapé, links).
```
