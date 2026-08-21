/**
 * Participacao.gs
 * ---------------------------------------------------------------------------
 * Segunda aba do Painel — não é sobre a QUALIDADE das notas (isso é
 * Painel.gs + Estatisticas.gs, e lê "Dados Tratados"); é sobre QUEM está
 * respondendo o formulário. Lê só "Registro de Respondentes" (1 linha por
 * submissão) e a tabela de Membros da Config.
 *
 * Mesma filosofia do resto do sistema: nada de número de política fixo no
 * código (limiares vêm de `cfg.parametros`), e reaproveita o que já existe
 * em Estatisticas.gs (`arredondar_`, `contarRespondentesUnicos_`,
 * `detectarQuedaEntrePeriodos_`) em vez de duplicar lógica.
 *
 * "Registro de Respondentes": A timestamp, B período, C nome, D setor, E cargo.
 * ---------------------------------------------------------------------------
 */

/**
 * @param {string} periodo  Período único pra "Resumo"/"Por Setor"/"Por Cargo"/
 *   "Quem ainda não respondeu" ('' = todos os períodos, combinados). A
 *   Evolução por Período ignora esse filtro de propósito — ela é sempre a
 *   trajetória inteira, igual a Evolução do Painel de Avaliações.
 */
function getParticipacaoDados(periodo) {
  periodo = normalizarTexto_(periodo);
  const cfg = lerConfig_();
  const sh = getSheetOrThrow_(SHEET_REGISTRO);

  const dados = sh.getDataRange().getValues();
  const rows = dados.slice(1).filter(r => normalizarTexto_(r[2]) !== ''); // C = Nome; linha real tem nome
  const membrosAtivos = cfg.membros.filter(m => m.status === 'Ativo');

  const rowsRecorte = periodo ? rows.filter(r => normalizarTexto_(r[1]) === periodo) : rows;
  const respondentes = new Set(rowsRecorte.map(r => normalizarTexto_(r[2])));

  /** Taxa de resposta (%) dentro de um grupo de membros — null se o grupo estiver vazio. */
  function taxaGrupo(membrosDoGrupo) {
    if (!membrosDoGrupo.length) return null;
    const respondeu = membrosDoGrupo.filter(m => respondentes.has(m.nome)).length;
    return arredondar_((respondeu / membrosDoGrupo.length) * 100, 1);
  }

  // ---- Por Setor / Por Cargo — mesma trava de grupo pequeno do Painel de Avaliações
  // (Param_MinGrupo): um setor de 2 pessoas mostrando "1 respondeu, 1 não" já entrega
  // quem foi, então esconde o número igual lá. ----
  const todosSetores = [...new Set(membrosAtivos.map(m => m.setor))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const todosCargos = [...new Set(membrosAtivos.map(m => m.papel))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const setoresOcultos = [];
  const porSetor = todosSetores.filter(s => {
    const membrosDoGrupo = membrosAtivos.filter(m => m.setor === s);
    const ok = membrosDoGrupo.length >= cfg.parametros.minIntegrantesGrupo;
    if (!ok) setoresOcultos.push(s);
    return ok;
  }).map(s => {
    const membrosDoGrupo = membrosAtivos.filter(m => m.setor === s);
    return {
      chave: s, taxa: taxaGrupo(membrosDoGrupo),
      respondentes: membrosDoGrupo.filter(m => respondentes.has(m.nome)).length,
      total: membrosDoGrupo.length,
    };
  });

  const cargosOcultos = [];
  const porCargo = todosCargos.filter(c => {
    const membrosDoGrupo = membrosAtivos.filter(m => m.papel === c);
    const ok = membrosDoGrupo.length >= cfg.parametros.minIntegrantesGrupo;
    if (!ok) cargosOcultos.push(c);
    return ok;
  }).map(c => {
    const membrosDoGrupo = membrosAtivos.filter(m => m.papel === c);
    return {
      chave: c, taxa: taxaGrupo(membrosDoGrupo),
      respondentes: membrosDoGrupo.filter(m => respondentes.has(m.nome)).length,
      total: membrosDoGrupo.length,
    };
  });

  // ---- Quem ainda não respondeu — sempre por NOME (nunca escondido por grupo pequeno,
  // pelo mesmo motivo de "Pessoa" nunca ser escondida no Painel de Avaliações: é uma
  // lista de ação — quem vai lembrar quem —, não um número agregado). ----
  const nuncaResponderam = membrosAtivos
    .filter(m => !respondentes.has(m.nome))
    .map(m => ({ nome: m.nome, setor: m.setor, papel: m.papel }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  // ---- Evolução da taxa de participação — sempre todos os períodos, independente do
  // filtro acima (mesma ideia da linha "Equipe geral" no Painel de Avaliações: uma
  // trajetória de referência fixa). Reaproveita contarRespondentesUnicos_. ----
  const evolucao = cfg.periodosCadastrados.map(p => {
    const rowsP = rows.filter(r => normalizarTexto_(r[1]) === p);
    const nRespondentes = contarRespondentesUnicos_(rowsP);
    return {
      periodo: p,
      taxa: membrosAtivos.length ? arredondar_((nRespondentes / membrosAtivos.length) * 100, 1) : null,
      respondentes: nRespondentes,
      ativos: membrosAtivos.length,
    };
  });

  // Reaproveita a MESMA função que detecta queda de nota no Painel de Avaliações — só
  // troca a série (taxa de participação, escala 0-100) e o limiar (pontos percentuais,
  // não pontos de nota).
  const queda = detectarQuedaEntrePeriodos_(evolucao, 'taxa', cfg.parametros.quedaParticipacaoPontos);

  return {
    periodos: cfg.periodosCadastrados,
    respondentesNoRecorte: respondentes.size,
    ativosNoRecorte: membrosAtivos.length,
    taxaGeral: taxaGrupo(membrosAtivos),
    porSetor, porCargo,
    gruposOcultos: { setores: setoresOcultos, cargos: cargosOcultos },
    nuncaResponderam,
    evolucao, queda,
    parametros: cfg.parametros,
  };
}
