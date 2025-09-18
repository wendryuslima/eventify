@echo off
echo 🚀 Configurando banco de dados Eventify...

cd backend

echo 🔄 Executando migrações...
npx prisma migrate dev --name init

echo 🌱 Executando seed...
npx prisma db seed

echo ✅ Banco de dados configurado com sucesso!
echo.
echo 🎉 Agora você pode executar:
echo   - Backend: cd backend && npm run dev
echo   - Frontend: npm run dev
echo.
pause
