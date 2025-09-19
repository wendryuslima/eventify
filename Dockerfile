# Multi-stage build para produção
FROM node:18-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências do frontend
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Instalar dependências do backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app

# Build do backend
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci
COPY backend/ ./
RUN npm run build

# Build do frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Imagem de produção, copiar todos os arquivos e executar
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos do backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma

# Copiar arquivos do frontend
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
EXPOSE 3001

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Script para executar ambos os serviços
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
