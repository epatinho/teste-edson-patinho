# Spotify App - Desafio Técnico

Esta aplicação foi desenvolvida como parte de um desafio técnico, utilizando a API oficial do Spotify para criar uma experiência interativa que permite aos usuários visualizar seus artistas favoritos, playlists e gerenciar seu conteúdo musical.

# Requisitos
## Requisitos obrigatórios
- [x] Seguimentação de commits
- [x] Lint
- [x] Autenticação via Spotify
- [x] Listar artistas
- [x] Listar albuns de um artista
- [x] Utilizar paginação (scroll infinito ou não)
- [x] Funcionamento offline
- [x] Testes unitários
- [x] Deploy da aplicação
## Bônus
- [x] Testes E2E
- [ ] Integração com Sentry
- [x] CI/CD
- [x] Responsividade (celular e tablet)
- [x] Qualidade de código (Sonarqube)
- [x] PWA

## 🚀 Funcionalidades

- **Autenticação via Spotify OAuth 2.0**: Login seguro usando o fluxo de autorização do Spotify
- **Dashboard de Artistas**: Visualize seus artistas mais ouvidos com paginação por scroll infinito
- **Detalhes dos Artistas**: Explore álbuns e músicas de cada artista
- **Gerenciamento de Playlists**: Visualize, crie e gerencie suas playlists do Spotify
- **Perfil de Usuário**: Acesse informações da sua conta Spotify
- **Modo Offline**: Funcionalidade PWA com suporte para visualização offline

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework de UI com os mais recentes recursos
- **TypeScript**: Tipagem estática para desenvolvimento mais seguro
- **React Router v7**: Sistema de roteamento avançado
- **Chakra UI**: Biblioteca de componentes para design responsivo
- **Zustand & React Context**: Gerenciamento de estado da aplicação
- **React Query**: Gerenciamento de estado do servidor e cache
- **Axios**: Cliente HTTP para chamadas à API
- **PWA/Service Worker**: Suporte para funcionamento offline
- **Jest & React Testing Library**: Suite de testes unitários
- **ESLint & Prettier**: Ferramentas de qualidade de código
- **CI/CD**: Pipeline automatizado para integração e deploy contínuos

## 📊 Arquitetura

O projeto segue uma arquitetura modular organizada por funcionalidades:

- **Features**: Módulos separados por domínio (artists, playlists, auth, home, user)
- **Components**: Componentes compartilhados e reutilizáveis
- **Context**: Gerenciamento de estado global
- **Services**: Camada de serviço para API e autenticação
- **Hooks**: Hooks personalizados para lógica reutilizável
- **Utils**: Funções utilitárias e formatadores

### 🧩 Escolhas Arquiteturais e Tecnológicas

A arquitetura e as tecnologias foram escolhidas visando três aspectos principais: manutenabilidade, escalabilidade e desempenho:

#### Manutenabilidade
- **Arquitetura por Features**: Organização do código por domínios de negócio, facilitando a localização e manutenção
- **Separação de Componentes**: Divisão clara entre componentes de apresentação (UI) e componentes container (lógica)
- **ESLint e Prettier**: Garantia de consistência de código e conformidade com padrões
- **TypeScript**: Tipagem forte para prevenir erros em tempo de desenvolvimento
- **Testes Unitários**: Cobertura de testes para garantir funcionamento contínuo após mudanças

#### Escalabilidade
- **React Context + Zustand**: Gerenciamento de estado escalável, onde o Context gerencia estados globais da aplicação e Zustand gerencia estados específicos de features
- **React Query**: Cache e gerenciamento eficiente de estado do servidor, reduzindo requisições desnecessárias
- **Estrutura Modular**: Facilita a adição de novos recursos e funcionalidades sem comprometer o código existente
- **GitFlow**: Fluxo de trabalho estruturado para desenvolvimento em equipe, facilitando a integração de novas features

#### Desempenho
- **React 19**: Aproveitamento das mais recentes otimizações de renderização do React
- **PWA/Service Workers**: Caching de recursos para carregamento rápido e funcionalidade offline
- **Lazy Loading**: Carregamento sob demanda de componentes para redução do tempo de carregamento inicial
- **Paginação com Scroll Infinito**: Carregamento eficiente de grandes listas de dados
- **Chakra UI**: Sistema de componentes otimizados com estilos em JS para melhor performance

## 🚀 Demo

**URL de Acesso:** [https://epatinho.github.io/teste-edson-patinho/](https://epatinho.github.io/teste-edson-patinho/)

> **Observação Importante:** Por utilizar uma licença de desenvolvimento do Spotify, apenas usuários previamente cadastrados na lista de permissões podem efetuar login. Se desejar testar a aplicação, entre em contato para adicionar seu e-mail do Spotify à lista de permissões.

Este demo foi implantado automaticamente através do pipeline de CI/CD do GitHub Actions configurado no projeto. O processo completo inclui testes unitários, análise de qualidade com SonarQube e deploy automático para o GitHub Pages sempre que há um merge na branch main.

## 🏃‍♂️ Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn
- Credenciais de API do Spotify (Client ID e Client Secret)

### Configuração

1. Clone o repositório:
```
git clone https://github.com/seu-usuario/teste-edson-patinho.git
cd teste-edson-patinho
```

2. Instale as dependências:
```
npm install
```

3. Configure as variáveis de ambiente: 

**Opção 1 - Usar o template existente (Recomendado)**: 
O projeto já inclui um arquivo `.env.test.local` com um template das variáveis necessárias. Renomeie este arquivo para `.env` e substitua os valores pelos seus dados reais do Spotify:

```
HOST=127.0.0.1
PORT=3000
HTTPS=true
REACT_APP_CLIENT_ID=seu_client_id_aqui
REACT_APP_CLIENT_SECRET=seu_client_secret_aqui
REACT_APP_REDIRECT_URI=https://127.0.0.1:3000/callback
```

**Opção 2 - Criar um novo arquivo .env**:
Caso prefira, crie um novo arquivo `.env` na raiz do projeto com as mesmas variáveis acima.

> **Nota**: O arquivo `.env` está configurado para não ser rastreado pelo Git, mantendo suas credenciais seguras.

### Executando o Projeto

```
npm start
```
Acesse a aplicação em https://127.0.0.1:3000/

### Scripts Disponíveis

- **npm start**: Inicia o servidor de desenvolvimento
- **npm run build**: Compila o projeto para produção
- **npm run build:pwa**: Compila o projeto com suporte a PWA
- **npm test**: Executa os testes unitários
- **npm run test:coverage**: Executa os testes com relatório de cobertura
- **npm run lint**: Verifica problemas de lint no código
- **npm run lint:fix**: Corrige automaticamente problemas de lint
- **npm run format**: Formata o código seguindo o padrão definido

## 📱 PWA e Suporte Offline

A aplicação implementa um Service Worker para permitir:
- Cache de recursos estáticos
- Funcionalidade offline para conteúdo já visitado
- Experiência de instalação em dispositivos móveis
- Atualizações automáticas quando uma nova versão está disponível

## 🧪 Testes e Qualidade de Código

O projeto possui uma suite completa de testes para garantir qualidade e confiabilidade:

### Testes Unitários
Utilizando Jest e React Testing Library, com foco em:
- Componentes de UI
- Hooks personalizados
- Context de autenticação
- Lógica de serviços

**Objetivos de Cobertura:**
- **Atual:** Mínimo de 30% de cobertura para branches, functions, lines e statements para título de exemplo
- **Ideal:** Ter 80% de cobertura em todos os aspectos
- **Comandos:**
  ```
  npm run test:coverage      # Executa testes com relatório de cobertura
  npm run test:coverage:open # Visualiza relatório HTML de cobertura
  ```

### Testes E2E (End-to-End)
Implementados com **Cypress** para automação completa dos cenários de teste:

#### 🤖 Testes E2E Automatizados (Cypress)
- **npm run test:e2e:dev**: Inicia servidor automaticamente + executa todos os testes E2E
- **npm run test:e2e:dev:open**: Inicia servidor automaticamente + abre interface interativa do Cypress
- **npm run test:e2e**: Executa todos os testes E2E em modo headless (servidor já deve estar rodando)
- **npm run test:e2e:open**: Abre interface do Cypress para execução interativa (servidor já deve estar rodando)
- **npm run test:e2e:headed**: Executa testes com interface visual (servidor já deve estar rodando)

**Cenários cobertos automaticamente:**
- Fluxo completo de autenticação (login/logout)
- Navegação e listagem de artistas
- Navegação entre diferentes páginas da aplicação
- Responsividade em diferentes resoluções (mobile, tablet, desktop)
- Funcionalidade offline/PWA
- Tratamento gracioso de erros de API

**Comandos personalizados criados:**
- `cy.loginWithSpotify()` - Simula autenticação com dados mock
- `cy.logoutFromSpotify()` - Limpa dados de autenticação
- `cy.goOffline()` / `cy.goOnline()` - Simula estados de conectividade

### SonarQube
O projeto está integrado ao SonarCloud para análise contínua de qualidade de código. A análise é executada automaticamente na branch principal (main) e em todas as branches de release.

O SonarCloud verifica:
- Code smells
- Bugs potenciais
- Vulnerabilidades de segurança
- Duplicação de código
- Complexidade ciclomática
- Cobertura de testes

A configuração do SonarQube está definida no arquivo `sonar-project.properties` e a análise é executada como parte do pipeline de CI/CD nos workflows do GitHub Actions.

## 📝 Padrões de Commits e Fluxo de Branches

### Tipos de Commits
Seguimos um padrão claro para mensagens de commit:

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **refactor**: Refatoração de código
- **test**: Adiciona ou modifica testes
- **docs**: Atualização de documentação
- **style**: Mudanças que não afetam o comportamento do código
- **perf**: Melhorias de performance

### Estratégia de Branches (GitFlow)

O projeto segue uma estratégia de branches baseada no GitFlow:

- **main**: Branch de produção, contendo código estável e pronto para implantação
- **release**: Branch de pré-produção para testes finais antes do merge com main
- **feature/**: Branches para desenvolvimento de novas funcionalidades (merge para release)
- **hotfix/**: Branches para correções urgentes (merge direto para main e release)

#### Fluxo de Trabalho
1. **Novas funcionalidades:** 
   - Criar branch `feature/nome-da-funcionalidade` a partir de `release`
   - Desenvolver e testar a funcionalidade
   - Criar Pull Request para merge na branch `release`

2. **Lançamento de versões:**
   - Branch `release` recebe todas as features planejadas
   - Testes finais na branch `release`
   - Merge da `release` para `main` quando aprovada

3. **Correções urgentes:**
   - Criar branch `hotfix/nome-da-correcao` a partir de `main`
   - Implementar a correção
   - Merge do `hotfix` para `main` e também para `release`

## 🔄 CI/CD e Qualidade de Código

- **ESLint**: Garantia de padrões de código consistentes
- **Prettier**: Formatação automática de código
- **Testes Automatizados**: Execução de testes a cada commit/PR
- **Análise de Cobertura**: Monitoramento da cobertura de testes

---

Desenvolvido por Edson Patinho Jr.
