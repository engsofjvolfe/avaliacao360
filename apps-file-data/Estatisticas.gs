/**
 * Estatisticas.gs
 * ---------------------------------------------------------------------------
 * Cálculos estatísticos que vão além da média simples: viés de quem avalia,
 * notas isoladas fora do padrão, e queda entre períodos. `Painel.gs` monta
 * as seções da tela e decide o que mostrar; este arquivo só faz conta —
 * nada aqui lê ou escreve em nenhuma aba diretamente.
 *
 * Todas as funções recebem linhas de "Dados Tratados" já filtradas por quem
 * chama (mesmo formato usado em Painel.gs): índice 1=período, 2=avaliador,
 * 6=avaliado, 8=critério, 9=nota.
 * ---------------------------------------------------------------------------
 */

function media_(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

/**
 * Conta quantos AVALIADORES DISTINTOS aparecem num conjunto de linhas — não
 * confundir com o número de linhas em si. Uma pessoa avaliada por 1 colega
 * só, em 7 critérios, gera 7 linhas mas `contarAvaliadoresUnicos_` = 1; isso
 * é o número que importa pra saber se uma média reflete a opinião de várias
 * pessoas ou de uma só (ver PARAM_PADRAO/`minAvaliacoesRanking` em Config.gs).
 */
function contarAvaliadoresUnicos_(rows) {
  return new Set(rows.map(r => normalizarTexto_(r[2]))).size;
}

/**
 * Mesma mecânica de `contarAvaliadoresUnicos_`, só com nome claro pro
 * contexto de "Registro de Respondentes" (onde a coluna 2 também é Nome,
 * por coincidência de layout) — usada em `Participacao.gs`. Existe como
 * função separada, não porque a conta seja diferente, mas porque "quantos
 * AVALIADORES distintos" e "quantos RESPONDENTES distintos" são perguntas
 * conceitualmente diferentes, mesmo com a mesma fórmula por baixo.
 */
function contarRespondentesUnicos_(rows) {
  return contarAvaliadoresUnicos_(rows);
}

/**
 * 1 valor por AVALIADOR DISTINTO (a média das notas que ele deu, dentro do
 * recorte já filtrado por quem chama) — não confundir com o array de notas
 * cru. Serve pra montar um histograma "por avaliador" em vez de "por nota":
 * sem isso, um avaliador que preencheu 6 critérios pesa 6x mais que um que
 * preencheu 1 só, inflando artificialmente a leitura de "quantas pessoas
 * pensam algo" (mesmo raciocínio de `contarAvaliadoresUnicos_`, aplicado a
 * um valor por pessoa em vez de uma contagem).
 */
function mediasPorAvaliador_(rows) {
  const porAvaliador = {};
  rows.forEach(r => {
    const nome = normalizarTexto_(r[2]);
    (porAvaliador[nome] = porAvaliador[nome] || []).push(Number(r[9]));
  });
  return Object.keys(porAvaliador).map(nome => media_(porAvaliador[nome]));
}

function arredondar_(n, casas) {
  if (n === null || n === undefined) return null;
  const f = Math.pow(10, casas || 2);
  return Math.round(n * f) / f;
}

/** Desvio-padrão amostral. Precisa de pelo menos 2 valores pra fazer sentido. */
function desvioPadrao_(arr, mediaArr) {
  if (arr.length < 2) return null;
  const m = mediaArr !== undefined ? mediaArr : media_(arr);
  const variancia = arr.reduce((soma, v) => soma + Math.pow(v - m, 2), 0) / (arr.length - 1);
  return Math.sqrt(variancia);
}

/**
 * Viés de cada avaliador: o quanto a média de notas QUE ELE DÁ se afasta da
 * média geral de todo mundo. Avaliador "durão" = viés negativo (nota
 * sistematicamente mais baixa); "bonzinho" = viés positivo. Calculado sobre
 * TODAS as linhas recebidas (sem filtro de período) — é sobre o padrão geral
 * de quem avalia, não sobre um recorte específico.
 */
function calcularViesAvaliadores_(rows) {
  const mediaGeral = media_(rows.map(r => Number(r[9])));
  const porAvaliador = {};
  rows.forEach(r => {
    const nome = normalizarTexto_(r[2]);
    (porAvaliador[nome] = porAvaliador[nome] || []).push(Number(r[9]));
  });
  const vies = {};
  Object.keys(porAvaliador).forEach(nome => {
    vies[nome] = media_(porAvaliador[nome]) - mediaGeral;
  });
  return vies;
}

/** Nota "crua" menos o viés de quem avaliou — tenta remover o efeito de avaliador durão/bonzinho. */
function notaAjustada_(nota, avaliador, viesPorAvaliador) {
  const v = viesPorAvaliador[normalizarTexto_(avaliador)] || 0;
  return Number(nota) - v;
}

/**
 * Erro padrão da média — o quanto uma média típica costuma oscilar por
 * causa do tamanho da amostra. `n` aqui é sempre Nº DE AVALIADORES
 * DISTINTOS (não Nº de notas): notas do mesmo avaliador não são
 * observações independentes (a mesma pessoa avaliando 7 critérios tende a
 * ter uma opinião geral, não 7 opiniões soltas), então contar notas
 * inflaria a confiança artificialmente. Precisa de `n >= 2` pra fazer
 * sentido (com 1 avaliador só não existe "oscilação" a medir).
 */
function erroPadrao_(desvioPadrao, n) {
  if (!desvioPadrao || !n || n < 2) return null;
  return desvioPadrao / Math.sqrt(n);
}

/**
 * Intervalo de confiança aproximado: média ± z × erro padrão, arredondado e
 * limitado à escala de notas do formulário (`notaMin`/`notaMax` — ver
 * `PARAM_PADRAO.notaMinima`/`notaMaxima` em Config.gs; o intervalo não faz
 * sentido fora da escala em uso). `z=2` (o padrão) é uma aproximação de ~95%
 * de confiança — o mesmo "2 desvios-padrão" já usado em
 * `detectarNotasForaDoPadrao_`, de propósito, pra manter só uma régua mental
 * no sistema inteiro em vez de duas.
 */
function intervaloConfianca_(media, desvioPadrao, n, z, notaMin, notaMax) {
  const ep = erroPadrao_(desvioPadrao, n);
  if (media === null || ep === null) return null;
  const margem = z * ep;
  return {
    inferior: arredondar_(Math.max(notaMin, media - margem), 2),
    superior: arredondar_(Math.min(notaMax, media + margem), 2),
  };
}

/**
 * "Encolhe" a média de um grupo pequeno em direção à média geral do time,
 * proporcional a quão pouco dado o grupo tem — a mesma ideia usada em notas
 * de produto/filme (ex.: a "nota ponderada" do IMDB), pra que um grupo de 2
 * pessoas com uma média de sorte (ex.: 9.5, vindo de pouquíssima nota) não
 * pese igual a um grupo de 12 pessoas com a mesma média — sustentada por
 * muito mais gente.
 *
 * `forca` = quantas "notas fictícias iguais à média geral" somar de peso.
 * Quanto maior `forca`, mais um grupo pequeno é puxado pra média geral;
 * grupos com `n` muito maior que `forca` quase não mudam. `n` é sempre Nº
 * DE AVALIADORES DISTINTOS, pelo mesmo motivo de `erroPadrao_`.
 */
function mediaEncolhida_(mediaGrupo, n, mediaGeral, forca) {
  if (mediaGrupo === null || mediaGeral === null) return null;
  if (!forca) return arredondar_(mediaGrupo, 2);
  return arredondar_((n * mediaGrupo + forca * mediaGeral) / (n + forca), 2);
}

/** Mediana de um array de números (não modifica o original). Array vazio -> null. */
function mediana_(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const meio = Math.floor(s.length / 2);
  return s.length % 2 ? s[meio] : (s[meio - 1] + s[meio]) / 2;
}

/**
 * Os 5 números que resumem a forma de uma distribuição (mínimo, quartil 1,
 * mediana, quartil 3, máximo) — a base de um "box plot". Quartis calculados
 * pelo método das "dobras de Tukey" (mediana das metades de baixo/cima),
 * escolhido por ser simples de explicar em vez do mais preciso possível:
 * Q1 = mediana da metade inferior, Q3 = mediana da metade superior.
 * Devolve null se o array tiver menos de 4 valores (com menos que isso,
 * "quartil" não separa nada de verdade).
 */
function quartis_(arr) {
  if (arr.length < 4) return null;
  const s = [...arr].sort((a, b) => a - b);
  const meio = Math.floor(s.length / 2);
  const metadeBaixo = s.slice(0, meio);
  const metadeCima = s.length % 2 ? s.slice(meio + 1) : s.slice(meio);
  return {
    min: s[0],
    q1: arredondar_(mediana_(metadeBaixo), 2),
    mediana: arredondar_(mediana_(s), 2),
    q3: arredondar_(mediana_(metadeCima), 2),
    max: s[s.length - 1],
  };
}

/**
 * Divide a escala de notas em uso (`notaMin`–`notaMax`, ver
 * `PARAM_PADRAO.notaMinima`/`notaMaxima` em Config.gs) em `qtdFaixas` pedaços
 * iguais — a base de um histograma. Nada aqui pressupõe escala 0–10: se a EJ
 * usar outra escala, as faixas (e os rótulos) se ajustam sozinhas.
 */
function gerarFaixasHistograma_(notaMin, notaMax, qtdFaixas) {
  const largura = (notaMax - notaMin) / qtdFaixas;
  const faixas = [];
  for (let i = 0; i < qtdFaixas; i++) {
    const de = arredondar_(notaMin + i * largura, 1);
    const ate = arredondar_(notaMin + (i + 1) * largura, 1);
    faixas.push({ label: de + '–' + ate, de, ate });
  }
  return faixas;
}

/** Conta quantas notas caem em cada faixa gerada por `gerarFaixasHistograma_`. */
function histograma_(notas, faixas) {
  const notaMin = faixas[0].de, notaMax = faixas[faixas.length - 1].ate;
  const contagem = new Array(faixas.length).fill(0);
  notas.forEach(nRaw => {
    const n = Math.min(notaMax, Math.max(notaMin, Number(nRaw)));
    let idx = faixas.length - 1; // cai aqui se não bater em nenhuma faixa "[de, ate)" — cobre o valor máximo exato
    for (let i = 0; i < faixas.length; i++) {
      if (n >= faixas[i].de && n < faixas[i].ate) { idx = i; break; }
    }
    contagem[idx]++;
  });
  return contagem;
}

/**
 * Notas isoladas muito fora do padrão de quem avaliou — possível sinal de
 * algo pontual (mal-entendido, retaliação, engano) que vale a pena conferir,
 * em vez de só diluir na média. Só considera avaliadores com pelo menos
 * `minNotas` notas dadas no recorte (senão o desvio-padrão não tem nenhuma
 * confiança — 2 ou 3 notas não definem um "padrão").
 */
function detectarNotasForaDoPadrao_(rows, minNotas, zMinimo) {
  const porAvaliador = {};
  rows.forEach(r => {
    const nome = normalizarTexto_(r[2]);
    (porAvaliador[nome] = porAvaliador[nome] || []).push(r);
  });
  const achados = [];
  Object.keys(porAvaliador).forEach(nome => {
    const linhas = porAvaliador[nome];
    if (linhas.length < minNotas) return;
    const notas = linhas.map(r => Number(r[9]));
    const m = media_(notas);
    const dp = desvioPadrao_(notas, m);
    if (!dp) return;
    linhas.forEach(r => {
      const z = (Number(r[9]) - m) / dp;
      if (Math.abs(z) >= zMinimo) {
        achados.push({
          avaliador: nome,
          avaliado: normalizarTexto_(r[6]),
          criterio: normalizarTexto_(r[8]),
          periodo: normalizarTexto_(r[1]),
          nota: Number(r[9]),
          mediaAvaliador: arredondar_(m, 2),
          z: arredondar_(z, 2),
        });
      }
    });
  });
  return achados.sort((a, b) => Math.abs(b.z) - Math.abs(a.z));
}

/**
 * Compara os 2 últimos pontos com dado de uma série de evolução (já vem uma
 * linha por período cadastrado, com `null` nos períodos sem dado) e devolve
 * um alerta se a queda entre eles for maior que `quedaMinima` pontos.
 * Devolve null se não houver dado suficiente ou a queda não for grande o
 * bastante — ninguém precisa reparar isso visualmente no gráfico.
 */
function detectarQuedaEntrePeriodos_(evolucao, chaveSerie, quedaMinima) {
  const comValor = evolucao.filter(p => p[chaveSerie] !== null && p[chaveSerie] !== undefined);
  if (comValor.length < 2) return null;
  const ultimo = comValor[comValor.length - 1];
  const anterior = comValor[comValor.length - 2];
  const delta = arredondar_(ultimo[chaveSerie] - anterior[chaveSerie], 2);
  if (delta > -quedaMinima) return null;
  return {
    periodoAnterior: anterior.periodo, periodoAtual: ultimo.periodo,
    valorAnterior: anterior[chaveSerie], valorAtual: ultimo[chaveSerie], delta,
  };
}
