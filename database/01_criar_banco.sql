-- =====================================================================
-- AproVest TCC - Criação do banco de dados e das tabelas (Modelo Físico)
-- SGBD: Microsoft SQL Server
-- Execute este script primeiro e depois o 02_dados_iniciais.sql.
-- =====================================================================

IF DB_ID('aprovesttcc') IS NULL
    CREATE DATABASE aprovesttcc;
GO

USE aprovesttcc;
GO

-- ---------------------------------------------------------------------
-- Vestibular: provas atendidas pelo sistema (ENEM, FUVEST, UNICAMP)
-- ---------------------------------------------------------------------
CREATE TABLE Vestibular
(
    idVestibular  INT IDENTITY(1,1) PRIMARY KEY,
    sigla         VARCHAR(10)  NOT NULL UNIQUE,
    nome          VARCHAR(100) NOT NULL,
    instituicao   VARCHAR(100) NOT NULL
);
GO

-- ---------------------------------------------------------------------
-- Materia: disciplinas das questões
-- ---------------------------------------------------------------------
CREATE TABLE Materia
(
    idMateria  INT IDENTITY(1,1) PRIMARY KEY,
    nome       VARCHAR(50) NOT NULL UNIQUE,
    area       VARCHAR(60) NOT NULL
);
GO

-- ---------------------------------------------------------------------
-- Usuario: alunos e administradores
-- Relacionamento 1:N com Vestibular (o vestibular que o aluno quer prestar)
-- ---------------------------------------------------------------------
CREATE TABLE Usuario
(
    idUsuario         INT IDENTITY(1,1) PRIMARY KEY,
    nome              VARCHAR(100) NOT NULL,
    email             VARCHAR(100) NOT NULL UNIQUE,
    senha             VARCHAR(100) NOT NULL,            -- guardada criptografada (BCrypt)
    tipo              VARCHAR(10)  NOT NULL DEFAULT 'ALUNO'
                      CHECK (tipo IN ('ALUNO', 'ADMIN')),
    idVestibularMeta  INT NULL FOREIGN KEY REFERENCES Vestibular(idVestibular),
    dataCadastro      SMALLDATETIME NOT NULL DEFAULT GETDATE(),
    status            VARCHAR(10)  NOT NULL DEFAULT 'ATIVO'
                      CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO

-- ---------------------------------------------------------------------
-- Questao: banco de questões (CRUD do administrador)
-- Relacionamentos 1:N com Vestibular e com Materia
-- ---------------------------------------------------------------------
CREATE TABLE Questao
(
    idQuestao     INT IDENTITY(1,1) PRIMARY KEY,
    enunciado     VARCHAR(3000) NOT NULL,
    ano           INT           NOT NULL CHECK (ano BETWEEN 1998 AND 2100),
    fonte         VARCHAR(150)  NULL,                   -- de onde a questão foi tirada
    dificuldade   VARCHAR(10)   NOT NULL DEFAULT 'MEDIA'
                  CHECK (dificuldade IN ('FACIL', 'MEDIA', 'DIFICIL')),
    idVestibular  INT NOT NULL FOREIGN KEY REFERENCES Vestibular(idVestibular),
    idMateria     INT NOT NULL FOREIGN KEY REFERENCES Materia(idMateria),
    dataCadastro  SMALLDATETIME NOT NULL DEFAULT GETDATE(),
    status        VARCHAR(10)   NOT NULL DEFAULT 'ATIVO'
                  CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO

-- ---------------------------------------------------------------------
-- Alternativa: as alternativas de cada questão (A a E)
-- Tabela separada para respeitar a 1ª Forma Normal (sem colunas repetidas
-- alternativaA, alternativaB...). Relacionamento 1:N com Questao.
-- ---------------------------------------------------------------------
CREATE TABLE Alternativa
(
    idAlternativa  INT IDENTITY(1,1) PRIMARY KEY,
    letra          CHAR(1)      NOT NULL CHECK (letra IN ('A', 'B', 'C', 'D', 'E')),
    texto          VARCHAR(500) NOT NULL,
    correta        BIT          NOT NULL DEFAULT 0,
    idQuestao      INT NOT NULL FOREIGN KEY REFERENCES Questao(idQuestao) ON DELETE CASCADE,
    CONSTRAINT uq_Alternativa_letra UNIQUE (idQuestao, letra)
);
GO

-- ---------------------------------------------------------------------
-- RespostaAluno: entidade associativa do relacionamento N:N entre
-- Usuario (aluno) e Questao (um aluno responde várias questões e uma
-- questão é respondida por vários alunos).
-- ---------------------------------------------------------------------
CREATE TABLE RespostaAluno
(
    idResposta      INT IDENTITY(1,1) PRIMARY KEY,
    idUsuario       INT NOT NULL FOREIGN KEY REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    idQuestao       INT NOT NULL FOREIGN KEY REFERENCES Questao(idQuestao) ON DELETE CASCADE,
    letraEscolhida  CHAR(1) NOT NULL CHECK (letraEscolhida IN ('A', 'B', 'C', 'D', 'E')),
    acertou         BIT     NOT NULL,
    dataResposta    SMALLDATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- ---------------------------------------------------------------------
-- Redacao: redações escritas pelo aluno. Relacionamento 1:N com Usuario.
-- ---------------------------------------------------------------------
CREATE TABLE Redacao
(
    idRedacao    INT IDENTITY(1,1) PRIMARY KEY,
    titulo       VARCHAR(150)  NOT NULL,
    tema         VARCHAR(200)  NOT NULL,
    texto        VARCHAR(5000) NOT NULL,
    status       VARCHAR(10)   NOT NULL DEFAULT 'RASCUNHO'
                 CHECK (status IN ('RASCUNHO', 'ENVIADA', 'CORRIGIDA')),
    nota         INT NULL CHECK (nota BETWEEN 0 AND 1000),
    dataCriacao  SMALLDATETIME NOT NULL DEFAULT GETDATE(),
    idUsuario    INT NOT NULL FOREIGN KEY REFERENCES Usuario(idUsuario) ON DELETE CASCADE
);
GO

-- ---------------------------------------------------------------------
-- MensagemContato: mensagens enviadas pela página Fale Conosco
-- ---------------------------------------------------------------------
CREATE TABLE MensagemContato
(
    idMensagem  INT IDENTITY(1,1) PRIMARY KEY,
    nome        VARCHAR(100)  NOT NULL,
    email       VARCHAR(100)  NOT NULL,
    assunto     VARCHAR(30)   NOT NULL,
    mensagem    VARCHAR(1000) NOT NULL,
    status      VARCHAR(10)   NOT NULL DEFAULT 'NOVA'
                CHECK (status IN ('NOVA', 'LIDA', 'RESPONDIDA')),
    dataEnvio   SMALLDATETIME NOT NULL DEFAULT GETDATE()
);
GO
