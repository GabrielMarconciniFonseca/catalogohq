# Script para iniciar ambos os projetos (frontend e backend)
Write-Host "=== CATÁLOGO HQ - Iniciando Projetos ===" -ForegroundColor Cyan

# Configurar todas as variáveis de ambiente
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:MAVEN_HOME = "C:\apache-maven-3.9.9"
$env:NODEJS_HOME = "C:\node-v20.18.0-win-x64"
$env:PATH = "$env:MAVEN_HOME\bin;$env:NODEJS_HOME;$env:PATH"

Write-Host "✅ Variáveis de ambiente configuradas" -ForegroundColor Green

# Iniciar o frontend em uma nova janela
Write-Host "🚀 Iniciando Frontend React..." -ForegroundColor Yellow
$frontendScript = @"
Set-Location 'C:\Users\Gabriel\OneDrive\Área de Trabalho\catalogohq'
`$env:NODEJS_HOME = 'C:\node-v20.18.0-win-x64'
`$env:PATH = "`$env:NODEJS_HOME;`$env:PATH"
`$frontendPath = Join-Path (Get-Location) 'frontend'
if (Test-Path `$frontendPath) {
    Set-Location `$frontendPath
    Write-Host '✅ Iniciando frontend...' -ForegroundColor Green
    `$npmPath = Join-Path `$env:NODEJS_HOME 'npm.cmd'
    & `$npmPath run dev
} else {
    Write-Host '❌ Diretório frontend não encontrado!' -ForegroundColor Red
}
Read-Host 'Pressione Enter para fechar'
"@

Start-Process powershell -ArgumentList "-Command", $frontendScript

Write-Host "🌐 Frontend estará disponível em: http://localhost:5173/" -ForegroundColor Green

Write-Host ""
Write-Host "Para iniciar o backend, execute:" -ForegroundColor Cyan
Write-Host ".\start-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Ou execute manualmente:" -ForegroundColor Cyan
Write-Host "cd 'Projeto_Catalogo_JAVA\bancohq'; mvn spring-boot:run -DskipTests" -ForegroundColor White