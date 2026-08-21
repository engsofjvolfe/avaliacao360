// Nível INTEGRAÇÃO (ver TESTES.md) — simula o `HtmlService.createTemplateFromFile
// (...).evaluate()` do Apps Script o suficiente pra confirmar que os
// scriptlets `<?!= include_('X'); ?>` resolvem certo e o HTML final fica bem
// formado. Não é o motor real do Google, só uma verificação de que a sintaxe
// e as referências entre arquivos batem — pega, por exemplo, um `include_`
// apontando pra um arquivo que não existe mais.
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { PROJ } = require('./load-gas');

let passou = 0;
function caso(nome, fn) {
  fn();
  passou++;
  console.log('  ok — ' + nome);
}

console.log('templates.test.js');

function include_(nome) {
  return fs.readFileSync(path.join(PROJ, nome + '.html'), 'utf8');
}

function evaluateTemplate(nomeArquivo) {
  const raw = fs.readFileSync(path.join(PROJ, nomeArquivo + '.html'), 'utf8');
  // <?!= expr ?>  ->  substitui pelo resultado (sem escapar), igual ao Apps Script
  return raw.replace(/<\?!=\s*([\s\S]*?)\s*\?>/g, (_, expr) => {
    const fn = new Function('include_', 'return (' + expr.replace(/;\s*$/, '') + ');');
    return fn(include_);
  });
}

const rendered = evaluateTemplate('PainelDialog');
fs.writeFileSync(path.join(__dirname, 'fixtures', 'PainelDialog.rendered.html'), rendered);

caso('PainelDialog: todos os scriptlets <?!= include_(...) ?> foram resolvidos', () => {
  const sobrando = rendered.match(/<\?!?=?[\s\S]*?\?>/g);
  assert.strictEqual(sobrando, null, 'não deveria sobrar nenhum scriptlet não resolvido: ' + JSON.stringify(sobrando));
});

caso('PainelDialog: tags <script> (incluindo a externa do Chart.js) abrem e fecham em par', () => {
  const abre = (rendered.match(/<script[^>]*>/g) || []).length;
  const fecha = (rendered.match(/<\/script>/g) || []).length;
  assert.strictEqual(abre, fecha);
});

caso('PainelDialog: tags <style> abrem e fecham em par', () => {
  const abre = (rendered.match(/<style[^>]*>/g) || []).length;
  const fecha = (rendered.match(/<\/style>/g) || []).length;
  assert.strictEqual(abre, fecha);
});

console.log(passou + ' caso(s) — OK\n');
