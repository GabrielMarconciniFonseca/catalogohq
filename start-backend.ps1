# Script para iniciar o backend Spring Boot
# Configurar variáveis de ambiente
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:MAVEN_HOME = "C:\apache-maven-3.9.9"
$env:PATH = "$env:MAVEN_HOME\bin;$env:PATH"

# Navegar para o diretório do backend
Set-Location "e:\Develop\catalogohq\Projeto_Catalogo_JAVA\bancohq"

# Executar o servidor Spring Boot
Write-Host "Iniciando o backend Spring Boot..." -ForegroundColor Green
mvn spring-boot:run -DskipTests