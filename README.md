# Home · Sistema de Consulta Pé-de-Meia (Seduc-AM)

Protótipo em HTML da página inicial do Sistema de Consulta Pé-de-Meia, que consulta elegibilidade, frequência e status dos estudantes do ensino médio público do Amazonas. Ele segue o Design System **Pé-de-Meia · Seduc-AM** e o padrão institucional do Governo do Amazonas (navbar e rodapé).

> **A referência técnica completa está nos comentários do `index.html`.** Este README é só a porta de entrada. Para entender, converter ou reaproveitar qualquer parte (componentes, camadas, animações, interações, bibliotecas, imagens), leia o topo do `index.html`, a partir de **"GUIA DE PORTABILIDADE"**.

## Como abrir

Abra o `index.html` no navegador (dois cliques). Não há build. Precisa de internet para o Tailwind CSS (CDN) e para as fontes do Google.

## O que tem na pasta

| Caminho | O que é |
| --- | --- |
| `index.html` | A página inteira: HTML marcado por componente (`data-component`, `data-item`, `data-prop`), CSS da página e scripts das interações, tudo comentado. Também contém o guia de conversão para React/Next/Vue. |
| `css/tokens.css` | Variáveis de cor, espaço, raio e sombra, geradas do Design System. |
| `css/pdm.css` | Componentes base do Design System (classes `pdm-*`) e o fade-up das seções. |
| `js/pdm.js` | Utilitários do Design System: ícones Lucide embutidos, fade-up e sombra da navbar (esta não é usada nesta página). |
| `assets/` | Logos e ilustrações em SVG, mais a marca d'água. `marca-dagua.gerador.js` regenera a marca d'água; não é carregado pela página. `moeda.jpg` é um asset antigo que a página atual não usa. |

## O que a página faz (resumo)

- **Navbar** não fixa, com cadeado ("Acesso restrito") e botão **Entrar**.
- **Entrar** troca a ilustração do topo pelo **card de login** (e-mail, senha, "Esqueceu sua senha?", "Fazer login"). O X ou a tecla Esc devolvem a ilustração.
- **Meia** clicável: cada clique solta uma moedinha. Ao carregar a página, saem duas sozinhas.
- **Seções** "O sistema" (com marca d'água de impressão digital), "Sobre o programa" (carteira com moeda que pula) e "Fonte dos dados".
- **Rodapé** institucional e botão **voltar ao topo**.
- No celular, título e botão do topo ficam centralizados, a descrição some e o rodapé fica centralizado.

Os detalhes de cada item (como funciona, onde ajustar, como fazer em React) estão nos comentários do `index.html`.

## Pendências

- **Login:** conectar a requisição real em `entrar()` (script, parte F, "PONTO DE INTEGRAÇÃO DO LOGIN").
- **"Esqueceu sua senha?":** definir a rota (hoje `#`).
- **Rodapé:** e-mail de contato do sistema (hoje `[e-mail de suporte do sistema]`).
- **Links de redes sociais e do Gestão Presente:** hoje `#`.
- **Produção:** trocar o Tailwind por CDN pela instalação no projeto (`npm i -D tailwindcss@3.4.17`).

## Links

- Design System: https://claude.ai/artifact/6W8yWCQKeypYnzYhDnbrkF
- Histórico de mudanças: aba **Commits** do repositório no GitHub.
