@echo off
echo === INICIANDO FRONTEND REACT ===
cd /d "E:\Develop\catalogohq\frontend"
echo Diretorio atual: %CD%
echo.
echo Verificando package.json...
if exist package.json (
    echo ✅ package.json encontrado!
) else (
    echo ❌ package.json nao encontrado!
    pause
    exit /b 1
)

echo.
echo Verificando node_modules...
if not exist node_modules (
    echo 📦 Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo 🚀 Iniciando servidor de desenvolvimento...
echo Frontend estara disponivel em: http://localhost:5173/
echo (ou proxima porta disponivel se 5173 estiver em uso)
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev
pause