# 🚀 Guia de Deploy - Eventify

Este guia contém instruções para fazer deploy da aplicação Eventify em diferentes plataformas.

## 📋 Pré-requisitos

- Conta no GitHub (para deploy automático)
- Node.js 18+ instalado localmente
- Git configurado

## 🎯 Opções de Deploy

### 1. **Vercel (Recomendado para iniciantes)**

#### Frontend + Backend no Vercel

1. **Fazer push do código para GitHub**

   ```bash
   git add .
   git commit -m "Preparar para deploy"
   git push origin main
   ```

2. **Conectar repositório no Vercel**

   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório GitHub
   - Configure as variáveis de ambiente:
     ```
     NEXT_PUBLIC_API_URL=https://seu-projeto.vercel.app/api
     ```

3. **Configurar banco de dados**

   - Use Vercel Postgres (gratuito)
   - Copie a `DATABASE_URL` fornecida
   - Configure no Vercel: `DATABASE_URL=postgresql://...`

4. **Deploy automático**
   - O Vercel fará deploy automático a cada push
   - Acesse sua aplicação em `https://seu-projeto.vercel.app`

#### Apenas Frontend no Vercel + Backend separado

1. **Deploy do Backend (Railway/Render)**

   - Veja seção 2 ou 3 abaixo

2. **Deploy do Frontend**
   - Configure `NEXT_PUBLIC_API_URL` com a URL do seu backend
   - Exemplo: `NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api`

---

### 2. **Railway (Backend + Database)**

1. **Conectar repositório**

   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project" → "Deploy from GitHub repo"
   - Selecione seu repositório

2. **Configurar banco PostgreSQL**

   - Adicione serviço "PostgreSQL"
   - Railway criará automaticamente a `DATABASE_URL`

3. **Configurar variáveis de ambiente**

   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   FRONTEND_URL=https://seu-frontend.vercel.app
   PORT=3001
   ```

4. **Deploy**
   - Railway detectará automaticamente o backend
   - Deploy será feito automaticamente

---

### 3. **Render (Backend + Database)**

1. **Conectar repositório**

   - Acesse [render.com](https://render.com)
   - Clique em "New" → "Web Service"
   - Conecte seu repositório GitHub

2. **Configurar serviço**

   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: `Node`

3. **Adicionar banco PostgreSQL**

   - Clique em "New" → "PostgreSQL"
   - Copie a `DATABASE_URL` interna

4. **Configurar variáveis de ambiente**
   ```
   DATABASE_URL=postgresql://...
   FRONTEND_URL=https://seu-frontend.vercel.app
   PORT=3001
   ```

---

### 4. **DigitalOcean App Platform**

1. **Conectar repositório**

   - Acesse [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Vá para "Apps" → "Create App"
   - Conecte seu repositório GitHub

2. **Configurar componentes**

   - **Frontend**: Next.js, pasta raiz
   - **Backend**: Node.js, pasta `backend`
   - **Database**: PostgreSQL gerenciado

3. **Configurar variáveis de ambiente**

   ```
   # Frontend
   NEXT_PUBLIC_API_URL=https://seu-backend.ondigitalocean.app/api

   # Backend
   DATABASE_URL=postgresql://...
   FRONTEND_URL=https://seu-frontend.ondigitalocean.app
   ```

---

### 5. **Docker + VPS**

1. **Preparar VPS**

   - Ubuntu 20.04+ recomendado
   - Docker e Docker Compose instalados

2. **Clonar repositório**

   ```bash
   git clone https://github.com/seu-usuario/eventify.git
   cd eventify
   ```

3. **Configurar variáveis de ambiente**

   ```bash
   cp env.production.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Deploy com Docker**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Configurar domínio (opcional)**
   - Use Nginx como proxy reverso
   - Configure SSL com Let's Encrypt

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente

#### Frontend

```env
NEXT_PUBLIC_API_URL=https://seu-backend.com/api
```

#### Backend

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
FRONTEND_URL=https://seu-frontend.com
PORT=3001
```

### Domínios e CORS

- Configure `FRONTEND_URL` no backend com o domínio exato do frontend
- Para desenvolvimento local: `http://localhost:3000`
- Para produção: `https://seu-dominio.com`

---

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**

   - Verifique se `FRONTEND_URL` está configurado corretamente
   - Certifique-se que não há trailing slash

2. **Erro de banco de dados**

   - Verifique se `DATABASE_URL` está correta
   - Execute migrações: `npm run db:migrate:deploy`

3. **Build falha**

   - Verifique se todas as dependências estão no `package.json`
   - Certifique-se que o Node.js versão é 18+

4. **Socket.IO não funciona**
   - Verifique se as portas estão abertas
   - Configure proxy se necessário

### Logs e Debug

- **Vercel**: Logs disponíveis no dashboard
- **Railway**: `railway logs`
- **Render**: Logs no dashboard
- **Docker**: `docker-compose logs -f`

---

## 📊 Monitoramento

### Health Checks

- **Backend**: `GET /health`
- **Frontend**: Página principal carregando

### Métricas Importantes

- Tempo de resposta da API
- Uso de memória e CPU
- Conexões de banco de dados
- Erros 4xx/5xx

---

## 🔄 Deploy Contínuo

Todas as plataformas suportam deploy automático:

1. **Push para main** → Deploy automático
2. **Pull Request** → Preview deployment
3. **Rollback** → Disponível em todas as plataformas

---

## 💰 Custos Estimados

- **Vercel**: Gratuito (hobby), $20/mês (pro)
- **Railway**: $5/mês (hobby), $20/mês (pro)
- **Render**: Gratuito (limitado), $7/mês (starter)
- **DigitalOcean**: $12/mês (basic)
- **VPS**: $5-20/mês dependendo do provedor

---

## 🎉 Próximos Passos

Após o deploy:

1. **Teste todas as funcionalidades**
2. **Configure domínio personalizado**
3. **Configure SSL/HTTPS**
4. **Configure monitoramento**
5. **Configure backups do banco**

---

**Precisa de ajuda?** Abra uma issue no repositório ou consulte a documentação da plataforma escolhida.
