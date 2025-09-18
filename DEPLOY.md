# 🚀 Deploy na Vercel - Eventify

## 📋 **Estratégia de Deploy**

### **Frontend (Next.js) → Vercel**

### **Backend (Express) → Railway/Render**

### **Banco (PostgreSQL) → Neon/Supabase**

---

## 🎯 **Passo a Passo**

### 1. **Preparar Backend para Produção**

#### 1.1. Configurar banco PostgreSQL em produção

- [Neon](https://neon.tech) (gratuito)
- [Supabase](https://supabase.com) (gratuito)
- [PlanetScale](https://planetscale.com) (gratuito)

#### 1.2. Deploy do Backend

**Opção A: Railway**

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd backend
railway init
railway up
```

**Opção B: Render**

```bash
# 1. Conectar repositório no Render
# 2. Configurar:
#    - Build Command: npm run build
#    - Start Command: npm start
#    - Environment: Node
```

### 2. **Deploy do Frontend na Vercel**

#### 2.1. Configurar variáveis de ambiente

```bash
# No painel da Vercel, adicionar:
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

#### 2.2. Deploy

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

---

## 🔧 **Configurações Necessárias**

### **Backend (.env)**

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
PORT=3001
FRONTEND_URL="https://seu-frontend.vercel.app"
```

### **Frontend (Vercel Environment Variables)**

```env
NEXT_PUBLIC_API_URL="https://seu-backend.railway.app"
```

---

## 🧪 **Testando o Deploy**

1. **Backend**: `https://seu-backend.railway.app/health`
2. **Frontend**: `https://seu-frontend.vercel.app`
3. **API**: `https://seu-backend.railway.app/api/events`

---

## 💡 **Dicas Importantes**

- ✅ Use HTTPS em produção
- ✅ Configure CORS corretamente
- ✅ Use variáveis de ambiente
- ✅ Configure domínio personalizado (opcional)
- ✅ Monitore logs de erro

---

## 🆘 **Problemas Comuns**

### **CORS Error**

```javascript
// backend/src/index.ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://seu-frontend.vercel.app",
    credentials: true,
  })
);
```

### **Database Connection**

- Verifique se a URL do banco está correta
- Execute migrações: `npx prisma migrate deploy`

### **Environment Variables**

- Verifique se todas as variáveis estão configuradas
- Use `vercel env ls` para listar variáveis
