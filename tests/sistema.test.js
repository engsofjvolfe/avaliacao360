// Nível SISTEMA (ver TESTES.md) — carrega o HTML do Painel (já processado
// por templates.test.js) num DOM real via jsdom, com `google.script.run`
// interceptado por um PROXY de verdade pro `getPainelDados()` real (o mesmo
// contexto rodado em integracao.test.js) — então trocar de lente/aba no
// "navegador" simulado dispara o cálculo de verdade, não uma resposta
// pré-gravada. Pega qualquer "Cannot read property of null" de elemento
// que não existe, sem precisar abrir o Google Sheets.
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { PROJ } = require('./load-gas');
const { ctx } = require('./integracao.test.js');

let passou = 0;
function caso(nome, fn) {
  fn();
  passou++;
  console.log('  ok — ' + nome);
}

console.log('sistema.test.js');

const filtros = ctx.getFiltrosPainel();
const entidadesComparando = [
  { tipo: 'cargo', valor: 'Presidente', periodo: '', label: 'Cargo: Presidente' },
  { tipo: 'setor', valor: 'Comercial', periodo: '', label: 'Setor: Comercial' },
];
const dadosColegas = ctx.getPainelDados(entidadesComparando, '', 'colegas');

const painelScriptSrc = fs.readFileSync(path.join(PROJ, 'PainelScript.html'), 'utf8').replace(/<\/?script>/g, '');

const renderedPath = path.join(__dirname, 'fixtures', 'PainelDialog.rendered.html');
if (!fs.existsSync(renderedPath)) {
  throw new Error('fixtures/PainelDialog.rendered.html não existe — rode templates.test.js antes (o runner em tests/run-all.js já faz isso na ordem certa).');
}
const html = fs.readFileSync(renderedPath, 'utf8')
  // não precisamos do Chart.js de verdade (jsdom não tem canvas 2D) — vira um stub mais abaixo
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js[^"]*"><\/script>/, '')
  // remove a cópia do PainelScript já embutida pelo include_() — ela rodaria sozinha
  // assim que o jsdom terminasse de montar o documento, ANTES da gente conseguir
  // definir window.google/window.Chart. Injetamos a mesma fonte de novo, manualmente,
  // depois desses dois já existirem (ver window.eval mais abaixo).
  .replace(/<script>[\s\S]*<\/script>/, '');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;

window.Chart = function (canvas, config) { this.destroy = () => {}; this._config = config; };
window.google = {
  script: {
    run: {
      _handler: null, _errHandler: null,
      withSuccessHandler(fn) { this._handler = fn; return this; },
      withFailureHandler(fn) { this._errHandler = fn; return this; },
      getFiltrosPainel() { this._handler(filtros); },
      // `entidades` vem vazio do cliente aqui (o teste não simula clique no
      // construtor de itens), então usamos o cenário de comparação do teste — mas
      // `lente` É o valor real que o cliente mandou, então trocarLente() é
      // testado de ponta a ponta de verdade.
      getPainelDados(entidades, periodoGeral, lente) { this._handler(ctx.getPainelDados(entidadesComparando, periodoGeral, lente)); },
    },
  },
};
window.eval(painelScriptSrc);

function id(elId) { return window.document.getElementById(elId); }
function temClasse(elId, classe) { return id(elId).className.split(/\s+/).includes(classe); }

// carregarFiltros() já rodou no window.eval acima (é a última linha de
// PainelScript.html) e chamou atualizar() sozinho — mas o proxy de
// getPainelDados() usa sempre `entidadesComparando`, então o estado inicial
// já reflete o cenário do teste, sem precisar simular cliques.

caso('render(): roda sem lançar erro e a tabela Resumo tem 1 linha por item', () => {
  window.render(dadosColegas);
  assert.strictEqual(id('tResumo').querySelectorAll('tr').length, 3); // cabeçalho + 2 itens
});

caso('Resumo: item "Cargo: Presidente" (grupo pequeno) mostra o aviso, não um número', () => {
  assert.ok(id('tResumo').innerHTML.includes('grupo pequeno demais'));
});

caso('Ranking: visível por padrão (lente colegas)', () => {
  assert.strictEqual(temClasse('blocoRanking', 'oculto'), false);
  assert.strictEqual(temClasse('avisoSemRanking', 'oculto'), true);
  assert.strictEqual(id('tTop5').querySelectorAll('tr').length, 5);
});

caso('trocarLente(autoavaliacao): Ranking some, botão de lente certo fica ativo', () => {
  window.trocarLente('autoavaliacao');
  assert.strictEqual(temClasse('lenteAutoavaliacao', 'active'), true);
  assert.strictEqual(temClasse('lenteColegas', 'active'), false);
  assert.strictEqual(temClasse('blocoRanking', 'oculto'), true);
  assert.strictEqual(temClasse('avisoSemRanking', 'oculto'), false);
  assert.ok(!id('tResumo').innerHTML.includes('class="mini"'), 'sem a lente Os dois, não deveria ter a mini-linha de autoavaliação');
});

caso('trocarLente(ambos): Ranking volta, célula de Nota ganha a mini-linha de autoavaliação', () => {
  window.trocarLente('ambos');
  assert.strictEqual(temClasse('lenteAmbos', 'active'), true);
  assert.strictEqual(temClasse('blocoRanking', 'oculto'), false);
  assert.ok(id('tResumo').innerHTML.includes('class="mini"'));
});

caso('trocarModoDistribuicao / trocarAbaDispersao: continuam funcionando com a lente atual', () => {
  window.trocarModoDistribuicao('avaliador');
  assert.strictEqual(temClasse('modoPorAvaliador', 'active'), true);
  window.trocarModoDistribuicao('nota');
  assert.strictEqual(temClasse('modoPorNota', 'active'), true);

  window.trocarAbaDispersao('dispersao');
  assert.strictEqual(temClasse('tabsModoDistribuicao', 'oculto'), true, 'alterna-visão só faz sentido dentro de Distribuição');
  window.trocarAbaDispersao('distribuicao');
  assert.strictEqual(temClasse('tabsModoDistribuicao', 'oculto'), false);

  window.trocarLente('colegas'); // volta ao padrão pro resto da suíte, se houver mais testes depois
});

console.log(passou + ' caso(s) — OK\n');
