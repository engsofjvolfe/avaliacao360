/**
 * Painel.gs
 * ---------------------------------------------------------------------------
 * Painel interativo — uma caixa de diálogo HTML que roda DENTRO do Google
 * Sheets (mesmo mecanismo da barra lateral, só que maior).
 *
 * MODELO DE COMPARAÇÃO
 * ---------------------
 * Em vez de filtros independentes que se cruzam (o que permite escolher
 * combinações que não existem, tipo uma Pessoa de um Setor enquanto o filtro
 * de Setor está travado em outro), o Painel trabalha com uma lista de "itens
 * de comparação": cada item já é uma Pessoa, um Setor OU um Cargo válido
 * (nunca uma mistura contraditória, porque o valor de cada item vem pronto
 * do Config), com um Período próprio e opcional — e cada um vira uma série
 * própria nos gráficos.
 *
 * O período por item (em vez de um período único global) é o que permite
 * comparar a MESMA pessoa ou o MESMO setor em períodos diferentes: dá pra
 * adicionar "Bruna Rossi · 2026.1" e "Bruna Rossi · 2026.2" como dois itens
 * lado a lado, junto com "Setor: Comercial" sem período nenhum (agregando
 * todos os períodos). Item sem período = combina todos os períodos daquele
 * item; item com período = só aquele recorte.
 *
 * Pessoa, Setor e Cargo descrevem sempre o mesmo eixo: quem está sendo
 * AVALIADO (não quem respondeu o formulário) — por isso um item de qualquer
 * um dos três tipos filtra as mesmas linhas de "Dados Tratados" (colunas G,
 * H, L).
 *
 * A seção "Visão geral" (todos os setores / todos os cargos) e o Ranking
 * ficam fora da lista de itens — são o "big picture" e têm seu próprio
 * período único, independente do que está sendo comparado.
 *
 * MODELO DE LENTE (colegas/liderança x autoavaliação x os dois)
 * ---------------------------------------------------------------------------
 * Toda seção que representa "a nota de alguém" (Resumo, Distribuição,
 * Dispersão, Radar, Evolução, Todos os setores/cargos) pode ser vista sob
 * três lentes, escolhidas na própria tela:
 *   - 'colegas'       — só o que colegas e liderança disseram (o padrão).
 *   - 'autoavaliacao' — só a autoavaliação da própria pessoa/grupo.
 *   - 'ambos'         — as duas, uma série por lente, lado a lado.
 * Cada lente usa sua própria base de linhas (`rowsHetero` ou `rowsAuto`) e
 * sua própria "média geral" de referência pro encolhimento (RF10) — nunca
 * mistura as duas dentro de um cálculo só. O Ranking é a única seção que
 * NÃO segue a lente: ele só existe com base em colegas/liderança, porque
 * autoavaliação sempre daria "1 avaliador" (a própria pessoa) pra qualquer
 * um, o que quebraria o limiar de confiança que o Ranking usa por definição
 * (RF9) — por isso `ranking` vem `null` quando a lente é só autoavaliação,
 * e a tela esconde o card inteiro nesse caso.
 *
 * "Dados Tratados": A timestamp, B período, C avaliador, D setorAvaliador,
 * E cargoAvaliador, F tipo, G avaliado, H setorAvaliado, I critério, J nota,
 * K ehAutoavaliação, L papelAvaliado.
 * ---------------------------------------------------------------------------
 */

function abrirPainel() {
  // createTemplateFromFile (em vez de createHtmlOutputFromFile) é o que permite
  // o PainelDialog.html usar `<?!= include_('...'); ?>` pra colar CSS/JS de
  // outros arquivos — ver include_() em Utils.gs.
  //
  // O tamanho aqui é sempre um valor fixo em pixels — o Google não deixa esse
  // tipo de caixa (showModalDialog) se ajustar sozinha ao tamanho da tela de
  // quem abrir. Usar um valor generoso (bem maior que a maioria das telas) é
  // o mais perto que dá de "tela cheia" nesse formato; se o monitor for menor
  // que isso, o próprio Google encolhe a caixa pra caber, sem quebrar nada.
  // Uma "tela cheia" de verdade, responsiva, exigiria publicar o Painel como
  // um Web App separado em vez de um diálogo do Sheets (ver POSSIBILIDADES-PAINEL-WEB.md).
  const html = HtmlService.createTemplateFromFile('PainelDialog').evaluate()
    .setWidth(1500)
    .setHeight(950);
  SpreadsheetApp.getUi().showModalDialog(html, 'Painel — Avaliação 360');
}

/**
 * Listas para popular os seletores do Painel: períodos cadastrados, e as
 * pessoas/setores/cargos REAIS (derivados da tabela Membros, não de tabelas
 * auxiliares com outro propósito) — isso é o que garante que toda combinação
 * oferecida na tela realmente existe no Config.
 */
function getFiltrosPainel() {
  const t0_ = Date.now(); // cronômetro de diagnóstico temporário — ver getPainelDados()
  const cfg = lerConfig_();
  Logger.log('[getFiltrosPainel] lerConfig_: ' + (Date.now() - t0_) + 'ms');

  const pessoas = cfg.membros
    .map(m => ({ nome: m.nome, setor: m.setor, papel: m.papel, status: m.status }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  // Setor e Cargo saem da MESMA tabela de Membros (não de "Config!A4:A8"/Cfg_Setores, que é
  // só o mapa Setor->Diretor e por isso nunca incluiria "Presidência e Vice-Presidência").
  const setores = [...new Set(cfg.membros.map(m => m.setor))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const cargos = [...new Set(cfg.membros.map(m => m.papel))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  Logger.log('[getFiltrosPainel] TOTAL: ' + (Date.now() - t0_) + 'ms');
  return { periodos: cfg.periodosCadastrados, pessoas, setores, cargos, maxEntidades: cfg.parametros.maxEntidades };
}

/**
 * Calcula tudo que o Painel mostra num único passe pelos dados de "Dados
 * Tratados": resumo por item comparado, evolução por período, radar de
 * competências, distribuição, dispersão, visão geral (todos os setores /
 * todos os cargos) e ranking — sob a lente escolhida (ver cabeçalho do
 * arquivo).
 *
 * @param {Array<{tipo:'pessoa'|'setor'|'cargo', valor:string, periodo:string, label:string}>} entidades
 *   Itens sendo comparados. `periodo` é opcional por item ('' = combina todos
 *   os períodos daquele item). Lista vazia = trata como "Equipe inteira".
 * @param {string} periodoVisaoGeral  Período único para a Visão Geral e o
 *   Ranking, opcional ('' = todos). Independente do período de cada item.
 * @param {'colegas'|'autoavaliacao'|'ambos'} lente  Qual base de notas usar.
 *   Valor inválido/ausente cai em 'colegas', o mesmo comportamento de antes
 *   dessa lente existir.
 */
function getPainelDados(entidades, periodoVisaoGeral, lente) {
  // ---- Cronômetro de diagnóstico (temporário — ver seção "Riscos e limitações
  // conhecidas" do NOTAS-TECNICAS.md). Cada `logEtapa_` grava, no log de Execuções
  // do Apps Script (Extensões > Apps Script > Execuções > clique na chamada >
  // "Ver registro de execução"), quanto tempo se passou desde a etapa anterior —
  // isso mostra exatamente qual trecho está pesando numa chamada lenta, em vez de
  // só o tempo total. Pode ser removido depois que a causa da demora estiver clara. ----
  const t0_ = Date.now();
  let tUltima_ = t0_;
  function logEtapa_(nome) {
    const agora = Date.now();
    Logger.log('[getPainelDados] ' + nome + ': ' + (agora - tUltima_) + 'ms (acumulado: ' + (agora - t0_) + 'ms)');
    tUltima_ = agora;
  }

  const cfg = lerConfig_();
  logEtapa_('lerConfig_');
  const membros = cfg.membros;
  entidades = (Array.isArray(entidades) ? entidades : []).slice(0, cfg.parametros.maxEntidades)
    .map(e => ({ tipo: e.tipo, valor: e.valor, periodo: normalizarTexto_(e.periodo), label: e.label }));
  periodoVisaoGeral = normalizarTexto_(periodoVisaoGeral);
  lente = ['colegas', 'autoavaliacao', 'ambos'].indexOf(lente) >= 0 ? lente : 'colegas';

  const shDados = getSheetOrThrow_(SHEET_DADOS);

  const dados = shDados.getDataRange().getValues();
  logEtapa_('leitura "Dados Tratados" (' + (dados.length - 1) + ' linhas)');
  const rows = dados.slice(1).filter(r => normalizarTexto_(r[2]) !== ''); // C = avaliador; linha real tem avaliador

  // Notas que colegas/liderança deram, e notas de autoavaliação — as duas bases
  // que qualquer lente usa. Nunca misturadas dentro do mesmo cálculo (RF12).
  const rowsHetero = rows.filter(r => normalizarTexto_(r[10]) !== 'Sim'); // K = autoavaliação (Sim/Não)
  const rowsAuto = rows.filter(r => normalizarTexto_(r[10]) === 'Sim');
  logEtapa_('separar colegas/autoavaliação');

  const media = arr => arredondar_(media_(arr), 2);

  // Casa uma LINHA de Dados Tratados com um item de comparação (pessoa/setor/cargo do AVALIADO).
  // Não olha o período do item aqui — isso é tratado à parte em cada seção, porque a
  // Evolução por Período precisa da trajetória inteira mesmo quando o item tem período fixo.
  function linhaBateEntidade(r, ent) {
    switch (ent.tipo) {
      case 'pessoa': return normalizarTexto_(r[6]) === ent.valor;   // G avaliado
      case 'setor':  return normalizarTexto_(r[7]) === ent.valor;   // H setorAvaliado
      case 'cargo':  return normalizarTexto_(r[11]) === ent.valor;  // L papelAvaliado
      default:       return true; // 'geral'
    }
  }
  // Casa um MEMBRO (linha da Config) com um item de comparação, para contagens de gente/ranking.
  function membroBateEntidade(m, ent) {
    switch (ent.tipo) {
      case 'pessoa': return m.nome === ent.valor;
      case 'setor':  return m.setor === ent.valor;
      case 'cargo':  return m.papel === ent.valor;
      default:       return true; // 'geral'
    }
  }
  // Filtra uma base de linhas (rowsHetero ou rowsAuto) pelo item + período próprio do item.
  function filtrarPorItem_(baseRows, ent) {
    return baseRows.filter(r => linhaBateEntidade(r, ent) && (!ent.periodo || normalizarTexto_(r[1]) === ent.periodo));
  }
  // Agrupa uma base de linhas por uma coluna (normalizada) — ex.: por critério, por
  // período, por setor do avaliado. Existe por desempenho: sem isso, Dispersão e Radar
  // escaneavam a base INTEIRA de novo pra cada um dos 9 critérios × cada item comparado
  // (o mesmo valendo pra Evolução por período e pro Ranking por pessoa), o que em
  // planilhas com milhares de linhas virava centenas de milhares de comparações
  // repetidas — perceptível como demora real ao trocar filtro/lente (RNF2). Agrupando
  // uma vez, cada seção só escaneia o pedaço que já sabe que é relevante.
  function agruparPor_(baseRows, indiceColuna) {
    const grupos = new Map();
    baseRows.forEach(r => {
      const chave = normalizarTexto_(r[indiceColuna]);
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(r);
    });
    return grupos;
  }
  // Mesma ideia de `agruparPor_`, mas monta VÁRIOS agrupamentos num único passe pela
  // base — usado em `construirSecoes_`, que precisa de 4 agrupamentos (critério,
  // período, setor do avaliado, cargo do avaliado) da MESMA base de linhas. Antes,
  // eram 4 chamadas separadas de `agruparPor_`, cada uma revisitando as mesmas
  // milhares de linhas do zero; aqui cada linha é visitada 1 vez só, distribuída
  // pros 4 Maps de uma vez.
  function agruparPorVarias_(baseRows, indicesColuna) {
    const grupos = indicesColuna.map(() => new Map());
    baseRows.forEach(r => {
      for (let i = 0; i < indicesColuna.length; i++) {
        const chave = normalizarTexto_(r[indicesColuna[i]]);
        const m = grupos[i];
        if (!m.has(chave)) m.set(chave, []);
        m.get(chave).push(r);
      }
    });
    return grupos;
  }

  const lista = entidades.length ? entidades : [{ tipo: 'geral', valor: '', periodo: '', label: 'Equipe inteira' }];

  // Viés de cada avaliador (durão/bonzinho), calculado sobre TODO o histórico de
  // notas dadas A OUTRAS PESSOAS (nunca a autoavaliação) — só faz sentido pro
  // lado colegas/liderança: não existe "viés de avaliador" na autoavaliação,
  // porque ali a única avaliadora possível é a própria pessoa (não há padrão de
  // "quão dura ela é com os OUTROS" a corrigir). Por isso "Nota ajustada" só é
  // calculada quando a base é colegas — ver `construirSecoes_`.
  const vies = calcularViesAvaliadores_(rowsHetero);

  // Cada lente encolhe (RF10) em direção à SUA PRÓPRIA média geral — a
  // autoavaliação não deveria ser puxada pra média do que os colegas dizem,
  // e vice-versa; são duas populações diferentes.
  const mediaGeralColegas = media_(rowsHetero.map(r => Number(r[9])));
  const mediaGeralAuto = media_(rowsAuto.map(r => Number(r[9])));

  const faixasHistograma = gerarFaixasHistograma_(cfg.parametros.notaMinima, cfg.parametros.notaMaxima, cfg.parametros.qtdFaixasHistograma);

  /**
   * Monta resumo/distribuição/dispersão/radar/evolução/visãoSetor/visãoCargo
   * pra UMA base de linhas (colegas OU autoavaliação) — reaproveitado pelas
   * duas bases (quando a lente pede as duas), pra nunca duplicar a lógica de
   * cada seção. `ehColegas` decide se "Nota ajustada" é calculada (só faz
   * sentido no lado colegas — ver comentário do `vies` acima).
   */
  function construirSecoes_(rowsBase, ehColegas, mediaGeralBase) {
    // ---- Cronômetro interno (temporário) — a correção do histograma (ver abaixo)
    // reduziu pouco o tempo total visto no log de Execuções real, então a redundância
    // do histograma não era o custo dominante. Em vez de arriscar outro palpite, esse
    // cronômetro isola qual sub-etapa pesa de verdade dentro de UMA chamada de
    // construirSecoes_. Remover depois que a causa estiver identificada. ----
    const tBase_ = Date.now();
    let tPassoBase_ = tBase_;
    const rotuloBase_ = ehColegas ? 'colegas' : 'autoavaliacao';
    function logEtapaBase_(nome) {
      const agora = Date.now();
      Logger.log('[construirSecoes_:' + rotuloBase_ + '] ' + nome + ': ' + (agora - tPassoBase_) + 'ms');
      tPassoBase_ = agora;
    }

    function estatisticasGrupo_(rowsSubset) {
      const notas = rowsSubset.map(r => Number(r[9]));
      const n = contarAvaliadoresUnicos_(rowsSubset);
      const mediaBruta = media_(notas);
      const dp = desvioPadrao_(notas);
      return {
        n,
        intervaloConfianca: intervaloConfianca_(mediaBruta, dp, n, cfg.parametros.zIntervaloConfianca,
          cfg.parametros.notaMinima, cfg.parametros.notaMaxima),
        notaEstabilizada: mediaEncolhida_(mediaBruta, n, mediaGeralBase, cfg.parametros.forcaEncolhimento),
      };
    }

    // Um passe só, reaproveitado no Resumo e na Distribuição — evita filtrar a
    // mesma base repetidas vezes por item.
    const rowsPorItem = lista.map(ent => filtrarPorItem_(rowsBase, ent));
    logEtapaBase_('rowsPorItem (' + rowsBase.length + ' linhas na base)');

    // Pré-agrupamentos reaproveitados por Dispersão/Radar (por critério), Evolução (por
    // período) e Setor/Cargo (por setor/cargo do avaliado) — os 4 num único passe pela
    // base (ver `agruparPorVarias_` acima).
    const [porCriterio, porPeriodo, porSetorAvaliado, porCargoAvaliado] =
      agruparPorVarias_(rowsBase, [8, 1, 7, 11]); // I critério, B período, H setor avaliado, L papel avaliado
    logEtapaBase_('agruparPorVarias_ (1 passe, 4 agrupamentos)');

    // ---- Resumo por item comparado — cada item respeita o PRÓPRIO período (se tiver um).
    // Setor/Cargo com poucos integrantes ativos tem a nota ocultada (grupoPequeno: true) —
    // com pouca gente, a "média do grupo" praticamente entrega quem deu qual nota pra
    // quem, o que não é o objetivo de um número agregado. Pessoa individual nunca é
    // ocultada aqui (é o próprio objetivo de escolher uma pessoa). ----
    const resumo = lista.map((ent, i) => {
      const rowsEnt = rowsPorItem[i];
      const pessoasEnt = membros.filter(m => m.status === 'Ativo' && membroBateEntidade(m, ent));
      const grupoPequeno = ent.tipo !== 'pessoa' && ent.tipo !== 'geral' && pessoasEnt.length < cfg.parametros.minIntegrantesGrupo;
      const est = estatisticasGrupo_(rowsEnt);
      return {
        label: ent.label,
        integrantes: pessoasEnt.length,
        nota: grupoPequeno ? null : media(rowsEnt.map(r => r[9])),
        notaAjustada: (ehColegas && !grupoPequeno) ? media(rowsEnt.map(r => notaAjustada_(r[9], r[2], vies))) : null,
        notaEstabilizada: grupoPequeno ? null : est.notaEstabilizada,
        intervaloConfianca: grupoPequeno ? null : est.intervaloConfianca,
        nAvaliacoes: rowsEnt.length,
        nAvaliadores: est.n,
        alertas: rowsEnt.filter(r => Number(r[9]) <= cfg.parametros.limiteAlerta).length,
        grupoPequeno,
      };
    });
    logEtapaBase_('resumo');

    // ---- Distribuição das notas — duas leituras do mesmo recorte de período do Resumo:
    // "porNota" (1 marca por NOTA) e "porAvaliador" (1 marca por AVALIADOR DISTINTO,
    // usando a média dele) — mesma lógica de `nAvaliacoes` x `nAvaliadores`, aplicada
    // ao histograma pra um avaliador que preencheu mais critérios não pesar mais. ----
    // Um histograma por ITEM, calculado uma vez só — a versão anterior chamava
    // `histograma_` (que já escaneia todas as notas do item) de novo pra CADA faixa,
    // só pra aproveitar 1 posição do resultado e jogar o resto fora, multiplicando o
    // custo pelo nº de faixas à toa (RNF2 — encontrado via o cronômetro de diagnóstico
    // em getPainelDados(), que mostrou construirSecoes_ crescendo muito mais rápido
    // que o volume de linhas entre a lente 'colegas' e 'autoavaliacao').
    const histogramasPorNota = rowsPorItem.map(rowsEnt => histograma_(rowsEnt.map(r => r[9]), faixasHistograma));
    const histogramasPorAvaliador = rowsPorItem.map(rowsEnt => histograma_(mediasPorAvaliador_(rowsEnt), faixasHistograma));
    const distribuicaoPorNota = faixasHistograma.map((faixaObj, idxFaixa) => {
      const ponto = { faixa: faixaObj.label };
      lista.forEach((ent, i) => { ponto['s' + i] = histogramasPorNota[i][idxFaixa]; });
      return ponto;
    });
    const distribuicaoPorAvaliador = faixasHistograma.map((faixaObj, idxFaixa) => {
      const ponto = { faixa: faixaObj.label };
      lista.forEach((ent, i) => { ponto['s' + i] = histogramasPorAvaliador[i][idxFaixa]; });
      return ponto;
    });
    logEtapaBase_('distribuicao (porNota + porAvaliador)');

    // ---- Dispersão por critério — 1 "caixa" (min/Q1/mediana/Q3/max) por item, por critério.
    // Aqui não existe o problema de "1 avaliador pesando mais": dentro de UM critério,
    // cada avaliador dá no máximo 1 nota, então 1 nota = 1 avaliador naturalmente. ----
    const dispersaoCompleta = cfg.criterios.map(criterio => {
      const rowsCriterio = porCriterio.get(criterio) || [];
      const ponto = { criterio };
      lista.forEach((ent, i) => {
        const rowsEnt = rowsCriterio.filter(r => linhaBateEntidade(r, ent) &&
          (!ent.periodo || normalizarTexto_(r[1]) === ent.periodo));
        ponto['d' + i] = quartis_(rowsEnt.map(r => Number(r[9])));
      });
      return ponto;
    });
    const dispersao = dispersaoCompleta.filter(ponto => lista.some((ent, i) => ponto['d' + i] !== null));
    logEtapaBase_('dispersao (' + cfg.criterios.length + ' criterios)');

    // ---- Evolução por período — 1 série por item + 1 linha fixa "Equipe (geral)" de referência.
    // Item SEM período fixo: linha inteira, todos os períodos cadastrados (mostra a trajetória).
    // Item COM período fixo: só um ponto naquele período. ----
    const evolucao = cfg.periodosCadastrados.map(periodo => {
      const rowsPeriodo = porPeriodo.get(periodo) || [];
      const ponto = { periodo };
      lista.forEach((ent, i) => {
        if (ent.periodo && ent.periodo !== periodo) { ponto['s' + i] = null; ponto['n' + i] = 0; return; }
        const rowsEnt = rowsPeriodo.filter(r => linhaBateEntidade(r, ent));
        ponto['s' + i] = media(rowsEnt.map(r => r[9]));
        ponto['n' + i] = contarAvaliadoresUnicos_(rowsEnt);
      });
      ponto.geral = media(rowsPeriodo.map(r => r[9]));
      ponto.nGeral = contarAvaliadoresUnicos_(rowsPeriodo);
      return ponto;
    });
    logEtapaBase_('evolucao (' + cfg.periodosCadastrados.length + ' periodos)');

    // ---- Radar de competências — 1 série por item. Um critério só aparece se PELO MENOS
    // UM dos itens comparados tiver nota nele — tira do desenho perguntas que não se
    // aplicam a nada do que está sendo comparado. ----
    const radarCompleto = cfg.criterios.map(criterio => {
      const rowsCriterio = porCriterio.get(criterio) || [];
      const ponto = { criterio };
      lista.forEach((ent, i) => {
        const rowsEnt = rowsCriterio.filter(r => linhaBateEntidade(r, ent) &&
          (!ent.periodo || normalizarTexto_(r[1]) === ent.periodo));
        ponto['s' + i] = media(rowsEnt.map(r => r[9]));
        ponto['n' + i] = contarAvaliadoresUnicos_(rowsEnt);
      });
      return ponto;
    });
    const radar = radarCompleto.filter(ponto => lista.some((ent, i) => ponto['s' + i] !== null));
    logEtapaBase_('radar');

    // ---- Visão geral: TODOS os setores / TODOS os cargos, sempre — não depende do
    // que está sendo comparado, só do período único da Visão Geral. Setor/Cargo com
    // menos integrantes ativos que o mínimo configurado nem entra na lista (privacidade). ----
    const todosSetores = [...new Set(membros.map(m => m.setor))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const todosCargos = [...new Set(membros.map(m => m.papel))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    function contarAtivos(campo, chave) {
      return membros.filter(m => m.status === 'Ativo' && m[campo] === chave).length;
    }

    const setoresOcultos = [];
    const visaoSetor = todosSetores.filter(setor => {
      const ok = contarAtivos('setor', setor) >= cfg.parametros.minIntegrantesGrupo;
      if (!ok) setoresOcultos.push(setor);
      return ok;
    }).map(setor => {
      let linhas = porSetorAvaliado.get(setor) || [];
      if (periodoVisaoGeral) linhas = linhas.filter(r => normalizarTexto_(r[1]) === periodoVisaoGeral);
      const est = estatisticasGrupo_(linhas);
      return { chave: setor, nota: media(linhas.map(r => r[9])), n: est.n, intervaloConfianca: est.intervaloConfianca, notaEstabilizada: est.notaEstabilizada };
    });
    const cargosOcultos = [];
    const visaoCargo = todosCargos.filter(cargo => {
      const ok = contarAtivos('papel', cargo) >= cfg.parametros.minIntegrantesGrupo;
      if (!ok) cargosOcultos.push(cargo);
      return ok;
    }).map(cargo => {
      let linhas = porCargoAvaliado.get(cargo) || [];
      if (periodoVisaoGeral) linhas = linhas.filter(r => normalizarTexto_(r[1]) === periodoVisaoGeral);
      const est = estatisticasGrupo_(linhas);
      return { chave: cargo, nota: media(linhas.map(r => r[9])), n: est.n, intervaloConfianca: est.intervaloConfianca, notaEstabilizada: est.notaEstabilizada };
    });
    logEtapaBase_('visaoSetor + visaoCargo');
    Logger.log('[construirSecoes_:' + rotuloBase_ + '] TOTAL: ' + (Date.now() - tBase_) + 'ms');

    return {
      resumo,
      distribuicao: { porNota: distribuicaoPorNota, porAvaliador: distribuicaoPorAvaliador },
      dispersao, radar, evolucao,
      visaoSetor, visaoCargo,
      gruposOcultos: { setores: setoresOcultos, cargos: cargosOcultos },
    };
  }

  const precisaColegas = lente === 'colegas' || lente === 'ambos';
  const precisaAuto = lente === 'autoavaliacao' || lente === 'ambos';
  const secoes = {
    colegas: precisaColegas ? construirSecoes_(rowsHetero, true, mediaGeralColegas) : null,
    autoavaliacao: precisaAuto ? construirSecoes_(rowsAuto, false, mediaGeralAuto) : null,
  };
  logEtapa_('construirSecoes_ (lente=' + lente + ')');
  // "Base primária": a que os cálculos que NÃO seguem a lente (quedas, outliers)
  // usam quando a lente é 'colegas' ou 'ambos' — nesses dois casos colegas é a
  // referência operacional de sempre; só quando a lente é EXCLUSIVAMENTE
  // autoavaliação essas seções passam a olhar autoavaliação também.
  const baseSecPrimaria = lente === 'autoavaliacao' ? secoes.autoavaliacao : secoes.colegas;
  const rowsPrimaria = lente === 'autoavaliacao' ? rowsAuto : rowsHetero;

  // ---- Ranking — só existe com base em colegas/liderança (ver cabeçalho do arquivo:
  // autoavaliação sempre dá n=1 avaliador, o que esvaziaria o Top/Bottom por definição).
  // Fica `null` quando a lente é só autoavaliação; a tela esconde o card nesse caso. ----
  let ranking = null;
  if (lente !== 'autoavaliacao') {
    // Agrupado por avaliado uma vez só — sem isso, cada candidato escaneava `rows`
    // inteiro de novo (ver `agruparPor_` acima). Usa `rows` (não rowsHetero/rowsAuto),
    // porque o Ranking precisa das duas — auto e hetero — pra montar o gap.
    const porAvaliadoGeral = agruparPor_(rows, 6); // G = avaliado
    const candidatos = membros.filter(m => m.status === 'Ativo' && lista.some(ent => membroBateEntidade(m, ent)));
    const rankingCompleto = candidatos.map(m => {
      let linhasPessoa = porAvaliadoGeral.get(m.nome) || [];
      if (periodoVisaoGeral) linhasPessoa = linhasPessoa.filter(r => normalizarTexto_(r[1]) === periodoVisaoGeral);
      const auto = linhasPessoa.filter(r => normalizarTexto_(r[10]) === 'Sim');
      const hetero = linhasPessoa.filter(r => normalizarTexto_(r[10]) === 'Não');
      const notaAuto = media(auto.map(r => r[9]));
      const notaHetero = media(hetero.map(r => r[9]));
      const nHetero = contarAvaliadoresUnicos_(hetero);
      const notaEstabilizadaHetero = mediaEncolhida_(media_(hetero.map(r => Number(r[9]))), nHetero, mediaGeralColegas, cfg.parametros.forcaEncolhimento);
      const gapConfiavel = auto.length >= cfg.parametros.minAvaliacoesGap && nHetero >= cfg.parametros.minAvaliacoesGap;
      const gap = gapConfiavel ? Math.round((notaHetero - notaAuto) * 100) / 100 : null;
      return {
        nome: m.nome, nota: notaHetero, notaAutoavaliacao: notaAuto, notaEstabilizada: notaEstabilizadaHetero,
        nAvaliacoes: hetero.length, nAvaliadores: nHetero, gap: gap,
      };
    }).filter(x => x.nota !== null);

    const rankingConfiavel = rankingCompleto.filter(x => x.nAvaliadores >= cfg.parametros.minAvaliacoesRanking);
    const top5 = [...rankingConfiavel].sort((a, b) => b.nota - a.nota).slice(0, cfg.parametros.tamanhoRanking);
    const bottom5 = [...rankingConfiavel].sort((a, b) => a.nota - b.nota).slice(0, cfg.parametros.tamanhoRanking);
    const maioresGaps = [...rankingCompleto].filter(x => x.gap !== null)
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)).slice(0, cfg.parametros.tamanhoRanking);
    ranking = { top5, bottom5, maioresGaps };
  }
  logEtapa_('ranking');

  // ---- Notas fora do padrão: segue a mesma "base primária" das quedas (ver acima). ----
  const rowsOutlier = periodoVisaoGeral ? rowsPrimaria.filter(r => normalizarTexto_(r[1]) === periodoVisaoGeral) : rowsPrimaria;
  const outliers = detectarNotasForaDoPadrao_(rowsOutlier, cfg.parametros.minNotasOutlier, cfg.parametros.zOutlier);

  // ---- Quedas entre os 2 últimos períodos com dado — olha a evolução da base primária. ----
  const quedas = [];
  lista.forEach((ent, i) => {
    const q = detectarQuedaEntrePeriodos_(baseSecPrimaria.evolucao, 's' + i, cfg.parametros.quedaAlertaPontos);
    if (q) quedas.push(Object.assign({ label: ent.label }, q));
  });
  const quedaGeral = detectarQuedaEntrePeriodos_(baseSecPrimaria.evolucao, 'geral', cfg.parametros.quedaAlertaPontos);
  if (quedaGeral) quedas.push(Object.assign({ label: 'Equipe (geral)' }, quedaGeral));
  logEtapa_('outliers + quedas');

  Logger.log('[getPainelDados] TOTAL: ' + (Date.now() - t0_) + 'ms');
  Logger.log('[getPainelDados] normalizarTexto_ caiu no branch de Date ' + _contadorNormalizarData_ +
    ' vezes, chamou Utilities.formatDate() ' + _contadorFormatDate_ + ' vezes (' +
    (_cacheDataFormatada_ ? _cacheDataFormatada_.size : 0) + ' valores distintos de data) — diagnóstico temporário, ver Utils.gs::normalizarTexto_');
  return {
    labels: lista.map(e => e.label),
    lente,
    secoes,
    ranking,
    outliers, quedas,
    parametros: cfg.parametros,
  };
}
