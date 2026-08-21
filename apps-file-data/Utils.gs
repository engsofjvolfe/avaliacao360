/**
 * Utils.gs
 * ---------------------------------------------------------------------------
 * Funções utilitárias compartilhadas entre os módulos. Nada aqui conhece
 * "regras de negócio" da Avaliação 360º — só mecânica de planilha/string.
 * ---------------------------------------------------------------------------
 */

/**
 * Cola o conteúdo de outro arquivo HTML do projeto no ponto onde é chamado —
 * é o jeito padrão do Apps Script de dividir CSS/JS em arquivos separados
 * (não existe `<link>`/`<script src="...">` apontando pra outro arquivo do
 * projeto, como num site normal). Uso: `<?!= include('NomeDoArquivo'); ?>`
 * dentro de um HTML aberto com `HtmlService.createTemplateFromFile(...)`.
 */
function include_(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

/** Retorna a aba pelo nome ou lança um erro claro se ela não existir. */
function getSheetOrThrow_(nome) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(nome);
  if (!sh) {
    throw new Error(
      `Não encontrei a aba "${nome}". Confira se o nome está exatamente igual ` +
      `(sem espaços extras) — veja a aba "Leia-me".`
    );
  }
  return sh;
}

/**
 * Colapsa espaços múltiplos/quebras de linha e remove espaços nas pontas.
 * Também protege contra o caso de uma célula que devia ser texto livre (ex.:
 * um período como "2026.1") ter sido "adivinhada" pelo Google Sheets como
 * data — sem essa proteção, `String(data)` gera um texto gigante tipo "Sun
 * Feb 01 2026 05:00:00 GMT-0300 (Horário Padrão de Brasília)", que nunca vai
 * bater com o texto de verdade que vem das respostas do Forms. Isso não
 * resolve a causa (a célula continua sendo uma data, não o texto que a
 * pessoa quis digitar) — só evita a poluição visual; o conserto de verdade é
 * formatar a célula como "Texto sem formatação" antes de digitar (ver
 * LEIA-ME).
 */
// Cache do fuso horário do script + cache do resultado formatado por valor de
// data — `normalizarTexto_` pode ser chamada milhares de vezes numa única
// chamada de `getPainelDados` (1x por linha × coluna sendo normalizada), e
// tanto `Session.getScriptTimeZone()` quanto `Utilities.formatDate()` são
// chamadas de serviço de verdade (não operações locais). Confirmado contra o
// log de Execuções real desta EJ: a coluna Período veio como `Date` em 100%
// das linhas (3684 de 3684, numa base de 3684 linhas) — ou seja, o mesmo
// punhado de valores de data (só existem uns poucos períodos cadastrados)
// se repetia milhares de vezes, e cada repetição chamava `Utilities.
// formatDate()` de novo do zero. Cachear só o fuso horário (1ª correção) não
// bastou — a chamada de `Utilities.formatDate()` em si continuava
// acontecendo 1x por linha. Agora o resultado formatado fica guardado por
// valor de data (`getTime()` como chave): a MESMA data só é formatada 1 vez,
// não importa quantas linhas a repitam. Mesmo princípio de "minimizar
// chamadas de serviço" (Apps Script > Best Practices) que já motivou o cache
// de `lerConfig_` e o `getNamedRanges()` em `lerConfigDaPlanilha_`.
// `_contadorNormalizarData_`/`_contadorFormatDate_` são diagnóstico
// temporário — o 2º deve ficar bem menor que o 1º (nº de valores distintos
// de data, não nº de linhas), confirmando o ganho no próximo log real.
let _fusoHorarioCache_ = null;
let _cacheDataFormatada_ = null;
let _contadorNormalizarData_ = 0;
let _contadorFormatDate_ = 0;
function normalizarTexto_(txt) {
  if (txt === null || txt === undefined) return '';
  // Object.prototype.toString (em vez de `instanceof Date`) identifica a data
  // corretamente mesmo se ela vier de um contexto/realm diferente do script.
  if (Object.prototype.toString.call(txt) === '[object Date]') {
    _contadorNormalizarData_++;
    if (_fusoHorarioCache_ === null) _fusoHorarioCache_ = Session.getScriptTimeZone() || 'GMT-3';
    if (_cacheDataFormatada_ === null) _cacheDataFormatada_ = new Map();
    const chave = txt.getTime();
    let formatado = _cacheDataFormatada_.get(chave);
    if (formatado === undefined) {
      _contadorFormatDate_++;
      formatado = Utilities.formatDate(txt, _fusoHorarioCache_, 'dd/MM/yyyy');
      _cacheDataFormatada_.set(chave, formatado);
    }
    return formatado;
  }
  return String(txt).replace(/\s+/g, ' ').trim();
}

/** Extrai "Título [Nome]" -> {titulo, nome} ou null se não houver colchetes. */
function extrairPadraoGrade_(headerNormalizado) {
  const m = headerNormalizado.match(/^(.*)\[(.+)\]\s*$/);
  if (!m) return null;
  return { titulo: m[1].trim(), nome: m[2].trim() };
}

/** Procura, dentro do texto (maiúsculas), qual critério do CRITERIA_MAP está presente. */
function identificarCriterio_(textoQualquer) {
  const upper = normalizarTexto_(textoQualquer).toUpperCase();
  for (const [token, nomeCanonico] of CRITERIA_MAP) {
    if (upper.indexOf(token) !== -1) return nomeCanonico;
  }
  return null;
}

/**
 * Lê a aba Config inteira (via Intervalos Nomeados) e devolve tudo que o resto
 * do sistema precisa num único lugar: a lista de membros (com Status), o mapa
 * setor->diretor, a ordem de exibição dos critérios, os períodos cadastrados,
 * e os parâmetros ajustáveis. Esta é a ÚNICA função que lê a tabela Membros —
 * o resto do sistema usa o resultado dela em vez de reler a Config por conta
 * própria, então um membro novo (ou uma coluna Status) nunca fica esquecido em
 * algum lugar do código (DRY).
 *
 * DESEMPENHO: em vez de 1 chamada `getValues()`/`getValue()` por Intervalo
 * Nomeado (8 `Cfg_*` + até 16 `Param_*` = até 24 idas e voltas separadas ao
 * Sheets, a cada vez que o Painel recalcula), esta função resolve todos os
 * intervalos primeiro (só metadado — linha/coluna/tamanho, não busca célula
 * nenhuma) pra descobrir de uma vez até onde a aba Config precisa ser lida, e
 * faz um ÚNICO `getRange(...).getValues()` cobrindo tudo. Cada intervalo
 * nomeado então "recorta" os valores já em memória, sem nova ida ao Sheets.
 * Isso é o que resolve a demora real sentida ao abrir/atualizar o Painel —
 * `lerConfig_()` roda em toda chamada de `getPainelDados`/`getFiltrosPainel`/
 * `getParticipacaoDados`, então esse custo se repetia a cada clique.
 *
 * CACHE: além de 1 leitura em vez de 24, o resultado fica guardado em
 * `CacheService.getScriptCache()` por alguns minutos — recomendação oficial
 * do Google pra exatamente esse padrão ("dado que muda pouco, mas é lido em
 * toda chamada curta de `google.script.run`", ver Apps Script > Best
 * Practices). A Config só muda quando alguém edita a aba manualmente, e
 * nesse caso o próprio LEIA-ME já instrui a clicar em "Atualizar Dados" — por
 * isso `executarTransformacao_()` invalida esse cache no início (ver
 * DataTransform.gs), garantindo que uma edição na Config seguida de
 * "Atualizar Dados" nunca fica presa num valor velho. O prazo do cache é só
 * uma rede de segurança pros casos em que isso não acontece.
 */
const CHAVE_CACHE_CONFIG_ = 'lerConfig_v1';
const TTL_CACHE_CONFIG_SEGUNDOS_ = 1800; // 30 min — cobertura extra; a invalidação em "Atualizar Dados" é o mecanismo principal

function lerConfig_() {
  // ---- Log de diagnóstico temporário — o cache deveria deixar a 2ª chamada em
  // diante quase instantânea, e os registros de Execuções mostraram lerConfig_
  // sempre lento (nunca um "acerto" de cache). Isso só aparece nos registros
  // (Extensões > Apps Script > Execuções > "Ver registro de execução"); pode ser
  // removido depois que a causa estiver confirmada e corrigida (mesmo padrão do
  // cronômetro em getPainelDados(), ver NOTAS-TECNICAS.md). ----
  const cache = CacheService.getScriptCache();
  let cacheado = null;
  try {
    cacheado = cache.get(CHAVE_CACHE_CONFIG_);
  } catch (e) {
    Logger.log('[lerConfig_] cache.get() lançou erro: ' + e.message);
  }
  if (cacheado) {
    try { return JSON.parse(cacheado); } catch (e) {
      Logger.log('[lerConfig_] valor em cache não é JSON válido (' + e.message + ') — recalculando');
    }
  } else {
    Logger.log('[lerConfig_] cache MISS');
  }
  const resultado = lerConfigDaPlanilha_();
  try {
    const serializado = JSON.stringify(resultado);
    Logger.log('[lerConfig_] gravando no cache — ' + serializado.length + ' caracteres');
    cache.put(CHAVE_CACHE_CONFIG_, serializado, TTL_CACHE_CONFIG_SEGUNDOS_);
  } catch (e) {
    // Config maior que o limite de 100KB do CacheService (EJ muito grande) — segue
    // funcionando sem cache nesse caso, só sem o ganho de velocidade extra.
    Logger.log('[lerConfig_] cache.put() falhou: ' + e.message);
  }
  return resultado;
}

/** Leitura de verdade da aba Config — nunca chamada direto, só por `lerConfig_()` acima. */
function lerConfigDaPlanilha_() {
  // Log de diagnóstico temporário (mesmo padrão do cronômetro em getPainelDados()) —
  // separa quanto custa RESOLVER os intervalos nomeados de quanto custa LER os
  // valores, pra confirmar se a troca de 24 getRangeByName() por 1 getNamedRanges()
  // realmente resolveu o tempo visto nos registros de Execuções. Remover depois.
  const t0_ = Date.now();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const shConfig = getSheetOrThrow_(SHEET_CONFIG);
  Logger.log('[lerConfigDaPlanilha_] getSheetOrThrow_: ' + (Date.now() - t0_) + 'ms');

  // 1 chamada só (getNamedRanges) pra trazer TODOS os Intervalos Nomeados da planilha
  // de uma vez — em vez de até 24 chamadas separadas a getRangeByName() (1 por
  // Cfg_*/Param_*). Cada chamada a um serviço do Sheets é uma ida e volta própria ao
  // servidor (ver Apps Script > Best Practices, "minimize service calls" — o mesmo
  // motivo pelo qual getValues()/setValues() em loop é lento); isso valia tanto pra
  // buscar o VALOR de um intervalo quanto pra só RESOLVER onde ele está, e essa
  // resolução nunca tinha sido batida numa chamada só, mesmo depois da leitura de
  // valores em si já ter virado 1 getRange().getValues() (ver comentário abaixo).
  let tPasso_ = Date.now();
  const mapaIntervalos = {};
  ss.getNamedRanges().forEach(nr => { mapaIntervalos[nr.getName()] = nr.getRange(); });
  Logger.log('[lerConfigDaPlanilha_] getNamedRanges (' + Object.keys(mapaIntervalos).length + ' intervalos): ' + (Date.now() - tPasso_) + 'ms');
  tPasso_ = Date.now();

  const nomesCfg = ['Cfg_Setores', 'Cfg_Diretores', 'Cfg_Nomes', 'Cfg_SetorMembro',
    'Cfg_PapelMembro', 'Cfg_StatusMembro', 'Cfg_Criterios', 'Cfg_Periodos'];
  const rangesCfg = {};
  nomesCfg.forEach(nome => {
    const r = mapaIntervalos[nome];
    if (!r) {
      throw new Error(
        `Não encontrei o intervalo nomeado "${nome}". Confira em Dados -> Intervalos ` +
        `nomeados se ele existe (deveria vir pronto no modelo da planilha) — veja a aba "Leia-me".`
      );
    }
    rangesCfg[nome] = r;
  });
  // Param_* são opcionais (ver PARAM_PADRAO em Config.gs) — o range vem `null`
  // quando a célula ainda não foi criada, e cai no padrão embutido mais abaixo.
  const rangesParam = {};
  Object.keys(PARAM_PADRAO).forEach(chave => {
    const nomeIntervalo = PARAM_PADRAO[chave].intervalo;
    rangesParam[nomeIntervalo] = mapaIntervalos[nomeIntervalo] || null;
  });

  const todosOsRanges = nomesCfg.map(n => rangesCfg[n])
    .concat(Object.keys(rangesParam).map(n => rangesParam[n]).filter(Boolean));
  const maxLinha = todosOsRanges.reduce((m, r) => Math.max(m, r.getRow() + r.getNumRows() - 1), 1);
  const maxColuna = todosOsRanges.reduce((m, r) => Math.max(m, r.getColumn() + r.getNumColumns() - 1), 1);
  Logger.log('[lerConfigDaPlanilha_] resolver ranges Cfg_*/Param_*: ' + (Date.now() - tPasso_) + 'ms');
  tPasso_ = Date.now();
  const dadosConfig = shConfig.getRange(1, 1, maxLinha, maxColuna).getValues();
  Logger.log('[lerConfigDaPlanilha_] getRange(1,1,' + maxLinha + ',' + maxColuna + ').getValues(): ' + (Date.now() - tPasso_) + 'ms');
  Logger.log('[lerConfigDaPlanilha_] TOTAL: ' + (Date.now() - t0_) + 'ms');

  // "Recorta" um Intervalo Nomeado (coluna única) de dentro da matriz já lida.
  function colunaDoIntervalo_(range) {
    const linha0 = range.getRow() - 1, col0 = range.getColumn() - 1;
    const out = [];
    for (let i = 0; i < range.getNumRows(); i++) out.push(dadosConfig[linha0 + i][col0]);
    return out;
  }

  // Tabela Setores: Cfg_Setores(A) / Cfg_Diretores(B), a partir da linha 4
  const setoresVals = colunaDoIntervalo_(rangesCfg['Cfg_Setores']).map(normalizarTexto_);
  const diretoresVals = colunaDoIntervalo_(rangesCfg['Cfg_Diretores']).map(normalizarTexto_);
  const setorParaDiretor = {};
  const setores = [];
  setoresVals.forEach((setor, i) => {
    if (!setor) return;
    setores.push(setor);
    setorParaDiretor[setor] = diretoresVals[i] || '';
  });

  // Tabela Membros: Cfg_Nomes(E) / Cfg_SetorMembro(F) / Cfg_PapelMembro(G) / Cfg_StatusMembro(H)
  const nomes = colunaDoIntervalo_(rangesCfg['Cfg_Nomes']).map(normalizarTexto_);
  const setorMembro = colunaDoIntervalo_(rangesCfg['Cfg_SetorMembro']).map(normalizarTexto_);
  const papelMembro = colunaDoIntervalo_(rangesCfg['Cfg_PapelMembro']).map(normalizarTexto_);
  const statusMembro = colunaDoIntervalo_(rangesCfg['Cfg_StatusMembro']).map(normalizarTexto_);
  const membros = [];
  const nomeParaSetor = {};
  const nomeParaPapel = {};
  nomes.forEach((nome, i) => {
    if (!nome) return;
    const setor = setorMembro[i] || '';
    const papel = papelMembro[i] || '';
    const status = statusMembro[i] || '';
    membros.push({ nome, setor, papel, status });
    nomeParaSetor[nome] = setor;
    nomeParaPapel[nome] = papel;
  });

  // Ordem de exibição dos critérios (Cfg_Criterios)
  const criterios = colunaDoIntervalo_(rangesCfg['Cfg_Criterios']).map(normalizarTexto_).filter(Boolean);

  // Períodos já cadastrados (Cfg_Periodos)
  const periodosCadastrados = colunaDoIntervalo_(rangesCfg['Cfg_Periodos'])
    .map(normalizarTexto_)
    .filter(v => v !== '');

  // Parâmetros ajustáveis dos alertas estatísticos (opcionais — caem no padrão se a célula não existir)
  const parametros = {};
  Object.keys(PARAM_PADRAO).forEach(chave => {
    const p = PARAM_PADRAO[chave];
    const range = rangesParam[p.intervalo];
    const v = range ? Number(dadosConfig[range.getRow() - 1][range.getColumn() - 1]) : NaN;
    parametros[chave] = isNaN(v) ? p.padrao : v;
  });

  return { setores, setorParaDiretor, membros, nomeParaSetor, nomeParaPapel, criterios, periodosCadastrados, parametros };
}

/**
 * Escreve uma matriz de valores em uma aba, apagando os dados antigos (mantém
 * o cabeçalho da linha 1).
 *
 * @param {number[]} [colunasTexto]  Colunas (1-based) que devem ficar travadas
 *   como "Texto sem formatação" (`@`) ANTES de escrever — ex.: a coluna
 *   Período. Sem isso, o próprio `setValues()` aplica a MESMA detecção
 *   automática de tipo que a digitação manual: mesmo escrevendo a string já
 *   limpa por `normalizarTexto_`, o Sheets pode reinterpretar algo como
 *   "2026.1" como data no momento da escrita, criando de novo o problema que
 *   `normalizarTexto_` existe pra contornar na LEITURA (ver comentário lá, e
 *   NOTAS-TECNICAS.md §9) — a causa raiz real ficava aqui, na escrita, não em
 *   nenhuma formatação manual que alguém tenha feito na célula.
 */
function substituirDados_(nomeAba, novaMatriz, nColunas, colunasTexto) {
  const sh = getSheetOrThrow_(nomeAba);
  const ultimaLinha = sh.getMaxRows();
  if (ultimaLinha > 1) {
    sh.getRange(2, 1, ultimaLinha - 1, Math.max(nColunas, sh.getMaxColumns())).clearContent();
  }
  if (novaMatriz.length > 0) {
    // garante que a aba tenha linhas suficientes
    const linhasNecessarias = novaMatriz.length + 1;
    if (sh.getMaxRows() < linhasNecessarias) {
      sh.insertRowsAfter(sh.getMaxRows(), linhasNecessarias - sh.getMaxRows());
    }
    if (colunasTexto && colunasTexto.length) {
      colunasTexto.forEach(col => {
        sh.getRange(2, col, novaMatriz.length, 1).setNumberFormat('@');
      });
    }
    sh.getRange(2, 1, novaMatriz.length, nColunas).setValues(novaMatriz);
  }
}
