/**
 * Sidebar.gs
 * ---------------------------------------------------------------------------
 * Funções chamadas via google.script.run pelo Sidebar.html.
 * Mantém toda a lógica de leitura/escrita na planilha aqui — o HTML só cuida
 * de UI.
 * ---------------------------------------------------------------------------
 */

/** Dados para popular os selects da sidebar (períodos, integrantes ativos, setores). */
function getDadosPainel() {
  const cfg = lerConfig_();

  const membrosAtivos = cfg.membros
    .filter(m => m.status === 'Ativo')
    .map(m => ({ nome: m.nome, setor: m.setor }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  const setores = [...new Set(cfg.membros.map(m => m.setor))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const shDash = getSheetOrThrow_(SHEET_DASHBOARD);
  const filtroPeriodoAtual = normalizarTexto_(shDash.getRange('C3').getValue());
  const filtroIntegranteAtual = normalizarTexto_(shDash.getRange('I3').getValue());

  return {
    periodos: cfg.periodosCadastrados,
    membros: membrosAtivos,
    setores: setores,
    filtroPeriodoAtual: filtroPeriodoAtual,
    filtroIntegranteAtual: filtroIntegranteAtual,
    totalAtivos: membrosAtivos.length,
    totalCadastrados: cfg.membros.length,
  };
}

/** Aplica o filtro de período/integrante no Dashboard e ativa a aba. */
function aplicarFiltroDashboard(periodo, integrante) {
  const sh = getSheetOrThrow_(SHEET_DASHBOARD);
  sh.getRange('C3').setValue(periodo || '');
  sh.getRange('I3').setValue(integrante || '');
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sh);
  return { ok: true };
}

/** Roda a transformação de dados e devolve um resumo (usado pelo botão "Atualizar" da sidebar). */
function executarAtualizacaoSidebar() {
  try {
    const r = executarTransformacao_();
    return {
      ok: true,
      nRespostas: r.nRespostas,
      nLinhasTidy: r.nLinhasTidy,
      avisos: r.avisos,
    };
  } catch (e) {
    return { ok: false, erro: String(e.message || e) };
  }
}

/** Consulta rápida: devolve os principais números de uma pessoa (lidos de "Resumo Individual"). */
function getResumoRapido(nome) {
  if (!nome) return null;
  const sh = getSheetOrThrow_(SHEET_RESUMO_IND);
  const headerRow = 5;
  const dataStart = 6;
  const lastRow = sh.getLastRow();
  const headers = sh.getRange(headerRow, 1, 1, sh.getLastColumn()).getValues()[0].map(normalizarTexto_);
  const idx = (nomeColuna) => headers.indexOf(nomeColuna);

  const idxNome = idx('Nome');
  const idxSetor = idx('Setor');
  const idxStatus = idx('Status');
  const idxMedia = idx('Média Geral');
  const idxNAval = idx('Nº Avaliações Recebidas');
  const idxAuto = idx('Autoavaliação (média)');
  const idxHetero = idx('Heteroavaliação (média)');
  const idxGap = idx('Gap (Hetero − Auto)');

  const dados = sh.getRange(dataStart, 1, lastRow - dataStart + 1, sh.getLastColumn()).getValues();
  const linha = dados.find(r => normalizarTexto_(r[idxNome]) === normalizarTexto_(nome));
  if (!linha) return null;

  return {
    nome: linha[idxNome],
    setor: linha[idxSetor],
    status: linha[idxStatus],
    mediaGeral: linha[idxMedia],
    nAvaliacoes: linha[idxNAval],
    autoavaliacao: linha[idxAuto],
    heteroavaliacao: linha[idxHetero],
    gap: linha[idxGap],
  };
}
