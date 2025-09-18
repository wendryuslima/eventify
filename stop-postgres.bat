@echo off
echo 🛑 Parando PostgreSQL...

docker stop eventify-postgres
docker rm eventify-postgres

echo ✅ PostgreSQL parado e removido!
pause
