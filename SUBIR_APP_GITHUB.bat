@echo off
setlocal
echo =======================================================
echo    Sincronizador App Movil OFMC 2026 a GitHub Pages
echo    Repositorio: https://github.com/manuelcastillos/manuel_oce_castillo
echo =======================================================
echo.

cd /d "D:\Proyectos_atigravity\web_personal"

:: 1. Configuracion de usuario git
git config user.name "manuelcastillos"

:: 2. Anadir cambios de app_congreso
echo [1/3] Anadiendo archivos de la App Movil...
git add app_congreso/

:: 3. Commit
set msg=Actualizacion de la App Movil OFMC 2026 con programa en vivo y salas paralelas
echo [2/3] Creando commit: "%msg%"
git commit -m "%msg%"

:: 4. Push a GitHub
echo [3/3] Subiendo cambios a GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================
    echo  [EXITO] La App Movil ha sido desplegada en GitHub!
    echo  Estará disponible en breves minutos en:
    echo  https://manuelcastillos.github.io/manuel_oce_castillo/app_congreso/
    echo =======================================================
) else (
    echo.
    echo [AVISO] Revisa tu conexion a Internet o credenciales de Git.
)

echo.
pause
