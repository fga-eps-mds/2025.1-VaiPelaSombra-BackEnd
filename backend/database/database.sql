CREATE DATABASE vai_pela_sombra;
\c vai_pela_sombra

-- criação de type

CREATE TYPE tipo_viajante_enum AS ENUM (
  'AVENTUREIRO',
  'CULTURAL',
  'RELAXAMENTO',
  'GASTRONOMICO'
);

CREATE TYPE frequencia_viagem_enum AS ENUM (
  'BIMESTRAL',
  'TRIMESTRAL',
  'SEMESTRAL',
  'ANUAL'
);


-- TABELAS AUXILIARES
-- TODO: Remodelar a tabela para a issue #13 Adicionar Interesses e Preferências de Usuário


CREATE TABLE interessesViagem(
  idInteresse SERIAL PRIMARY KEY,
  nomeInteresse VARCHAR(50)
)

CREATE TABLE prefere(
  idInteresse INT,
  idPrerencias INT

  CONSTRAINT fk_prefere_interessesViagem FOREIGN KEY (idInteresse) REFERENCES interessesViagem(idInteresse),
  CONSTRAINT fk_prefere_preferenciasViagem FOREIGN KEY (idPrerencias) REFERENCES preferenciasViagem(idPrerencias)
)

CREATE TABLE preferenciasViagem (
  idPrerencias SERIAL PRIMARY KEY,
  idUsuario INT,
  preferenciasViagem VARCHAR(100) NOT NULL,
  tipoViajante tipo_viajante_enum,
  frequenciaViagem frequencia_viagem_enum,
  orcametoMedio DECIMAL(6,2)

  CONSTRAINT fk_usuario_preferencias FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- TABELAS PRINCIPAIS

CREATE TABLE Usuario (
  idUsuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  dataCriacao DATE DEFAULT CURRENT_DATE,
  bioPerfil VARCHAR(500),
  fotoPerfil VARCHAR(500)
);

CREATE TABLE Avaliacoes (
  idAvaliacao SERIAL PRIMARY KEY,
  textoAvaliacao VARCHAR(1500) NOT NULL,
  anexoImagem VARCHAR(500),
  idUsuario INT NOT NULL,
  CONSTRAINT fk_avaliacoes_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE atividadesRecomendadas (
  idAtividadesRecomendadas SERIAL PRIMARY KEY,
  atividadesRecomendadas VARCHAR(500) NOT NULL
);

CREATE TABLE eventosLocais (
  idEventosLocais SERIAL PRIMARY KEY,
  eventosLocais VARCHAR(100) NOT NULL
);

CREATE TABLE sugestoesSobrevivencia (
  idSugestoesSobrevivencia SERIAL PRIMARY KEY,
  sugestoesSobrevivencia VARCHAR(500) NOT NULL
);

CREATE TABLE Destino (
  idDestino SERIAL PRIMARY KEY,
  tituloDestino VARCHAR(100) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  longitudeDestino VARCHAR(100) NOT NULL,
  latitudeDestino VARCHAR(100) NOT NULL,
  climaLocal VARCHAR(500),
  fusoHorario VARCHAR(100),
  idAtividadesRecomendadas INT,
  idEventosLocais INT,
  idSugestoesSobrevivencia INT,
  idAvaliacao INT,
  CONSTRAINT fk_destino_atividade FOREIGN KEY (idAtividadesRecomendadas) REFERENCES atividadesRecomendadas(idAtividadesRecomendadas),
  CONSTRAINT fk_destino_eventos FOREIGN KEY (idEventosLocais) REFERENCES eventosLocais(idEventosLocais),
  CONSTRAINT fk_destino_sobrevivencia FOREIGN KEY (idSugestoesSobrevivencia) REFERENCES sugestoesSobrevivencia(idSugestoesSobrevivencia),
  CONSTRAINT fk_destino_avaliacao FOREIGN KEY (idAvaliacao) REFERENCES Avaliacoes(idAvaliacao)
);

CREATE TABLE Transporte (
  idTransporte SERIAL PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  valor DECIMAL(6,2) NOT NULL,
  dataSaida TIMESTAMP,
  dataChegada TIMESTAMP,
  duracao TIMESTAMP,
  descricao VARCHAR(500)
);

CREATE TABLE DocumentosNecessarios (
  idDocumentosNecessarios SERIAL PRIMARY KEY,
  documentosNecessarios VARCHAR(800) NOT NULL
);

CREATE TABLE Itinerario (
  idItinerario SERIAL PRIMARY KEY,
  idTransporte INT,
  idDocumentosNecessarios INT,
  tituloItinerario VARCHAR(100) NOT NULL,
  dataInicio DATE NOT NULL,
  dataFim DATE NOT NULL,
  statusItinerario VARCHAR(20) NOT NULL,
  orcamentoHospedagem DECIMAL(7,2),
  orcamentoAlimentacao DECIMAL(7,2),
  orcamentoTotal DECIMAL(7,2),
  CONSTRAINT fk_itinerario_transporte FOREIGN KEY (idTransporte) REFERENCES Transporte(idTransporte),
  CONSTRAINT fk_itinerario_documentos FOREIGN KEY (idDocumentosNecessarios) REFERENCES DocumentosNecessarios(idDocumentosNecessarios)
);

CREATE TABLE planeja (
  idItinerario INT NOT NULL,
  idUsuario INT NOT NULL,
  PRIMARY KEY (idItinerario, idUsuario),
  CONSTRAINT fk_planeja_itinerario FOREIGN KEY (idItinerario) REFERENCES Itinerario(idItinerario),
  CONSTRAINT fk_planeja_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE contem (
  idItinerario INT NOT NULL,
  idDestino INT NOT NULL,
  PRIMARY KEY (idItinerario, idDestino),
  CONSTRAINT fk_contem_itinerario FOREIGN KEY (idItinerario) REFERENCES Itinerario(idItinerario),
  CONSTRAINT fk_contem_destino FOREIGN KEY (idDestino) REFERENCES Destino(idDestino)
);

CREATE TABLE Atividades (
  idAtividade SERIAL PRIMARY KEY,
  local VARCHAR(100) NOT NULL,
  tituloAtividade VARCHAR(100) NOT NULL,
  precoAtividade DECIMAL(5,2),
  dataInicio TIMESTAMP,
  dataFinal TIMESTAMP,
  duracao TIMESTAMP,
  descricao VARCHAR(500)
);
