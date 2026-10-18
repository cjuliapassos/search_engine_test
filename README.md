# buscador_test

[![Testes E2E Cypress - Bing Search](https://github.com/cjuliapassos/search_engine_test/actions/workflows/cypress.yml/badge.svg)](https://github.com/cjuliapassos/search_engine_test/actions/workflows/cypress.yml)

Suíte de testes E2E (ponta a ponta) com [Cypress](https://www.cypress.io/) para
validar o fluxo de busca do [bing.com](https://www.bing.com).

## Sobre o projeto

São 10 cenários de teste que cobrem o essencial de uma busca: carregamento da
página inicial, disponibilidade do campo de busca, pesquisa de termos válidos,
frases com espaços, caracteres especiais, termos sem resultado, envio via
teclado e via botão, e navegação de volta pelo histórico do navegador.

Os testes rodam contra o Bing de verdade (sem mocks nem servidor local), então
é necessário ter acesso à internet para executá-los. Para o histórico completo
de por que o Bing foi escolhido (em vez do Google) e outras decisões técnicas,
veja [docs/CENARIOS_DE_TESTE.md](docs/CENARIOS_DE_TESTE.md).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado 18+)
- npm (vem junto com o Node.js)

## Instalação

```bash
npm install
```

## Como rodar os testes

```bash
# Modo headless (sem abrir janela), usando Chromium
npm run cypress:run

# Modo interativo (abre a interface do Cypress), usando Chromium
npm run cypress:open
```

> **Por que Chromium?** O Bing serve uma versão diferente da página para o
> Electron (navegador padrão do Cypress), o que deixa o envio de busca via
> Enter instável. Por isso os scripts acima já usam `--browser chromium`. Mais
> detalhes em
> [docs/CENARIOS_DE_TESTE.md](docs/CENARIOS_DE_TESTE.md#electron-vs-chromium-por-que-a-recomendação).

## Estrutura do projeto

```
├── cypress/
│   ├── e2e/
│   │   └── bing.cy.js        # Cenários de teste (TC01–TC10)
│   └── support/
│       ├── commands.js       # Comando customizado para aceitar cookies
│       └── e2e.js            # Configurações globais do Cypress
├── docs/
│   └── CENARIOS_DE_TESTE.md  # Documentação detalhada de cada cenário
├── cypress.config.js         # Configuração do Cypress (baseUrl, etc.)
└── .github/workflows/
    └── cypress.yml           # CI: roda os testes a cada push/PR na main
```

## Integração contínua

Todo `push` ou `pull request` para a branch `main` dispara automaticamente a
execução dos testes via GitHub Actions
([.github/workflows/cypress.yml](.github/workflows/cypress.yml)). Em caso de
falha, screenshots e vídeos da execução ficam disponíveis como artefatos do
workflow.

## Documentação adicional

Para entender o objetivo de cada cenário de teste, prioridades e decisões
técnicas (como o motivo da migração do Google para o Bing), consulte
[docs/CENARIOS_DE_TESTE.md](docs/CENARIOS_DE_TESTE.md).
