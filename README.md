### Objetivos Técnicos Alcançados

- **Arquitetura Fullstack**: Separação clara entre backend (Express + PostgreSQL) e frontend (Next.js 15)
- **Type Safety**: TypeScript end-to-end com validação rigorosa
- **Concorrência**: Controle de capacidade com transações atômicas
- **UX/UI Moderna**: Interface responsiva com componentes reutilizáveis
- **Observabilidade**: Sistema completo de auditoria e logs
- **Tempo Real**: Atualizações automáticas com Socket.IO

## Diferenciais Técnicos Implementados

### Backend (Node.js + Express + PostgreSQL)

**Gestão de Concorrência**

- Transações atômicas para controle de capacidade
- Prevenção de race conditions em inscrições simultâneas
- Validação de duplicidade com constraints de banco

  **Validação Robusta**

- Schema validation com Zod em todas as camadas
- Validação de telefone com DDD brasileiro
- Sanitização de dados de entrada

  **Observabilidade & Auditoria**

- Log completo de todas as operações críticas
- Rastreabilidade de inscrições e cancelamentos
- Monitoramento de capacidade em tempo real

### Frontend (Next.js 15 + React 19)

**Performance & UX**

- App Router do Next.js 15 com otimizações automáticas
- Formulários otimizados com React Hook Form
- Feedback visual imediato com toast notifications

  **Acessibilidade & Design**

- Componentes shadcn/ui seguindo padrões de acessibilidade
- Máscaras inteligentes com react-number-format
- Interface responsiva mobile-first

  **Type Safety Frontend**

- Tipagem completa da API com TypeScript
- Validação de formulários com Zod schemas
- Error boundaries e tratamento de estados

## Stack Tecnológica

### Backend

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod schemas
- **Language**: TypeScript
- **Architecture**: RESTful API com middleware personalizado

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **UX**: Toast notifications, loading states

### DevOps & Quality

- **Database**: Docker Compose para PostgreSQL
- **Development**: Script `dev:full` para execução simultânea
- **Real-time**: Socket.IO para atualizações em tempo real
- **Validation**: End-to-end type safety
- **Code Quality**: ESLint + Prettier
- **Environment**: Configuração completa de dev/prod

## 🔧 Desafios Técnicos Resolvidos

### 1. **Controle de Concorrência**

- Implementação de transações atômicas para prevenir inscrições além da capacidade
- Uso de `FOR UPDATE` no PostgreSQL para lock de registros
- Tratamento de race conditions em cenários de alta concorrência

### 2. **Validação de Duplicidade**

- Constraint única no banco: `(event_id, phone)`
- Validação em múltiplas camadas (frontend, backend, banco)
- Feedback imediato ao usuário sobre duplicidade

### 3. **Type Safety End-to-End**

- Tipagem completa da API com TypeScript
- Schemas Zod compartilhados entre frontend e backend
- Validação de runtime com fallback graceful

### 4. **UX/UI Responsiva**

- Design mobile-first com Tailwind CSS
- Componentes acessíveis seguindo WCAG
- Estados de loading, erro e sucesso bem definidos

### 5. **Tempo Real com Socket.IO**

- Atualizações automáticas de capacidade em tempo real
- Sincronização de inscrições entre múltiplos usuários
- Notificações push para inscrições/cancelamentos
- Rooms por evento para otimização de performance

## 🚀 **Quick Start**

```bash
git clone https://github.com/wendryuslima/eventify.git
cd eventify
echo 'NEXT_PUBLIC_API_URL="http://localhost:3001/api"' > .env.local
cd backend && cp env.example .env && cd ..
docker-compose up -d postgres
cd backend && npm install && npm run db:generate && npm run db:migrate && npm run db:seed && cd ..
npm install
npm run db:generate
npm run dev:full
```

**Acesse**: `http://localhost:3000`

## Instalação e Execução

### 1. Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- Git

### 2. Variáveis de Ambiente

#### Backend (`.env`)

Crie o arquivo `.env` na pasta `backend/` baseado no `env.example`:

```bash
cd backend
cp env.example .env
```

**Ou crie manualmente** o arquivo `.env` na pasta `backend/` com:

```env
# Database
DATABASE_URL="postgresql://eventify_user:eventify_password@localhost:5432/eventify?schema=public"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (`.env.local`)

Crie o arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Clone e Setup

```bash
git clone https://github.com/wendryuslima/eventify.git
cd eventify
```

### 4. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no `env.example`:

```bash
cp env.example .env
```

**Para PostgreSQL local**, ajuste a `DATABASE_URL` no arquivo `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/eventify?schema=public"
```

### 5. Configure o Banco de Dados

#### Opção A: Usando Docker (Recomendado)

```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d postgres

# Gerar o cliente Prisma
npm run db:generate

# Executar as migrações
npm run db:migrate

# Popular com dados de exemplo (opcional)
npm run db:seed
```

#### Opção B: PostgreSQL Local

Certifique-se de que o PostgreSQL está rodando localmente e configure a `DATABASE_URL` no arquivo `.env` com suas credenciais.

```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar as migrações
npm run db:migrate

# Popular com dados de exemplo (opcional)
npm run db:seed
```

### 6. Configure o Frontend

```bash
cd ../ # Voltar para a raiz do projeto
npm install
```

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# Criar o arquivo .env.local
touch .env.local
```

**Conteúdo do arquivo `.env.local`:**

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 7. Executar a Aplicação

#### Opção A: Execução Completa (Recomendado)

```bash
# Executa backend + frontend simultaneamente
npm run dev:full
```

#### Opção B: Execução Separada

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

**URLs de Acesso:**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

### 8. Parar PostgreSQL (quando necessário)

```bash
# Se estiver usando Docker
docker-compose down
```

## API Documentation

### Eventos Endpoints

- `GET /api/events` - Listar todos os eventos
- `POST /api/events` - Criar novo evento
- `PATCH /api/events/:id` - Editar evento existente
- `DELETE /api/events/:id` - Excluir evento

### Inscrições Endpoints

- `GET /api/events/:id/inscriptions` - Listar inscritos do evento
- `POST /api/events/:id/inscriptions` - Inscrever participante
- `DELETE /api/events/:id/inscriptions` - Cancelar inscrição

### Auditoria

- `GET /api/audit` - Logs de auditoria do sistema

## Arquitetura do Banco de Dados

### Schema Principal

- **`Event`** - Eventos (title, description, status, capacity)
- **`Inscription`** - Inscrições (name, phone, event_id)
- **`AuditLog`** - Logs de auditoria completos

### Constraints & Validações

- **Unique Constraint**: `(event_id, phone)` - Previne duplicidade
- **Check Constraints**: Capacidade >= 0, status válido
- **Foreign Keys**: Integridade referencial garantida
- **Transações**: Controle atômico de capacidade

### Performance

- **Índices**: Otimização de consultas por event_id e phone
- **Queries**: Otimizadas para cenários de alta concorrência

## Cenários de Teste

### Funcionalidades Básicas

1. **Criação de Eventos**: `http://localhost:3000/events/create`
2. **Listagem**: Visualizar eventos com status e capacidade
3. **Inscrição**: Formulário com validação de telefone
4. **Cancelamento**: Remoção de inscrições existentes

### Cenários de Concorrência

1. **Capacidade Esgotada**: Teste com múltiplas inscrições simultâneas
2. **Duplicidade**: Tentativa de inscrição duplicada
3. **Validação**: Campos obrigatórios e formatos

### Auditoria

1. **Logs**: Verificar rastreabilidade em `/api/audit`
2. **Histórico**: Todas as operações são registradas

### Teste de Tempo Real (Socket.IO)

1. **Abrir múltiplas abas** do navegador em `http://localhost:3000`
2. **Navegar para um evento** específico
3. **Fazer uma inscrição** em uma aba
4. **Observar atualização automática** nas outras abas:
   - Contador de vagas restantes
   - Lista de participantes
   - Notificações de inscrição/cancelamento
5. **Testar cancelamento** e verificar sincronização entre abas

## Scripts de Desenvolvimento

### Backend (`/backend`)

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar em produção
- `npm run db:generate` - Gerar cliente Prisma
- `npm run db:migrate` - Executar migrações
- `npm run db:seed` - Popular com dados de exemplo

### Frontend (`/`)

- `npm run dev` - Servidor de desenvolvimento
- `npm run dev:full` - **Executa backend + frontend simultaneamente**
- `npm run dev:backend` - Executa apenas o backend
- `npm run build` - Build otimizado para produção
- `npm run start` - Executar em produção
- `npm run lint` - Análise de código

## 🎯 Competências Demonstradas

### Backend Development

- **API Design**: RESTful com endpoints bem estruturados
- **Database Design**: Schema normalizado com constraints apropriados
- **Concurrency**: Controle de transações e race conditions
- **Validation**: Validação robusta em múltiplas camadas
- **Error Handling**: Tratamento adequado de erros e edge cases
- **Real-time**: Socket.IO para comunicação em tempo real

### Frontend Development

- **Modern React**: Hooks, context, e padrões atuais
- **Type Safety**: TypeScript end-to-end
- **UX/UI**: Interface intuitiva e responsiva
- **Form Handling**: Validação e feedback em tempo real
- **State Management**: Gerenciamento eficiente de estado
- **Accessibility**: Componentes acessíveis seguindo WCAG

### DevOps & Quality

- **Environment Setup**: Configuração completa de desenvolvimento
- **Database Management**: Migrações e seeds automatizados
- **Code Quality**: Linting e formatação consistente
- **Documentation**: README detalhado e instruções claras
- **Docker**: Containerização para PostgreSQL
- **Scripts**: Automação de tarefas de desenvolvimento

---

## 📝 Notas de Entrega

Este projeto demonstra um sistema completo de gestão de eventos com todas as funcionalidades solicitadas e diferenciais técnicos implementados. O código está pronto para produção e inclui:

- ✅ CRUD completo de eventos
- ✅ Sistema de inscrições com controle de capacidade
- ✅ Validação de duplicidade
- ✅ Interface moderna e responsiva
- ✅ Atualizações em tempo real
- ✅ Sistema de auditoria completo
- ✅ Documentação detalhada
- ✅ Setup automatizado com Docker

**Para testar**: Execute `npm run dev:full` e acesse `http://localhost:3000`

## 🚨 Troubleshooting

### Problemas Comuns

**1. Erro de conexão com banco de dados**

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Se não estiver, inicie novamente
docker-compose up -d postgres
```

**2. Erro "Module not found" no backend**

```bash
cd backend
npm install
npm run db:generate
```

**3. Erro de migração**

```bash
cd backend
npm run db:migrate
```

**4. Frontend não conecta com backend**

- Verifique se o backend está rodando na porta 3001
- Confirme se o arquivo `.env.local` tem a URL correta
- Verifique se não há firewall bloqueando as portas

**5. Erro de TypeScript: "Property 'inscriptions' does not exist"**

```bash
echo 'NEXT_PUBLIC_API_URL="http://localhost:3001/api"' > .env.local
cd backend && cp env.example .env && cd ..
npm run db:generate
npm run dev:full
```

**6. Erro "@prisma/client did not initialize yet"**

```bash
npm run db:generate
npm run dev:full
```

**7. Script dev:full não funciona**

```bash
# Execute separadamente:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev
```

### Logs e Debug

Para ver logs detalhados do backend, ajuste no arquivo `backend/.env`:

```env
LOG_LEVEL=debug
```

##

**Wendryus Lima**

- GitHub: [@wendryuslima](https://github.com/wendryuslima)
- LinkedIn: [Wendryus Lima](https://linkedin.com/in/wendryuslima)

---
