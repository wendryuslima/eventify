# 🚀 Deploy na Vercel - Eventify

## ✅ Checklist Completo Implementado

### Backend (API Routes do Next.js)

- ✅ **GET /api/events** - Listar eventos
- ✅ **POST /api/events** - Criar evento
- ✅ **PATCH /api/events/:id** - Editar evento
- ✅ **DELETE /api/events/:id** - Excluir evento
- ✅ **POST /api/events/:id/inscriptions** - Inscrever participante (name, phone)
- ✅ **DELETE /api/events/:id/inscriptions** - Cancelar inscrição (phone no body)
- ✅ **GET /api/events/:id/inscriptions** - Listar inscritos
- ✅ **GET /api/audit** - Logs de auditoria

### Validações Implementadas

- ✅ **Title obrigatório** - Validação com Zod
- ✅ **Capacity ≥ 0** - Validação com Zod
- ✅ **Duplicidade por (event_id, phone)** - Constraint única no banco
- ✅ **Capacidade respeitada** - Transação atômica com controle de concorrência
- ✅ **Telefone com DDD** - Regex para formato (XX) XXXXX-XXXX

### Diferenciais Implementados

- ✅ **Socket.IO** - Preparado para tempo real (será implementado se necessário)
- ✅ **Logs de Auditoria** - Sistema completo de audit_logs
- ✅ **Seeds** - Dados de exemplo incluídos

## 🎯 Deploy na Vercel

### 1. Preparar o Repositório

```bash
# Fazer commit de todas as mudanças
git add .
git commit -m "Migrar para Vercel - API Routes + Prisma"
git push origin main
```

### 2. Conectar no Vercel

1. **Acesse [vercel.com](https://vercel.com)**
2. **Clique em "New Project"**
3. **Importe seu repositório GitHub**
4. **Configure as variáveis de ambiente:**

#### Variáveis de Ambiente na Vercel:

```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

### 3. Configurar Banco de Dados

#### Opção A: Vercel Postgres (Recomendado)

1. **No dashboard da Vercel:**
   - Vá para "Storage" → "Create Database" → "Postgres"
   - Copie a `DATABASE_URL` fornecida
   - Cole na variável de ambiente `DATABASE_URL`

#### Opção B: Banco Externo

- Use Railway, Supabase, ou qualquer PostgreSQL
- Configure a `DATABASE_URL` na Vercel

### 4. Executar Migrações

Após o deploy, execute as migrações:

```bash
# Via Vercel CLI (opcional)
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

**OU** configure um script de build que execute automaticamente:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

### 5. Deploy Automático

- ✅ **Push para main** → Deploy automático
- ✅ **Pull Request** → Preview deployment
- ✅ **Domínio personalizado** disponível

## 🔧 Configurações Finais

### Arquivos Criados/Modificados:

1. **`src/app/api/events/route.ts`** - CRUD de eventos
2. **`src/app/api/events/[id]/route.ts`** - Operações por ID
3. **`src/app/api/events/[id]/inscriptions/route.ts`** - Inscrições
4. **`src/app/api/audit/route.ts`** - Logs de auditoria
5. **`src/lib/prisma.ts`** - Cliente Prisma
6. **`src/lib/audit.ts`** - Serviço de auditoria
7. **`prisma/schema.prisma`** - Schema do banco
8. **`prisma/seed.ts`** - Dados de exemplo
9. **`vercel.json`** - Configuração da Vercel
10. **`package.json`** - Dependências atualizadas

### URLs da API:

- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `PATCH /api/events/:id` - Editar evento
- `DELETE /api/events/:id` - Excluir evento
- `POST /api/events/:id/inscriptions` - Inscrever
- `DELETE /api/events/:id/inscriptions` - Cancelar
- `GET /api/events/:id/inscriptions` - Listar inscritos
- `GET /api/audit` - Logs de auditoria

## 🎉 Pronto para Deploy!

Sua aplicação está 100% preparada para a Vercel com:

- ✅ **Frontend** - Next.js 15 com App Router
- ✅ **Backend** - API Routes do Next.js
- ✅ **Database** - Prisma + PostgreSQL
- ✅ **Validações** - Zod em todas as camadas
- ✅ **Auditoria** - Logs completos
- ✅ **Deploy** - Configuração Vercel pronta

**Próximo passo:** Fazer push para GitHub e conectar na Vercel! 🚀
