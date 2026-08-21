// Nível UNITÁRIO (ver TESTES.md) — chama as funções puras de Estatisticas.gs
// isoladas, sem planilha nenhuma por trás. Cada caso tem o valor esperado
// calculado à mão, a partir da REGRA descrita no requisito (não rodando o
// código e copiando o que ele devolveu) — é isso que evita um teste que só
// confirma "o código faz o que o código faz" (overfit ao próprio código).
'use strict';
const assert = require('assert');
const { buildEnv } = require('./gas-mock');
const { loadGasFiles } = require('./load-gas');

const env = buildEnv({}, {});
const ctx = loadGasFiles(env, ['Estatisticas.gs', 'Utils.gs']);

let passou = 0;
function caso(nome, fn) {
  fn();
  passou++;
  console.log('  ok — ' + nome);
}

console.log('unitario.test.js');

// ---- calcularViesAvaliadores_ / notaAjustada_ (RF6) ----
// "Durão" avalia 4 pessoas com notas 3, 2, 4, e 5; "Bonzinho" avalia 4
// pessoas com notas 9, 10, 8, e 5 — a última nota (5) é pro MESMO alvo dos
// dois, pra comparar como a mesma nota bruta vira algo diferente conforme
// quem deu ela. Média geral (dos 8 valores) = 46/8 = 5.75. Viés Durão =
// média(3,2,4,5) − 5.75 = 3.5 − 5.75 = −2.25. Viés Bonzinho =
// média(9,10,8,5) − 5.75 = 8 − 5.75 = 2.25. Nota ajustada do alvo comum
// (nota bruta 5): Durão → 5 − (−2.25) = 7.25; Bonzinho → 5 − 2.25 = 2.75.
caso('calcularViesAvaliadores_ + notaAjustada_: mesma nota bruta, avaliadores com hábitos opostos', () => {
  const linha = (avaliador, nota) => ['', '', avaliador, '', '', '', '', '', '', nota];
  const rows = [
    linha('Durão', 3), linha('Durão', 2), linha('Durão', 4), linha('Durão', 5),
    linha('Bonzinho', 9), linha('Bonzinho', 10), linha('Bonzinho', 8), linha('Bonzinho', 5),
  ];
  const vies = ctx.calcularViesAvaliadores_(rows);
  assert.strictEqual(vies['Durão'], -2.25);
  assert.strictEqual(vies['Bonzinho'], 2.25);
  assert.strictEqual(ctx.notaAjustada_(5, 'Durão', vies), 7.25);
  assert.strictEqual(ctx.notaAjustada_(5, 'Bonzinho', vies), 2.75);
});

// ---- detectarNotasForaDoPadrao_ (RF7) ----
// Avaliador "Extremo" dá 7 notas 8, e 1 nota isolada 1 (8 notas ao todo —
// acima do mínimo de 5). Média = 7.125; desvio-padrão amostral ≈ 2.475;
// z da nota 1 ≈ (1 − 7.125) / 2.475 ≈ −2.475 (|z| ≥ 2 → alerta). Um segundo
// avaliador "PoucosDados" dá só 2 notas (9 e 1, uma diferença enorme) — mas
// como tem menos que o mínimo de 5 notas, não deveria gerar nenhum achado,
// mesmo sendo um caso mais extremo que o primeiro.
caso('detectarNotasForaDoPadrao_: nota isolada some da média, mas amostra pequena nunca gera alerta', () => {
  const linha = (avaliador, nota) => ['', '', avaliador, '', '', '', '', '', '', nota];
  const rows = [
    linha('Extremo', 8), linha('Extremo', 8), linha('Extremo', 8), linha('Extremo', 8),
    linha('Extremo', 8), linha('Extremo', 8), linha('Extremo', 8), linha('Extremo', 1),
    linha('PoucosDados', 9), linha('PoucosDados', 1),
  ];
  const achados = ctx.detectarNotasForaDoPadrao_(rows, 5, 2);
  assert.strictEqual(achados.length, 1, 'deveria achar só 1 nota fora do padrão (a do avaliador com amostra suficiente)');
  assert.strictEqual(achados[0].avaliador, 'Extremo');
  assert.strictEqual(achados[0].nota, 1);
  // z calculado fora da função, pela mesma fórmula estatística (desvio-padrão amostral),
  // não copiado do que a função devolveu — a função arredonda pra 2 casas antes de expor.
  const zBruto = (1 - 7.125) / 2.474873734152916;
  assert.strictEqual(achados[0].z, Math.round(zBruto * 100) / 100);
});

// ---- detectarQuedaEntrePeriodos_ (RF7) ----
caso('detectarQuedaEntrePeriodos_: queda acima do limiar gera alerta', () => {
  const evolucao = [{ periodo: '2026.1', s0: 7.0 }, { periodo: '2026.2', s0: 5.5 }];
  const q = ctx.detectarQuedaEntrePeriodos_(evolucao, 's0', 1);
  assert.ok(q, 'queda de 1.5 pontos, limiar 1 — deveria alertar');
  assert.strictEqual(q.periodoAnterior, '2026.1');
  assert.strictEqual(q.periodoAtual, '2026.2');
  assert.strictEqual(Math.abs(q.delta), 1.5);
});
caso('detectarQuedaEntrePeriodos_: queda abaixo do limiar não gera alerta', () => {
  const evolucao = [{ periodo: '2026.1', s0: 7.0 }, { periodo: '2026.2', s0: 6.6 }];
  const q = ctx.detectarQuedaEntrePeriodos_(evolucao, 's0', 1);
  assert.strictEqual(q, null, 'queda de 0.4 pontos, limiar 1 — não deveria alertar');
});
caso('detectarQuedaEntrePeriodos_: subida nunca gera alerta, mesmo grande', () => {
  const evolucao = [{ periodo: '2026.1', s0: 5.0 }, { periodo: '2026.2', s0: 8.0 }];
  const q = ctx.detectarQuedaEntrePeriodos_(evolucao, 's0', 1);
  assert.strictEqual(q, null, 'subida de 3 pontos não é queda');
});

// ---- mediasPorAvaliador_ (RF13) ----
// Avaliador A deu 2 notas (2 e 4, média 3); avaliador B deu 1 nota só (8).
// Resultado esperado: 1 valor POR AVALIADOR (não por nota) — [3, 8], nunca
// o array cru [2, 4, 8].
caso('mediasPorAvaliador_: 1 valor por avaliador distinto, não por nota', () => {
  const linha = (avaliador, nota) => ['', '', avaliador, '', '', '', '', '', '', nota];
  const rows = [linha('A', 2), linha('A', 4), linha('B', 8)];
  const medias = ctx.mediasPorAvaliador_(rows);
  // Array.from: `medias` nasce dentro do contexto isolado do vm (outro "realm" do
  // JS) — deepStrictEqual falha comparando array de outro realm mesmo com os
  // mesmos valores, então normaliza pro realm principal antes de comparar.
  assert.deepStrictEqual(Array.from(medias), [3, 8]);
});

console.log(passou + ' caso(s) — OK\n');
