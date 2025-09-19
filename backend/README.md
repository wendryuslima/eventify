# Eventify Backend

Backend da aplicação Eventify - Sistema de gerenciamento de eventos e inscrições.

## 🚀 Tecnologias

- **Node.js** com **Express**
- **TypeScript**
- **PostgreSQL** com **Prisma ORM**
- **Zod** para validação
- **CORS** e **Helmet** para segurança

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## ⚙️ Configuração

1. **Clone o repositório e navegue para a pasta backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/eventify?schema=public"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Configure o banco de dados:**
   ```bash
   # Gerar o cliente Prisma
   npm run db:generate
   
   # Executar as migrations
   npm run db:migrate
   
   # (Opcional) Executar seeds para dados de exemplo
   npm run db:seed
   ```

## 🏃‍♂️ Como executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3001`

## 📚 Endpoints da API

### Eventos

- `GET /api/events` - Listar todos os eventos
- `GET /api/events/:id` - Buscar evento por ID
- `POST /api/events` - Criar novo evento
- `PATCH /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento

### Inscrições

- `POST /api/events/:id/inscriptions` - Inscrever participante
- `DELETE /api/events/:id/inscriptions` - Cancelar inscrição
- `GET /api/events/:id/inscriptions` - Listar inscrições do evento

### Health Check

- `GET /health` - Verificar status do servidor

## 📝 Exemplos de uso

### Criar evento
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Churrasco dos Amigos",
    "description": "Churrasco na casa do João",
    "capacity": 20,
    "status": "ACTIVE"
  }'
```

### Inscrever participante
```bash
curl -X POST http://localhost:3001/api/events/1/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "phone": "(11) 99999-9999"
  }'
```

### Cancelar inscrição
```bash
curl -X DELETE http://localhost:3001/api/events/1/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "(11) 99999-9999"
  }'
```

## 🔧 Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa a versão compilada
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:migrate` - Executa as migrations
- `npm run db:seed` - Executa os seeds

## 🛡️ Validações

- **Eventos**: Título obrigatório, capacidade ≥ 0
- **Inscrições**: Nome obrigatório, telefone no formato (XX) XXXXX-XXXX
- **Duplicidade**: Impede inscrição duplicada no mesmo evento
- **Capacidade**: Respeita limite de vagas com controle de concorrência

## 📊 Logs de Auditoria

Todas as ações importantes são registradas na tabela `audit_logs`:
- Criação, atualização e exclusão de eventos
- Inscrições e cancelamentos
- Detalhes das operações para auditoria

## 🚨 Tratamento de Erros

A API retorna erros padronizados com:
- Código de status HTTP apropriado
- Mensagem de erro clara
- Detalhes da validação quando aplicável
- Logs no console para debugging
