/**
 * Triggers.gs
 * ---------------------------------------------------------------------------
 * Automação do fluxo Forms ->Dados Tratados ->Resumo/Dashboard/Painel.
 *
 * O que ISSO automatiza: a cada resposta nova do Forms, roda sozinho o
 * equivalente a clicar em "Atualizar Dados" - não precisa mais fazer isso
 * na mão a cada resposta.
 *
 * O que ISSO NÃO automatiza (continua manual, de propósito):
 *   - Cadastrar/editar pessoas, setores ou papéis ->aba Config (tabela Membros/Setores)
 *   - Cadastrar um novo período ->aba Config, coluna L
 *   - Adicionar alguém no rodízio de avaliação de pares ->direto no Google Forms
 *     (nova linha na pergunta de grade do setor dela)
 * ---------------------------------------------------------------------------
 */

const NOME_FUNCAO_GATILHO = 'onFormSubmitAutomatico_';

/** Liga a atualização automática (chamado pelo menu). Idempotente - não duplica o gatilho. */
function ativarAtualizacaoAutomatica() {
  removerGatilhosExistentes_();
  ScriptApp.newTrigger(NOME_FUNCAO_GATILHO)
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();

  SpreadsheetApp.getUi().alert(
    'Atualização automática ativada',
    'A partir de agora, toda resposta nova do Forms atualiza sozinha "Dados ' +
    'Tratados", "Resumo Individual", "Resumo Setor" e o Painel - não precisa ' +
    'mais clicar em "Atualizar Dados" depois de cada resposta.\n\n' +
    'O que continua manual (de propósito): cadastrar pessoas/setores/períodos na ' +
    'Config, e adicionar alguém na grade de avaliação de pares direto no Forms. ' +
    'Depois de mexer na Config, você ainda pode clicar em "Atualizar Dados" a ' +
    'qualquer momento para forçar um reprocessamento imediato.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/** Desliga a atualização automática (chamado pelo menu). */
function desativarAtualizacaoAutomatica() {
  const n = removerGatilhosExistentes_();
  SpreadsheetApp.getUi().alert(
    'Atualização automática desativada',
    n > 0
      ? 'Pronto. As respostas continuam chegando normalmente em "Respostas do ' +
        'Formulário 1" (isso é nativo do Forms, não depende deste gatilho), mas agora ' +
        'alguém precisa clicar em "Atualizar Dados" para processá-las.'
      : 'A atualização automática já estava desligada.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/** Mostra se o gatilho automático está ligado ou não, e o resultado da última execução. */
function statusAtualizacaoAutomatica() {
  const ligado = ScriptApp.getProjectTriggers().some(t =>t.getHandlerFunction() === NOME_FUNCAO_GATILHO);
  const shConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  let ultimaExecucao = '';
  if (shConfig) {
    const [[linha2Raw], [linha3Raw]] = shConfig.getRange('N2:N3').getValues(); // 1 chamada em vez de 2
    const linha2 = normalizarTexto_(linha2Raw);
    const linha3 = normalizarTexto_(linha3Raw);
    if (linha2) ultimaExecucao = '\n\nÚltima execução automática:\n' + linha2 + (linha3 ? '\n' + linha3 : '');
  }
  SpreadsheetApp.getUi().alert(
    'Status da automação',
    (ligado
      ? 'A atualização automática está LIGADA.\nToda resposta nova do Forms atualiza sozinha os dados.'
      : 'A atualização automática está DESLIGADA.\nUse "Atualizar Dados" para processar manualmente, ou ligue a automação no menu.'
    ) + ultimaExecucao,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function removerGatilhosExistentes_() {
  const gatilhos = ScriptApp.getProjectTriggers().filter(t =>t.getHandlerFunction() === NOME_FUNCAO_GATILHO);
  gatilhos.forEach(t =>ScriptApp.deleteTrigger(t));
  return gatilhos.length;
}

/**
 * Chamada automaticamente pelo Google a cada resposta nova do Forms.
 * Roda "por trás", sem interface - por isso nunca chama SpreadsheetApp.getUi()
 * aqui dentro (isso derrubaria o gatilho com erro de contexto).
 */
function onFormSubmitAutomatico_(e) {
  try {
    const resultado = executarTransformacao_();
    registrarLogAutomatico_(true, resultado.nRespostas, resultado.nLinhasTidy, resultado.avisos);
  } catch (err) {
    registrarLogAutomatico_(false, 0, 0, [String(err.message || err)]);
    throw err; // deixa o Google notificar por e-mail automaticamente sobre a falha do gatilho
  }
}

/**
 * Deixa um rastro do que aconteceu na última execução automática em Config!N1:N3
 * (área sem uso - não interfere nas tabelas Setores/Membros/Períodos).
 */
function registrarLogAutomatico_(ok, nRespostas, nLinhasTidy, avisos) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  if (!sh) return;
  const fuso = Session.getScriptTimeZone() || 'GMT-3';
  const agora = Utilities.formatDate(new Date(), fuso, 'dd/MM/yyyy HH:mm:ss');
  const status = ok ? (nRespostas + ' respostas / ' + nLinhasTidy + ' linhas geradas') : 'erro (veja detalhe abaixo)';
  const resumoAvisos = (avisos && avisos.length)
    ? avisos.slice(0, 3).join(' | ')
    : (ok ? 'sem avisos' : String(avisos[0] || ''));
  sh.getRange('N1:N3').setValues([['Última atualização automática:'], [agora + ' - ' + status], [resumoAvisos]]); // 1 chamada em vez de 3
}
