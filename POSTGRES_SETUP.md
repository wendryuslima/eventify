# 🐘 Configuração do PostgreSQL - Eventify

## 🚀 Setup Rápido (Windows)

### 1. **Iniciar PostgreSQL**

```bash
# Execute o comando:
docker-compose up -d postgres
```

### 2. **Configurar Banco de Dados**

```bash
# Execute os comandos:
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. **Iniciar Aplicação**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 4. **Parar PostgreSQL (quando necessário)**

```bash
# Execute o comando:
docker-compose down
```

---

## 📋 **Informações do Banco**

- **Host:** localhost
- **Porta:** 5432
- **Banco:** eventify
- **Usuário:** eventify_user
- **Senha:** eventify_password

---

## 🔧 **Comandos Manuais (se necessário)**

### Iniciar PostgreSQL:

```bash
docker run --name eventify-postgres -e POSTGRES_DB=eventify -e POSTGRES_USER=eventify_user -e POSTGRES_PASSWORD=eventify_password -p 5432:5432 -d postgres:15
```

### Configurar Banco:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### Parar PostgreSQL:

```bash
docker stop eventify-postgres
docker rm eventify-postgres
```

---

## ✅ **Verificar se está funcionando**

1. Acesse: http://localhost:3001/api/events
2. Deve retornar uma lista de eventos em JSON
3. As datas devem aparecer corretamente (sem "Invalid Date")

---

## 🆘 **Problemas Comuns**

### Docker não está rodando:

- Abra o Docker Desktop
- Aguarde ele inicializar completamente
- Execute os scripts novamente

### Porta 5432 em uso:

- Execute `docker-compose down`
- Aguarde alguns segundos
- Execute `docker-compose up -d postgres` novamente

### Erro de permissão:

- Execute o terminal como Administrador
- Ou use o PowerShell como Administrador
