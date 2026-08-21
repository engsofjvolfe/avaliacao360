// Monta a aba Config (+ Intervalos Nomeados) sintética a partir dos dados de
// tests/gen-data.js — compartilhado pelos testes de integração e de sistema,
// pra não duplicar essa montagem em cada arquivo (DRY).
'use strict';
const { sheetData, SETORES, MEMBROS, PERIODOS } = require('../gen-data');

const CRITERIOS_SHEET = ['Engajamento', 'Responsabilidade', 'Trabalho em Equipe', 'Comunicação', 'Organização',
  'Criatividade', 'Liderança', 'Comprometimento', 'Tomada de Decisão'];

function buildConfigSheet() {
  const nRows = 106;
  const data = [];
  for (let r = 0; r < nRows; r++) data.push(new Array(14).fill(''));
  data[2] = ['Setor', 'Diretor(a) Responsável', 'Sigla', '', 'Nome', 'Setor', 'Papel', 'Status', '', 'Critério', '', 'Período (ordem cronológica)', '', ''];
  SETORES.forEach((s, i) => { data[3 + i][0] = s[0]; data[3 + i][1] = s[1]; data[3 + i][2] = s[2]; });
  MEMBROS.forEach((m, i) => { data[3 + i][4] = m[0]; data[3 + i][5] = m[1]; data[3 + i][6] = m[2]; data[3 + i][7] = m[3]; });
  CRITERIOS_SHEET.forEach((c, i) => { data[3 + i][9] = c; });
  PERIODOS.forEach((p, i) => { data[3 + i][11] = p; });
  return data;
}

const NAMED_RANGES = {
  Cfg_Setores: { sheet: 'Config', a1: 'A4:A8' },
  Cfg_Diretores: { sheet: 'Config', a1: 'B4:B8' },
  Cfg_Nomes: { sheet: 'Config', a1: 'E4:E103' },
  Cfg_SetorMembro: { sheet: 'Config', a1: 'F4:F103' },
  Cfg_PapelMembro: { sheet: 'Config', a1: 'G4:G103' },
  Cfg_StatusMembro: { sheet: 'Config', a1: 'H4:H103' },
  Cfg_Criterios: { sheet: 'Config', a1: 'J4:J12' },
  Cfg_Periodos: { sheet: 'Config', a1: 'L4:L33' },
};

function buildSheetsData() {
  return {
    Config: buildConfigSheet(),
    'Respostas do Formulário 1': sheetData,
    'Registro de Respondentes': [['Timestamp', 'Período', 'Nome', 'Setor', 'Cargo']],
    'Dados Tratados': [['Timestamp', 'Período', 'Avaliador', 'Setor do Avaliador', 'Cargo do Avaliador',
      'Tipo de Avaliação', 'Avaliado', 'Setor do Avaliado', 'Critério', 'Nota', 'Autoavaliação', '']],
  };
}

module.exports = { buildSheetsData, NAMED_RANGES, CRITERIOS_SHEET };
