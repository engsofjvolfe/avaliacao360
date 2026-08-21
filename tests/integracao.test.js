// Nível INTEGRAÇÃO (ver TESTES.md) — roda o fluxo completo real: dados
// sintéticos de "Respostas do Formulário 1" (tests/gen-data.js) até
// executarTransformacao_() e getPainelDados()/getFiltrosPainel(), com os
// mesmos arquivos .gs de produção. Os valores esperados abaixo foram
// conferidos manualmente contra o resultado (ex.: nota do Setor Comercial,
// contagem de avaliadores da Ana Beatriz Monelli) antes de virarem asserção
// — não são "o que o código devolveu na primeira vez que rodei".
'use strict';
const assert = require('assert');
const { buildEnv } = require('./gas-mock');
const { loadGasFiles } = require('./load-gas');
const { buildSheetsData, NAMED_RANGES } = require('./fixtures/build-sheets');

let passou = 0;
function caso(nome, fn) {
  fn();
  passou++;
  console.log('  ok — ' + nome);
}

console.log('integracao.test.js');

const env = buildEnv(buildSheetsData(), NAMED_RANGES);
const ctx = loadGasFiles(env, ['Config.gs', 'Utils.gs', 'Estatisticas.gs', 'DataTransform.gs', 'Painel.gs', 'Participacao.gs']);

const resultado = ctx.executarTransformacao_();

caso('executarTransformacao_(): processa as respostas sintéticas sem avisos inesperados', () => {
  assert.strictEqual(resultado.nRespostas, 91);
  assert.ok(resultado.nLinhasTidy > 0);
});

caso('getFiltrosPainel(): listas derivam da tabela de Membros (RF3)', () => {
  const filtros = ctx.getFiltrosPainel();
  assert.strictEqual(filtros.pessoas.length, 45);
  assert.deepStrictEqual(Array.from(filtros.setores).sort(), ['Comercial', 'DAF', 'Gestão de Pessoas', 'Marketing', 'Presidência e Vice-Presidência', 'Projetos']);
  assert.deepStrictEqual(Array.from(filtros.cargos).sort(), ['Consultor(a)', 'Diretor(a)', 'Presidente', 'Vice-Presidente']);
});

caso('getPainelDados(): Setor Comercial, lente colegas — nota e contagens batem com o conferido à mão', () => {
  const d = ctx.getPainelDados([{ tipo: 'setor', valor: 'Comercial', periodo: '', label: 'Setor: Comercial' }], '', 'colegas');
  const r = d.secoes.colegas.resumo[0];
  assert.strictEqual(r.integrantes, 9);
  assert.strictEqual(r.nota, 5.48);
  assert.strictEqual(r.nAvaliacoes, 792);
  assert.strictEqual(r.nAvaliadores, 12);
  assert.strictEqual(r.grupoPequeno, false);
});

caso('getPainelDados(): Cargo Presidente — grupo pequeno demais, número escondido (RF5)', () => {
  const d = ctx.getPainelDados([{ tipo: 'cargo', valor: 'Presidente', periodo: '', label: 'Cargo: Presidente' }], '', 'colegas');
  const r = d.secoes.colegas.resumo[0];
  assert.strictEqual(r.integrantes, 1);
  assert.strictEqual(r.grupoPequeno, true);
  assert.strictEqual(r.nota, null);
});

caso('getPainelDados(): lente autoavaliacao esconde o Ranking (RF14)', () => {
  const d = ctx.getPainelDados([], '', 'autoavaliacao');
  assert.strictEqual(d.ranking, null);
  assert.strictEqual(d.secoes.colegas, null, 'não deveria computar a base colegas à toa');
});

caso('getPainelDados(): RF12 — autoavaliação nunca conta como avaliador de si mesma no Ranking', () => {
  const d = ctx.getPainelDados([], '', 'colegas');
  const anaBeatriz = d.ranking.bottom5.concat(d.ranking.top5, d.ranking.maioresGaps).find(x => x.nome === 'Ana Beatriz Monelli');
  assert.ok(anaBeatriz, 'Ana Beatriz Monelli deveria aparecer em alguma das listas do ranking');
  assert.strictEqual(anaBeatriz.nAvaliadores, 7, 'só colegas reais contam, nunca ela mesma');
  assert.strictEqual(anaBeatriz.nAvaliacoes, 84);
});

caso('getPainelDados(): distribuição por nota x por avaliador soma exatamente o Resumo (RF13)', () => {
  const d = ctx.getPainelDados([{ tipo: 'setor', valor: 'Comercial', periodo: '', label: 'Setor: Comercial' }], '', 'colegas');
  const sec = d.secoes.colegas;
  const somaPorNota = sec.distribuicao.porNota.reduce((s, x) => s + x.s0, 0);
  const somaPorAvaliador = sec.distribuicao.porAvaliador.reduce((s, x) => s + x.s0, 0);
  assert.strictEqual(somaPorNota, sec.resumo[0].nAvaliacoes);
  assert.strictEqual(somaPorAvaliador, sec.resumo[0].nAvaliadores);
});

console.log(passou + ' caso(s) — OK\n');

module.exports = { ctx, env }; // reaproveitado por tests/sistema.test.js, pra não montar tudo de novo
