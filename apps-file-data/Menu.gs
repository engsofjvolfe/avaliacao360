/**
 * Menu.gs
 * ---------------------------------------------------------------------------
 * Cria o menu "Avaliação 360" na barra de menus do Google Sheets.
 * ---------------------------------------------------------------------------
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Avaliação 360')
    .addItem('Abrir Painel', 'abrirPainel')
    .addSeparator()
    .addItem('Atualizar Dados', 'atualizarDados')
    .addSeparator()
    .addItem('Ativar atualização automática', 'ativarAtualizacaoAutomatica')
    .addItem('Desativar atualização automática', 'desativarAtualizacaoAutomatica')
    .addItem('Status da automação', 'statusAtualizacaoAutomatica')
    .addSeparator()
    .addItem('Ajuda rápida', 'mostrarAjuda')
    .addToUi();
}

function mostrarAjuda() {
  SpreadsheetApp.getUi().alert(
    'Avaliação 360 - Ajuda rápida',
    'Consulte a aba "Leia-me" para instruções completas.\n\n' +
    'Fluxo básico:\n' +
    '1) Vincule o Google Forms a esta planilha (aba "Respostas do Formulário 1").\n' +
    '2) Ligue "Ativar atualização automática" (uma vez só) para não precisar mais ' +
    'clicar em "Atualizar Dados" a cada resposta - ou continue clicando manualmente, se preferir.\n' +
    '3) Use "Abrir Painel" para comparar o que quiser: adicione pessoas, setores ou ' +
    'cargos à comparação (qualquer combinação) e veja evolução por período, perfil de ' +
    'competências e ranking lado a lado.\n\n' +
    'Entrada/saída de integrante, setor e período continuam manuais e ficam todos na aba ' +
    'Config: adicionar uma linha nova na tabela Membros, mudar o Status para "Inativo", ou ' +
    'cadastrar um período novo na coluna L. Se a pessoa também participa do rodízio de ' +
    'avaliação de pares, adicione-a como uma linha nova direto na pergunta de grade do Forms ' +
    '- isso não é feito pela Config.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
