// =============================================================================
// Gerador da marca d'água "impressão digital" (assets/marca-dagua.svg)
// Uso:  node assets/marca-dagua.gerador.js assets/marca-dagua.svg
// -----------------------------------------------------------------------------
// COMO FUNCIONA (por que parece impressão digital)
//  1. Um "campo" de valores cobre o ladrilho: para cada ponto, a distância até o
//     NÚCLEO mais próximo (há 7 núcleos, cada um levemente oval e girado). Perto
//     de um núcleo o valor é pequeno e cresce em anéis, como os redemoinhos de um
//     dedo. Os anéis de núcleos vizinhos se encontram em "deltas" (soft-min com K baixo).
//  2. Um tremor suave (soma de senos) entorta os anéis para não ficarem perfeitos.
//  3. As CRISTAS são as curvas de nível desse campo a cada ESPACO px (técnica
//     "marching squares", a mesma de mapas topográficos).
//  4. Uma segunda máscara (também feita de senos) abre pequenas FALHAS nas cristas,
//     criando segmentos e pontinhos de pontas arredondadas, como na referência.
//  5. Tudo é periódico (repete a cada T px nos dois eixos), então o ladrilho emenda
//     sem costura quando repetido no CSS (background-repeat).
// AJUSTES: T (tamanho do ladrilho), ESPACO (distância entre cristas), TRACO
// (espessura), OPACIDADE, NUCLEOS (posição/forma dos redemoinhos), LIMIAR_FALHA.
// =============================================================================
const fs = require('fs');
const saida = process.argv[2] || 'marca-dagua.svg';

const T = 640;             // ladrilho (px)
const ESPACO = 28;         // distância entre cristas
const TRACO = 15;          // espessura da crista (≈ metade do ESPACO, como na referência)
const OPACIDADE = 0.025;   // bem suave: textura quase imperceptível, não desenho
const COR = '#123bfe';     // azul-pdm
const PASSO = 4;           // resolução da grade de cálculo (px)
const LIMIAR_FALHA = 0.72; // quanto maior, menos falhas
const MARGEM = 40;         // calcula um pouco além do ladrilho (o SVG recorta)

// núcleos: [x, y, escalaX, escalaY, rotação] (7 redemoinhos espalhados pelo ladrilho)  → ovais diferentes = redemoinhos diferentes
const NUCLEOS = [
  [150, 170, 1.0, 1.35, 0.4],
  [470, 110, 1.25, 1.0, -0.3],
  [380, 430, 1.0, 1.2, 1.1],
  [ 90, 500, 1.3, 1.0, 0.2],
  [600, 330, 1.0, 1.15, -0.8],
  [270, 560, 1.2, 1.0, 0.6],
  [560, 560, 1.0, 1.3, -0.2],
];
const TAU = Math.PI * 2;

// distância "que dá a volta" no ladrilho (periódica)
function dTor(a, b) { let d = Math.abs(a - b) % T; return d > T / 2 ? T - d : d; }
function dSinal(a, b) { let d = ((a - b) % T + T) % T; return d > T / 2 ? d - T : d; }

function campo(x, y) {
  // soft-min das distâncias ovais até os núcleos (anéis que se encontram suavemente)
  const K = 9; let soma = 0;   // K pequeno = encontro nítido entre redemoinhos ("deltas")
  for (const [cx, cy, sx, sy, r] of NUCLEOS) {
    const dx = dSinal(x, cx), dy = dSinal(y, cy);
    const rx = dx * Math.cos(r) + dy * Math.sin(r), ry = -dx * Math.sin(r) + dy * Math.cos(r);
    const d = Math.hypot(rx / sx, ry / sy);
    soma += Math.exp(-d / K);
  }
  let f = -K * Math.log(soma);
  // tremor periódico (os anéis "respiram" de leve)
  f += 7 * Math.sin(TAU * (2 * x / T + 1 * y / T)) + 5 * Math.sin(TAU * (-1 * x / T + 3 * y / T) + 1.3)
     + 3 * Math.sin(TAU * (4 * x / T - 2 * y / T) + 0.7);
  return f;
}
function falha(x, y) {  // máscara periódica: valores altos = abre um vão na crista
  const v = Math.sin(TAU * (5 * x / T + 2 * y / T) + 0.4) * Math.sin(TAU * (-3 * x / T + 6 * y / T) + 2.1)
          + 0.35 * Math.sin(TAU * (9 * x / T + 7 * y / T));
  return v;
}

// grade de valores
const x0 = -MARGEM, y0 = -MARGEM, W = Math.ceil((T + 2 * MARGEM) / PASSO), H = W;
const V = [];
for (let j = 0; j <= H; j++) { V[j] = []; for (let i = 0; i <= W; i++) V[j][i] = campo(x0 + i * PASSO, y0 + j * PASSO); }
let fmin = Infinity, fmax = -Infinity;
for (const l of V) for (const v of l) { fmin = Math.min(fmin, v); fmax = Math.max(fmax, v); }

// marching squares para um nível: devolve polilinhas (encadeando segmentos pelas arestas)
function contornos(L) {
  const segs = [], porAresta = new Map();
  const P = (i, j) => [x0 + i * PASSO, y0 + j * PASSO];
  const lerp = (pa, pb, va, vb) => { const t = (L - va) / (vb - va); return [pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t]; };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const a = V[j][i], b = V[j][i + 1], c = V[j + 1][i + 1], d = V[j + 1][i];
    const caso = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
    if (caso === 0 || caso === 15) continue;
    const A = {
      t: ['h', i, j, () => lerp(P(i, j), P(i + 1, j), a, b)],
      r: ['v', i + 1, j, () => lerp(P(i + 1, j), P(i + 1, j + 1), b, c)],
      b: ['h', i, j + 1, () => lerp(P(i, j + 1), P(i + 1, j + 1), d, c)],
      l: ['v', i, j, () => lerp(P(i, j), P(i, j + 1), a, d)],
    };
    const tabela = { 1: [['l', 'b']], 2: [['b', 'r']], 3: [['l', 'r']], 4: [['t', 'r']], 5: [['l', 't'], ['b', 'r']],
      6: [['t', 'b']], 7: [['l', 't']], 8: [['l', 't']], 9: [['t', 'b']], 10: [['t', 'r'], ['l', 'b']],
      11: [['t', 'r']], 12: [['l', 'r']], 13: [['b', 'r']], 14: [['l', 'b']] };
    for (const [e1, e2] of tabela[caso]) {
      const k1 = A[e1].slice(0, 3).join(':'), k2 = A[e2].slice(0, 3).join(':');
      const s = { k: [k1, k2], p: [A[e1][3](), A[e2][3]()], usado: false };
      segs.push(s);
      for (const k of s.k) { if (!porAresta.has(k)) porAresta.set(k, []); porAresta.get(k).push(s); }
    }
  }
  const linhas = [];
  for (const s0 of segs) {
    if (s0.usado) continue; s0.usado = true;
    const linha = [s0.p[0], s0.p[1]];
    for (const lado of [1, 0]) {               // estende para os dois lados
      let chave = s0.k[lado];
      while (true) {
        const prox = (porAresta.get(chave) || []).find(s => !s.usado);
        if (!prox) break; prox.usado = true;
        const ent = prox.k[0] === chave ? 0 : 1, sai = 1 - ent;
        if (lado === 1) linha.push(prox.p[sai]); else linha.unshift(prox.p[sai]);
        chave = prox.k[sai];
      }
    }
    linhas.push(linha);
  }
  return linhas;
}

// corta as cristas onde a máscara de falha é alta; descarta pedaços fora do ladrilho
const pedacos = [];
for (let L = Math.ceil(fmin / ESPACO) * ESPACO + ESPACO / 2; L < fmax; L += ESPACO) {
  for (const linha of contornos(L)) {
    let atual = [];
    for (const p of linha) {
      if (falha(p[0], p[1]) > LIMIAR_FALHA) { if (atual.length) pedacos.push(atual); atual = []; }
      else atual.push(p);
    }
    if (atual.length) pedacos.push(atual);
  }
}
const dentro = (pts) => pts.some(([x, y]) => x > -TRACO && x < T + TRACO && y > -TRACO && y < T + TRACO);
let d = '';
for (const pts of pedacos) {
  if (!dentro(pts)) continue;
  const simp = pts.filter((_, i) => i % 2 === 0 || i === pts.length - 1);   // menos pontos, mesma forma
  if (simp.length === 1) simp.push([simp[0][0] + 0.1, simp[0][1]]);         // pedacinho vira ponto
  d += 'M' + simp.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">
<!-- Marca d'água "impressão digital" Pé-de-Meia (autoral). Ladrilho ${T}×${T} sem emenda.
     Cristas = curvas de nível em torno de ${NUCLEOS.length} núcleos, com falhas. Cor azul-pdm a ${OPACIDADE * 100}%.
     Gerado por assets/marca-dagua.gerador.js — edite lá, não aqui. -->
<path d="${d}" fill="none" stroke="${COR}" stroke-opacity="${OPACIDADE}" stroke-width="${TRACO}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
fs.writeFileSync(saida, svg);
console.log('pedaços', pedacos.length, '| bytes', svg.length);
