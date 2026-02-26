@echo off
setlocal
echo ===========================================
echo    Sincronizador Personal: manuelcastillos
echo ===========================================
echo.

:: 1. CONFIGURACION DE IDENTIDAD LOCAL
:: Esto asegura que esta carpeta use tu cuenta personal
git config user.name "manuelcastillos"
git config user.email "tu_email_de_github@example.com"

:: 2. PROCESO DE SUBIDA
echo Preparando cambios...
git add .

set /p msg="Introduce un mensaje para el cambio (ej. nuevos proyectos): "
if "%msg%"=="" set msg="actualizacion personal"

git commit -m "%msg%"

echo.
echo Subiendo a GitHub (manuelcastillos)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [EXITO] Tu portafolio personal ha sido actualizado.
) else (
    echo.
    echo [ERROR] Hubo un problema al subir los cambios.
)

echo.
pause
