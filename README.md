# Spotify App - Desafio Técnico

Esta aplicação foi desenvolvida como parte de um desafio técnico, utilizando a API oficial do Spotify para criar uma experiência interativa que permite aos usuários visualizar seus artistas favoritos, playlists e gerenciar seu conteúdo musical.

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

3. Configure as variáveis de ambiente: Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
REACT_APP_CLIENT_ID=seu_client_id_do_spotify
REACT_APP_CLIENT_SECRET=seu_client_secret_do_spotify
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
```

### Executando o Projeto

```
npm start
```
Acesse a aplicação em http://localhost:3000

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

## 🧪 Testes

O projeto possui testes unitários para componentes e lógica de negócio, utilizando Jest e React Testing Library, com foco em:
- Componentes de UI
- Hooks personalizados
- Context de autenticação
- Lógica de serviços

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

Desenvolvido com ❤️ por Edson Junior
