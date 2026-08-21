# Testes

> Licença: [PolyForm Noncommercial 1.0.0](LICENSE) · Autoria: **N Denominado**

## Como rodar

```
npm install
npm test
```

Isso não precisa de conta Google nem de planilha nenhuma — os testes rodam
inteiramente no seu computador, contra os arquivos reais de
`apps-file-data/`, sem alterar nada neles.

## Por que isso existe

Google Apps Script não roda fora do Google, então não existe um "pytest do
Apps Script". O jeito reconhecido de testar (usado pelo `clasp`, a
ferramenta oficial de linha de comando do Google para Apps Script — ver
[developers.google.com/apps-script/guides/clasp](https://developers.google.com/apps-script/guides/clasp))
é: manter os arquivos `.gs`/`.html` como código Node comum por fora, com
`npm test` rodando a suíte, e simular (mockar) os serviços do Google
(`SpreadsheetApp`, `CacheService`, etc.) — em vez de precisar de uma
planilha real pra cada teste. É exatamente isso que `tests/gas-mock.js`
faz: os arquivos `.gs` em `apps-file-data/` são carregados **sem
alteração nenhuma**, dentro de um ambiente isolado do Node, com esses
serviços fingidos por baixo.

## O que cada arquivo verifica

| Arquivo | Nível | O que confere |
|---|---|---|
| `tests/unitario.test.js` | Unitário | Funções de `Estatisticas.gs` isoladas — cada caso tem o valor esperado calculado à mão, fora do código |
| `tests/templates.test.js` | Integração | O HTML do Painel processa certo (scriptlets resolvidos, tags fechadas) |
| `tests/integracao.test.js` | Integração | O fluxo completo — respostas → `executarTransformacao_()` → `getPainelDados()` — com números conferidos manualmente |
| `tests/sistema.test.js` | Sistema | A tela renderiza de verdade num DOM (jsdom), incluindo clique em lente/aba disparando uma chamada real ao servidor simulado |

Essa divisão (unitário → integração → sistema) é a mesma que
`NOTAS-TECNICAS.md` documenta em detalhe, requisito por requisito (RF1 a
RF14) — este arquivo não repete aquele conteúdo, só mostra como rodar e
onde cada peça mora.

## O princípio por trás: teste nasce do requisito, não do código

Um teste que só confirma "o código faz o que o código faz" não pega bug de
lógica — só pega erro de digitação. Por isso, cada caso em
`unitario.test.js` calcula o valor esperado **fora** da função, a partir da
regra descrita (não rodando o código uma vez e copiando o que saiu).
Exemplo real, direto do arquivo:

```js
// "Durão" avalia 4 pessoas com notas 3, 2, 4, e 5; "Bonzinho" avalia 4
// pessoas com notas 9, 10, 8, e 5 — a última nota (5) é pro MESMO alvo dos
// dois. Média geral = 46/8 = 5.75. Viés Durão = média(3,2,4,5) − 5.75 =
// −2.25. Nota ajustada do alvo comum: Durão → 5 − (−2.25) = 7.25.
assert.strictEqual(ctx.notaAjustada_(5, 'Durão', vies), 7.25);
```

O `7.25` não veio de rodar a função e ver o que aparecia — veio da fórmula
descrita no requisito (RF6), calculada à parte. Se um dia alguém mudar a
fórmula sem querer, o teste quebra porque o valor esperado continua fiel
ao requisito, não ao código.

## Aplicando essa ideia em outro projeto

O padrão geral, fora do contexto de Apps Script:

1. **Isole a lógica de decisão da plataforma.** Aqui isso já existia por
   desenho: `Estatisticas.gs` só calcula, nunca lê/escreve planilha — por
   isso dá pra testar sem precisar simular o Google Sheets inteiro.
2. **Pergunte "eu tenho ferramenta pra isso?" antes de "como eu faço
   isso?"** Em Python a resposta era óbvia (`pytest`). Aqui não havia uma
   ferramenta pronta — o que existe é um padrão (mockar o ambiente, rodar
   o código real por cima) documentado pela própria plataforma, não uma
   biblioteca de teste dedicada.
3. **Todo teste começa pela pergunta "qual é a regra?", nunca por "o que o
   código faz?"** Se a resposta só existe olhando o código, ainda não é um
   teste — é um espelho.
