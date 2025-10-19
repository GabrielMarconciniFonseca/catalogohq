# Como Rodar o Projeto Catálogo HQ

## Pré-requisitos
- Node.js (instalado)
- Java 21
- Maven

## Status Atual do Projeto

### ✅ Frontend (React + Vite)
- **Localização**: `frontend/`
- **Tecnologia**: React 18 + Vite
- **Porta**: http://localhost:5174 (ou 5173 se disponível)
- **Status**: ✅ Funcionando

### ✅ Backend (Spring Boot)
- **Localização**: `Projeto_Catalogo_JAVA/bancohq/`
- **Tecnologia**: Spring Boot 3.4.0 + Java 21
- **Porta**: http://localhost:8080
- **Status**: ✅ Configurado

## Como Iniciar o Projeto

### Opção 1: Scripts Automatizados

#### Iniciar Frontend:
```powershell
# Opção 1: Script batch (recomendado)
.\start-frontend.bat

# Opção 2: Script PowerShell
.\start-frontend.ps1

# Opção 3: Manual
cd frontend
npm run dev
```

#### Iniciar Backend:
```powershell
.\start-backend.ps1
```

#### Iniciar Ambos:
```powershell
.\start-all.ps1
```

### Opção 2: Manual

#### Frontend:
```powershell
cd frontend
npm install
npm run dev
```

#### Backend:
```powershell
cd "Projeto_Catalogo_JAVA\bancohq"
mvn spring-boot:run -DskipTests
```

## URLs de Acesso

- **Frontend**: http://localhost:5174/
- **Backend API**: http://localhost:8080/
- **Documentação API**: http://localhost:8080/swagger-ui.html (quando disponível)

## Estrutura do Projeto

```
catalogohq/
├── frontend/                 # React + Vite
├── Projeto_Catalogo_JAVA/    # Spring Boot
├── Projeto_CatalogoFront/    # Frontend antigo (HTML/CSS/JS)
├── docs/                     # Documentação
└── *.ps1                     # Scripts de inicialização
```

## Comandos Úteis

### Frontend
```powershell
cd frontend
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run test         # Executar testes
```

### Backend
```powershell
cd "Projeto_Catalogo_JAVA\bancohq"
mvn clean install    # Compilar e instalar
mvn spring-boot:run   # Executar aplicação
mvn test              # Executar testes
```

## Troubleshooting

### Script PowerShell não executa
Se o script `.ps1` apresentar erros, use o script `.bat`:
```cmd
.\start-frontend.bat
```

### Porta em uso
Se a porta 5173 estiver em uso, o Vite automaticamente tentará a próxima disponível (5174, 5175, etc.)

### Dependências
Se houver problemas com dependências:
```powershell
# Frontend
cd frontend
rm -rf node_modules
npm install

# Backend
cd "Projeto_Catalogo_JAVA\bancohq"
mvn clean install
```

### Java/Maven não encontrado
Verifique se as variáveis de ambiente estão configuradas nos scripts .ps1

## Status da Migração
- ✅ Projeto movido para `e:\Develop\catalogohq\`
- ✅ Scripts atualizados com novos caminhos
- ✅ Frontend funcionando na porta 5174
- ✅ Backend configurado para porta 8080
- ✅ Dependências instaladas