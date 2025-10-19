# Script para iniciar o frontend React
Write-Host "=== INICIANDO FRONTEND REACT ===" -ForegroundColor Cyan

# Usar caminho relativo para evitar problemas
$currentDir = Get-Location
$frontendPath = Join-Path $currentDir "frontend"
Write-Host "Navegando para: $frontendPath" -ForegroundColor Yellow

if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "✅ Diretório encontrado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro: Diretório frontend não encontrado!" -ForegroundColor Red
    Write-Host "Verifique se você está no diretório raiz do projeto" -ForegroundColor Yellow
    Read-Host "Pressione Enter para fechar"
    return
}

# Verificar se package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro: package.json não encontrado!" -ForegroundColor Red
    Read-Host "Pressione Enter para fechar"
    return
}

# Verificar se node_modules existe, se não, instalar dependências
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        Read-Host "Pressione Enter para fechar"
        return
    }
}

# Executar o servidor de desenvolvimento
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "Frontend estará disponível em: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "(ou próxima porta disponível se 5173 estiver em uso)" -ForegroundColor Gray
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev