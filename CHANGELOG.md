# Changelog

> Licença: [PolyForm Noncommercial 1.0.0](LICENSE) · Autoria: **N Denominado**

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [1.0.0] — 2026-08-21

Primeira versão versionada do projeto — pré-modularização de código (todo
o código-fonte ainda vive em `apps-file-data/` como arquivos `.gs`/`.html`
soltos, no formato que o Google Apps Script exige, sem um processo de
build/módulos por cima).

### Adicionado

- **Painel interativo** (dentro do Google Sheets): comparação livre entre
  Pessoa, Setor, Cargo e Equipe inteira, qualquer combinação, com período
  independente por item.
- **Três lentes de leitura** — Colegas/Liderança, Autoavaliação, ou as
  duas juntas — aplicadas de forma consistente a Resumo, Evolução, Radar,
  Distribuição, Dispersão e Todos os setores/cargos.
- **Correções estatísticas de confiabilidade**: nota ajustada (desconta
  viés de quem avalia), nota estabilizada (encolhimento em direção à
  média geral para grupos pequenos), intervalo de confiança, e proteção
  de anonimato para grupos abaixo de um tamanho mínimo configurável.
- **Detecção automática** de notas fora do padrão e de quedas de nota
  entre períodos.
- **Aba de Participação**, independente da qualidade das notas: taxa de
  resposta geral/por setor/por cargo, evolução, queda de participação, e
  lista de quem ainda não respondeu.
- **Filtro de Setor** e **Tipo "Equipe inteira"** no construtor de itens
  do Painel.
- **Atualização automática** opcional via gatilho `onFormSubmit`.
- Toda política ajustável (limiares de amostra, escala de notas, tamanho
  do histograma, etc.) vive em células de planilha — nada fixo no código.
- Documentação: guia de uso (`docs/LEIA-ME.md`) e guia de instalação
  (`docs/INSTALACAO.md`).
- Licença **PolyForm Noncommercial 1.0.0**.

### Notas de desempenho desta versão

Passou por uma rodada de otimização real (não especulativa) apoiada em
medições do log de Execuções do Apps Script: leitura da Config em lote
(1 chamada em vez de até 24), cache de configuração, agrupamento prévio
para evitar varreduras repetidas, e correção de duas causas escondidas de
lentidão — chamadas de `Session`/`Utilities` redundantes disparadas por
uma célula de Período mal-interpretada como data pelo Google Sheets no
momento da escrita.
