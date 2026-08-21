// Gera um conjunto sintético de respostas — determinístico (semente fixa),
// então roda igual toda vez, sem precisar salvar nada em disco entre uma
// rodada de teste e outra. Espelha como um Google Forms real desse sistema
// se ramifica por papel (Consultor(a)/Diretor(a)/Presidência), em 2 períodos.
'use strict';
const fs = require('fs');
const path = require('path');

const headers = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'headers.json'), 'utf8'));

const SETORES = [
  ['Comercial', 'Maria Eduarda Esper', 'COM'],
  ['DAF', 'Bernardo Henrique', 'DAF'],
  ['Gestão de Pessoas', 'Davi Brito', 'GP'],
  ['Marketing', "Camila D'Ávila", 'MKT'],
  ['Projetos', 'Luísa Petrini', 'PROJ'],
];

const MEMBROS = [
  ['Bruna Rossi', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Eduardo Pagani', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Gabriel Donato', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Giovani Moraes', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Gustavo Amaral', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['João Pedro Cabral', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Maria Luisa Moreira', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Pedro Benfato', 'Comercial', 'Consultor(a)', 'Ativo'],
  ['Bernardo Gabriel', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Gabriella Luquete', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Julia Nunes', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Luana Ramos', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Lucas Oliveira', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Vitória Mauad', 'DAF', 'Consultor(a)', 'Ativo'],
  ['Ana Beatriz Monelli', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Ingrid Adriadrine', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Izadora Machado', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Jaqueline Lanza', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Larissa Costa', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Marcus Vinicius', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Samile Meireles', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Vitória Souza', 'Gestão de Pessoas', 'Consultor(a)', 'Ativo'],
  ['Bruno Moura', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Carolina Velasco', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Cézar Muniz', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Giovana Medeiros', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Maria Eduarda Girolineto', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Mirela Gomes', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Yasmim Borges', 'Marketing', 'Consultor(a)', 'Ativo'],
  ['Alanna Núbia', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Egon Fernando', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Julia Bressanin', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Lívia Talarico', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Maria Eduarda Rodrigues', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Maria Luísa Pádua', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Pedro Lucas', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Renato Franceschini', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Samuel Fuzaro', 'Projetos', 'Consultor(a)', 'Ativo'],
  ['Bernardo Henrique', 'DAF', 'Diretor(a)', 'Ativo'],
  ["Camila D'Ávila", 'Marketing', 'Diretor(a)', 'Ativo'],
  ['Davi Brito', 'Gestão de Pessoas', 'Diretor(a)', 'Ativo'],
  ['Luísa Petrini', 'Projetos', 'Diretor(a)', 'Ativo'],
  ['Maria Eduarda Esper', 'Comercial', 'Diretor(a)', 'Ativo'],
  ['Maria Eduarda Muniz', 'Presidência e Vice-Presidência', 'Presidente', 'Ativo'],
  ['Nicole Oliveira', 'Presidência e Vice-Presidência', 'Vice-Presidente', 'Ativo'],
];

const PERIODOS = ['2026.1', '2026.2'];

function idxOf(pred) {
  const out = [];
  headers.forEach((h, i) => { if (h && pred(h)) out.push(i); });
  return out;
}
function idxExact(h) { return headers.indexOf(h); }

const idxTimestamp = idxExact('Carimbo de data/hora');
const idxNome = idxExact('Qual o seu nome?');
const idxSetor = idxExact('Qual o seu setor?');
const idxPeriodo = idxExact('Período da Avaliação 360º');
const idxsCargo = idxOf(h => h.toLowerCase().includes('cargo'));

function gradeColFor(criterioToken, nomeAlvo) {
  return headers.findIndex(h => h && h.includes('[' + nomeAlvo + ']') && h.toUpperCase().includes(criterioToken));
}
function diretorColFor(criterioToken) {
  return headers.findIndex(h => h && /do seu diretor/i.test(h) && h.toUpperCase().includes(criterioToken));
}
function autoavalCol(criterioToken) {
  return headers.findIndex(h => h && /você se avalia em/i.test(h) && h.toUpperCase().includes(criterioToken));
}

const CRIT_6 = ['ENGAJAMENTO', 'RESPONSABILIDADE', 'TRABALHO EM EQUIPE', 'COMUNICAÇÃO', 'ORGANIZAÇÃO', 'CRIATIVIDADE'];
const CRIT_7 = CRIT_6.concat(['LIDERANÇA']); // blocos "do seu diretor" / "você se avalia"

// Gerador pseudoaleatório com semente fixa — mesma sequência de notas toda
// vez que os testes rodam, pra um teste falhar só por mudança real de
// comportamento, nunca por acaso.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const rand = rng(42);
function nota() { return 1 + Math.floor(rand() * 10); } // 1-10

function ts(periodoIdx, offsetDays) {
  const base = periodoIdx === 0 ? new Date(2026, 1, 1) : new Date(2026, 6, 1);
  return new Date(base.getTime() + offsetDays * 86400000);
}

const consultoresPorSetor = {};
SETORES.forEach(s => consultoresPorSetor[s[0]] = []);
MEMBROS.filter(m => m[2] === 'Consultor(a)').forEach(m => consultoresPorSetor[m[1]].push(m[0]));
const diretores = MEMBROS.filter(m => m[2] === 'Diretor(a)');
const presidencia = MEMBROS.filter(m => m[2] === 'Presidente' || m[2] === 'Vice-Presidente');

const rows = [];
let dayOffset = 0;

PERIODOS.forEach((periodo, pIdx) => {
  // Consultores: avaliam os pares do próprio setor (6 critérios), o diretor (7), e a si mesmos (7)
  Object.keys(consultoresPorSetor).forEach(setor => {
    const peers = consultoresPorSetor[setor];
    peers.forEach(nomeRespondente => {
      const row = new Array(headers.length).fill('');
      row[idxTimestamp] = ts(pIdx, dayOffset++);
      row[idxNome] = nomeRespondente;
      row[idxSetor] = setor;
      row[idxPeriodo] = periodo;
      row[idxsCargo[0]] = 'Consultor(a)';

      peers.forEach(nomeAlvo => {
        CRIT_6.forEach(crit => {
          const col = gradeColFor(crit, nomeAlvo);
          if (col >= 0) row[col] = nomeAlvo === nomeRespondente ? '' : nota(); // não avalia a si mesmo na grade de pares
        });
      });
      CRIT_7.forEach(crit => {
        const colD = diretorColFor(crit);
        if (colD >= 0) row[colD] = nota();
        const colA = autoavalCol(crit);
        if (colA >= 0) row[colA] = nota();
      });
      rows.push(row);
    });
  });

  // Diretores: avaliam os outros diretores (Liderança), a Presidência (Comprometimento/Tomada de Decisão), e a si mesmos (7)
  diretores.forEach(([nomeRespondente, setor]) => {
    const row = new Array(headers.length).fill('');
    row[idxTimestamp] = ts(pIdx, dayOffset++);
    row[idxNome] = nomeRespondente;
    row[idxSetor] = setor;
    row[idxPeriodo] = periodo;
    row[idxsCargo[0]] = 'Diretor(a)';

    diretores.forEach(([nomeAlvo]) => {
      if (nomeAlvo === nomeRespondente) return;
      const col = gradeColFor('LIDERANÇA', nomeAlvo);
      if (col >= 0) row[col] = nota();
    });
    presidencia.forEach(([nomeAlvo]) => {
      ['COMPROMETIMENTO', 'TOMADA DE DECISÃO'].forEach(crit => {
        const col = gradeColFor(crit, nomeAlvo);
        if (col >= 0) row[col] = nota();
      });
    });
    CRIT_7.forEach(crit => {
      const colA = autoavalCol(crit);
      if (colA >= 0) row[colA] = nota();
    });
    rows.push(row);
  });

  // Presidência: só autoavaliação (7 critérios)
  presidencia.forEach(([nomeRespondente, setor, papel]) => {
    const row = new Array(headers.length).fill('');
    row[idxTimestamp] = ts(pIdx, dayOffset++);
    row[idxNome] = nomeRespondente;
    row[idxSetor] = setor;
    row[idxPeriodo] = periodo;
    row[idxsCargo[0]] = papel;
    CRIT_7.forEach(crit => {
      const colA = autoavalCol(crit);
      if (colA >= 0) row[colA] = nota();
    });
    rows.push(row);
  });
});

// Uma linha extra testando o caso de borda "cargo dentro do texto de setor"
// (ex.: "Consultor de Comercial" em vez de só "Comercial").
(function addEdgeCaseRow() {
  const row = new Array(headers.length).fill('');
  row[idxTimestamp] = ts(1, dayOffset++);
  row[idxNome] = 'Bruna Rossi';
  row[idxSetor] = 'Consultor de Comercial';
  row[idxPeriodo] = '2026.2';
  CRIT_7.forEach(crit => {
    const colA = autoavalCol(crit);
    if (colA >= 0) row[colA] = nota();
  });
  rows.push(row);
})();

const sheetData = [headers].concat(rows);

module.exports = { headers, rows, sheetData, SETORES, MEMBROS, PERIODOS };
