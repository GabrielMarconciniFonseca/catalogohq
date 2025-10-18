# Modelo de domínio e API REST

Este documento descreve o modelo de dados do catálogo de HQs/mangás, os relacionamentos principais, o desenho inicial da API REST e o esboço do esquema relacional em PostgreSQL.

## Entidades principais

| Entidade | Descrição | Atributos obrigatórios | Atributos opcionais |
| --- | --- | --- | --- |
| **Franquia/Coleção** | Agrupa volumes relacionados (ex.: *Fullmetal Alchemist*, *Turma da Mônica*). | `id`, `nome` | `descricao`, `ano_inicio`, `ano_fim`, `pais_origem`, `status_publicacao` (enum: ATIVA, CONCLUIDA, HIATO) |
| **Selo Editorial** | Imprint usado por uma editora para lançar coleções específicas. | `id`, `nome` | `descricao`, `editora_id` (referência à editora-mãe) |
| **Editora** | Responsável pela publicação (ex.: Panini, JBC). | `id`, `nome_pessoa_juridica` | `nome_fantasia`, `pais_sede`, `site_oficial`, `fundacao` |
| **Autor** | Pessoas responsáveis por escrita, arte ou outros papéis. | `id`, `nome_completo` | `nome_artistico`, `data_nascimento`, `data_falecimento`, `pais_origem`, `biografia`, `site_oficial` |
| **Papel Criativo** | Define o papel exercido por um autor em um título. | `id`, `nome` (ex.: ROTEIRISTA, DESENHISTA, ARTE-FINALISTA, LETRISTA) | `descricao` |
| **Série (Mangá/HQ)** | Conjunto de volumes sob um mesmo título. | `id`, `titulo_original`, `tipo` (enum: MANGA, HQ_OCCIDENTAL, GRAPHIC_NOVEL, WEBCOMIC) | `titulo_localizado`, `sinopse`, `publico_indicativo` (enum), `idioma_original`, `formato_publicacao` (ex.: TANKOBON, CAPA_DURA), `status_publicacao` (enum: EM_ANDAMENTO, CONCLUIDA, HIATO, CANCELADA), `selo_editorial_id`, `colecao_id`, `generos` (lista) |
| **Volume** | Unidade física/digital comercializada. | `id`, `numero` (string p/ suportar "#0", "1.1"), `serie_id`, `data_publicacao`, `isbn13` | `titulo`, `subtitulo`, `sinopse`, `edicao` (ex.: 1ª EDIÇÃO), `formato` (enum: FISICO, DIGITAL), `preco_capa`, `paginas`, `peso`, `dimensoes`, `estoque`, `idioma`, `capa_url`, `observacoes`, `tiragem`, `codigo_barras`
| **Autor do Volume** | Relaciona autores com volumes e papéis criativos. | `volume_id`, `autor_id`, `papel_id` | `ordem_credito` |
| **Item de Colecionador** | Exemplar controlado pelo usuário. | `id`, `volume_id`, `usuario_id`, `estado_conservacao` (enum: NOVO, QUASE_NOVO, BOM, REGULAR, RUIM), `status_leitura` (enum: NAO_LIDO, LENDO, LIDO) | `data_compra`, `preco_pago`, `local_compra`, `notas_pessoais`, `autografado` (bool), `data_autografo`, `avaliacao_pessoal` |
| **Usuário** | Proprietário dos itens no catálogo pessoal. | `id`, `nome`, `email` | `apelido`, `senha_hash`, `foto_url`, `preferencias` (JSON) |
| **Etiquetas** | Tags customizadas para itens/volumes. | `id`, `usuario_id`, `nome` | `cor_hex`, `descricao` |
| **Etiqueta de Volume** | Associação entre volumes/itens e etiquetas. | `id`, `etiqueta_id` + `volume_id` ou `item_colecionador_id` | `contexto` |

### Regras e relacionamentos

- Uma **série** pertence a, no máximo, uma **coleção** e pode ser vinculada a um **selo editorial** (que, por sua vez, pertence a uma **editora**).
- Uma **série** possui múltiplos **volumes**; cada volume mantém um número sequencial (string) para permitir variações como especiais ou reimpressões.
- Autores são relacionados às séries por meio de **volumes**, garantindo rastreabilidade por edição e papel criativo específico.
- Um **volume** pode ter várias **etiquetas** globais (compartilhadas) e também etiquetas específicas por **item de colecionador**.
- Itens de colecionador pertencem a um **usuário**; cada usuário pode registrar múltiplos itens para o mesmo volume (ex.: diferentes edições ou estados de conservação).
- O relacionamento **Volume ↔ Autor** é muitos-para-muitos mediado por **Autor do Volume** com a coluna `ordem_credito` para priorização.
- O relacionamento **Coleção ↔ Série** é um-para-muitos; **Série ↔ Volume** também é um-para-muitos.
- **Papel Criativo** é referenciado por `papel_id`, permitindo extensibilidade sem alterar o modelo.

## API REST

Todas as respostas seguem o padrão JSON com paginação baseada em cursores ou páginas (default: página/limite). Parâmetros comuns:

- `page`: página atual (default 0).
- `size`: quantidade de registros por página (default 20, máximo 100).
- `sort`: lista de campos ordenados (`titulo,asc`).

Estrutura de resposta paginada:

```json
{
  "data": [ /* registros */ ],
  "page": 0,
  "size": 20,
  "totalElements": 125,
  "totalPages": 7,
  "links": {
    "self": "/api/series?page=0&size=20",
    "next": "/api/series?page=1&size=20",
    "prev": null
  }
}
```

### Endpoints principais

#### Séries (Mangás/HQs)
- `GET /api/series`: lista filtrando por `titulo`, `tipo`, `status_publicacao`, `colecaoId`, `editoraId`, `autorId`, `genero`.
- `GET /api/series/{id}`: detalha série com volumes e autores agregados.
- `POST /api/series`: cria série; requer `titulo_original`, `tipo`. Aceita arrays de `generos` e vínculo com `colecaoId`.
- `PUT /api/series/{id}`: atualiza atributos completos.
- `PATCH /api/series/{id}`: atualização parcial.
- `DELETE /api/series/{id}`: exclusão lógica (atributo `ativo=false`).

#### Volumes
- `GET /api/series/{serieId}/volumes`: lista volumes da série.
- `GET /api/volumes`: aceita filtros `serieId`, `numero`, `isbn`, `formato`, `dataPublicacaoDe/Ate`.
- `GET /api/volumes/{id}`: detalhe do volume com autores e disponibilidade em estoque.
- `POST /api/series/{serieId}/volumes`: cria volume.
- `PUT /api/volumes/{id}` / `PATCH /api/volumes/{id}`.
- `DELETE /api/volumes/{id}`: exclusão lógica.

#### Autores e papéis
- `GET /api/autores`: filtros `nome`, `pais`, `papelId`.
- `GET /api/autores/{id}`: dados biográficos e obras associadas.
- `POST /api/autores` / `PUT` / `PATCH` / `DELETE` (lógico).
- `GET /api/papeis-criativos`: lista valores suportados.
- `POST /api/volumes/{volumeId}/autores`: vincula autor e papel (`autorId`, `papelId`, `ordemCredito`).
- `DELETE /api/volumes/{volumeId}/autores/{autorId}`.

#### Editoras, selos e coleções
- `GET /api/editoras`: filtros `nome`, `pais`.
- `GET /api/editoras/{id}`.
- `POST /api/editoras`, `PUT`, `PATCH`, `DELETE`.
- `GET /api/selos`: filtro por `editoraId`.
- `GET /api/colecoes`: filtros `nome`, `status_publicacao`.

#### Itens de colecionador e etiquetas
- `GET /api/usuarios/{usuarioId}/itens`: filtros `status_leitura`, `estado`, `etiquetaId`.
- `POST /api/usuarios/{usuarioId}/itens`: cadastra item (requer `volumeId`, `estadoConservacao`, `statusLeitura`).
- `PATCH /api/itens/{id}`: atualiza status de leitura, notas etc.
- `DELETE /api/itens/{id}`: remove item do acervo.
- `POST /api/usuarios/{usuarioId}/etiquetas`: cria etiqueta personalizada.
- `POST /api/etiquetas/{etiquetaId}/volumes`: associa etiqueta a volume (payload `volumeId` ou `itemId`).

#### Consultas auxiliares
- `GET /api/generos`: lista taxonomia de gêneros.
- `GET /api/statuses`: retorna enums suportados (`tipoVolume`, `statusPublicacao`, etc.).
- `GET /api/busca`: pesquisa global (param `q`) com destaque por tipo e suporte a sugestões.

### Convenções adicionais

- Campos de data em ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:MM:SSZ`).
- Endpoints `POST` retornam `201 Created` com cabeçalho `Location` apontando para o recurso criado.
- Erros seguem padrão:

```json
{
  "timestamp": "2024-04-01T12:30:00Z",
  "status": 400,
  "error": "ValidationError",
  "message": "Campo 'tituloOriginal' é obrigatório",
  "details": ["tituloOriginal"]
}
```

## Esquema de banco de dados (PostgreSQL)

Principais tabelas e chaves:

- `colecoes` (`id` PK, `nome` UNIQUE, `descricao`, `ano_inicio`, `ano_fim`, `pais_origem`, `status_publicacao`).
- `editoras` (`id` PK, `nome_pessoa_juridica` UNIQUE, `nome_fantasia`, `pais_sede`, `site_oficial`, `fundacao`).
- `selos_editoriais` (`id` PK, `nome` UNIQUE, `descricao`, `editora_id` FK → `editoras`).
- `papeis_criativos` (`id` PK, `nome` UNIQUE, `descricao`).
- `series` (`id` PK, `titulo_original`, `titulo_localizado`, `tipo`, `sinopse`, `publico_indicativo`, `idioma_original`, `formato_publicacao`, `status_publicacao`, `selo_editorial_id` FK, `colecao_id` FK, `generos` TEXT[]).
- `autores` (`id` PK, `nome_completo`, `nome_artistico`, `data_nascimento`, `data_falecimento`, `pais_origem`, `biografia`, `site_oficial`).
- `volumes` (`id` PK, `serie_id` FK, `numero`, `titulo`, `subtitulo`, `sinopse`, `data_publicacao`, `isbn13`, `edicao`, `formato`, `preco_capa`, `paginas`, `peso`, `dimensoes`, `estoque`, `idioma`, `capa_url`, `observacoes`, `tiragem`, `codigo_barras`, `ativo` boolean default true).
- `volumes_autores` (`volume_id` FK, `autor_id` FK, `papel_id` FK, `ordem_credito`, PK composta `(volume_id, autor_id, papel_id)`).
- `usuarios` (`id` PK, `nome`, `email` UNIQUE, `apelido`, `senha_hash`, `foto_url`, `preferencias` JSONB, `ativo` boolean default true).
- `itens_colecionador` (`id` PK, `usuario_id` FK, `volume_id` FK, `estado_conservacao`, `status_leitura`, `data_compra`, `preco_pago`, `local_compra`, `notas_pessoais`, `autografado`, `data_autografo`, `avaliacao_pessoal`).
- `etiquetas` (`id` PK, `usuario_id` FK, `nome`, `cor_hex`, `descricao`, UNIQUE(usuario_id, nome)).
- `etiquetas_volumes` (`id` PK, `etiqueta_id` FK, `volume_id` FK NULLABLE, `item_colecionador_id` FK NULLABLE, `contexto`, CHECK para garantir que pelo menos um vínculo não seja nulo).

Índices sugeridos:

- `series(titulo_original gin_trgm_ops)` para busca parcial.
- `volumes(serie_id, numero)` único para evitar duplicidade.
- `volumes(isbn13)` único (quando informado).
- `volumes_autores(autor_id)` para facilitar listagem de obras por autor.
- `itens_colecionador(usuario_id, volume_id)` único para evitar duplicidade quando apropriado.

## Script de criação

Veja o arquivo [`Projeto_Catalogo_JAVA/bancohq/config/schema.sql`](../Projeto_Catalogo_JAVA/bancohq/config/schema.sql) para o DDL completo.

