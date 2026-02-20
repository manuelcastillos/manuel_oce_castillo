@echo off
echo ===========================================
echo   Generador de Paquete de Actualizacion
echo ===========================================
echo.
echo Comprimiendo archivos de web_personal...
echo.

set ZIP_NAME=web_actualizada.zip

:: Usar PowerShell para crear el ZIP ya que es estandar en Windows
powershell -Command "if (Test-Path %ZIP_NAME%) { Remove-Item %ZIP_NAME% }; Compress-Archive -Path '../web_personal/*' -DestinationPath %ZIP_NAME% -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [EXITO] Archivo '%ZIP_NAME%' creado correctamente.
    echo Sube este archivo a tu repositorio de GitHub o a Netlify Drop.
    echo.
) else (
    echo.
    echo [ERROR] Hubo un problema al crear el archivo ZIP.
    echo.
)

pause
