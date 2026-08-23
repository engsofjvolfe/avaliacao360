# Avaliação 360

> Licença: [PolyForm Noncommercial 1.0.0](../LICENSE) · Autoria: **N Denominado**

Este guia ensina a usar o sistema já pronto, no dia a dia — não fala de
código nem de como o sistema foi montado por dentro (isso está em outros
documentos, pra quem for mexer na instalação). Se você só vai preencher a
lista de integrantes e olhar o Painel, este documento é só o que você
precisa.

**Este guia não espera que você já saiba ler gráfico nenhum.** Toda vez
que um gráfico ou uma tabela nova aparece, o texto explica primeiro **o
que é aquilo**, depois **como olhar pra ele** passo a passo, e por fim dá
um **exemplo bem concreto**, com números pequenos e fáceis de acompanhar
na cabeça. Nenhuma palavra estranha aparece sem explicação — se você
esbarrar em algum termo que não lembra o que significa, use o índice
abaixo pra voltar na seção onde ele foi explicado pela primeira vez.

## Índice

- [Antes de começar](#antes-de-começar)
- [1. Como ler um gráfico, do zero](#1-como-ler-um-gráfico-do-zero)
- [2. Abrindo o Painel](#2-abrindo-o-painel)
- [3. Montando uma comparação](#3-montando-uma-comparação)
- [4. Escolhendo a base das notas (a "lente")](#4-escolhendo-a-base-das-notas-a-lente)
- [5. O que você vê na tela, de cima a baixo](#5-o-que-você-vê-na-tela-de-cima-a-baixo)
- [6. Nota ajustada, nota estabilizada, e o quanto dá pra confiar num número](#6-nota-ajustada-nota-estabilizada-e-o-quanto-dá-pra-confiar-num-número)
- [7. A aba "Participação"](#7-a-aba-participação)
- [8. Cadastrando e removendo pessoas](#8-cadastrando-e-removendo-pessoas)
- [9. Deixando automático (opcional)](#9-deixando-automático-opcional)
- [10. Editando o formulário](#10-editando-o-formulário)
- [11. Perguntas e problemas comuns](#11-perguntas-e-problemas-comuns)
- [12. Outras formas de usar](#12-outras-formas-de-usar)

---

## Antes de começar

### Palavras que este guia usa o tempo todo

Antes de entrar nos gráficos, um dicionário rápido — pra nunca precisar
parar no meio de uma frase se perguntando "o que é isso mesmo?":

- **Nota** — um número, de 0 a 10 (ou outra escala, se a sua organização
  configurou diferente), que alguém deu pra outra pessoa (ou pra si
  mesma) num critério específico, tipo "Comunicação" ou "Organização".
- **Critério** — cada uma dessas "categorias" avaliadas. "Engajamento" é
  um critério; "Comunicação" é outro. O formulário tem vários.
- **Setor** — o time/área da organização a que alguém pertence (ex.:
  "Comercial", "Marketing").
- **Cargo** — a função que alguém ocupa (ex.: "Consultor(a)",
  "Presidente"), separado de setor — dá pra ter o mesmo cargo em setores
  diferentes.
- **Período** — a "rodada" da avaliação (ex.: "2026.1" é o primeiro
  semestre de 2026, "2026.2" o segundo). Cada resposta do formulário
  pertence a um período.
- **Colegas/liderança** — as notas que **outras pessoas** deram pra
  alguém (diferente da nota que a própria pessoa deu pra si mesma).
- **Autoavaliação** — a nota que a **própria pessoa** deu pra si mesma.
- **Avaliador** — quem deu a nota. **Avaliado** — quem recebeu a nota.
- **Planilha / Google Sheets** — o arquivo de tabela (parecido com
  Excel) onde tudo isso vive, incluindo o próprio Painel.
- **Config** — uma aba (uma "página") dentro dessa planilha, onde ficam
  cadastrados nomes, setores, cargos e períodos.
- **Painel** — a telinha com gráficos que este guia explica. Abre por
  dentro da própria planilha (seção 2).

### Como o sistema funciona, em 3 passos

1. Alguém responde o formulário de Avaliação 360 no Google Forms. *(Ex.:
   o Integrante A preenche o formulário avaliando os colegas do setor
   dele no período 2026.2.)*
2. A planilha organiza essas respostas sozinha — você só clica num botão
   de vez em quando (ou nem isso, se a atualização automática estiver
   ligada, ver seção 9). *(Ex.: depois de 5 pessoas responderem, alguém
   clica em "Avaliação 360 → Atualizar Dados" e as 5 respostas viram
   números prontos pro Painel.)*
3. Você abre o **Painel** — uma telinha dentro da própria planilha — pra
   ver notas, gráficos e comparações. *(Ex.: você abre o Painel e já vê a
   nota média da equipe inteira, sem escolher nada.)*

### Sobre os exemplos deste guia

Ao longo do texto, sempre que for útil mostrar um número concreto, este
guia usa exemplos com nomes genéricos como **Integrante A**, **Integrante
B**, **Integrante C** — nunca nomes reais, porque este é um documento
sobre como o sistema funciona, não sobre pessoas específicas. Os exemplos
também usam os setores "Comercial" e "Marketing" e os períodos "2026.1" e
"2026.2" como pano de fundo, só pra dar concretude — na sua planilha, o
raciocínio é idêntico com qualquer nome, setor, cargo ou período reais
que você tiver.

**Importante:** cada exemplo mostra *uma* forma de usar aquele recurso,
não *a única* forma. Onde o texto explica uma regra geral, ela vale pra
qualquer combinação de Pessoa, Setor, Cargo e período que existir na sua
planilha — os exemplos servem só pra deixar a regra mais fácil de
visualizar, nunca pra sugerir que só aquela combinação específica é
possível.

---

## 1. Como ler um gráfico, do zero

Um **gráfico** é só um jeito de desenhar números, em vez de escrever
eles numa lista. A ideia é que o **olho** enxerga um desenho mais rápido
do que a **cabeça** faz conta em cima de uma lista de números — um
gráfico bem feito deixa "quem está melhor", "quem está pior" ou "isso
está subindo ou caindo" visível na hora, sem precisar comparar número
por número.

Esta seção ensina o vocabulário básico que **todo** gráfico deste Painel
usa. Leia ela uma vez só — as seções seguintes vão te lembrar dela sempre
que for preciso.

### Eixo horizontal e eixo vertical

Quase todo gráfico tem duas "réguas":

- Uma **linha embaixo, na horizontal** (da esquerda pra direita) —
  chamada de **eixo horizontal**. Nos gráficos deste Painel, ela quase
  sempre mostra **o quê** está sendo comparado (ex.: os nomes dos
  setores, um do lado do outro) ou **quando** (ex.: os períodos, em
  ordem do mais antigo pro mais recente).
- Uma **linha do lado, na vertical** (de baixo pra cima) — chamada de
  **eixo vertical**. Nos gráficos deste Painel, ela quase sempre mostra
  **a nota** (de 0 a 10) ou **uma quantidade** (quantas pessoas, quantas
  notas).

*(Exemplo bem simples, fora do sistema: imagine um gráfico da
temperatura de cada dia da semana. No eixo horizontal, os dias — Segunda,
Terça, Quarta... Na vertical, a temperatura. Um ponto alto em cima de
"Quarta" quer dizer que fez mais calor na quarta-feira; um ponto baixo em
cima de "Sábado" quer dizer que fez mais frio no sábado. É só isso: a
posição de cada marca no desenho já conta a história, sem precisar ler
número nenhum.)*

### Cor = grupo, e a "legenda" que explica cada cor

Quando um gráfico compara mais de uma coisa ao mesmo tempo (ex.: o Setor
Comercial e o Setor Marketing, lado a lado), cada uma delas ganha uma
**cor diferente** — sempre a mesma cor em todos os gráficos da tela, pra
você não precisar decorar de novo a cada gráfico. Embaixo ou do lado do
gráfico, geralmente aparece uma pequena lista chamada **legenda**, com
uma bolinha ou tracinho colorido do lado de cada nome — é ali que você
confere "qual cor é qual". *(Exemplo: se você está comparando "Setor:
Comercial" (roxo) e "Setor: Marketing" (verde), todo traço, barra ou
ponto roxo no gráfico é sempre sobre o Comercial, e todo verde é sempre
sobre o Marketing — em qualquer gráfico da tela, não só num.)*

### Passar o mouse por cima (sem clicar) mostra mais detalhes

Muitos gráficos deste Painel escondem um número exato até você **passar
a setinha do mouse por cima** de um ponto, barra ou linha — sem clicar
em nada, só posicionar o cursor ali. Assim que você faz isso, aparece uma
caixinha pequena com informações extras (esse recurso tem um nome técnico,
"tooltip", mas este guia sempre vai chamar simplesmente de **"passar o
mouse"**). *(Exemplo: você vê uma barra num gráfico, mas não sabe o
número exato dela — passe o mouse em cima da barra, sem clicar, e uma
caixinha aparece mostrando o valor certinho, e às vezes informação extra,
como quantas pessoas deram aquela nota.)*

### Os formatos de gráfico que você vai encontrar neste Painel

Este Painel usa só quatro formatos de gráfico (e mais duas tabelas, que
nem são bem "gráfico", são listas organizadas em linhas e colunas, tipo
Excel). Cada um deles é explicado com calma, e com exemplo próprio, mais
adiante — aqui vai só um resumo rápido de "qual é qual", pra você já
reconhecer o formato quando chegar nele:

1. **Gráfico de linha** (usado na seção 5.3, "Evolução por Período") —
   uma linha ligando vários pontos, andando da esquerda (mais no
   passado) pra direita (mais recente). Serve pra ver se algo está
   subindo, descendo ou ficando estável ao longo do tempo.
2. **Gráfico de barras** (usado nas seções 5.5 e 5.6, e também na aba
   Participação) — barras verticais, uma do lado da outra. Quanto mais
   alta a barra, maior o número que ela representa.
3. **Gráfico de teia** (usado na seção 5.4, "Perfil de Competências") —
   um desenho parecido com uma teia de aranha ou estrela, com várias
   "pontas" saindo do centro, uma pra cada critério avaliado. Quanto
   mais longe do centro o desenho chega numa ponta, maior a nota naquele
   critério específico.
4. **Gráfico de caixinha** (usado na seção 5.5, aba "Dispersão por
   critério") — uma pequena caixa retangular, em vez de uma barra ou
   linha, mostrando "onde ficou o miolo" de um monte de notas, sem
   mostrar cada nota individual.
5. **Tabelas** (usadas nas seções 5.1 e 5.7) — linhas e colunas de
   números organizados, sem desenho nenhum — o jeito mais direto de
   comparar valores exatos lado a lado.

Com esse vocabulário na cabeça, vamos pro Painel de verdade.

---

## 2. Abrindo o Painel

O Painel abre pelo menu **Avaliação 360 → Abrir Painel**, lá em cima da
planilha, do lado do menu "Ajuda" (esse menu aparece bem no topo da
tela, junto com "Arquivo", "Editar" etc. — é a fileira de palavras
clicáveis logo acima da própria planilha).

Depois de abrir, logo abaixo do título tem duas **abas** — são como duas
"telinhas" diferentes dentro da mesma janela; clicar no nome de uma delas
troca o que aparece embaixo, sem fechar nada:

- **Avaliações** (abre primeiro, e é o que as seções 3 a 6 deste guia
  explicam) — sobre a *qualidade* das notas: quem tirou o quê, em qual
  critério, com quanta gente concordando. *(Ex.: "o Setor Comercial está
  bem avaliado?" é uma pergunta desta aba.)*
- **Participação** (seção 7) — sobre *quem está respondendo* o
  formulário, não sobre as notas em si. *(Ex.: "todo mundo do Comercial
  já respondeu esse período?" é uma pergunta desta outra aba — dá pra
  ter nota ótima na primeira aba e taxa de resposta péssima na segunda,
  ao mesmo tempo, sobre o mesmo setor.)*

---

## 3. Montando uma comparação

A ideia central do Painel é: você monta uma lista do que quer comparar, e
cada item dessa lista vira uma cor/linha em todos os gráficos da tela.
*(Ex.: adicionar "Setor: Comercial" e "Setor: Marketing" faz os dois
aparecerem lado a lado, cada um na sua cor, em todo gráfico da tela.)*

**Cada item da lista é totalmente independente dos outros**, em dois
sentidos:

- **Tipo:** cada item pode ser uma **Pessoa**, um **Setor inteiro**, um
  **Cargo**, ou a **Equipe inteira** — e você não precisa escolher o
  mesmo tipo pra todos os itens. Dá pra comparar uma pessoa específica
  com um setor inteiro, ou com um cargo, ou com a equipe toda, tudo na
  mesma tela, ao mesmo tempo. *(Ex.: "Cargo: Consultor(a)" junta, numa
  média só, todo Consultor de todos os setores — não é preciso que sejam
  do mesmo setor; "Equipe inteira" junta literalmente todo mundo, de
  qualquer setor ou cargo.)*
- **Período:** cada item pode ficar travado num período específico, ou
  combinar todos os períodos — e essa escolha também é independente de
  item pra item, mesmo que dois itens sejam do mesmo tipo. *(Ex.: "Setor:
  Comercial" travado em 2026.1, junto com "Setor: Comercial" travado em
  2026.2, viram dois pontos separados — um pra cada período — em vez de
  uma média só combinando os dois.)*

Não existe combinação "errada" entre Tipo e Período: qualquer mistura faz
sentido pro sistema, e ele calcula os números certos pra cada item, um
por um, não importa o tipo ou o período de cada um.

### Passo a passo pra adicionar um item à comparação

Na tela, existe uma fileira de caixinhas de escolha (esse tipo de
caixinha, onde você clica e aparece uma lista de opções pra escolher,
chama-se **menu suspenso**) e um botão **"+ Adicionar"**:

1. Escolha o **Tipo**, no primeiro menu suspenso: Pessoa, Setor, Cargo,
   ou **Equipe inteira**. *(Ex.: escolha "Setor".)* Se você escolher
   **Pessoa**, aparece um campo extra chamado **Setor** — ele estreita a
   lista de nomes do passo seguinte pra só quem é daquele setor, útil
   quando a organização tem muita gente e procurar na lista inteira
   demora. Deixando esse filtro em "Todos" (o padrão), a lista continua
   mostrando todo mundo, sem filtro nenhum. *(Ex.: escolher "Comercial"
   nesse filtro de Setor deixa a lista de nomes do próximo passo só com
   quem é do Comercial, em vez da equipe inteira; voltar pra "Todos"
   mostra todo mundo de novo.)*
2. No segundo menu suspenso, escolha **qual** pessoa/setor/cargo,
   especificamente — esse passo não existe pra "Equipe inteira" (o campo
   fica travado, cinza, porque não há "qual" escolher: é sempre todo
   mundo junto). *(Ex.: escolha "Comercial" na lista que aparece.)* Na
   lista de pessoas, quem já saiu da equipe (seção 8) continua
   aparecendo, marcado com **"(Inativo)"** ao lado do nome — dá pra
   comparar o histórico dela normalmente, mesmo depois que ela saiu.
   *(Ex.: a lista mostra "Integrante B (Inativo) — Comercial" — escolher
   esse nome funciona igual a escolher qualquer pessoa ativa, mostrando
   o histórico completo dela.)*
3. Se quiser travar num período específico, escolha em **"Período deste
   item"**. Deixando em branco ("Todos (combina)"), o item combina
   todos os períodos juntos. *(Ex.: escolher "2026.1" aqui trava o item
   só naquele semestre; deixar em "Todos" junta 2026.1 e 2026.2 numa
   média só.)*
4. Clique no botão **"+ Adicionar"**. Aparece um retângulo colorido
   pequeno (chamado de **"chip"** neste guia) representando essa
   escolha, com uma bolinha da cor do item, o nome dele, e um "×" —
   clicar nesse × remove aquele item da comparação. *(Ex.: aparece um
   chip roxo escrito "Setor: Comercial" — clicar no × dele some com essa
   comparação.)*
5. Repita quantas vezes quiser, misturando tipos e períodos livremente,
   até o limite configurado (padrão: 6 itens ao mesmo tempo — ajustável,
   ver o fim da seção 6). *(Ex.: com o padrão de 6, ao tentar adicionar
   um 7º item, o Painel avisa "Máximo de 6 itens" e pede pra remover
   algum primeiro.)*

Se você não adicionar nada, o Painel mostra a **equipe inteira** —
nunca fica vazio à toa. *(Ex.: abrir o Painel pela primeira vez, sem
escolher nada, já mostra a nota média de todo mundo.)* Isso é diferente
de adicionar "Equipe inteira" como Tipo (passo 1): sem nenhum item, ela
aparece sozinha por padrão; adicionando-a como item, ela fica **ao lado**
de outros itens que você também adicionou, pra comparar diretamente
contra eles. *(Ex.: adicionar "Setor: Comercial" e, junto, um item de
"Equipe inteira", mostra os dois lado a lado em todos os gráficos — dá
pra ver na hora se o Comercial está acima ou abaixo da média geral, sem
precisar decorar o número de cabeça.)*

**Exemplo — misturando tipos e períodos numa comparação só:**

> Você quer, numa reunião só, olhar três coisas ao mesmo tempo: como o
> Integrante A está indo agora, como ele estava no período anterior, e
> como o Setor Marketing (onde ele trabalha) está indo em geral. Isso é 1
> comparação com 3 itens: "Pessoa: Integrante A" travado em **2026.2**,
> "Pessoa: Integrante A" travado em **2026.1**, e "Setor: Marketing" sem
> período (combinando tudo). Os três aparecem juntos, cada um na sua
> cor, em todos os gráficos da tela.

### Um segundo período, separado do de cada item: "Visão Geral / Ranking"

Logo abaixo do construtor de itens tem um card (uma "caixinha" separada
na tela, com título próprio) chamado **"Visão geral e ranking"**, com um
seletor de período que **não** é o mesmo do passo 3 acima. Enquanto
"Período deste item" trava só AQUELE item específico, esse segundo
seletor controla só duas seções lá embaixo na tela — "Todos os setores e
todos os cargos" (seção 5.6) e o **Ranking** (seção 5.7) — que ficam de
fora da lista de itens de propósito, porque são o "mapa geral" da
organização, não uma comparação escolhida por você. Trocar um não afeta
o outro.

*(Exemplo: você está comparando "Pessoa: Integrante A · 2026.1" (item
travado em 2026.1) mas deixou o seletor "Visão Geral/Ranking" em "Todos
os períodos" — o Resumo e a Evolução do Integrante A mostram só 2026.1,
mas o Ranking (Top/Bottom) e os gráficos "Todos os setores"/"Todos os
cargos" continuam somando todos os períodos juntos, porque respondem à
pergunta "como está a organização toda, em geral", não "como está o
Integrante A".)*

---

## 4. Escolhendo a base das notas (a "lente")

Logo abaixo de "O que comparar" tem um card chamado **"Base das
notas"**, com 3 botões: **Colegas/Liderança**, **Autoavaliação** e **Os
dois**. Essa escolha (chamamos de **"lente"** ao longo deste guia,
porque é como trocar a lente de uma câmera — o assunto continua o mesmo,
mas o que você enxerga dele muda) vale pra praticamente toda a tela de
uma vez só — Resumo, Evolução, Perfil de Competências, Distribuição,
Dispersão e Todos os setores/cargos passam a usar a base escolhida, sem
precisar configurar cada gráfico separadamente. *(Ex.: trocar a lente 1
vez muda o que "Nota" significa em 6 partes diferentes da tela ao mesmo
tempo, sem precisar repetir a escolha em cada uma.)*

- **Colegas/Liderança** (a que abre por padrão) — todo número na tela
  representa só o que colegas e liderança disseram sobre cada item. É a
  visão "de fora": o que o time pensa. *(Ex.: a Nota do Setor Comercial
  nessa lente é a média do que os OUTROS deram pra ele — nunca inclui o
  que o próprio setor disse de si mesmo.)*
- **Autoavaliação** — todo número passa a representar só a
  autoavaliação: o que a própria pessoa/grupo disse de si mesma. *(Ex.:
  nessa lente, a Nota do Setor Comercial vira a média de quanto cada
  integrante do Comercial se autoavaliou — os colegas de fora não entram
  na conta.)*
- **Os dois** — cada gráfico passa a mostrar as duas visões juntas, lado
  a lado (uma para cada item que você está comparando) — nunca mais que
  isso: fora desse modo, cada gráfico sempre mostra 1 única visão por
  vez. *(Ex.: com 1 item comparado (Setor Comercial) e a lente em "Os
  dois", o gráfico de Evolução mostra exatamente 2 linhas: uma de
  colegas/liderança, uma de autoavaliação — nunca vira 4 linhas mesmo
  comparando mais itens de uma vez, é sempre 2 por item.)* Nessa lente,
  a legenda de cada gráfico também deixa isso explícito no texto — não
  só na cor/traço — acrescentando "(colegas)" ou "(autoaval.)" ao nome
  de cada item. *(Ex.: comparando "Setor: Comercial" na lente "Os dois",
  a legenda mostra duas entradas: "Setor: Comercial (colegas)" e "Setor:
  Comercial (autoaval.)" — nas outras duas lentes, como só existe 1
  visão na tela, a legenda mostra só "Setor: Comercial", sem sufixo
  nenhum, porque seria redundante repetir algo que já vale pra tela
  inteira.)*

**Exemplo — comparando as duas visões do Setor Comercial:**

> Você quer saber se o Setor Comercial se autoavalia parecido com o que
> os colegas/liderança acham dele. Deixe "Setor: Comercial" como único
> item da comparação e clique em **"Os dois"**. No gráfico de Evolução
> (seção 5.3), aparece uma linha cheia (colegas/liderança) e uma linha
> tracejada (feita de tracinhos, em vez de contínua) da mesma cor
> (autoavaliação) — se as duas andarem próximas, o setor tem uma
> autopercepção parecida com a visão de fora; se ficarem bem separadas, é
> sinal de que vale conversar sobre isso.

**Uma exceção importante: o Ranking.** A seção de Ranking (Top/Bottom/
gaps, seção 5.7) **nunca** segue a lente Autoavaliação — ela continua
sempre baseada em colegas/liderança, e some da tela inteira quando você
escolhe "Autoavaliação" sozinha (sem "Os dois"). O motivo: numa
autoavaliação, toda pessoa tem exatamente 1 "avaliadora" possível (ela
mesma) — e o Ranking exige um mínimo de avaliadores diferentes pra
mostrar alguém (ver seção 5.7), o que nunca aconteceria ali. Em vez de
mostrar uma lista sempre vazia e confusa, o Painel simplesmente esconde
o card nesse caso, com um aviso explicando o motivo.

*(Exemplo: você troca a lente pra "Autoavaliação" querendo ver como a
equipe se autoavalia em geral. Os gráficos de Resumo, Evolução e Radar
mudam normalmente — mas o card de Ranking, lá embaixo na tela, simplesmente
desaparece nessa lente, com um aviso no lugar dele. Volte pra "Colegas/
Liderança" ou "Os dois" pra ele reaparecer.)*

---

## 5. O que você vê na tela, de cima a baixo

Mudar qualquer escolha (adicionar/remover item, trocar período, trocar a
lente) recalcula tudo na hora — não precisa apertar nenhum botão de
atualizar. *(Ex.: trocar de "Colegas/Liderança" pra "Os dois" já muda
todos os gráficos na mesma hora, sem precisar clicar em nada mais.)*

### 5.1. Resumo por item comparado (tabela)

Essa é a primeira tabela da tela — lembre da seção 1: uma **tabela** é
só uma lista organizada em linhas e colunas, sem desenho, como no Excel.
Ela funciona como um resumo rápido antes de você entrar nos gráficos —
uma linha por item que você adicionou (ou uma linha só, "Equipe
inteira", se não adicionou nada). *(Ex.: comparar 2 setores gera uma
tabela de 2 linhas, uma pra cada.)* Ela existe pra responder, de forma
compacta, quatro perguntas sobre cada item: **quantas pessoas** ele
representa, **que nota** ele recebeu (segundo a lente escolhida — seção
4), **o quanto essa nota é confiável**, e **quantos alertas** apareceram
nele. Veja o que cada coluna realmente está dizendo, e por quê:

- **Integrantes** — quantas pessoas ativas fazem parte daquele item (1,
  se for uma Pessoa; o tamanho do grupo, se for Setor ou Cargo). Serve
  de referência pras colunas seguintes: uma nota vinda de 1 pessoa e uma
  nota vinda de 12 não têm o mesmo peso, mesmo que o número pareça
  igual. *(Ex.: "Setor: Comercial" mostra "9" nessa coluna, porque o
  Comercial tem 9 pessoas ativas hoje.)*
- **Nota** — segue a lente escolhida no card "Base das notas". Com a
  lente em **"Os dois"**, o número principal é sempre colegas/liderança,
  e a autoavaliação aparece numa linha pequena logo abaixo, dentro da
  mesma célula (uma "célula" é o quadradinho onde uma linha e uma coluna
  se cruzam) — nunca somada escondida dentro do número principal. Com a
  lente em **"Autoavaliação"** sozinha, é a autoavaliação que vira o
  número principal, sem nenhuma linha extra. *(Ex.: na lente "Os dois",
  a célula mostra `7.2` grande, com `autoaval.: 8.0` pequeno embaixo —
  os dois números visíveis ao mesmo tempo, nunca misturados num só.)*
- **Nota ajustada** — desconto pelo hábito de quem avaliou (explicação
  completa, com exemplo, na seção 6). *(Ex.: uma Nota de 6.0 pode virar
  7.5 na versão ajustada, se quem avaliou costuma dar notas mais baixas
  que a média geral.)*
- **Nota estabilizada** — a Nota puxada em direção à média geral, mais
  forte quanto menor o grupo (explicação completa, com exemplo, na
  seção 6). *(Ex.: um grupo de 2 pessoas com nota 9.5 pode aparecer como
  "7.8" estabilizada — mais perto da média geral, por ter pouca gente
  sustentando o número.)* Nenhuma das duas colunas existe do lado
  Autoavaliação sozinha pra "Nota ajustada" especificamente — ela
  aparece como "—" nessa lente, porque não existe "hábito de quem avalia
  os outros" quando a única avaliadora é a própria pessoa (ver seção 6).
- **Nº avaliações** e **Nº avaliadores** — dois jeitos de contar "quanta
  gente opinou", propositalmente diferentes. *(Ex.: se só 1 colega
  avaliou o Integrante A nos 6 critérios do formulário, a tabela mostra
  "6" em Nº avaliações (uma nota por critério) e "1" em Nº avaliadores —
  é esse segundo número que diz que foi 1 pessoa só, repetida 6 vezes,
  não 6 pessoas diferentes opinando.)*
- **Alertas** — quantas notas individuais, dentro daquele item, ficaram
  iguais ou abaixo do limite configurado (padrão: 4) — um jeito rápido
  de perceber se há notas baixas escondidas dentro de uma média que,
  sozinha, parece ok. *(Ex.: um item com nota média 7 pode mesmo assim
  mostrar "3 alertas", se 3 notas específicas dentro dele vieram ≤4 — a
  média boa escondia esses 3 casos.)*

Se um item comparado for um Setor ou Cargo com pouca gente ativa (menos
de 3, por padrão), essa linha aparece diferente: em vez dos números, o
texto **"grupo pequeno demais pra mostrar"** ocupa o lugar da Nota — o
motivo está explicado, com exemplo, na seção 6.

### 5.2. Quedas entre períodos

Um aviso automático se algum item comparado (ou a equipe toda) caiu de
nota de um período pro outro, mais do que o limite configurado (padrão:
1 ponto). Ele existe pra você não depender de reparar isso sozinho,
olhando o gráfico de Evolução com atenção linha por linha — se caiu
forte, o Painel avisa primeiro, num quadrinho de destaque acima dos
gráficos.

> **Exemplo:** o Setor Comercial tinha média 7.2 no período 2026.1 e
> caiu pra 5.8 no 2026.2 — uma queda de 1.4 pontos, acima do limite de
> 1. Esse card mostra algo como: "Setor Comercial caiu 1.4 pontos entre
> 2026.1 (7.2) e 2026.2 (5.8)".

Se nenhum item caiu mais do que o limite, o card mostra uma mensagem
tranquilizadora ("Nenhuma queda de X+ pontos...") em vez de ficar vazio
sem explicação.

### 5.3. Evolução por Período (gráfico de linha)

Este é o primeiro **gráfico de linha** do Painel — reveja a seção 1 se
precisar relembrar o conceito. Aqui, o **eixo horizontal** (embaixo)
mostra os períodos, do mais antigo (esquerda) pro mais recente
(direita); o **eixo vertical** (do lado) mostra a nota, de 0 a 10.

**Como ler, passo a passo:**

1. Cada linha colorida representa um item que você está comparando —
   confira a legenda pra saber qual cor é qual (seção 1).
2. Siga a linha da esquerda pra direita: se ela **sobe**, a nota daquele
   item **melhorou** de um período pro outro; se ela **desce**, a nota
   **piorou**.
3. Uma linha **cinza tracejada** (feita de tracinhos) aparece sempre,
   mesmo que você não tenha pedido — ela é a média de toda a equipe, só
   de referência, e serve pra comparar "esse item está acima ou abaixo
   do resto da equipe?". Ela sempre representa colegas/liderança, mesmo
   se a lente estiver em "Os dois".
4. Se um item foi travado num período específico (passo 3 da seção 3),
   ele não vira uma linha inteira — aparece só como **um pontinho
   isolado**, sozinho em cima daquele período, porque não existe
   "trajetória" pra desenhar quando só um momento no tempo foi
   escolhido.
5. Passe o mouse em cima de qualquer ponto da linha pra ver o número
   exato da nota, e quantos avaliadores diferentes sustentam ela (o
   "n=", explicado com calma na seção 6).

*(Exemplo simples: uma linha indo de 5.0 em 2026.1 pra 7.0 em 2026.2
mostra uma melhora clara naquele item — o ponto da direita está
visivelmente mais alto que o da esquerda.)* *(Exemplo com a linha cinza:
mesmo comparando só o Setor Marketing, a linha cinza continua ali
mostrando a média de TODA a equipe, pra você ver se o Marketing está
acima ou abaixo do resto.)*

Com a lente em **"Os dois"** (seção 4), cada item ganha uma **segunda
linha**, tracejada e da mesma cor da primeira, mostrando a trajetória da
autoavaliação ao lado da trajetória de colegas/liderança — ou seja,
linha cheia = colegas/liderança, linha tracejada colorida = autoavaliação
do mesmo item, linha cinza tracejada = a média geral da equipe (sempre
colegas/liderança).

> **Exemplo:** você comparou "Setor: Comercial" e escolheu a lente "Os
> dois". A linha cheia roxa mostra a nota que colegas/liderança deram ao
> setor em 2026.1 e 2026.2; uma segunda linha roxa, tracejada, mostra a
> autoavaliação média do setor nos mesmos dois períodos. Se as duas
> subirem juntas, a melhora é percebida tanto de dentro quanto de fora
> do setor; se só uma delas subir, vale entender por quê.

### 5.4. Perfil de Competências (gráfico de teia/radar)

Este é o **gráfico de teia** citado na seção 1 — também chamado de
"radar" porque lembra a tela de um radar de navio, com o centro sendo o
"zero" e cada direção sendo um critério diferente. Cada "ponta" da teia
é um critério avaliado (Engajamento, Comunicação, Organização, etc.).

**Como ler, passo a passo:**

1. Olhe pro centro do desenho: ali seria a nota mais baixa possível.
2. Cada linha reta que sai do centro é um critério — o nome dele aparece
   escrito na pontinha de fora.
3. Quanto **mais longe do centro** o contorno colorido chega numa ponta
   específica, **maior** a nota naquele critério.
4. O resultado final é uma forma fechada, meio de "teia de aranha" — uma
   forma **grande e "estufada"** (bem esticada em todas as direções)
   significa notas altas em geral; uma forma **pequena e "murcha"**
   (puxada pro centro) significa notas baixas em geral. Se só uma ponta
   específica estiver "murcha" enquanto as outras estão "estufadas",
   esse é o critério mais fraco daquele item especificamente, mesmo que
   a nota geral pareça boa.

*(Exemplo: uma teia bem estufada em todas as pontas mostra notas altas
em tudo; uma teia murcha só na ponta de "Organização" mostra que esse
critério específico está mais fraco que os outros, mesmo que o resto
esteja bem.)*

Esse gráfico serve principalmente pra **comparação**: com dois ou mais
itens na tela, cada um ganha o seu próprio contorno colorido sobre a
mesma teia, e dá pra ver na hora em qual ponta específica cada um
"estica" mais que o outro — ali está o ponto forte relativo de cada um,
algo que uma nota média sozinha não mostra (duas pessoas podem ter a
mesma média geral e perfis de competência completamente diferentes).

Com a lente em **"Os dois"**, cada item ganha um segundo contorno,
tracejado e mais claro (mais "apagado"), mostrando o perfil de
autoavaliação ao lado do perfil segundo colegas/liderança — mesma lógica
de linha cheia/tracejada da Evolução (seção 5.3).

Só entram na teia os critérios que fazem sentido pro que você está
comparando — por exemplo, "Comprometimento" e "Tomada de Decisão" só
existem hoje pra quem avalia a Presidência, então comparar só Setores
nunca traz essas duas pontas. *(Ex.: comparar "Setor: Comercial" com
"Setor: Marketing" mostra uma teia com 7 pontas, sem "Comprometimento"
nem "Tomada de Decisão"; comparar "Cargo: Presidente" já traz essas duas
de volta.)*

> **Exemplo:** você compara "Pessoa: Integrante A" com a lente "Os
> dois". O contorno cheio mostra como os colegas avaliam cada
> competência dele; o contorno tracejado mostra como ele mesmo se
> avalia em cada uma. Se o tracejado "estufar" muito mais que o cheio
> numa ponta específica (ex.: Liderança), é um sinal de que ele se acha
> mais forte em Liderança do que os colegas acham — um ponto concreto
> pra puxar numa conversa de feedback.

Passar o mouse em cima de qualquer ponta mostra a nota exata e quantos
avaliadores diferentes sustentam ela (o "n=" — seção 6). Um pico isolado
na teia costuma vir de pouquíssima gente opinando, e o "n=" avisa isso na
hora.

### 5.5. Distribuição e dispersão das notas

Este é um card com **duas abas** por dentro (clicáveis, como as abas da
seção 2). Ele existe porque **uma média sozinha não distingue
concordância de divergência**: um item com média 7 pode ser "todo mundo
deu nota parecida, perto de 7", ou pode ser "metade deu nota 10 e a
outra metade deu nota 4" — a mesma média, formas de opinião completamente
diferentes.

#### Aba "Distribuição das notas" (gráfico de barras / histograma)

Abre primeiro. É um tipo de **gráfico de barras** chamado
**histograma** — a diferença pra um gráfico de barras comum é que aqui
cada barra não representa "um setor" ou "uma pessoa", e sim **uma faixa
de nota** (por padrão, faixas como "0–2", "2–4", "4–6", "6–8", "8–10").

**Como ler, passo a passo:**

1. No eixo horizontal (embaixo), cada grupo de barras é uma faixa de
   nota.
2. No eixo vertical (do lado), a altura da barra mostra **quantas notas**
   caíram naquela faixa.
3. Se a maioria das barras altas estiver concentrada numa faixa só (por
   exemplo, quase tudo em "6–8"), isso quer dizer que **a maioria das
   pessoas concordou**, dando notas parecidas.
4. Se as barras altas estiverem espalhadas nas duas pontas (por exemplo,
   bastante barra em "0–2" **e** bastante em "8–10", com pouca coisa no
   meio), isso quer dizer que **as opiniões estão divididas** — um grupo
   pensa de um jeito, outro grupo pensa de outro, mesmo que a média final
   pareça "no meio do caminho".

*(Exemplo: um item com a maioria das barras nas faixas "6–8" e "8–10"
mostra concordância alta; o mesmo item com barras espalhadas de "0–2" até
"8–10" mostra opiniões bem divididas, mesmo que a média pareça "no
meio".)*

Dentro dessa aba tem um segundo par de botões, menor, chamado **"Por
nota"** e **"Por avaliador"** — eles trocam **o que cada barra está
contando**, sem trocar a lente nem o item comparado:

- **"Por nota"** — cada nota dada conta como 1 marca no histograma.
- **"Por avaliador"** — cada **avaliador diferente** conta como 1 marca
  só (usando a média das notas que ele deu), não importa quantos
  critérios ele tenha preenchido.

Esses dois existem pela mesma razão de "Nº avaliações" x "Nº avaliadores"
na tabela de Resumo (seção 5.1): se uma pessoa preencheu vários
critérios, cada nota dela vira uma barra separada em "Por nota", o que
pode inflar a leitura de "quanta gente pensa isso".

> **Exemplo:** imagine que o Integrante A avaliou o Integrante B com
> notas baixas em todos os 6 critérios (todas na faixa 0–4), enquanto os
> Integrantes C e D deram notas altas (8–10) em todos os critérios que
> avaliaram. Na visão **"Por nota"**, a faixa 0–4 vai ter 6 marcas (uma
> por critério do Integrante A) — pode dar a impressão de "muita gente
> discordando". Na visão **"Por avaliador"**, essa mesma opinião do
> Integrante A vira **1 marca só** (a média dele), do mesmo jeito que a
> opinião de cada um dos outros dois também vira 1 marca — mostrando de
> forma mais justa que é "1 pessoa pensando diferente de 2", não "6 notas
> ruins contra 2 boas". Nenhuma das duas visões é "a errada" — elas
> respondem perguntas diferentes ("como as notas se distribuem" x "como
> as pessoas se distribuem"), por isso as duas ficam disponíveis, e você
> escolhe qual olhar conforme a pergunta que tiver em mente.

#### Aba "Dispersão por critério" (gráfico de caixinha)

Este é o **gráfico de caixinha** citado na seção 1. Ele mostra, um
critério de cada vez (Comunicação, Organização, etc., um do lado do
outro no eixo horizontal), uma pequena caixa retangular clara — sem
mostrar cada nota individual, só um resumo visual de "onde ficou o
miolo" delas.

**Como ler, passo a passo:**

1. Cada caixa representa todas as notas dadas num critério específico,
   pra um item comparado.
2. Imagine todas as notas daquele critério colocadas em ordem, da menor
   pra maior, e divididas em 4 partes iguais (4 "quartos", ou
   **quartis**). A caixa clara mostra onde ficam **os dois quartos do
   meio** — ou seja, a metade das notas que não são nem as mais baixas
   nem as mais altas daquele grupo.
3. Uma **caixa estreita** (baixinha, ocupando pouco espaço no eixo
   vertical) quer dizer que a maioria das notas do meio ficou bem
   próxima — quase todo mundo concordou. Uma **caixa larga** quer dizer
   que até as notas "do meio" já estão bem espalhadas — opiniões mais
   divididas.
4. Passe o mouse em cima de qualquer caixa pra ver três números extras:
   a **mediana** (o valor bem no meio de todas as notas, se você as
   colocasse em fila da menor pra maior — metade das notas fica abaixo
   dela, metade fica acima), e as notas **mais extremas** (a mais baixa
   e a mais alta que apareceram naquele critério).

Essa aba é uma visão mais fina que a "Distribuição das notas": em vez de
misturar todos os critérios numa forma só, ela separa cada um, então dá
pra ver se a divergência de opinião está concentrada num critério
específico ou espalhada por todos.

> **Exemplo:** olhando "Setor: Comercial" na aba Dispersão, o critério
> "Comunicação" tem uma caixinha estreita entre 6 e 7 (quase todo mundo
> concorda que está nessa faixa), enquanto "Criatividade" tem uma
> caixinha larga, de 3 a 9 (opiniões bem divididas). A média sozinha não
> mostraria essa diferença entre os dois critérios.

Um critério só aparece nessa aba se tiver notas suficientes pra fazer
sentido calcular uma caixa (pelo menos 4 notas) — critérios com poucas
notas simplesmente não aparecem na lista, em vez de mostrar uma caixa
sem sentido.

### 5.6. Todos os setores e todos os cargos (gráfico de barras)

Dois **gráficos de barras**, mostrando **todo mundo, sempre** —
independente do que você escolheu comparar nas seções 3 e 4. Existe pra
dar uma visão geral rápida da organização inteira sem precisar adicionar
cada setor/cargo manualmente na comparação: é o "olhar o mapa todo"
antes de decidir onde focar. *(Ex.: mesmo comparando só "Pessoa:
Integrante A" lá em cima, esses dois gráficos continuam mostrando TODOS
os setores e TODOS os cargos, não só o dele.)* Quem controla o período
mostrado aqui é o seletor **"Visão Geral/Ranking"** (seção 3), não o
"Período deste item" de cada item comparado.

**Como ler, passo a passo:**

Diferente de uma barra sólida simples, cada setor/cargo aqui ganha
**duas camadas visuais ao mesmo tempo**, uma em cima da outra:

1. Uma **faixa clara e larga** — mostra "o quanto essa nota pode
   realmente variar", chamada de **intervalo de confiança** (explicado
   com calma, e com exemplo, na seção 6). Uma faixa **estreita** quer
   dizer número confiável; uma faixa **larga** quer dizer "tem pouco
   dado, desconfie mais desse número".
2. Um **pontinho sólido**, bem no meio (ou perto) dessa faixa — é a nota
   "estabilizada" daquele grupo (explicada, com exemplo, na seção 6).

Essas duas camadas existem porque uma barra sólida simples faria um
setor de 4 pessoas parecer tão "sólido" quanto um de 12 só por terem a
mesma altura, escondendo que os dois números têm níveis de confiança bem
diferentes. *(Ex.: o Setor Comercial (12 pessoas) mostra uma faixa
estreita; um setor de 4 pessoas com a mesma nota média mostra uma faixa
bem mais larga ao redor do pontinho.)*

Passe o mouse em cima de qualquer barra pra ver a nota "crua" (sem
ajuste nenhum) e quantos avaliadores distintos sustentam ela. *(Ex.:
passar o mouse na barra do Marketing mostra algo como "Nota crua: 5.7 —
Avaliadores distintos: 11".)*

Com a lente em **"Os dois"**, cada setor/cargo ganha um **segundo
ponto** — um **triângulo vazado** (sem preenchimento, só o contorno), em
vez do círculo cheio — representando a autoavaliação média daquele
grupo, ao lado do círculo de colegas/liderança.

> **Exemplo:** com a lente em "Colegas/Liderança", o gráfico "Todos os
> setores" mostra um pontinho cheio pra cada setor, na altura da nota
> média que os colegas/liderança deram a ele. Trocando pra "Os dois",
> cada setor ganha também um triângulo vazado um pouco acima ou abaixo
> do círculo — se o Marketing tiver o triângulo bem mais alto que o
> círculo, por exemplo, é sinal de que o setor se autoavalia mais
> generosamente do que os colegas de outros setores/liderança avaliam
> ele.

Setor ou cargo com poucos integrantes ativos (menos que o mínimo
configurado, padrão 3) **não aparece** nesses gráficos — o motivo é o
mesmo de "grupo pequeno demais pra mostrar" da seção 5.1, explicado a
fundo na seção 6. Um texto pequeno logo abaixo do gráfico lista quais
setores/cargos ficaram de fora por esse motivo, se algum ficou.

### 5.7. Ranking (tabelas)

Três **tabelas** lado a lado (reveja o conceito de tabela na seção 1):
quem está com a nota mais alta (**Top**), quem está com a nota mais
baixa (**Bottom**), e quem tem a maior diferença entre "como se
autoavalia" e "como os colegas avaliam" (**gaps de autopercepção**).
*(Ex.: o Top pode mostrar "Integrante A — 8.7", o Bottom "Integrante F —
4.2".)*

Do lado da nota, aparece algo como `n=5` — esse é o número de
avaliadores distintos por trás dela (o mesmo conceito de "Nº
avaliadores" da seção 5.1); se o número de notas for diferente do número
de avaliadores, aparece também entre parênteses, tipo `n=5 (30 notas)`.
*(Ex.: `n=5 (30 notas)` quer dizer 5 pessoas diferentes avaliaram,
somando 30 notas ao todo entre elas — 6 critérios × 5 avaliadores.)*

Como explicado na seção 4, o Ranking sempre usa colegas/liderança, mesmo
se você tiver trocado a lente do resto da tela — e some completamente
quando a lente é só "Autoavaliação". O período usado aqui é o mesmo
seletor **"Visão Geral/Ranking"** (seção 3) da seção anterior — não o
"Período deste item" de cada item que você está comparando. *(Ex.: com
"Visão Geral/Ranking" em "2026.2", o Top/Bottom reflete só as notas
daquele período, mesmo que você esteja comparando itens travados em
outros períodos lá em cima.)*

> **Exemplo de gap:** o Integrante A se autoavalia com 6.0 em média, mas
> os colegas dão em média 8.5 pra ele — um gap de +2.5. Isso pode
> significar que ele é mais duro consigo mesmo do que os colegas são com
> ele (ou o contrário, se o gap fosse negativo). Não é "certo" nem
> "errado" em si — é um sinal de que vale conversar sobre autopercepção
> numa devolutiva.

Só entra no Top/Bottom quem foi avaliado por um número mínimo de pessoas
diferentes (padrão: 3) — evita que 1 colega sozinho, avaliando em vários
critérios, jogue alguém pro topo ou pro fundo da lista injustamente.
*(Ex.: o Integrante G foi avaliado só por 1 colega, mesmo que em 6
critérios — com o padrão de mínimo 3 avaliadores, ele não aparece nem no
Top nem no Bottom, porque 1 pessoa só não é amostra suficiente pra um
ranking justo.)* A mesma ideia vale pro ranking de gaps, com um mínimo
próprio de notas de autoavaliação e de avaliadores externos.

### 5.8. Notas fora do padrão

Uma lista de notas isoladas que fogem muito do que a própria pessoa que
avaliou costuma dar. Ela existe pra chamar atenção pra casos pontuais que
uma média inteira nunca revelaria (uma nota ruim se dilui fácil dentro de
uma média boa) — mas não quer dizer que está errado, é só um sinal
barato de "vale olhar com calma". Segue a mesma regra de "Quedas entre
períodos" (seção 5.2): com a lente em "Os dois", continua olhando só
colegas/liderança; com a lente em "Autoavaliação" sozinha, passa a
procurar autoavaliações isoladas fora do padrão de cada pessoa.

> **Exemplo:** o Integrante C normalmente dá notas entre 7 e 9 pra todo
> mundo que avalia. Se, numa avaliação específica, ele deu nota 2 pra
> alguém, essa nota aparece aqui — porque é bem diferente do padrão dele
> mesmo, não porque a nota "2" seja proibida ou errada em si.

O texto de cada linha dessa lista também mostra "quantos desvios-padrão
de distância" aquela nota ficou do padrão do avaliador — esse termo é
explicado, em palavras simples, na seção 6 (é o mesmo conceito por trás
do intervalo de confiança dos gráficos de barra).

---

## 6. Nota ajustada, nota estabilizada, e o quanto dá pra confiar num número

Uma média sozinha esconde uma pergunta importante: **quanto dá pra
confiar nela?** Duas notas médias iguais, uma vinda de 3 pessoas e outra
de 15, não têm o mesmo peso — a de 3 pessoas oscila muito mais fácil (uma
nota diferente já muda tudo). *(Ex.: se 1 das 3 pessoas mudasse a nota
dela de 8 pra 4, a média do grupo de 3 despencaria; a mesma mudança de 1
nota num grupo de 15 quase não move a média.)* O Painel deixa isso
visível em vez de esconder, de várias formas, explicadas uma a uma
abaixo.

- **Nota ajustada** — algumas pessoas dão nota alta pra todo mundo por
  hábito, outras dão nota baixa por hábito, o que bagunça a comparação
  entre quem foi avaliado por gente rigorosa e quem foi avaliado por
  gente generosa. A "nota ajustada" desconta, de cada nota, o quanto
  quem avaliou costuma se afastar da média geral. Não substitui a Nota
  normal, é uma segunda visão ao lado dela. Só existe do lado
  colegas/liderança: na autoavaliação, a única "avaliadora" possível é
  a própria pessoa, e não faz sentido corrigir o "hábito" de alguém
  avaliando a si mesma do jeito que se corrige o hábito de quem avalia
  várias pessoas diferentes — por isso essa coluna mostra "—" na lente
  Autoavaliação. *(Exemplo: se um avaliador costuma dar, em média, 1.5
  ponto a menos que a média geral, uma nota "6" dada por ele vira "7.5"
  na versão ajustada — o sistema reconhece que ele é, de modo geral,
  mais rigoroso, e compensa isso.)*
- **Nota estabilizada** — a nota de um grupo pequeno é puxada um pouco em
  direção à média geral do time, proporcional a quão pouco dado ele tem.
  Isso vale nas duas lentes, cada uma puxando pra sua própria média
  geral (a média geral de colegas/liderança de um lado, a média geral de
  autoavaliação do outro — nunca uma puxando a outra). *(Exemplo: um
  setor de 2 pessoas com uma média de sorte de "9.5" não compete de
  igual pra igual com um setor de 12 pessoas com a mesma média — a nota
  estabilizada do primeiro cai mais perto da média geral, porque tem
  muito menos gente sustentando aquele número. Setores com bastante
  gente quase não mudam.)*
- **Intervalo de confiança** (a faixa clara nos gráficos de barra da
  seção 5.6) — em vez de só a média, mostra "essa nota pode realmente
  estar em qualquer lugar entre X e Y". Faixa estreita = número mais
  confiável; faixa larga = pouco dado, desconfie mais. *(Exemplo: o
  Setor Comercial, com 12 avaliadores, mostra uma faixa estreita tipo
  "5.2 a 5.7" — dá pra confiar que a nota real está bem ali perto de
  5.4. Um setor pequeno, com só 3 avaliadores, pode mostrar uma faixa
  larga tipo "3.8 a 7.1" pra uma média parecida — o mesmo número "5.4"
  ali é bem menos confiável.)*
- **"n=" (tamanho da amostra) em todo lugar** — todo gráfico (barra,
  radar, evolução) mostra, ao passar o mouse em cima (seção 1), quantos
  avaliadores distintos sustentam aquela nota. Um pico isolado no radar,
  por exemplo, costuma vir de pouquíssima gente — o "passar o mouse"
  mostra isso na hora, sem você ter que ir caçar esse número em outro
  lugar. *(Exemplo: no Radar, a ponta de "Liderança" do Integrante A
  parece bem mais alta que as outras — passando o mouse ali, aparece
  "n=1 avaliador(es)": só 1 pessoa opinou sobre esse critério
  especificamente, o que explica o pico e avisa pra não tirar conclusão
  forte só com base nele.)*
- **"Grupo pequeno demais pra mostrar"** — se você comparar um setor ou
  cargo com poucas pessoas ativas nele (padrão: menos de 3), o Painel
  esconde o número inteiro, não só estabiliza. Com pouca gente, fica
  fácil adivinhar quem deu qual nota pra quem — esconder o número
  protege o anonimato de quem avaliou e de quem foi avaliado. Quer ver
  mesmo assim? Compare a pessoa específica pelo nome — isso nunca é
  escondido, porque aí o objetivo é justamente olhar aquela pessoa.
  *(Exemplo: o Cargo "Presidente" só tem 1 pessoa ativa — comparar
  "Cargo: Presidente" mostra a linha "grupo pequeno demais pra mostrar"
  em vez de um número, porque um grupo de 1 pessoa não é diferente de
  expor a nota individual dela. Comparar "Pessoa: [nome dela]"
  diretamente já mostra o número normalmente.)*

**O que é, afinal, "desvio-padrão"?** Esse termo aparece em alguns
lugares da tela (seção 5.8). Em palavras simples: é um número que mede
"o quanto as notas costumam variar em volta da média". Se todo mundo dá
notas bem parecidas entre si, o desvio-padrão é pequeno; se as notas
variam bastante de uma pra outra, ele é grande. Quando este guia fala em
"tantos desvios-padrão de distância" (seção 5.8) ou no intervalo de
confiança acima, está usando esse mesmo número como régua pra dizer "o
quanto isso é normal ou incomum" dentro do padrão de quem avaliou.

### Onde ajustar esses números

Esses limites — mínimos de amostra, força da estabilização, largura do
intervalo de confiança, a escala de notas usada no formulário, o limite
que vira "alerta", quantas faixas o histograma mostra, quantos itens dá
pra comparar ao mesmo tempo, quantos nomes aparecem no Top/Bottom/gaps e
na lista de notas fora do padrão, e a queda de participação que vira
alerta (seção 7) — ficam numa tabela na aba **Config**, nas colunas
**P e Q** ("Parâmetro dos alertas do Painel"). É só preencher/trocar o
número da célula, igual qualquer outra célula de planilha. Se o seu
formulário usa uma escala diferente de 0 a 10, por exemplo, é só trocar
ali — todos os gráficos e cálculos se ajustam sozinhos.

*(Exemplo: sua organização é pequena e o padrão de "menos de 3 pessoas =
grupo pequeno demais" está escondendo setores que você gostaria de ver.
Vá na Config, ache a linha "grupo mínimo" na tabela de parâmetros, e
troque o número de 3 pra 2. Da próxima vez que abrir o Painel, setores
de 2 pessoas já aparecem normalmente — sem precisar editar nenhum
código.)*

---

## 7. A aba "Participação"

Enquanto a aba Avaliações é sobre **a qualidade** das notas, a
Participação é sobre **quem está respondendo** o formulário — uma
pergunta bem diferente, que a aba Avaliações não responde, e que importa
por si só: uma nota alta não significa nada se só metade da equipe
respondeu, e uma queda de participação costuma ser um sinal de alerta
antes até de virar uma queda de nota. *(Ex.: um setor com nota média 9.0
mas só 20% de participação é um alerta bem maior do que uma nota 7.0
com 100% de participação.)* Essa aba não tem lente (seção 4) —
participação não tem "autoavaliação", é sempre "respondeu ou não
respondeu".

- **Filtro de período** — muda o recorte de tudo abaixo, exceto a
  Evolução (que é sempre a trajetória inteira). É independente dos
  períodos escolhidos lá na aba Avaliações — as duas abas não se afetam.
  *(Exemplo: escolher "2026.1" aqui mostra só quem respondeu naquele
  período, mesmo que na aba Avaliações você esteja olhando "2026.2".)*
- **Resumo** — quantas pessoas ativas responderam, de quantas ao todo, no
  recorte escolhido. É a mesma lógica de "Integrantes" da aba
  Avaliações (seção 5.1), só que aplicada a "quem respondeu" em vez de
  "quem tem nota". *(Exemplo: "3 de 4 integrantes ativos responderam
  nesse recorte (75%)".)*
- **Queda na participação** — avisa sozinho se a taxa de resposta caiu
  forte de um período pro outro, mais do que o limite configurado em
  pontos percentuais (mesma ideia das "Quedas entre períodos" da aba
  Avaliações, seção 5.2, só que sobre quem respondeu, não sobre a
  nota). *(Exemplo: se 90% do Setor Comercial respondeu em 2026.1 e só
  40% respondeu em 2026.2, esse card avisa a queda de 50 pontos
  percentuais.)*
- **Participação por setor e por cargo (gráfico de barras)** — dois
  gráficos de barra iguais aos da seção 1, agora em **porcentagem** (o
  eixo vertical vai de 0% a 100%), mostrando se algum grupo específico
  está respondendo menos que os outros. Setor/cargo com poucas pessoas
  fica escondido, pelo mesmo motivo de sempre (anonimato — ver seção 6).
  *(Exemplo: a barra do Setor Marketing em 60% e a do Comercial em 100%
  mostra rapidamente onde vale cobrar mais respostas.)*
- **Evolução da participação por período (gráfico de linha)** — igual ao
  gráfico de linha da seção 5.3, mas com a taxa de participação (%) no
  lugar da nota. Sempre a trajetória inteira, não muda com o filtro de
  período aqui de cima, porque o objetivo aqui é ver a tendência ao
  longo do tempo, não um recorte específico. *(Exemplo: uma linha caindo
  de 95% em 2026.1 pra 70% em 2026.2 mostra uma tendência de queda que
  vale investigar, mesmo sem ter disparado o alerta de queda brusca.)*
- **Quem ainda não respondeu (lista)** — lista com nome, setor e cargo de
  quem está ativo mas não respondeu no recorte escolhido, pra você saber
  exatamente quem cobrar. Essa lista **nunca** é escondida por "grupo
  pequeno" — diferente dos outros números desta seção, ela não é uma
  média que possa expor a nota de alguém, é só uma lista de ação.
  *(Exemplo: a lista mostra "Integrante D — Marketing · Consultor(a)" —
  você já sabe exatamente quem lembrar e de qual setor ele é.)*

---

## 8. Cadastrando e removendo pessoas

Tudo aqui é preencher células numa aba chamada **Config**, dentro da
mesma planilha — igual preencher qualquer tabela no Excel ou Google
Sheets. Isso é sempre manual, de propósito: é uma decisão de gente, não
algo que devesse acontecer sozinho.

**Entrou alguém novo na equipe:**

1. Vá na aba **Config**, na tabela de Membros. *(Ex.: role até a tabela
   que tem colunas Nome/Setor/Papel/Status.)*
2. Preencha a próxima linha em branco: Nome, Setor, Cargo, e Status
   (`Ativo`). *(Ex.: `Integrante E | Comercial | Consultor(a) |
   Ativo`.)*
3. Se essa pessoa também vai participar da avaliação entre colegas do
   setor dela, adicione-a **direto no Google Forms** também, como uma
   opção nova na pergunta correspondente. A aba Config nunca cria nada
   no Forms sozinha — isso é sempre manual, feito lá no Forms. *(Ex.: na
   pergunta de grade "Avalie os colegas do Comercial", adicione uma
   linha nova com o nome "Integrante E".)*

*(Exemplo completo: o Integrante E entra no Setor Comercial. Você
preenche a linha na Config e adiciona "Integrante E" na pergunta de
avaliação entre colegas do Comercial, lá no Forms. Na próxima vez que
alguém responder o formulário avaliando o Integrante E, o Painel já vai
reconhecê-lo.)*

**Alguém saiu da equipe:**

Na aba Config, mude o Status dessa pessoa de `Ativo` pra `Inativo`. Não
apague a linha — o histórico de notas dela continua guardado, e você
ainda pode olhar os números dela individualmente se precisar,
adicionando ela como uma comparação do tipo Pessoa (seção 3). Ela só
some das médias por setor/cargo e do ranking, porque essas contas são
sobre quem está ativo hoje.

*(Exemplo: o Integrante B sai da equipe em 2026.2. Você muda o Status
dele pra `Inativo` — a média do setor dele, a partir daí, não conta mais
com as notas dele, mas se você adicionar "Pessoa: Integrante B" numa
comparação, o histórico completo dele continua aparecendo normalmente.)*

**Período novo:**

Na aba Config, adicione o nome do novo período na próxima linha em
branco da coluna de Períodos. A partir da próxima resposta do Forms
marcada com esse período, ele já aparece nos seletores do Painel.

*(Exemplo: a equipe começa o período 2026.3. Você adiciona `2026.3` na
próxima linha livre da coluna de Períodos — na próxima vez que alguém
responder o formulário marcando esse período, ele já aparece como opção
nos filtros do Painel.)*

Depois de qualquer uma dessas mudanças, vá em **Avaliação 360 →
Atualizar Dados** de novo pra tudo recalcular. *(Ex.: você acabou de
marcar o Integrante B como Inativo — clique em Atualizar Dados pra essa
mudança já valer no Painel.)*

---

## 9. Deixando automático (opcional)

Por padrão, alguém precisa lembrar de clicar em "Atualizar Dados" depois
de cada resposta nova. Dá pra deixar isso automático:

1. **Avaliação 360 → Ativar atualização automática.** Pode pedir uma
   autorização extra do Google na primeira vez — normal. *(Ex.: aparece
   uma tela do Google pedindo permissão — clique em "Avançado" →
   "Acessar (nome do projeto), não seguro".)*
2. A partir daí, toda resposta nova do formulário atualiza a planilha
   sozinha. *(Ex.: alguém responde o formulário às 22h de um sábado — os
   dados já aparecem atualizados no Painel, sem ninguém ter clicado em
   nada.)*
3. Você ainda pode clicar em "Atualizar Dados" manualmente quando quiser
   (por exemplo, logo depois de editar a Config). *(Ex.: você acabou de
   mudar o Status de alguém — clicar manualmente garante que essa
   mudança já valha na hora, sem esperar a próxima resposta do Forms.)*
4. **Avaliação 360 → Status da automação** mostra se está ligada e como
   foi a última vez que rodou sozinha. *(Ex.: a tela mostra algo como
   "LIGADA — Última execução automática: 20/08/2026 14:32 — 3 respostas
   / 18 linhas geradas".)*
5. **Avaliação 360 → Desativar atualização automática** desliga isso
   quando quiser. *(Ex.: depois de desligar, novas respostas do Forms
   continuam chegando na planilha normalmente, só que sem processar
   sozinhas — alguém precisa voltar a clicar em Atualizar Dados.)*

Isso só troca "alguém clicando em Atualizar Dados" por "acontece
sozinho". Cadastrar pessoas, setores e períodos continua sempre manual
(seção 8).

*(Exemplo: você ativa a atualização automática numa sexta-feira. Durante
o fim de semana, 3 pessoas respondem o formulário. Na segunda-feira, ao
abrir o Painel, os números já refletem essas 3 respostas — ninguém
precisou lembrar de clicar em nada.)*

---

## 10. Editando o formulário

Dá pra **reordenar as perguntas** do Google Forms à vontade — o Painel
continua funcionando normalmente, porque ele identifica cada pergunta
pelo texto dela, não pela posição. *(Ex.: mover a pergunta de
"Comunicação" pra antes da de "Organização" não muda nenhum cálculo — o
sistema reconhece cada uma pelo texto.)*

Dá pra **adicionar uma pessoa nova** numa pergunta de avaliação entre
colegas a qualquer momento. *(Ex.: adicionar "Integrante E" como nova
linha na pergunta de grade do Comercial — na próxima resposta que citar
esse nome, o Painel já processa normalmente, desde que ele também esteja
cadastrado na Config, seção 8.)*

O que **não** deve ser feito sem ajuda técnica, porque quebra o sistema:

- Renomear um critério (ex.: trocar a palavra "ENGAJAMENTO" por outra
  bem diferente, tipo "MOTIVAÇÃO"). *(O que quebra: o Painel procura
  essa palavra-chave exata pra saber que critério é aquele — mudando a
  palavra sem avisar o sistema, as notas daquele critério deixam de ser
  reconhecidas e somem dos gráficos.)*
- Renomear de forma muito diferente as perguntas fixas (nome, setor,
  período). *(O que quebra: se a pergunta de nome deixar de se chamar
  "Qual o seu nome?", o sistema não consegue mais identificar quem
  respondeu, e a atualização para com um erro.)*

Se precisar de qualquer uma dessas duas mudanças, peça apoio a quem
configurou o sistema.

---

## 11. Perguntas e problemas comuns

**Abri o Painel e está tudo vazio.**
Confira se "Atualizar Dados" já foi rodado pelo menos uma vez depois da
última resposta nova. *(Ex.: alguém respondeu o formulário há 5 minutos
e ninguém ainda clicou em Atualizar Dados nem ligou a automação — é por
isso que o Painel ainda não mostra nada daquela resposta.)*

**Um setor ou cargo que eu esperava ver na lista não aparece.**
Confira na aba Config, tabela de Membros, se tem alguém cadastrado com
esse setor/cargo escrito exatamente do jeito que você espera. *(Ex.: você
esperava ver "Presidência" na lista, mas o setor está cadastrado como
"Presidência e Vice-Presidência" — precisa ser exatamente esse texto
completo pra aparecer.)*

**Apareceu um aviso dizendo que uma pessoa que respondeu ainda não está
cadastrada.**
Não é erro. As respostas dela já foram usadas normalmente nos cálculos
dos colegas — ela só vai aparecer nos relatórios individuais dela
depois que você cadastrar o nome dela na aba Config (seção 8 acima).
*(Ex.: o Integrante H respondeu avaliando o setor dele, mas ainda não
está na Config — as notas que ele DEU já contam pra média dos colegas,
só o histórico individual DELE (se você comparar "Pessoa: Integrante H")
que ainda não aparece, até você cadastrá-lo.)*

**Apareceu um aviso de "setor não reconhecido".**
O texto da resposta não bate com nenhum setor cadastrado na Config.
*(Ex.: alguém escreveu "comercial" com letra minúscula ou com espaço
extra no Forms, e a Config tem "Comercial" — confira se estão exatamente
iguais nos dois lugares.)*

**A equipe cresceu e passou de 100 pessoas cadastradas, e não sobra
linha em branco na Config.**
Vá em **Dados → Intervalos nomeados**, na planilha, e aumente o
intervalo `Cfg_Nomes` (e os outros que começam com `Cfg_`) pra caber
mais linhas — é um ajuste dentro da própria planilha, direto no menu
Dados. *(Ex.: sua equipe passa a ter 110 membros — aumente `Cfg_Nomes`
de "até a linha 103" pra "até a linha 120", por exemplo, e sobra espaço
de novo.)*

**O Ranking sumiu da tela.**
Confira a lente escolhida no card "Base das notas" (seção 4) — se
estiver em "Autoavaliação", isso é esperado, não é erro. *(Ex.: você
trocou pra "Autoavaliação" pra ver o Radar de autopercepção, e o Ranking
some junto — volte pra "Colegas/Liderança" ou "Os dois" que ele
reaparece normalmente.)*

**Uma seção do Painel está vazia ou com números estranhos, e nada do que
está aqui resolve.**
Peça pra quem configurou o sistema dar uma olhada — pode ser algo na
instalação que precisa de atenção técnica. *(Ex.: um gráfico mostra um
erro em vez de um número, mesmo depois de conferir Config e Atualizar
Dados — nesse caso já é hora de pedir ajuda técnica, em vez de continuar
tentando sozinho.)*

**Não consigo editar uma célula, ou uma aba sumiu da lista lá embaixo.**
Isso é proposital, não é bug — algumas abas foram travadas ou escondidas
de propósito, porque são preenchidas só pelos scripts (editar por engano
bagunçaria os números). *(Ex.: a aba "Dados Tratados" está escondida
porque é gerada automaticamente — se você precisa mesmo vê-la, peça pra
quem configurou o sistema reexibi-la.)*

---

## 12. Outras formas de usar

A lista abaixo é só um ponto de partida — como visto na seção 3, dá pra
combinar Pessoa, Setor e Cargo livremente, com qualquer período, então o
número de comparações possíveis é muito maior do que os exemplos aqui.

- **Antes de uma conversa de feedback com alguém:** adicione a pessoa
  como comparação no Painel pra ver a evolução dela e o perfil de
  competências. Adicione o setor dela também, pra comparar com a média
  do time. *(Ex.: antes de conversar com o Integrante A, adicione
  "Pessoa: Integrante A" e "Setor: Comercial" juntos — dá pra ver na
  hora se ele está acima ou abaixo da média do próprio setor em
  Comunicação, por exemplo.)*
- **Autopercepção da equipe:** troque a lente (seção 4) pra "Os dois" e
  olhe o Perfil de Competências (seção 5.4) de um setor ou cargo
  inteiro. *(Ex.: o Setor Marketing pode se achar mais forte em
  Criatividade do que os colegas de fora acham — o contorno tracejado
  bem maior que o cheio naquela ponta específica mostra isso na hora.)*
- **Setor contra setor, ou cargo contra cargo:** adicione dois ou mais
  setores (ou dois ou mais cargos) como comparação, pra ver lado a lado.
  *(Ex.: "Setor: Comercial" + "Setor: Marketing" mostra os dois lado a
  lado em todo gráfico da tela.)*
- **Antes e depois:** adicione a mesma pessoa (ou o mesmo setor) duas
  vezes, cada vez travada num período diferente. *(Ex.: "Pessoa:
  Integrante A · 2026.1" + "Pessoa: Integrante A · 2026.2" mostra a
  evolução dele direto no radar e na tabela de Resumo, lado a lado.)*
- **Uma mistura de tudo:** nada impede de comparar, ao mesmo tempo, uma
  pessoa específica, um setor inteiro, e um cargo. *(Ex.: "Pessoa:
  Integrante A" + "Setor: Marketing" + "Cargo: Diretor(a)" numa
  comparação só — cada item é calculado certinho, sem nenhum precisar
  ser do mesmo tipo dos outros.)*
- **Levar um recorte pra uma reunião:** com o Painel ajustado do jeito
  que você quer, é só printar a tela (tirar uma foto da tela, usando a
  própria ferramenta de captura do computador) ou copiar os números.
  *(Ex.: você monta a comparação "Setor: Comercial" x "Setor: Marketing"
  com a lente "Os dois", tira um print da tela de Resumo, e leva pra
  reunião de diretoria.)*
