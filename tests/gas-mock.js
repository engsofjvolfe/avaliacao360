// Mock mínimo de SpreadsheetApp/CacheService — o suficiente pra rodar os
// arquivos .gs/.html REAIS (sem alterar nada neles) dentro do Node, contra
// dados sintéticos. Ver TESTES.md para a ideia geral por trás disso.
'use strict';

function colLetterToIndex(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n; // 1-indexed
}

function parseA1(a1) {
  // Suporta: A1, A1:B2, A4:C, A4:C8, A:A
  const m = a1.match(/^([A-Z]+)(\d*)(?::([A-Z]+)(\d*))?$/);
  if (!m) throw new Error('Intervalo não suportado pelo mock: ' + a1);
  const c1 = colLetterToIndex(m[1]);
  const r1 = m[2] ? parseInt(m[2], 10) : 1;
  const c2 = m[3] ? colLetterToIndex(m[3]) : c1;
  const r2 = m[4] ? parseInt(m[4], 10) : null; // null = até o fim da aba
  return { r1, c1, r2, c2 };
}

class MockRange {
  constructor(sheet, r1, c1, r2, c2) {
    this.sheet = sheet;
    this.r1 = r1; this.c1 = c1;
    this.r2 = r2 == null ? sheet.data.length : r2;
    this.c2 = c2;
  }
  getValues() {
    const out = [];
    for (let r = this.r1; r <= this.r2; r++) {
      const row = [];
      for (let c = this.c1; c <= this.c2; c++) {
        const rowArr = this.sheet.data[r - 1] || [];
        row.push(rowArr[c - 1] !== undefined ? rowArr[c - 1] : '');
      }
      out.push(row);
    }
    return out;
  }
  getValue() {
    const rowArr = this.sheet.data[this.r1 - 1] || [];
    return rowArr[this.c1 - 1] !== undefined ? rowArr[this.c1 - 1] : '';
  }
  setValue(v) {
    this.sheet.data[this.r1 - 1] = this.sheet.data[this.r1 - 1] || [];
    this.sheet.data[this.r1 - 1][this.c1 - 1] = v;
  }
  setValues(vals) {
    for (let i = 0; i < vals.length; i++) {
      const r = this.r1 + i;
      this.sheet.data[r - 1] = this.sheet.data[r - 1] || [];
      for (let j = 0; j < vals[i].length; j++) {
        this.sheet.data[r - 1][this.c1 - 1 + j] = vals[i][j];
      }
    }
  }
  clearContent() {
    for (let r = this.r1; r <= this.r2; r++) {
      if (this.sheet.data[r - 1]) {
        for (let c = this.c1; c <= this.c2; c++) this.sheet.data[r - 1][c - 1] = '';
      }
    }
  }
  getRow() { return this.r1; }
  getColumn() { return this.c1; }
  getNumRows() { return this.r2 - this.r1 + 1; }
  getNumColumns() { return this.c2 - this.c1 + 1; }
  getSheet() { return this.sheet; }
  // No-op no mock — o mock não simula a auto-detecção de tipo do Sheets, então
  // não há nada pra esse método prevenir aqui; existe só pra o código real
  // (Utils.gs::substituirDados_) rodar sem lançar erro.
  setNumberFormat() { return this; }
}

class MockSheet {
  constructor(name, data) {
    this.name = name;
    this.data = data.map(row => row.slice());
  }
  getRange(a1OrRow, c1, numRows, numCols) {
    if (typeof a1OrRow === 'string') {
      const { r1, c1: cc1, r2, c2 } = parseA1(a1OrRow);
      return new MockRange(this, r1, cc1, r2, c2);
    }
    const r1 = a1OrRow, cc1 = c1;
    const r2 = numRows ? r1 + numRows - 1 : r1;
    const c2 = numCols ? cc1 + numCols - 1 : cc1;
    return new MockRange(this, r1, cc1, r2, c2);
  }
  getDataRange() {
    const maxCols = this.data.reduce((m, r) => Math.max(m, r.length), 0);
    return new MockRange(this, 1, 1, this.data.length, maxCols || 1);
  }
  getMaxRows() { return this.data.length; }
  getMaxColumns() { return this.data.reduce((m, r) => Math.max(m, r.length), 0); }
  getLastRow() {
    for (let r = this.data.length; r >= 1; r--) {
      if ((this.data[r - 1] || []).some(v => v !== '' && v !== null && v !== undefined)) return r;
    }
    return 0;
  }
  getLastColumn() { return this.getMaxColumns(); }
  insertRowsAfter(afterRow, howMany) {
    for (let i = 0; i < howMany; i++) this.data.push([]);
  }
}

class MockSpreadsheet {
  constructor(sheets, namedRanges) {
    this.sheets = sheets; // nome -> MockSheet
    this.namedRanges = namedRanges || {}; // nome -> { sheet, a1 }
  }
  getSheetByName(name) { return this.sheets[name] || null; }
  getRangeByName(name) {
    const def = this.namedRanges[name];
    if (!def) return null;
    return this.sheets[def.sheet].getRange(def.a1);
  }
  getNamedRanges() {
    return Object.keys(this.namedRanges).map(name => {
      const range = this.getRangeByName(name);
      return { getName: () => name, getRange: () => range };
    });
  }
}

function buildEnv(sheetsData, namedRanges) {
  const sheets = {};
  Object.keys(sheetsData).forEach(name => { sheets[name] = new MockSheet(name, sheetsData[name]); });
  const ss = new MockSpreadsheet(sheets, namedRanges);

  const SpreadsheetApp = {
    getActiveSpreadsheet: () => ss,
    getUi: () => ({
      alert: () => { /* no-op */ },
      ButtonSet: { OK: 'OK' },
    }),
    flush: () => {},
  };

  // Mock mínimo de CacheService.getScriptCache() — get/put/remove num Map em
  // memória, sem expiração de verdade (suficiente pra testar corretude, não
  // timing de TTL). getCacheStats() existe só pra o teste inspecionar quantas
  // vezes o cache foi de fato consultado/escrito.
  const cacheStore = new Map();
  let getCalls = 0, putCalls = 0;
  const scriptCache = {
    get(key) { getCalls++; return cacheStore.has(key) ? cacheStore.get(key) : null; },
    put(key, value) { putCalls++; cacheStore.set(key, value); },
    remove(key) { cacheStore.delete(key); },
  };
  const CacheService = { getScriptCache: () => scriptCache };

  return { SpreadsheetApp, CacheService, ss, sheets, cacheStore, getCacheStats: () => ({ getCalls, putCalls }) };
}

module.exports = { buildEnv, MockSheet };
