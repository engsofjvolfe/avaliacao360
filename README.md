# Avaliação 360

[![Testes](https://github.com/engsofjvolfe/avaliacao360/actions/workflows/tests.yml/badge.svg)](.github/workflows/tests.yml)
[![Licença](https://img.shields.io/badge/licença-PolyForm%20Noncommercial%201.0.0-blue.svg)](LICENSE)
[![Versão](https://img.shields.io/badge/versão-1.0.1-informational.svg)](CHANGELOG.md)
[![Plataforma](https://img.shields.io/badge/plataforma-Google%20Apps%20Script-4285F4.svg)](docs/INSTALACAO.md)
[![Linguagem](https://img.shields.io/badge/linguagem-JavaScript%20%28Apps%20Script%29-F7DF1E.svg)](apps-file-data/)

> Licença: [PolyForm Noncommercial 1.0.0](LICENSE) · Autoria: **N Denominado**

Sistema de Avaliação 360 — avaliação entre pares, liderança e
autoavaliação — para qualquer organização estruturada em setores, cargos e
períodos (empresas juniores, ONGs, times internos, etc.). Roda inteiro
dentro do Google Sheets/Google Forms via Google Apps Script: ingere
respostas do formulário, organiza os dados sozinho, e mostra notas/
gráficos/comparações num painel interativo. Nada de nomes, setores ou
cargos fica fixo no código — tudo vem de células de planilha (ver
`docs/INSTALACAO.md`), então o mesmo projeto serve pra qualquer
organização com essa estrutura, não só a que o gerou originalmente.

## Estrutura do projeto

| Pasta/arquivo | O que tem |
|---|---|
| [`docs/`](docs/) | Toda a documentação narrativa (veja a tabela abaixo) |
| [`apps-file-data/`](apps-file-data/) | Código-fonte — os arquivos `.gs`/`.html` que vão no Apps Script |
| [`tests/`](tests/) | Suíte de testes local (Node.js) — ver [TESTES.md](TESTES.md) |
| [`planilhas/`](planilhas/) | Planilha modelo (`.xlsx`), estrutura pronta sem dado nenhum preenchido |

## Onde começar

| Documento | Pra quem |
|---|---|
| [docs/LEIA-ME.md](docs/LEIA-ME.md) | Quem usa o sistema no dia a dia (RH, liderança, qualquer integrante) — sem código |
| [docs/INSTALACAO.md](docs/INSTALACAO.md) | Quem configura o sistema na planilha, uma vez |
| [TESTES.md](TESTES.md) | Quem programa/mantém — como rodar a suíte de testes local |
| [CHANGELOG.md](CHANGELOG.md) | O que mudou em cada versão |

Notas técnicas de arquitetura e o histórico de arquivos alterados por
rodada existem localmente pra quem mantém este projeto, mas não fazem
parte deste repositório público.

## Licença

Este projeto é distribuído sob a **PolyForm Noncommercial License 1.0.0**
— veja o arquivo [LICENSE](LICENSE) para o texto completo. Em resumo:
qualquer pessoa pode usar, copiar, modificar e redistribuir este código
livremente para fins **não comerciais** (uso pessoal, organizações sem
fins lucrativos, instituições de ensino/pesquisa, e qualquer propósito
não comercial em geral — ver a seção "Noncommercial Purposes" da
licença), contanto que mantenha o aviso de autoria original. Uso ou venda
**comercial** exige autorização direta do autor (**N Denominado**) — como
titular dos direitos, o autor não está sujeito a essa restrição.
