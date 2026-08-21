/**
 * DataTransform.gs
 * ---------------------------------------------------------------------------
 * Lê "Respostas do Formulário 1" (larga, uma coluna por membro x critério) e
 * gera:
 *   - "Registro de Respondentes": 1 linha por submissão (para taxa de participação)
 *   - "Dados Tratados": 1 linha por (Avaliador, Avaliado, Critério) — formato
 *      longo, é isso que alimenta as fórmulas de Resumo Individual/Setor e os
 *      gráficos do Dashboard.
 *
 * O parsing é feito por PADRÃO no texto do cabeçalho (não por posição fixa de
 * coluna), então o script continua funcionando mesmo se você reordenar ou
 * adicionar perguntas no Forms — só não pode mudar o texto-chave dos critérios
 * (ex.: a palavra "ENGAJAMENTO") nem o formato "Pergunta [Nome]" das grades.
 * ---------------------------------------------------------------------------
 */

/** Ponto de entrada chamado pelo menu "Atualizar Dados". */
function atualizarDados() {
  const ui = SpreadsheetApp.getUi();
  try {
    const resultado = executarTransformacao_();
    const msg =
      `Atualização concluída.\n\n` +
      `• ${resultado.nRespostas} respostas processadas\n` +
      `• ${resultado.nLinhasTidy} linhas geradas em "Dados Tratados"\n` +
      (resultado.avisos.length
        ? `\nAvisos (${resultado.avisos.length}):\n` + resultado.avisos.slice(0, 12).join('\n') +
          (resultado.avisos.length > 12 ? `\n… e mais ${resultado.avisos.length - 12}.` : '')
        : '\nNenhum aviso.');
    ui.alert('Avaliação 360º', msg, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Erro ao atualizar', String(e.message || e), ui.ButtonSet.OK);
    throw e;
  }
}

/** Versão "silenciosa" (sem popup), usada pela sidebar e por gatilhos automáticos. */
function executarTransformacao_() {
  // Invalida o cache de lerConfig_() (ver Utils.gs) antes de ler — "Atualizar Dados" é
  // exatamente o momento em que o LEIA-ME instrui a rodar depois de editar a Config, então
  // essa é a hora certa de garantir uma leitura fresca (e recachear o valor novo pro resto
  // da sessão, incluindo o Painel).
  CacheService.getScriptCache().remove(CHAVE_CACHE_CONFIG_);
  const cfg = lerConfig_();
  const shResp = getSheetOrThrow_(SHEET_RESPOSTAS);
  const dados = shResp.getDataRange().getValues();
  if (dados.length < 2) {
    return { nRespostas: 0, nLinhasTidy: 0, avisos: ['A aba de respostas está vazia — nada para processar.'] };
  }

  const headers = dados[0].map(normalizarTexto_);
  const colInfo = classificarColunas_(headers);

  const registros = [];   // -> Registro de Respondentes
  const tidy = [];        // -> Dados Tratados
  const avisos = [];
  const periodosVistos = new Set();
  const setoresDesconhecidos = new Set();
  const nomesDesconhecidos = new Set();
  const avaliadoresNaoCadastrados = new Set();

  for (let r = 1; r < dados.length; r++) {
    const linha = dados[r];
    const nomeAvaliador = normalizarTexto_(linha[colInfo.idxNome]);
    if (!nomeAvaliador) continue; // linha em branco (sobra de fórmula/planilha maior que os dados)

    const timestamp = linha[colInfo.idxTimestamp];
    const periodo = normalizarTexto_(linha[colInfo.idxPeriodo]);
    const resolucaoSetor = extrairSetorECargo_(linha[colInfo.idxSetor], cfg);
    const setorAvaliador = resolucaoSetor.setor;
    let cargoAvaliador = '';
    for (const idx of colInfo.idxsCargo) {
      const v = normalizarTexto_(linha[idx]);
      if (v) { cargoAvaliador = v; break; }
    }
    if (!cargoAvaliador && resolucaoSetor.cargoDetectado) cargoAvaliador = resolucaoSetor.cargoDetectado;

    if (periodo) periodosVistos.add(periodo);
    if (setorAvaliador && !(setorAvaliador in cfg.setorParaDiretor) && setorAvaliador !== SETOR_PRESIDENCIA) {
      setoresDesconhecidos.add(setorAvaliador);
    }
    if (!(nomeAvaliador in cfg.nomeParaSetor)) {
      avaliadoresNaoCadastrados.add(nomeAvaliador);
    }

    registros.push([timestamp, periodo, nomeAvaliador, setorAvaliador, cargoAvaliador]);

    // --- Colunas de grade (Avalie X dos membros abaixo: [Nome]) ---
    for (const col of colInfo.colunasGrade) {
      const nota = linha[col.idx];
      if (nota === '' || nota === null || nota === undefined) continue;
      const avaliado = col.avaliado;
      const setorAvaliado = resolverSetorDoAvaliado_(avaliado, cfg, nomesDesconhecidos);
      const papelAvaliado = resolverPapelDoAvaliado_(avaliado, cfg);
      tidy.push(montarLinhaTidy_(timestamp, periodo, nomeAvaliador, setorAvaliador_ok(setorAvaliador),
        cargoAvaliador, 'Avaliação de Equipe', avaliado, setorAvaliado, col.criterio, nota,
        avaliado === nomeAvaliador, papelAvaliado));
    }

    // --- Colunas "Avalie X do seu diretor(a)" (o avaliado é inferido pelo setor do respondente) ---
    for (const col of colInfo.colunasLiderDiretor) {
      const nota = linha[col.idx];
      if (nota === '' || nota === null || nota === undefined) continue;
      const diretor = cfg.setorParaDiretor[setorAvaliador];
      if (!diretor) {
        avisos.push(`Linha ${r + 1}: não encontrei o(a) diretor(a) do setor "${setorAvaliador}" (verifique a aba Config).`);
        continue;
      }
      const papelDiretor = resolverPapelDoAvaliado_(diretor, cfg);
      tidy.push(montarLinhaTidy_(timestamp, periodo, nomeAvaliador, setorAvaliador,
        cargoAvaliador, 'Avaliação da Liderança', diretor, setorAvaliador, col.criterio, nota,
        false, papelDiretor));
    }

    // --- Colunas "O quanto você se avalia em X?" (autoavaliação) ---
    for (const col of colInfo.colunasAutoavaliacao) {
      const nota = linha[col.idx];
      if (nota === '' || nota === null || nota === undefined) continue;
      const papelProprio = resolverPapelDoAvaliado_(nomeAvaliador, cfg);
      tidy.push(montarLinhaTidy_(timestamp, periodo, nomeAvaliador, setorAvaliador,
        cargoAvaliador, 'Autoavaliação', nomeAvaliador, setorAvaliador, col.criterio, nota,
        true, papelProprio));
    }
  }

  substituirDados_(SHEET_REGISTRO, registros, 5, [2]);  // B = período
  substituirDados_(SHEET_DADOS, tidy, 12, [2]);          // B = período

  // Avisos de qualidade de dado — ajudam a pegar erro de digitação/Config desatualizado
  const periodosNaoCadastrados = [...periodosVistos].filter(p => cfg.periodosCadastrados.indexOf(p) === -1);
  if (periodosNaoCadastrados.length) {
    avisos.push(`Período(s) nas respostas mas ainda não cadastrados em Config!L: ${periodosNaoCadastrados.join(', ')} ` +
      `(os gráficos por período só mostram períodos cadastrados).`);
  }
  if (setoresDesconhecidos.size) {
    avisos.push(`Setor(es) de respondente não reconhecidos: ${[...setoresDesconhecidos].join(', ')} (confira a aba Config).`);
  }
  if (nomesDesconhecidos.size) {
    avisos.push(`Nome(s) avaliado(s) não encontrados na lista de membros (Config!E): ${[...nomesDesconhecidos].join(', ')}.`);
  }
  if (avaliadoresNaoCadastrados.size) {
    avisos.push(`Pessoa(s) que responderam mas ainda NÃO estão cadastradas em Config: ` +
      `${[...avaliadoresNaoCadastrados].join(', ')}. As respostas delas sobre os colegas já foram ` +
      `processadas normalmente, mas elas só aparecem em "Resumo Individual"/"Alertas" depois de você ` +
      `adicionar uma linha para elas na tabela Membros da aba Config (Status = Ativo).`);
  }

  SpreadsheetApp.flush();
  return { nRespostas: dados.length - 1, nLinhasTidy: tidy.length, avisos };
}

/** Pequeno passthrough só para deixar a linha de cima legível (evita 'undefined' silencioso). */
function setorAvaliador_ok(v) { return v || 'N/D'; }

function montarLinhaTidy_(timestamp, periodo, avaliador, setorAvaliador, cargoAvaliador,
                           tipo, avaliado, setorAvaliado, criterio, nota, ehAuto, papelAvaliado) {
  // Coluna L (papelAvaliado) é aditiva ao final, não mexe nas colunas A-K já usadas
  // por Resumo Individual/Setor/Dashboard, então não quebra nada existente.
  return [timestamp, periodo, avaliador, setorAvaliador, cargoAvaliador, tipo,
          avaliado, setorAvaliado, criterio, Number(nota), ehAuto ? 'Sim' : 'Não', papelAvaliado || 'N/D'];
}

function resolverSetorDoAvaliado_(nomeAvaliado, cfg, nomesDesconhecidos) {
  const setor = cfg.nomeParaSetor[nomeAvaliado];
  if (!setor) {
    nomesDesconhecidos.add(nomeAvaliado);
    return 'N/D';
  }
  return setor;
}

/** Papel/cargo (Consultor(a)/Diretor(a)) da pessoa AVALIADA, buscado na Config. */
function resolverPapelDoAvaliado_(nomeAvaliado, cfg) {
  return cfg.nomeParaPapel[nomeAvaliado] || 'N/D';
}

/**
 * Tenta casar o texto da pergunta de setor com a lista de setores cadastrados
 * (Config!A4:A8). Se não bater direto, tenta remover um prefixo de cargo comum
 * ("Consultor(a) de", "Diretor(a) de" etc.) antes de comparar de novo - cobre
 * o caso de formulários onde a pergunta de setor mistura cargo e setor na
 * mesma resposta (ex.: "Consultor de Marketing"). Devolve {setor, cargoDetectado}
 * - cargoDetectado fica '' quando nenhum prefixo de cargo foi encontrado.
 */
function extrairSetorECargo_(textoSetor, cfg) {
  const bruto = normalizarTexto_(textoSetor);
  if (!bruto) return { setor: '', cargoDetectado: '' };
  if (bruto in cfg.setorParaDiretor || bruto === SETOR_PRESIDENCIA) {
    return { setor: bruto, cargoDetectado: '' };
  }
  const m = bruto.match(/^(Consultor\(a\)|Diretor\(a\)|Consultora|Consultor|Diretora|Diretor)\s+d[eoa]\s+(.+)$/i);
  if (!m) return { setor: bruto, cargoDetectado: '' };
  const setorExtraido = normalizarTexto_(m[2]);
  const cargoDetectado = /^Diretor/i.test(m[1]) ? 'Diretor(a)' : 'Consultor(a)';
  return { setor: setorExtraido, cargoDetectado: cargoDetectado };
}

/**
 * Varre o cabeçalho inteiro uma única vez e classifica cada coluna em:
 * identificação (nome/setor/período/cargo/timestamp) ou um dos 3 tipos de
 * pergunta de nota (grade / líder-direto / autoavaliação).
 */
function classificarColunas_(headers) {
  const idxTimestamp = headers.indexOf(normalizarTexto_(COL_TIMESTAMP));
  const idxNome = headers.indexOf(normalizarTexto_(COL_NOME));
  const idxSetor = headers.indexOf(normalizarTexto_(COL_SETOR));
  const idxPeriodo = headers.indexOf(normalizarTexto_(COL_PERIODO));

  if (idxTimestamp < 0 || idxNome < 0 || idxSetor < 0 || idxPeriodo < 0) {
    throw new Error(
      'Não encontrei uma ou mais colunas fixas (Carimbo de data/hora, Nome, Setor, Período). ' +
      'Confira se a aba "Respostas do Formulário 1" tem exatamente esses cabeçalhos.'
    );
  }

  const idxsCargo = [];
  const colunasGrade = [];
  const colunasLiderDiretor = [];
  const colunasAutoavaliacao = [];

  headers.forEach((h, idx) => {
    if ([idxTimestamp, idxNome, idxSetor, idxPeriodo].indexOf(idx) !== -1) return;
    if (h.toLowerCase().indexOf(COL_CARGO_HINT) !== -1) { idxsCargo.push(idx); return; }

    const grade = extrairPadraoGrade_(h);
    if (grade) {
      const criterio = identificarCriterio_(grade.titulo);
      if (criterio) colunasGrade.push({ idx, criterio, avaliado: grade.nome });
      return;
    }
    if (PATTERN_LIDER_DIRETOR.test(h)) {
      const criterio = identificarCriterio_(h);
      if (criterio) colunasLiderDiretor.push({ idx, criterio });
      return;
    }
    if (PATTERN_AUTOAVALIACAO.test(h)) {
      const criterio = identificarCriterio_(h);
      if (criterio) colunasAutoavaliacao.push({ idx, criterio });
      return;
    }
    // Coluna não reconhecida (ex.: pergunta nova adicionada ao Forms) — ignorada silenciosamente.
  });

  return { idxTimestamp, idxNome, idxSetor, idxPeriodo, idxsCargo, colunasGrade, colunasLiderDiretor, colunasAutoavaliacao };
}
