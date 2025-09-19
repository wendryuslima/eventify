#!/bin/bash

# Função para aguardar o banco de dados estar disponível
wait_for_db() {
    echo "Aguardando banco de dados estar disponível..."
    until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
        echo "Banco de dados não está disponível - aguardando..."
        sleep 2
    done
    echo "Banco de dados está disponível!"
}

# Executar migrações do banco
run_migrations() {
    echo "Executando migrações do banco de dados..."
    cd backend
    npm run db:migrate:deploy
    echo "Migrações concluídas!"
    cd ..
}

# Iniciar backend em background
start_backend() {
    echo "Iniciando backend..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    echo "Backend iniciado com PID: $BACKEND_PID"
}

# Iniciar frontend
start_frontend() {
    echo "Iniciando frontend..."
    npm start
}

# Função para cleanup ao sair
cleanup() {
    echo "Parando serviços..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
    fi
    exit 0
}

# Capturar sinais de interrupção
trap cleanup SIGINT SIGTERM

# Verificar se estamos em produção
if [ "$NODE_ENV" = "production" ]; then
    # Aguardar banco e executar migrações
    wait_for_db
    run_migrations
fi

# Iniciar backend
start_backend

# Aguardar um pouco para o backend inicializar
sleep 3

# Iniciar frontend (bloqueante)
start_frontend
