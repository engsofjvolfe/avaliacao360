// Helper compartilhado por todos os arquivos de teste: carrega os .gs/.html
// REAIS de apps-file-data/ (sem copiar nem reescrever nada) dentro de um
// contexto isolado do Node, com os serviços do Apps Script substituídos
// pelo mock de gas-mock.js. Existe só pra não repetir essa mesma configuração
// em cada arquivo de teste (DRY).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJ = path.join(__dirname, '..', 'apps-file-data');

function loadGasFiles(env, arquivos) {
  const ctx = vm.createContext(Object.assign({
    console,
    SpreadsheetApp: env.SpreadsheetApp,
    CacheService: env.CacheService,
    Logger: { log: () => {} },
    HtmlService: {
      createHtmlOutputFromFile: () => ({
        setWidth() { return this; }, setHeight() { return this; }, setTitle() { return this; },
      }),
    },
    ScriptApp: {
      getProjectTriggers: () => [],
      newTrigger: () => ({ forSpreadsheet() { return this; }, onFormSubmit() { return this; }, create() {} }),
    },
    Utilities: { formatDate: () => '' },
    Session: { getScriptTimeZone: () => 'GMT-3' },
  }));
  arquivos.forEach(f => vm.runInContext(fs.readFileSync(path.join(PROJ, f), 'utf8'), ctx, { filename: f }));
  return ctx;
}

module.exports = { PROJ, loadGasFiles };
