# Script para iniciar o frontend React
# Configurar variáveis de ambiente
$env:NODEJS_HOME = "C:\node-v20.18.0-win-x64"
$env:PATH = "$env:NODEJS_HOME;$env:PATH"

# Usar caminho relativo para evitar problemas de encoding
$currentDir = Get-Location
$frontendPath = Join-Path $currentDir "frontend"
Write-Host "Navegando para: $frontendPath" -ForegroundColor Yellow

if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "✅ Diretório encontrado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro: Diretório frontend não encontrado!" -ForegroundColor Red
    Write-Host "Verifique se o caminho está correto: $frontendPath" -ForegroundColor Yellow
    return
}

# Verificar se npm está disponível
$npmPath = Join-Path $env:NODEJS_HOME "npm.cmd"
if (Test-Path $npmPath) {
    Write-Host "✅ NPM encontrado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro: NPM não encontrado!" -ForegroundColor Red
    Write-Host "Verifique se Node.js está instalado em: $env:NODEJS_HOME" -ForegroundColor Yellow
    return
}

# Executar o servidor de desenvolvimento
Write-Host "🚀 Iniciando o frontend React..." -ForegroundColor Green
& $npmPath run dev