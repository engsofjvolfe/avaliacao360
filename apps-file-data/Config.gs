/**
 * Config.gs
 * ---------------------------------------------------------------------------
 * Fonte única de constantes do sistema de Avaliação 360º.
 * Se o FORMULÁRIO mudar (pergunta renomeada, novo critério, novo setor),
 * ajuste os nomes de aba/coluna aqui — o resto do código não precisa mudar
 * (princípio DRY: um só lugar para cada "verdade").
 * ---------------------------------------------------------------------------
 */

// Nomes das abas (precisam bater exatamente com a planilha)
const SHEET_RESPOSTAS     = 'Respostas do Formulário 1';
const SHEET_CONFIG        = 'Config';
const SHEET_REGISTRO      = 'Registro de Respondentes';
const SHEET_DADOS         = 'Dados Tratados';

// Cabeçalhos fixos de identificação na aba de Respostas.
// A comparação é sempre feita após normalizar espaços (ver Utils.gs -> normalizarTexto),
// então pequenas variações de espaçamento no texto da pergunta não quebram o script.
const COL_TIMESTAMP = 'Carimbo de data/hora';
const COL_NOME      = 'Qual o seu nome?';
const COL_SETOR     = 'Qual o seu setor na Ligamento?';
const COL_PERIODO   = 'Período da Avaliação 360º';
const COL_CARGO_HINT = 'cargo'; // qualquer cabeçalho que CONTENHA esta palavra é tratado como pergunta de cargo

// Mapa "token em maiúsculas, como aparece no texto da pergunta" -> "nome canônico do critério".
// ORDEM IMPORTA: tokens compostos (mais longos) vêm antes dos simples, para não casar
// "COMUNICAÇÃO" por engano dentro de um token maior, por exemplo.
const CRITERIA_MAP = [
  ['TRABALHO EM EQUIPE', 'Trabalho em Equipe'],
  ['TOMADA DE DECISÃO',  'Tomada de Decisão'],
  ['RESPONSABILIDADE',   'Responsabilidade'],
  ['COMPROMETIMENTO',    'Comprometimento'],
  ['COMUNICAÇÃO',        'Comunicação'],
  ['ORGANIZAÇÃO',        'Organização'],
  ['CRIATIVIDADE',       'Criatividade'],
  ['ENGAJAMENTO',        'Engajamento'],
  ['LIDERANÇA',          'Liderança'],
];

// Padrões (regex) das perguntas lineares que não são grade (não têm "[Nome]" no cabeçalho)
const PATTERN_LIDER_DIRETOR  = /do seu diretor/i;     // "Avalie o ENGAJAMENTO do seu diretor(a)"
const PATTERN_AUTOAVALIACAO  = /você se avalia em/i;  // "O quanto você se avalia em ENGAJAMENTO?"

// Setor usado para membros da Presidência/Vice — precisa bater com a opção do Forms
const SETOR_PRESIDENCIA = 'Presidência e Vice-Presidência';

/**
 * Parâmetros ajustáveis dos alertas estatísticos do Painel (ver Estatisticas.gs).
 * Cada um pode ser sobrescrito por uma célula na aba Config, através do
 * Intervalo Nomeado indicado — os valores abaixo são só o padrão usado
 * quando essa célula ainda não existe ou está em branco (ver `lerParametro_`
 * em Utils.gs). Nunca é obrigatório criar essas células: o Painel funciona
 * com os padrões sem elas.
 */
const PARAM_PADRAO = {
  minAvaliacoesRanking: { intervalo: 'Param_MinRanking',      padrao: 3 }, // nº mín. de AVALIADORES DISTINTOS (não de notas) p/ entrar no Top5/Bottom5
  minAvaliacoesGap:     { intervalo: 'Param_MinGap',          padrao: 2 }, // nº mín. de notas de autoavaliação, E de avaliadores distintos do lado hetero, p/ entrar no ranking de gaps
  minIntegrantesGrupo:  { intervalo: 'Param_MinGrupo',        padrao: 3 }, // nº mín. de integrantes ativos p/ mostrar média de Setor/Cargo
  minNotasOutlier:      { intervalo: 'Param_MinNotasOutlier', padrao: 5 }, // nº mín. de notas dadas p/ um avaliador entrar na checagem de notas fora do padrão
  zOutlier:             { intervalo: 'Param_ZOutlier',        padrao: 2 }, // quantos desvios-padrão da própria média o avaliador precisa se afastar p/ virar alerta
  quedaAlertaPontos:    { intervalo: 'Param_QuedaAlerta',     padrao: 1 }, // queda mínima (pontos, na escala notaMinima–notaMaxima) entre os 2 últimos períodos p/ virar alerta
  zIntervaloConfianca:  { intervalo: 'Param_ZIntervalo',      padrao: 2 }, // largura do intervalo de confiança mostrado nos gráficos (2 = ~95%, mesma régua do zOutlier)
  forcaEncolhimento:    { intervalo: 'Param_ForcaEncolhimento', padrao: 5 }, // nº de "notas fictícias da média geral" somadas ao calcular a nota estabilizada de um grupo pequeno
  notaMinima:           { intervalo: 'Param_NotaMin',         padrao: 0 }, // menor nota possível na escala do formulário — usada nos eixos dos gráficos e no cálculo do intervalo de confiança
  notaMaxima:           { intervalo: 'Param_NotaMax',         padrao: 10 }, // maior nota possível na escala do formulário — idem
  limiteAlerta:         { intervalo: 'Param_LimiteAlerta',    padrao: 4 }, // nota MENOR OU IGUAL a este valor conta como "alerta" no Resumo e em Alertas
  qtdFaixasHistograma:  { intervalo: 'Param_QtdFaixas',       padrao: 5 }, // em quantos pedaços iguais dividir a escala (notaMinima–notaMaxima) no histograma de Distribuição das Notas
  maxEntidades:         { intervalo: 'Param_MaxEntidades',    padrao: 6 }, // nº máx. de itens que dá pra comparar ao mesmo tempo no Painel (trava no servidor e no cliente)
  tamanhoRanking:       { intervalo: 'Param_TamanhoRanking',  padrao: 5 }, // quantos nomes aparecem no Top/Bottom e nos maiores gaps
  maxOutliers:          { intervalo: 'Param_MaxOutliers',     padrao: 15 }, // quantas notas fora do padrão aparecem na lista (a mais confiável primeiro)
  quedaParticipacaoPontos: { intervalo: 'Param_QuedaParticipacao', padrao: 20 }, // queda mínima (em pontos percentuais) na taxa de participação entre os 2 últimos períodos p/ virar alerta
};
