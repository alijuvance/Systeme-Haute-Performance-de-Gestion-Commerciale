@echo off
setlocal
set TIMESTAMP=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%_%TIME:~0,2%-%TIME:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FILE=backup_erp_%TIMESTAMP%.sql

echo ========================================================
echo Sauvegarde de la Base de Donnees ERP
echo ========================================================
echo.
echo Fichier de sauvegarde : %BACKUP_FILE%

docker exec -t erp_db pg_dump -U erp_user -d erp_db -F c > %BACKUP_FILE%

if %errorlevel% equ 0 (
    echo.
    echo [SUCCES] Sauvegarde terminee avec succes !
) else (
    echo.
    echo [ERREUR] La sauvegarde a echouee.
)

echo.
pause
