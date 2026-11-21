-- =====================================================================
-- AproVest TCC - Dados iniciais (para testes e demonstração)
-- Questões: provas oficiais do ENEM (INEP) e da FUVEST, com a fonte de cada uma.
-- Contas de teste (senha 123456): admin@aprovest.com.br e aluno@aprovest.com.br
-- =====================================================================

USE aprovesttcc;
GO

INSERT INTO Vestibular (sigla, nome, instituicao) VALUES
('ENEM', 'Exame Nacional do Ensino Médio', 'INEP'),
('FUVEST', 'Vestibular da Universidade de São Paulo', 'Fundação Universitária para o Vestibular'),
('UNICAMP', 'Vestibular da Unicamp', 'Comvest - Unicamp');
GO

INSERT INTO Materia (nome, area) VALUES
('Matemática', 'Matemática e suas Tecnologias'),
('Física', 'Ciências da Natureza'),
('Química', 'Ciências da Natureza'),
('Biologia', 'Ciências da Natureza'),
('História', 'Ciências Humanas'),
('Geografia', 'Ciências Humanas'),
('Língua Portuguesa', 'Linguagens e Códigos');
GO

INSERT INTO Usuario (nome, email, senha, tipo, idVestibularMeta, dataCadastro) VALUES
('Administrador AproVest', 'admin@aprovest.com.br', '$2a$10$69HkHax1aoLigeeisAFyU.0a3HbRmjmk1z3WhSGcmTwjkGSjOy3IS', 'ADMIN', NULL, DATEADD(DAY, -60, GETDATE())),
('Mariana Souza', 'aluno@aprovest.com.br', '$2a$10$69HkHax1aoLigeeisAFyU.0a3HbRmjmk1z3WhSGcmTwjkGSjOy3IS', 'ALUNO', 1, DATEADD(DAY, -30, GETDATE())),
('Pedro Henrique Lima', 'pedro.lima@email.com', '$2a$10$69HkHax1aoLigeeisAFyU.0a3HbRmjmk1z3WhSGcmTwjkGSjOy3IS', 'ALUNO', 2, DATEADD(DAY, -20, GETDATE())),
('Ana Beatriz Rocha', 'ana.rocha@email.com', '$2a$10$69HkHax1aoLigeeisAFyU.0a3HbRmjmk1z3WhSGcmTwjkGSjOy3IS', 'ALUNO', 1, DATEADD(DAY, -10, GETDATE()));
GO

-- Questões e alternativas (a alternativa correta tem correta = 1)
DECLARE @q INT;

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Nas angiospermas, além da fertilização da oosfera, existe uma segunda fertilização que resulta num tecido triploide.

Essa segunda fertilização foi importante evolutivamente, pois viabilizou a formação de um tecido de', 2021, 'INEP - ENEM 2021, questão 129 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Biologia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Nutrição para o fruto.', 0, @q),
('B', 'Reserva para o embrião.', 1, @q),
('C', 'Revestimento para a semente.', 0, @q),
('D', 'Proteção para o megagametófito.', 0, @q),
('E', 'Vascularização para a planta jovem.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('A maior parte da alimentação humana é constituída por grãos e cereais, que, em sua maioria, correspondem às sementes, em termos botânicos. Esse consumo é adequado, uma vez que as sementes', 2025, 'FUVEST 2025 - 1ª fase, Prova V1, questão 46 (gabarito oficial)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'FUVEST'), (SELECT idMateria FROM Materia WHERE nome = 'Biologia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'constituem o único órgão de reserva de amido das plantas, substância altamente energética para os seres vivos em geral.', 0, @q),
('B', 'armazenam todas as vitaminas e nutrientes necessários para a planta e, portanto, também ao ser humano.', 0, @q),
('C', 'possuem DNA da planta-mãe e do embrião, que constituem nutrientes sem os quais a espécie humana não sobrevive.', 0, @q),
('D', 'contêm substâncias de reserva provedoras de energia para o desenvolvimento do embrião vegetal, que também servem de fonte energética aos seres humanos.', 1, @q),
('E', 'possuem enzimas digestivas de amido e de proteínas, que disponibilizam energia ao embrião vegetal e também são usadas para promover a digestão em seres humanos.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('A polinização, que viabiliza o transporte do grão de pólen de uma planta até o estigma de outra, pode ser realizada biótica ou abioticamente. Nos processos abióticos, as plantas dependem de fatores como o vento e a água.

A estratégia evolutiva que resulta em polinização mais eficiente quando esta depende do vento é o(a)', 2018, 'INEP - ENEM 2018, questão 111 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Biologia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Diminuição do cálice.', 0, @q),
('B', 'Alongamento do ovário.', 0, @q),
('C', 'Disponibilização do néctar.', 0, @q),
('D', 'Intensificação da cor das pétalas.', 0, @q),
('E', 'Aumento do número de estames.', 1, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('O deserto é um bioma que se localiza em regiões de pouca umidade. A fauna é, predominantemente, composta por animais roedores, aves, répteis e artrópodes.

Uma adaptação, associada a esse bioma, presente nos seres vivos dos grupos citados é o(a)', 2018, 'INEP - ENEM 2018, questão 101 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Física'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Existência de numerosas glândulas sudoríparas na epiderme.', 0, @q),
('B', 'Eliminação de excretas nitrogenadas de forma concentrada.', 1, @q),
('C', 'Desenvolvimento do embrião no interior de ovo com casca.', 0, @q),
('D', 'Capacidade de controlar a temperatura corporal.', 0, @q),
('E', 'Respiração realizada por pulmões foliáceos.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Visando a melhoria estética de um veículo, o vendedor de uma loja sugere ao consumidor que ele troque as rodas de seu automóvel de aro 15 polegadas para aro 17 polegadas, o que corresponde a um diâmetro maior do conjunto roda e pneu.

Duas consequências provocadas por essa troca de
aro são:', 2018, 'INEP - ENEM 2018, questão 122 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Física'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Elevar a posição do centro de massa do veículo tornando-o mais instável e aumentar a velocidade do automóvel em relação à indicada no velocímetro.', 1, @q),
('B', 'Abaixar a posição do centro de massa do veículo tornando-o mais instável e diminuir a velocidade do automóvel em relação à indicada no velocímetro.', 0, @q),
('C', 'Elevar a posição do centro de massa do veículo tornando-o mais estável e aumentar a velocidade do automóvel em relação à indicada no velocímetro.', 0, @q),
('D', 'Abaixar a posição do centro de massa do veículo tornando-o mais estável e diminuir a velocidade do automóvel em relação à indicada no velocímetro.', 0, @q),
('E', 'Elevar a posição do centro de massa do veículo tornando-o mais estável e diminuir a velocidade do automóvel em relação à indicada no velocímetro.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Talvez você já tenha bebido suco usando dois canudinhos iguais. Entretanto, pode-se verificar que, se colocar um canudo imerso no suco e outro do lado de fora do líquido, fazendo a sucção simultaneamente em ambos, você terá dificuldade em bebê-lo.

Essa dificuldade ocorre porque o(a)', 2018, 'INEP - ENEM 2018, questão 134 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Física'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Força necessária para a sucção do ar e do suco simultaneamente dobra de valor', 0, @q),
('B', 'Densidade do ar é menor que a do suco, portanto, o volume de ar aspirado é muito maior que o volume de suco.', 0, @q),
('C', 'Velocidade com que o suco sobe deve ser constante nos dois canudos, o que é impossível com um dos canudos de fora.', 0, @q),
('D', 'Peso da coluna de suco é consideravelmente maior que o peso da coluna de ar, o que dificulta a sucção do líquido.', 0, @q),
('E', 'Pressão no interior da boca assume praticamente o mesmo valor daquela que atua sobre o suco.', 1, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('De acordo com a Organização Mundial da Saúde, a filariose e a leishmaniose são consideradas doenças  
tropicais infecciosas e constituem uma preocupação para a saúde pública por ser alto o índice de mortalidade a elas associado.

Uma medida profilática comum a essas duas doenças é o(a)', 2022, 'INEP - ENEM 2022, questão 92 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Geografia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Incineração do lixo orgânico.', 0, @q),
('B', 'Construção de rede de esgoto.', 0, @q),
('C', 'Uso de vermífugo pela população.', 0, @q),
('D', 'Controle das populações dos vetores.', 1, @q),
('E', 'Consumo de carnes vermelhas bem cozidas.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Em 2011, uma falha no processo de perfuração realizado
por uma empresa petrolífera ocasionou derramamento de
petróleo na bacia hidrográfica de Campos, no Rio de
Janeiro.
Os impactos decorrentes desse derramamento ocorrem
porque os componentes do petróleo', 2020, 'INEP - ENEM 2020, questão 124 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Geografia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Reagem com a água do mar e sofrem degradação, gerando compostos com elevada toxicidade.', 0, @q),
('B', 'Acidificam o meio, promovendo o desgaste das conchas calcárias de moluscos e a morte de corais.', 0, @q),
('C', 'Dissolvem-se na água, causando a mortandade dos seres marinhos por ingestão da água contaminada.', 0, @q),
('D', 'Têm caráter hidrofóbico e baixa densidade, impedindo as trocas gasosas entre o meio aquático e a atmosfera.', 1, @q),
('E', 'Têm cadeia pequena e elevada volatilidade, conta - minando a atmosfera local e regional em função dos ventos nas orlas marítimas.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('O bônus demográfico é caracterizado pelo período em que, por causa da redução do número de filhos por mulher, a estrutura populacional fica favorável ao crescimento econômico. Isso acontece porque há proporcionalmente menos crianças na população, e o percentual de idosos ainda não é alto.

GOIS, A. O Globo, 5 abr. 2015 (adaptado).

A ação estatal que contribui para o aproveitamento do bônus demográfico é o estímulo à:', 2019, 'INEP - ENEM 2019, questão 88 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Geografia'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Atração de imigrantes.', 0, @q),
('B', 'Elevação da carga tributária.', 0, @q),
('C', 'Qualificação da mão de obra.', 1, @q),
('D', 'Admissão de exilados políticos.', 0, @q),
('E', 'Concessão de aposentadorias.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('A partir da segunda metade do século XVII, o número de escravos recém-chegados cresce no Rio e se estabiliza na Bahia. Nenhum lugar servia tão bem à recepção de escravos quanto o Rio de Janeiro.

FRANÇA, R. O tamanho real da escravidão. O Globo, 5 abr. 2015 (adaptado).

Na matéria, o jornalista informa uma mudança na dinâmica do tráfico atlântico que está relacionada à seguinte atividade:', 2019, 'INEP - ENEM 2019, questão 81 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'História'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Coleta de drogas do sertão.', 0, @q),
('B', 'Extração de metais preciosos.', 1, @q),
('C', 'Adoção da pecuária extensiva.', 0, @q),
('D', 'Retirada de madeira do litoral.', 0, @q),
('E', 'Exploração da lavoura de tabaco.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('A primeira Guerra do Golfo, genuinamente apoiada pelas Nações Unidas e pela comunidade internacional, assim como a reação imediata ao Onze de Setembro, demonstravam a força da posição dos Estados Unidos na era pós-soviética.

HOBSBAWM, E. Globalização, democracia e terrorismo. São Paulo: Cia. das Letras, 2007.

Um aspecto que explica a força dos Estados Unidos, apontada pelo texto, reside no(a)', 2017, 'INEP - ENEM 2017, questão 61 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'História'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Poder de suas bases militares espalhadas ao redor do mundo.', 1, @q),
('B', 'Alinhamento geopolítico da Rússia em relação aos EUA.', 0, @q),
('C', 'Política de expansionismo territorial exercida sobre Cuba.', 0, @q),
('D', 'Aliança estratégica com países produtores de petróleo, como Kuwait e Irã.', 0, @q),
('E', 'Incorporação da China à Organização do Tratado do Atlântico Norte (Otan).', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Muitos países se caracterizam por terem populações multiétnicas. Com frequência, evoluíram desse modo ao longo de séculos. Outras sociedades se tornaram multiétnicas mais rapidamente, como resultado de políticas incentivando a migração, ou por conta de legados coloniais e imperiais.

GIDDENS,A. Sociologia. Porto Alegre: Penso, 2012 (adaptado)

Do ponto de vista do funcionamento das democracias contemporâneas, o modelo de sociedade descrito demanda, simultaneamente,', 2017, 'INEP - ENEM 2017, questão 58 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'História'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Defesa do patriotismo e rejeição ao hibridismo.', 0, @q),
('B', 'Universalização de direitos e respeito à diversidade.', 1, @q),
('C', 'Segregação do território e estímulo ao autogoverno.', 0, @q),
('D', 'Políticas de compensação e homogeneização do idioma.', 0, @q),
('E', 'Padronização da cultura e repressão aos particularismos.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Ao empregar o pronome se em “utilizou-se o caldo de cana em uma célula a combustível para gerar energia elétrica”, o pesquisador', 2025, 'FUVEST 2025 - 1ª fase, Prova V1, questão 66 (gabarito oficial)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'FUVEST'), (SELECT idMateria FROM Materia WHERE nome = 'Língua Portuguesa'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'indetermina o sujeito, tentando mostrar que desconhece a real autoria do experimento.', 0, @q),
('B', 'valoriza o objeto “caldo de cana”, enfatizando a importância desse produto para o experimento.', 0, @q),
('C', 'chama a atenção para o verbo transitivo “utilizar”, valorizando a importância de se experimentar diretamente o caldo de cana.', 0, @q),
('D', 'faz uso da voz passiva, construção em que “caldo de cana” atua como sujeito, deixando de haver menção a quem realizou o experimento.', 1, @q),
('E', 'escolhe uma construção reflexiva em que “caldo de cana” é, ao mesmo tempo, o agente e o objeto do experimento realizado.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Sítio Gerimum

Este é o meu lugar (…)

Meu Gerimum é com g

Você pode ter estranhado

Gerimum em abundância

Aqui era plantado

E com a letra g

Meu lugar foi registrado.

OLIVEIRA, H. D. Língua Portuguesa, n. 88, fev. 2013 (fragmento)

Nos versos de um menino de 12 anos, o emprego da palavra “Gerimum”grafada com a letra “g” tem por objetivo', 2017, 'INEP - ENEM 2017, questão 15 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Língua Portuguesa'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Valorizar usos informais caracterizadores da norma nacional.', 0, @q),
('B', 'Confirmar o uso da norma-padrão em contexto da linguagem poética.', 0, @q),
('C', 'Enfatizar um processo recorrente na transformação da língua portuguesa.', 0, @q),
('D', 'Registrar a diversidade étnica e linguística presente no território brasileiro.', 0, @q),
('E', 'Reafirmar discursivamente a forte relação do falante com seu lugar de origem.', 1, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Blues da piedade

Vamos pedir piedade  
Senhor, piedade  
Pra essa gente careta e covarde  
Vamos pedir piedade  
Senhor, piedade  
Lhes dê grandeza e um pouco de coragem

CAZUZA. Cazuza: o poeta não morreu. Rio de Janeiro:  
Universal Music, 2000 (fragmento).

Todo gênero apresenta elementos constitutivos que condicionam seu uso em sociedade. A letra de canção identifica-se com o gênero ladainha, essencialmente, pela utilização da sequência textual', 2019, 'INEP - ENEM 2019, questão 24 (caderno azul / 1ª aplicação)', 'FACIL',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Língua Portuguesa'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Expositiva, por discorrer sobre um dado tema.', 0, @q),
('B', 'Narrativa, por apresentar uma cadeia de ações.', 0, @q),
('C', 'Injuntiva, por chamar o interlocutor à participação.', 1, @q),
('D', 'Descritiva, por enumerar características de um personagem.', 0, @q),
('E', 'Argumentativa, por incitar o leitor a uma tomada de atitude.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Qual é a quantidade mínima de água, em litro, que cada morador, em média, deverá economizar por dia, de modo que o reservatório não fique sem água nos próximos 10 dias?', 2023, 'INEP - ENEM 2023, questão 142 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Matemática'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', '50', 1, @q),
('B', '60', 0, @q),
('C', '80', 0, @q),
('D', '140', 0, @q),
('E', '150', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Em uma de suas viagens, um turista comprou uma lembrança de um dos monumentos que visitou. Na base do objeto há informações dizendo que se trata de uma peça em escala 1: 400, e que seu volume é de 25 cm3.

O volume do monumento original, em metro cúbico, é de', 2017, 'INEP - ENEM 2017, questão 158 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Matemática'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', '100', 0, @q),
('B', '400', 0, @q),
('C', '1600', 1, @q),
('D', '6250', 0, @q),
('E', '10000', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Uma empresa tem diversos funcionários. Um deles é o gerente, que recebe R$ 1000,00 por semana.  
Os outros funcionários são diaristas. Cada um trabalha 2 dias por semana, recebendo R$ 80,00 por dia trabalhado.

Chamando de X a quantidade total de funcionários da empresa, a quantia Y, em reais, que esta empresa gasta semanalmente para pagar seus funcionários é expressa por', 2019, 'INEP - ENEM 2019, questão 168 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Matemática'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Y = 80X + 920.', 0, @q),
('B', 'Y = 80X + 1000.', 0, @q),
('C', 'Y = 80X + 1080.', 0, @q),
('D', 'Y = 160X + 840.', 1, @q),
('E', 'Y = 160X + 1000.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Grandes reservatórios de óleo leve de melhor qualidade e que produz petróleo mais fino foram descobertos no litoral brasileiro numa camada denominada pré-sal, formada há 150 milhões de anos.

A utilização desse recurso energético acarreta para o ambiente um desequilíbrio no ciclo do', 2020, 'INEP - ENEM 2020, questão 97 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Química'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Nitrogênio, devido à nitrificação ambiental transformando amônia em nitrito.', 0, @q),
('B', 'Nitrogênio, devido ao aumento dos compostos nitrogenados no ambiente terrestre.', 0, @q),
('C', 'Carbono, devido ao aumento dos carbonatos dissolvidos no ambiente marinho.', 0, @q),
('D', 'Carbono, devido à liberação das cadeias carbônicas aprisionadas abaixo dos sedimentos.', 1, @q),
('E', 'Fósforo, devido à liberação dos fosfatos acumulados no ambiente marinho.', 0, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Uma das estratégias para conservação de alimentos é o salgamento, adição de cloreto de sódio (NaCl), historicamente utilizado por tropeiros, vaqueiros e sertanejos para conservar carnes de boi, porco e peixe.

O que ocorre com as células presentes nos alimentos preservados com essa técnica?', 2017, 'INEP - ENEM 2017, questão 132 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Química'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'O sal adicionado diminui a concentração de solutos em seu interior.', 0, @q),
('B', 'O sal adicionado desorganiza e destrói suas membranas plasmáticas.', 0, @q),
('C', 'A adição de sal altera as propriedades de suas membranas plasmáticas.', 0, @q),
('D', 'Os íons Na+ e CI- provenientes da dissociação do sal entram livremente nelas.', 0, @q),
('E', 'A grande concentração de sal no meio extracelular provoca a saída de água de dentro delas.', 1, @q);

INSERT INTO Questao (enunciado, ano, fonte, dificuldade, idVestibular, idMateria)
VALUES ('Um teste de laboratório permite identificar alguns cátions metálicos ao introduzir uma pequena quantidade do material de interesse em uma chama de bico de Bunsen para, em seguida, observar a cor da luz emitida.

A cor observada é proveniente da emissão de radiação eletromagnética ao ocorrer a', 2019, 'INEP - ENEM 2019, questão 105 (caderno azul / 1ª aplicação)', 'MEDIA',
        (SELECT idVestibular FROM Vestibular WHERE sigla = 'ENEM'), (SELECT idMateria FROM Materia WHERE nome = 'Química'));
SET @q = SCOPE_IDENTITY();
INSERT INTO Alternativa (letra, texto, correta, idQuestao) VALUES
('A', 'Mudança da fase sólida para a fase líquida do elemento metálico.', 0, @q),
('B', 'Combustão dos cátions metálicos provocada pelas moléculas de oxigênio da atmosfera.', 0, @q),
('C', 'Diminuição da energia cinética dos elétrons em uma mesma órbita na eletrosfera atômica.', 0, @q),
('D', 'Transição eletrônica de um nível mais externo para outro mais interno na eletrosfera atômica.', 1, @q),
('E', 'Promoção dos elétrons que se encontram no estado fundamental de energia para níveis mais energéticos.', 0, @q);
GO

-- Respostas da aluna Mariana (algumas certas e outras erradas, em dias diferentes)
DECLARE @aluna INT = (SELECT idUsuario FROM Usuario WHERE email = 'aluno@aprovest.com.br');
INSERT INTO RespostaAluno (idUsuario, idQuestao, letraEscolhida, acertou, dataResposta)
SELECT @aluna, q.idQuestao,
       CASE WHEN q.idQuestao % 3 = 0 THEN (SELECT TOP 1 a.letra FROM Alternativa a WHERE a.idQuestao = q.idQuestao AND a.correta = 0 ORDER BY a.letra)
            ELSE (SELECT a.letra FROM Alternativa a WHERE a.idQuestao = q.idQuestao AND a.correta = 1) END,
       CASE WHEN q.idQuestao % 3 = 0 THEN 0 ELSE 1 END,
       DATEADD(DAY, -(q.idQuestao % 7), GETDATE())
FROM Questao q
WHERE q.idQuestao <= 15;
GO

-- Redações da aluna Mariana
DECLARE @aluna INT = (SELECT idUsuario FROM Usuario WHERE email = 'aluno@aprovest.com.br');
INSERT INTO Redacao (titulo, tema, texto, status, dataCriacao, idUsuario) VALUES
('O cuidado que ninguém vê',
 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
 'No Brasil, milhões de mulheres dedicam horas diárias ao cuidado de filhos, idosos e pessoas com deficiência, sem que esse esforço seja reconhecido como trabalho. Essa invisibilidade tem raízes históricas e culturais e precisa ser enfrentada pelo Estado e pela sociedade.

Em primeiro lugar, a divisão sexual do trabalho, herdada de uma sociedade patriarcal, naturalizou a ideia de que cuidar é uma obrigação feminina. Por isso, muitas mulheres acumulam jornadas, o que reduz o tempo dedicado aos estudos e à carreira e aprofunda a desigualdade de renda entre homens e mulheres.

Além disso, a falta de políticas públicas, como creches em tempo integral e centros de convivência para idosos, transfere para as famílias, e principalmente para as mulheres, uma responsabilidade que também é coletiva.

Portanto, cabe ao Ministério das Mulheres, em parceria com as prefeituras, ampliar a oferta de creches e de serviços de cuidado, além de promover campanhas nas escolas e na mídia sobre a divisão justa das tarefas domésticas. Assim, o trabalho de cuidado deixará de ser invisível.',
 'ENVIADA', DATEADD(DAY, -5, GETDATE()), @aluna),
('Povos tradicionais e o direito à memória',
 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
 'Indígenas, quilombolas, ribeirinhos e caiçaras guardam saberes fundamentais para a preservação ambiental e para a identidade brasileira. No entanto, essas comunidades ainda enfrentam invisibilidade e ameaças aos seus territórios.

(rascunho: desenvolver os argumentos sobre demarcação de terras e educação escolar)',
 'RASCUNHO', DATEADD(DAY, -1, GETDATE()), @aluna);
GO

-- Mensagens recebidas pela página Fale Conosco
INSERT INTO MensagemContato (nome, email, assunto, mensagem, status, dataEnvio) VALUES
('Rafael Moreira', 'rafael.moreira@email.com', 'Dúvida', 'O simulado mensal fica disponível para todos os alunos cadastrados?', 'NOVA', DATEADD(DAY, -2, GETDATE())),
('Colégio Horizonte', 'coordenacao@colegiohorizonte.com.br', 'Parceria', 'Gostaríamos de conhecer o AproVest para usar com as turmas do 3º ano.', 'LIDA', DATEADD(DAY, -4, GETDATE()));
GO
