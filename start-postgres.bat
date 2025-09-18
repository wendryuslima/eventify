@echo off
echo 🐳 Iniciando PostgreSQL com Docker...

REM Iniciar PostgreSQL
docker run --name eventify-postgres -e POSTGRES_DB=eventify -e POSTGRES_USER=eventify_user -e POSTGRES_PASSWORD=eventify_password -p 5432:5432 -d postgres:15

echo ⏳ Aguardando PostgreSQL estar pronto...
timeout /t 10 /nobreak

echo ✅ PostgreSQL iniciado!
echo 📊 Banco: eventify
echo 👤 Usuário: eventify_user  
echo 🔑 Senha: eventify_password
echo 🌐 Porta: 5432

echo.
echo 🚀 Agora execute: npm run setup-db
pause
