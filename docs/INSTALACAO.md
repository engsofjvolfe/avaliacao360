# Instalação — Avaliação 360

> Licença: [PolyForm Noncommercial 1.0.0](../LICENSE) · Autoria: **N Denominado**

Este guia é só para quem está **montando o sistema pela primeira vez**
(normalmente uma pessoa só, uma vez só). Depois de pronto, ninguém mais
precisa voltar aqui — o dia a dia de usar o sistema está todo no
`LEIA-ME.md`, que não tem nada de código.

Se você é quem vai só usar o sistema depois de pronto (preencher a lista de
integrantes, abrir o Painel, etc.), pode ignorar este arquivo inteiro e ir
direto pro `LEIA-ME.md`.

---

## 1. Antes de instalar

- **A planilha precisa ser do Google Sheets de verdade**, não um arquivo
  Excel só "aberto para visualização". Se você recebeu um arquivo `.xlsx`,
  suba ele no Google Drive, clique com o botão direito nele e escolha
  **Abrir com → Google Planilhas**.
- **A planilha precisa estar ligada ao formulário do Google Forms.** No
  Forms, vá em Respostas → clique no ícone verde do Sheets → escolha esta
  planilha. Sem isso, as respostas nunca chegam na planilha.
- **Você precisa poder editar a planilha**, não só visualizar.
- **Use o Google Chrome**, de preferência logado com uma conta só (mais de
  uma conta Google aberta ao mesmo tempo pode dar problema no próximo
  passo — se der, tente numa janela anônima).

---

## 2. Colando os arquivos

O sistema é feito de vários arquivos de código que vão dentro da própria
planilha, num editor chamado "Apps Script" (é uma ferramenta que já vem
junto do Google Sheets, escondida num menu). Os arquivos estão na pasta
`apps-file-data` deste pacote.

1. Na planilha, clique em **Extensões → Apps Script**.
2. Vai abrir um arquivo `Code.gs` com um texto pronto dentro. Apague tudo.
3. Crie 12 arquivos e cole o conteúdo correspondente em cada um (a ordem
   não importa):
   - Para os que terminam em `.gs`: clique no **+** ao lado de "Arquivos" →
     **Script**, dê o nome do arquivo (sem o `.gs`) e cole o conteúdo.
   - Para os que terminam em `.html`: clique no **+** → **HTML**, mesmo
     processo.
4. Nomes exatos que cada arquivo precisa ter:

   **Script:** `Config`, `Utils`, `Estatisticas`, `DataTransform`, `Menu`,
   `Triggers`, `Painel`, `Participacao`

   **HTML:** `EstilosComuns`, `PainelDialog`, `PainelEstilos`,
   `PainelScript`

   Precisa ser idêntico (sem acento errado, sem espaço a mais).
5. Salve tudo (`Ctrl+S`).
6. Volte pra planilha e aperte `F5`.
7. Um menu novo **"Avaliação 360"** deve aparecer do lado de "Ajuda". Se
   aparecer, deu certo.

Por que 12 arquivos em vez de 1 só: é só organização — cada um cuida de uma
parte (cores da tela, cálculos, menu, etc.), em vez de tudo misturado num
arquivo gigante. O detalhamento técnico de como cada arquivo se conecta
está em `NOTAS-TECNICAS.md`.

> Existe uma pasta `descontinuado/` dentro de `apps-file-data` com a antiga
> Barra Lateral (`Sidebar`, `SidebarLogic`, etc.) — não faz parte da
> instalação atual, ficou só arquivada. Veja `NOTAS-TECNICAS.md` se quiser
> entender por quê.

### Primeira autorização

Na primeira vez que alguém clicar em qualquer coisa do menu "Avaliação
360", o Google pergunta se autoriza o script a mexer na planilha — normal,
mesma pergunta que qualquer script próprio faz na primeira vez. Pode
aparecer um aviso de "o Google não verificou este app": também normal.
Clique em **Avançado** → **Acessar (nome do projeto), não seguro**. Só
pergunta isso uma vez.

---

## 3. Primeiro uso

1. Confira se já existe pelo menos uma resposta na aba "Respostas do
   Formulário 1" (pode ser uma resposta de teste sua).
2. Menu **Avaliação 360 → Atualizar Dados**.
3. Se aparecer algum aviso na mensagem de resultado, tudo bem — a maioria é
   informativa, não erro (a lista completa de avisos possíveis está no
   `LEIA-ME.md`, seção de problemas comuns).
4. Menu **Avaliação 360 → Abrir Painel**. Os números já devem aparecer.
5. Preencha a lista de integrantes na aba Config (nome, setor, cargo,
   status) se ainda não estiver preenchida — isso está explicado com
   detalhe no `LEIA-ME.md`, não precisa de código nenhum, é só preencher
   células.

A partir daqui, entregue o `LEIA-ME.md` pra quem for usar o sistema no dia
a dia — não precisam saber nada do que está neste arquivo.

---

## 4. Bloqueando e escondendo abas (recomendado)

Várias abas da planilha são preenchidas só pelos scripts (fórmulas ou dados
gerados automaticamente) — se alguém digitar por cima delas por engano, os
números ficam errados até você perceber. O Google Sheets deixa **proteger**
(bloqueia edição, mas a aba continua visível) e **ocultar** (some da lista
de abas) cada aba ou até só um pedaço dela. Isso é opcional — o sistema
funciona igual sem nada disso — mas evita dor de cabeça.

**Proteger uma aba não trava os scripts.** Bloquear impede que *outras
pessoas* editem por engano — o "Atualizar Dados" e a atualização automática
continuam escrevendo normalmente, porque rodam com a sua autorização (de
quem instalou o sistema), e o dono da proteção sempre pode editar mesmo com
ela ativa.

### O que recomendamos em cada aba

| Aba | Recomendação | Por quê |
|---|---|---|
| Config | Proteger só as colunas A-C (Setores) e a coluna N (log da automação). Deixar livres: E-H (Membros), coluna dos Períodos, e P-Q (Parâmetros) | Só essas partes livres são as que o dia a dia realmente precisa editar (ver `LEIA-ME.md`) |
| Respostas do Formulário 1 | Proteger a aba inteira | Só o Forms deveria escrever aqui |
| Registro de Respondentes | Proteger e ocultar | Gerada 100% pelo script; ninguém precisa abrir no dia a dia |
| Dados Tratados | Proteger, sem ocultar | Gerada pelo script, mas pode servir de base pra uma Tabela Dinâmica avançada |
| Resumo Individual, Resumo Setor, Dashboard, Alertas | **Ocultar** (não precisa proteger) | Painel antigo, substituído pelo Painel atual — ver `NOTAS-TECNICAS.md`. Fica ocultada em vez de excluída, pra dar pra reverter se algo inesperado depender delas |

### Como proteger uma aba inteira

1. Clique com o botão direito no nome da aba (lá embaixo) → **Proteger planilha**.
2. Escolha "Planilha inteira".
3. Clique em **Definir permissões**, escolha quem pode editar (normalmente só você), **Concluído**.

### Como proteger só um pedaço da aba (ex.: colunas A-C da Config)

1. Selecione o intervalo de células que quer travar.
2. **Dados → Planilhas e intervalos protegidos** → **+ Adicionar uma planilha ou intervalo**.
3. Confira o intervalo, clique em **Definir permissões**, escolha quem pode editar, **Concluído**.
4. Repita pra cada pedaço que quiser proteger.

Pra deixar quase tudo protegido e liberar só 1 ou 2 células soltas (caso do
Resumo Individual/Setor/Dashboard), o mesmo caminho funciona: proteja a
aba inteira e, na tela de permissões, use a opção de **exceto certas
células** pra apontar quais ficam livres.

### Como ocultar uma aba

Clique com o botão direito no nome da aba → **Ocultar planilha**.

### Como reexibir uma aba escondida

Clique na setinha pequena perto da lista de abas (canto inferior esquerdo)
→ escolha o nome da aba.

### Como desfazer uma proteção

**Dados → Planilhas e intervalos protegidos** → clique no item que quer
remover → ícone da lixeira.

---

## 5. Problemas específicos de instalação

**Extensões → Apps Script não abre, ou dá erro ao abrir.**
Normalmente é mais de uma conta Google logada ao mesmo tempo no navegador.
Tente numa janela anônima, logado só com a conta certa.

**Erro citando "intervalo nomeado" ao abrir o Painel.**
Vá em **Dados → Intervalos nomeados** na planilha e confira se o nome
citado no erro existe. Esses intervalos já vêm prontos no modelo original
— só costuma faltar se a aba Config foi criada do zero, sem partir do
modelo pronto.

**Preciso mudar o texto de um critério (ex.: renomear "ENGAJAMENTO"), ou
mudar de forma muito grande as perguntas fixas do formulário (nome, setor,
período).**
Isso exige editar código (`Config.gs`) — não é uma tarefa pra fazer sem
saber programar. Peça ajuda técnica, ou volte aqui e me chame de novo.

Detalhes técnicos mais profundos (como cada arquivo funciona por dentro,
decisões de arquitetura) estão em `NOTAS-TECNICAS.md`.
