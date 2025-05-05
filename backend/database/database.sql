
CREATE DATABASE vai_pela_sombra IF NOT EXISTS;
\c vai_pela_sombra

CREATE TABLE enderecoEstabelecimento (
  idEnderecoEstabelecimento SERIAL,
  campoEndereco VARCHAR(100) NOT NULL,
  longitudeEnderecoEstabelecimento VARCHAR(100) NOT NULL,
  latitudeEnderecoEstabelecimento VARCHAR(100) NOT NULL,
  CONSTRAINT pk_enderecoEstabelecimento PRIMARY KEY (idEnderecoEstabelecimento)
);

CREATE TABLE telefone (
  idTelefone SERIAL,
  telefone DECIMAL(11,0) NOT NULL,
  CONSTRAINT pk_telefone PRIMARY KEY (idTelefone)
);

CREATE TABLE UsuarioHotel (
  idUsuarioHotel SERIAL,
  idEnderecoEstabelecimento INT NOT NULL,
  idTelefone INT NOT NULL,
  nomeEmpresa VARCHAR NOT NULL,
  CONSTRAINT pk_usuarioHotel PRIMARY KEY (idUsuarioHotel),
  CONSTRAINT fk_usuarioHotel_endereco FOREIGN KEY (idEnderecoEstabelecimento) REFERENCES enderecoEstabelecimento(idEnderecoEstabelecimento),
  CONSTRAINT fk_usuarioHotel_telefone FOREIGN KEY (idTelefone) REFERENCES telefone(idTelefone)
);

CREATE TABLE Avaliacoes (
  idAvaliacao SERIAL,
  textoAvaliacao VARCHAR(1500) NOT NULL,
  anexoImagem VARCHAR(500) NOT NULL,
  CONSTRAINT pk_avaliacoes PRIMARY KEY (idAvaliacao)
);

CREATE TABLE Acomodacoes (
  idAcomodacao SERIAL,
  idFotosAcomodacao INT NOT NULL,
  idAvaliacao INT NOT NULL,
  tipoAcomodacao VARCHAR NOT NULL,
  precoDiaria DECIMAL(24,2) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  CONSTRAINT pk_acomodacoes PRIMARY KEY (idAcomodacao),
  CONSTRAINT fk_acomodacoes_avaliacao FOREIGN KEY (idAvaliacao) REFERENCES Avaliacoes(idAvaliacao)
);

CREATE TABLE fotosAcomodacao (
  idFotosAcomodacao SERIAL,
  fotosAcomodacao VARCHAR(500) NOT NULL,
  tituloDaFoto VARCHAR(100) NOT NULL,
  CONSTRAINT pk_fotosAcomodacao PRIMARY KEY (idFotosAcomodacao)
);

CREATE TABLE Destino (
  idDestino SERIAL,
  idAvaliacao INT NOT NULL,
  dataInicialDestino DATE NOT NULL,
  dataFinalDestino DATE NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  longitudeDestino VARCHAR(100) NOT NULL,
  latitudeDestino VARCHAR(100) NOT NULL,
  CONSTRAINT pk_destino PRIMARY KEY (idDestino),
  CONSTRAINT fk_destino_avaliacao FOREIGN KEY (idAvaliacao) REFERENCES Avaliacoes(idAvaliacao)
);

CREATE TABLE tem (
  idDestino INT NOT NULL,
  idAcomodacao INT NOT NULL,
  CONSTRAINT pk_tem PRIMARY KEY (idDestino, idAcomodacao),
  CONSTRAINT fk_tem_destino FOREIGN KEY (idDestino) REFERENCES Destino(idDestino),
  CONSTRAINT fk_tem_acomodacao FOREIGN KEY (idAcomodacao) REFERENCES Acomodacoes(idAcomodacao)
);

CREATE TABLE preferenciasViagem (
  idPreferenciasViagem SERIAL,
  preferenciasViagem VARCHAR(100) NOT NULL,
  CONSTRAINT pk_preferenciasViagem PRIMARY KEY (idPreferenciasViagem)
);

CREATE TABLE Perfil (
  idPerfil SERIAL,
  idPreferenciasViagem INT NOT NULL,
  bioPerfil VARCHAR(1500) NOT NULL,
  fotoPerfil VARCHAR(500) NOT NULL,
  CONSTRAINT pk_perfil PRIMARY KEY (idPerfil),
  CONSTRAINT fk_perfil_preferencias FOREIGN KEY (idPreferenciasViagem) REFERENCES preferenciasViagem(idPreferenciasViagem)
);

CREATE TABLE Usuario (
  idUsuario SERIAL,
  idPerfil INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_usuario PRIMARY KEY (idUsuario),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (idPerfil) REFERENCES Perfil(idPerfil)
);

CREATE TABLE Itinerario (
  idItinerario SERIAL,
  tituloItinerario VARCHAR(100) NOT NULL,
  dataInicio DATE NOT NULL,
  dataFim DATE NOT NULL,
  statusItinerario VARCHAR(100) NOT NULL,
  CONSTRAINT pk_itinerario PRIMARY KEY (idItinerario)
);

CREATE TABLE planeja (
  idItinerario INT NOT NULL,
  idUsuario INT NOT NULL,
  CONSTRAINT pk_planeja PRIMARY KEY (idItinerario, idUsuario),
  CONSTRAINT fk_planeja_itinerario FOREIGN KEY (idItinerario) REFERENCES Itinerario(idItinerario),
  CONSTRAINT fk_planeja_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE contem (
  idItinerario INT NOT NULL,
  idDestino INT NOT NULL,
  CONSTRAINT pk_contem PRIMARY KEY (idItinerario, idDestino),
  CONSTRAINT fk_contem_itinerario FOREIGN KEY (idItinerario) REFERENCES Itinerario(idItinerario),
  CONSTRAINT fk_contem_destino FOREIGN KEY (idDestino) REFERENCES Destino(idDestino)
);
