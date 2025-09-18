#!/bin/bash

echo "🚀 Configurando PostgreSQL para Eventify..."

# Criar arquivo .env se não existir
if [ ! -f "backend/.env" ]; then
    echo "📝 Criando arquivo .env..."
    cat > backend/.env << EOF
# Database
DATABASE_URL="postgresql://eventify_user:eventify_password@localhost:5432/eventify?schema=public"

# Server
PORT=3000
FRONTEND_URL="http://localhost:3001"
EOF
    echo "✅ Arquivo .env criado!"
fi

# Iniciar PostgreSQL com Docker
echo "🐳 Iniciando PostgreSQL com Docker..."
docker-compose up -d postgres

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Executar migrações
echo "🔄 Executando migrações..."
cd backend
npx prisma migrate dev --name init

# Executar seed
echo "🌱 Executando seed..."
npx prisma db seed

echo "✅ PostgreSQL configurado com sucesso!"
echo "📊 Banco de dados: eventify"
echo "👤 Usuário: eventify_user"
echo "🔑 Senha: eventify_password"
echo "🌐 Porta: 5432"
