# Catálogo HQ

Este repositório contém o catálogo de histórias em quadrinhos que será desenvolvido com uma API em Spring Boot e uma interface web estática evolutiva. O objetivo principal é permitir que colecionadores registrem, consultem e organizem suas HQs de forma simples.

## Escopo inicial

- Cadastro básico de HQs com informações como título, editora, autores e ano de publicação.
- Consulta e listagem com filtros por título, editora e status de leitura.
- Integração futura com banco de dados MySQL para persistência.
- Interface web inicial para navegação do catálogo e visualização dos registros cadastrados.

## Tecnologias escolhidas

- **Back-end**: Spring Boot 2.5, Java 11, Maven, Checkstyle para padronização de código.
- **Front-end**: HTML, CSS e JavaScript puro, com linting via ESLint e formatação com Prettier.

## Gerenciamento de dependências

- O módulo Java utiliza Maven (`Projeto_Catalogo_JAVA/bancohq`) com o wrapper incluído (`mvnw`). Foram adicionadas configurações do Checkstyle para garantir a qualidade do código Java.
- O módulo front-end (`Projeto_CatalogoFront`) usa npm para gerenciar as dependências de desenvolvimento ligadas ao lint/format (ESLint, Prettier). Utilize `npm install` para baixar as dependências e `npm run lint`/`npm run format` para validar o código.

## Como começar

1. Instale as dependências do front-end:
   ```bash
   cd Projeto_CatalogoFront
   npm install
   ```
2. Valide o código front-end:
   ```bash
   npm run lint
   ```
3. Execute as verificações do back-end:
   ```bash
   cd ../Projeto_Catalogo_JAVA/bancohq
   ./mvnw verify
   ```

Esses passos garantem que os padrões de código estão sendo aplicados em ambos os módulos do projeto.
