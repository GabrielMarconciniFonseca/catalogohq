-- Esquema inicial do catálogo de HQs/Mangás
-- Compatível com PostgreSQL 13+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE colecoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    ano_inicio SMALLINT,
    ano_fim SMALLINT,
    pais_origem TEXT,
    status_publicacao TEXT CHECK (status_publicacao IN ('ATIVA', 'CONCLUIDA', 'HIATO'))
);

CREATE TABLE editoras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_pessoa_juridica TEXT NOT NULL UNIQUE,
    nome_fantasia TEXT,
    pais_sede TEXT,
    site_oficial TEXT,
    fundacao SMALLINT
);

CREATE TABLE selos_editoriais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT,
    editora_id UUID REFERENCES editoras(id) ON DELETE SET NULL
);

CREATE TABLE papeis_criativos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo_original TEXT NOT NULL,
    titulo_localizado TEXT,
    tipo TEXT NOT NULL CHECK (tipo IN ('MANGA', 'HQ_OCCIDENTAL', 'GRAPHIC_NOVEL', 'WEBCOMIC')),
    sinopse TEXT,
    publico_indicativo TEXT,
    idioma_original TEXT,
    formato_publicacao TEXT,
    status_publicacao TEXT CHECK (status_publicacao IN ('EM_ANDAMENTO', 'CONCLUIDA', 'HIATO', 'CANCELADA')),
    selo_editorial_id UUID REFERENCES selos_editoriais(id) ON DELETE SET NULL,
    colecao_id UUID REFERENCES colecoes(id) ON DELETE SET NULL,
    generos TEXT[],
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE autores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo TEXT NOT NULL,
    nome_artistico TEXT,
    data_nascimento DATE,
    data_falecimento DATE,
    pais_origem TEXT,
    biografia TEXT,
    site_oficial TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE volumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serie_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    numero TEXT NOT NULL,
    titulo TEXT,
    subtitulo TEXT,
    sinopse TEXT,
    data_publicacao DATE,
    isbn13 CHAR(13),
    edicao TEXT,
    formato TEXT CHECK (formato IN ('FISICO', 'DIGITAL')),
    preco_capa NUMERIC(10,2),
    paginas INTEGER,
    peso INTEGER,
    dimensoes TEXT,
    estoque INTEGER,
    idioma TEXT,
    capa_url TEXT,
    observacoes TEXT,
    tiragem INTEGER,
    codigo_barras TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (serie_id, numero),
    UNIQUE (isbn13)
);

CREATE TABLE volumes_autores (
    volume_id UUID NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES autores(id) ON DELETE CASCADE,
    papel_id UUID NOT NULL REFERENCES papeis_criativos(id) ON DELETE RESTRICT,
    ordem_credito SMALLINT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (volume_id, autor_id, papel_id)
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    apelido TEXT,
    senha_hash TEXT,
    foto_url TEXT,
    preferencias JSONB,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE itens_colecionador (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    volume_id UUID NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
    estado_conservacao TEXT NOT NULL CHECK (estado_conservacao IN ('NOVO', 'QUASE_NOVO', 'BOM', 'REGULAR', 'RUIM')),
    status_leitura TEXT NOT NULL CHECK (status_leitura IN ('NAO_LIDO', 'LENDO', 'LIDO')),
    data_compra DATE,
    preco_pago NUMERIC(10,2),
    local_compra TEXT,
    notas_pessoais TEXT,
    autografado BOOLEAN DEFAULT FALSE,
    data_autografo DATE,
    avaliacao_pessoal SMALLINT CHECK (avaliacao_pessoal BETWEEN 0 AND 10),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (usuario_id, volume_id)
);

CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cor_hex CHAR(7),
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (usuario_id, nome)
);

CREATE TABLE etiquetas_volumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etiqueta_id UUID NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
    volume_id UUID REFERENCES volumes(id) ON DELETE CASCADE,
    item_colecionador_id UUID REFERENCES itens_colecionador(id) ON DELETE CASCADE,
    contexto TEXT,
    CHECK (
        (volume_id IS NOT NULL) OR (item_colecionador_id IS NOT NULL)
    )
);

-- Índices auxiliares
CREATE INDEX idx_series_titulo_trgm ON series USING gin (titulo_original gin_trgm_ops);
CREATE INDEX idx_volumes_autor ON volumes_autores (autor_id);
CREATE INDEX idx_itens_usuario ON itens_colecionador (usuario_id);
CREATE INDEX idx_etiquetas_volumes_volume ON etiquetas_volumes (volume_id);
CREATE INDEX idx_etiquetas_volumes_item ON etiquetas_volumes (item_colecionador_id);

