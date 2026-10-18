# Cenários de Teste — Busca do Bing

Esse documento reúne os cenários de teste que criamos para validar a busca do
[bing.com](https://www.bing.com) usando Cypress. A ideia é explicar, de um jeito
simples, o que cada teste faz, por que ele existe e o que esperamos ver quando tudo
der certo. O código correspondente está em
[cypress/e2e/bing.cy.js](../cypress/e2e/bing.cy.js).

> **Por que Bing e não Google?** Esses testes rodavam originalmente contra o
> `google.com`, mas o Google bloqueava a suíte de forma consistente ao detectar
> tráfego automatizado (veja a seção [Por que migramos do Google para o
> Bing](#por-que-migramos-do-google-para-o-bing) para o histórico completo da
> investigação). O Bing se mostrou bem mais tolerante a esse tipo de teste.

## O que você precisa saber antes de rodar

- Os testes acessam o Bing de verdade (não tem mock nem servidor local), então
  precisa de internet para funcionar.
- Antes de cada teste, a página inicial é recarregada do zero e, se aparecer o
  banner de cookies da Microsoft, a gente já aceita automaticamente pra não
  travar o fluxo. No Bing, diferente do Google, esse banner reaparece em
  **toda** visita à página (não é só na primeira vez), então o comando que
  aceita cookies roda sempre no `beforeEach`.
- **Recomendado rodar com um navegador real (Chromium), não com o Electron
  padrão do Cypress.** Veja o porquê em [Electron vs. Chromium](#electron-vs-chromium-por-que-a-recomendação).

## Visão geral dos cenários

| ID | Cenário | Prioridade |
|---|---|---|
| TC01 | Acessar a página inicial | Alta |
| TC02 | Verificar se o campo de pesquisa está disponível | Alta |
| TC03 | Pesquisar um termo válido | Alta |
| TC04 | Validar se os resultados correspondem à pesquisa | Alta |
| TC05 | Pesquisar uma frase com espaços | Média |
| TC06 | Pesquisar caracteres especiais | Média |
| TC07 | Pesquisar um termo sem resultados relevantes | Média |
| TC08 | Enviar uma pesquisa usando Enter | Alta |
| TC09 | Enviar uma pesquisa usando o botão de busca, quando disponível | Média |
| TC10 | Navegar de volta para a página anterior | Média |

---

### TC01 — Acessar a página inicial

É o teste mais básico de todos: só confere se o Bing abre normalmente. Se isso
falhar, provavelmente tem algo bem errado (site fora do ar, bloqueio, etc.).

- **O que fazemos:** entramos na URL base (`/`).
- **O que esperamos:** a página carrega na URL inicial e o título traz "Bing".
- **Prioridade:** Alta

### TC02 — Verificar se o campo de pesquisa está disponível

Antes de tentar pesquisar qualquer coisa, precisamos ter certeza de que o campo de
busca realmente está lá, visível e pronto pra receber texto.

- **O que fazemos:** abrimos a página inicial e procuramos o campo de busca.
- **O que esperamos:** o input (`textarea[name="q"]` ou `input[name="q"]`) aparece
  visível e habilitado.
- **Prioridade:** Alta

### TC03 — Pesquisar um termo válido

Aqui testamos o caminho feliz da busca: digitar algo que existe e ver se o Bing
leva a gente pra página de resultados.

- **Termo usado:** `Cypress.io`
- **O que fazemos:** digitamos o termo no campo de busca e damos Enter.
- **O que esperamos:** a URL muda para `/search` e o bloco de resultados
  (`#b_results`) aparece na página.
- **Prioridade:** Alta

### TC04 — Validar se os resultados correspondem à pesquisa

Não basta a busca "funcionar" — os resultados precisam fazer sentido com o que foi
pesquisado. Esse teste olha o conteúdo da página de resultados.

- **Termo usado:** `Cypress.io`
- **O que fazemos:** realizamos a busca e checamos o texto dos blocos de
  resultado orgânico (`.b_algo`) dentro de `#b_results`.
- **O que esperamos:** existe pelo menos um bloco de resultado e algum deles
  menciona o termo pesquisado (sem diferenciar maiúsculas/minúsculas).
- **Prioridade:** Alta

### TC05 — Pesquisar uma frase com espaços

Em vez de uma palavra só, aqui testamos uma frase completa, pra garantir que os
espaços não quebrem nada.

- **Frase usada:** `teste de automação com cypress`
- **O que fazemos:** digitamos a frase inteira e damos Enter.
- **O que esperamos:** a busca é enviada normalmente e a página de resultados
  carrega.
- **Prioridade:** Média

### TC06 — Pesquisar caracteres especiais

Esse é o teste "quebra-tudo": jogamos símbolos e caracteres incomuns na busca pra
ver se a aplicação aguenta sem travar ou dar erro estranho.

- **Termo usado:** `C++ & @cypress #teste! 100%`
- **O que fazemos:** digitamos esse termo cheio de símbolos e damos Enter.
- **O que esperamos:** a navegação acontece sem travar e a página de resultados é
  exibida normalmente, mesmo com os caracteres especiais.
- **Prioridade:** Média

### TC07 — Pesquisar um termo sem resultados relevantes

E quando a busca não encontra nada? Esse cenário verifica se o Bing lida bem com
esse caso, mostrando a mensagem de "nenhum resultado" em vez de quebrar.

- **Termo usado:** uma string aleatória sem sentido nenhum, entre aspas (tipo
  `"asdkjhqweoiuqwpoeiuzxcvbnmqwerty1234567890semresultadorelevante_xyzteste987"`).
  As aspas forçam uma busca por frase exata — sem elas, o Bing costuma fazer
  "fuzzy match" e devolve resultados parecidos mesmo para termos sem sentido.
- **O que fazemos:** pesquisamos esse termo "impossível" de dar match exato.
- **O que esperamos:** aparece algum aviso de ausência de resultados (algo como
  "There are no results for..." ou "nenhum resultado encontrado").
- **Prioridade:** Média

### TC08 — Enviar uma pesquisa usando Enter

Confirma que dá pra disparar a busca só apertando Enter, sem precisar clicar em
nada — um fluxo bem comum no dia a dia de quem usa o Bing.

- **Termo usado:** `Cypress.io`
- **O que fazemos:** digitamos o termo e pressionamos Enter.
- **O que esperamos:** a página de resultados (`/search`) é carregada.
- **Prioridade:** Alta

### TC09 — Enviar uma pesquisa usando o botão de busca, quando disponível

Mesma ideia do TC08, mas agora clicando no botão de pesquisa em vez de usar o
teclado. Se o botão não estiver acessível no DOM por algum motivo, o teste cai
para o Enter como alternativa, pra não travar sem necessidade.

- **Termo usado:** `Cypress.io`
- **O que fazemos:** digitamos o termo, fechamos a lista de sugestões e clicamos
  no botão de busca — na prática, o ícone de lupa (`label[for="sb_form_go"]`),
  já que o `input#sb_form_go` real fica oculto no DOM (ou usamos Enter como
  fallback, se nada disso aparecer).
- **O que esperamos:** a página de resultados (`/search`) é carregada.
- **Prioridade:** Média

### TC10 — Navegar de volta para a página anterior

Depois de pesquisar, será que o botão "voltar" do navegador funciona direito e
leva o usuário de volta pra página inicial?

- **Termo usado:** `Cypress.io`
- **O que fazemos:** pesquisamos algo e, em seguida, acionamos a navegação de
  volta (`cy.go('back')`).
- **O que esperamos:** voltamos para a página inicial (`/`) com o campo de busca
  visível de novo.
- **Prioridade:** Média

---

## Sobre o banner de cookies

O Bing exibe um aviso de consentimento de cookies da Microsoft
(`#bnp_btn_accept` / `#bnp_cookie_banner`) em praticamente toda visita à
página — diferente do Google, que só mostrava uma vez por sessão. Pra esse
detalhe não atrapalhar os testes, criamos um comando customizado chamado
`cy.aceitarCookiesSeNecessario()` (no arquivo
[cypress/support/commands.js](../cypress/support/commands.js)), que tenta clicar
automaticamente em "Accept" quando o banner aparece. Se o banner não aparecer,
o teste simplesmente segue em frente sem reclamar.

## Sobre erros de script da página (uncaught exceptions)

Como o Bing é um site de terceiros fora do nosso controle, às vezes ele lança
erros de JavaScript que não têm nada a ver com o que estamos testando (scripts
de analytics/experimentos minificados, por exemplo). Para esses erros não
derrubarem os testes à toa, configuramos em
[cypress/support/e2e.js](../cypress/support/e2e.js) para ignorar exceções não
tratadas vindas da aplicação (`Cypress.on('uncaught:exception', () => false)`).

## Como cada cenário se conecta às funcionalidades

| Cenário | O que valida |
|---|---|
| TC01 | Carregamento da página inicial |
| TC02 | Disponibilidade do campo de busca |
| TC03 | Busca básica com termo válido |
| TC04 | Relevância dos resultados exibidos |
| TC05 | Busca com frases/múltiplas palavras |
| TC06 | Resistência da busca a caracteres especiais |
| TC07 | Comportamento quando não há resultados |
| TC08 | Envio da busca pelo teclado (Enter) |
| TC09 | Envio da busca pelo botão de pesquisa |
| TC10 | Navegação de volta do navegador |

---

## Electron vs. Chromium: por que a recomendação

O Bing serve **duas versões diferentes da página inicial** dependendo do
navegador/user-agent detectado:

- Com um **Chromium real** (`npx cypress run --browser chromium`), a home vem
  numa versão enxuta, com o campo de busca como `<input name="q">`. Pressionar
  Enter dispara a navegação nativamente (o próprio HTML já faz isso,
  independente de JavaScript), então o comportamento é 100% estável.
- Com o **Electron** (navegador padrão do Cypress), a home vem numa versão mais
  "rica" (com botões de "Criar Imagens"/"Criar Texto") e o campo de busca é um
  `<textarea name="q">`. Nesse caso, o envio pelo Enter depende de um script da
  própria página interceptar o `keydown` — e isso se mostrou instável sob
  automação no Electron, fazendo a busca às vezes não ser enviada.

Por isso, os scripts do `package.json` (`npm run cypress:run` e
`npm run cypress:open`) já usam `--browser chromium` por padrão. Se você for
rodar via `npx cypress run` diretamente, inclua a flag `--browser chromium`
também.

```bash
npx cypress run --browser chromium
```

## Por que migramos do Google para o Bing

Esses testes rodavam originalmente contra o `google.com`. Durante a
investigação de uma falha que travava a suíte (a partir do TC03, quando o
teste de fato faz uma busca), descobrimos o seguinte:

> **O Google bloqueia os testes por detectar tráfego automatizado.** Rodando a
> suíte inteira em modo headless (Electron), a partir do TC03 o Google passou a
> redirecionar para uma página de verificação anti-bot
> (`https://www.google.com/sorry/index...`). Isso não é um bug no código: é uma
> proteção legítima do Google contra scraping e automação. A prova de que o
> código estava certo é que o TC01 e o TC02 (que não chegam a pesquisar nada)
> sempre passavam, confirmando que a navegação e os seletores funcionavam.

Testamos a hipótese de que um navegador real (em vez do Electron headless)
reduziria o bloqueio. Instalamos o Chromium e rodamos
`npx cypress run --browser chromium` contra o Google — o resultado foi **2
passando / 8 falhando**, ou seja, o bloqueio ocorreu de novo e, nessa execução
específica, ainda mais cedo (a partir do TC03). Isso confirmou que a detecção é
feita pelo Google do lado do servidor (por IP/padrão de tráfego da sessão), não
pelo motor de renderização do navegador — trocar de Electron para
Chrome/Chromium/Edge **não resolveu** o bloqueio do Google.

A evidência técnica do bloqueio:

```
ReferenceError: The following error originated from your application code, not from Cypress.
> solveSimpleChallenge is not defined
    at onload (https://www.google.com/sorry/index?continue=...)
```

```
CypressError: Timed out after waiting `60000ms` for your remote page to load.
```

Diante disso, avaliamos alternativas **sem tentar burlar a proteção do
Google** (o que não faríamos de qualquer forma): também testamos o DuckDuckGo
Lite, que mostrou um desafio anti-bot próprio ("Unfortunately, bots use
DuckDuckGo too") de forma consistente. O Bing, por outro lado, respondeu bem a
buscas automatizadas nos nossos testes, então migramos a suíte pra lá, mantendo
os mesmos 10 cenários.

## Como rodar os testes

```bash
# Instalar as dependências
npm install

# Rodar em modo headless (sem abrir janela), usando Chromium
npm run cypress:run

# Rodar em modo interativo (abre a interface do Cypress), usando Chromium
npm run cypress:open
```
