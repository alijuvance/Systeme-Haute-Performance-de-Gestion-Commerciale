@echo off
echo ========================================================
echo Lancement de l'ERP - Systeme de Gestion Commerciale
echo ========================================================
echo.
echo Démarrage des conteneurs via Docker Compose...
docker-compose up -d

echo.
echo Les services sont en cours de demarrage.
echo L'ERP sera accessible dans quelques instants sur : http://localhost:3000
echo.
pause
