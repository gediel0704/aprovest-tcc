# AproVest - TCC

Plataforma web de preparação para o ENEM, a FUVEST e a Unicamp, desenvolvida como Trabalho de Conclusão
de Curso do **Curso Técnico em Informática** da FIEB - ITB Brasílio Flores de Azevedo (turma INF2CM).

O aluno resolve questões oficiais na banca de questões, escreve e organiza suas redações e acompanha o
seu desempenho por matéria. O administrador mantém o banco de questões (CRUD completo), acompanha os
usuários e as mensagens do Fale Conosco.

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Front-end | React + Vite (JavaScript), React Router, Axios, Bootstrap 5, CSS Modules, Font Awesome |
| Back-end | Java 21, Spring Boot (Web, Data JPA, Validation), BCrypt para as senhas |
| Banco de dados | Microsoft SQL Server (scripts na pasta `database`) |

## Como executar

**Pré-requisitos:** Node.js 20 ou superior, Java 21 (JDK) e Microsoft SQL Server 2019 ou superior.

No terminal do VS Code, dentro da pasta do projeto:

```
npm install
npm run dev
```

O `npm run dev` faz tudo sozinho:

1. encontra o Java 21 e o SQL Server do computador (e o login que funciona: Windows ou usuário `sa`);
2. sobe a API (Spring Boot) na porta 8080. Na primeira vez, se o banco `aprovesttcc` não existir,
   a API o cria executando os scripts `database/01_criar_banco.sql` e `database/02_dados_iniciais.sql`;
3. sobe o site (Vite) e abre o navegador em **http://localhost:5173**.

Para encerrar, pressione `Ctrl + C` no terminal.

### Contas de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Aluno | aluno@aprovest.com.br | 123456 |
| Administrador | admin@aprovest.com.br | 123456 |

### Executar as partes separadamente

- **Banco:** no SQL Server Management Studio, execute `database/01_criar_banco.sql` e depois `database/02_dados_iniciais.sql`.
- **API:** em `aprovest-api/src/main/resources`, copie `application-local.properties.example` para
  `application-local.properties`, coloque o usuário e a senha do SQL Server e rode `.\mvnw.cmd spring-boot:run`
  dentro da pasta `aprovest-api`.
- **Site:** dentro da pasta `aprovest-web`, rode `npm install` e `npm run dev`.

## Estrutura

```
database/            scripts do SQL Server (criação das tabelas e dados iniciais)
aprovest-api/        API REST em Java (Spring Boot)
  controller/        rotas da API (recebem as requisições)
  model/entity/      entidades (uma para cada tabela)
  model/repository/  acesso ao banco (Spring Data JPA)
  model/services/    regras de negócio
aprovest-web/        site em React
  src/pages/         uma pasta por tela (Nome/Nome.jsx + Nome.module.css)
  src/components/    componentes reutilizáveis (menus, Modal, CredentialUser...)
  src/routes/        AppRoutes.jsx (rotas do site)
  src/services/      api.js (Axios) e sessao.js (usuário logado)
scripts/             iniciar.mjs: sobe banco, API e site com "npm run dev"
```

## Rotas da API (http://localhost:8080/api/v1)

| Método | Rota | Uso |
|---|---|---|
| POST | /auth/login, /auth/cadastro | Login e cadastro |
| GET, POST, PUT, DELETE | /questoes, /questoes/{id} | CRUD de questões (administrador) |
| GET | /questoes/banca | Sorteia questões para o aluno |
| POST | /questoes/{id}/responder | Registra a resposta do aluno |
| GET, POST, PUT, DELETE | /redacoes, /redacoes/{id} | CRUD das redações do aluno |
| GET, PUT | /usuarios, /usuarios/{id}, /usuarios/{id}/status | Usuários e perfil |
| GET | /usuarios/{id}/desempenho | Desempenho do aluno |
| POST, GET, PUT, DELETE | /mensagens | Fale Conosco |
| GET | /vestibulares, /materias, /publico/numeros, /admin/resumo | Listas e números dos painéis |

## O que está em desenvolvimento

Todas as telas estão prontas e navegáveis. Ficam para a próxima etapa do projeto: a correção automática
de redação por inteligência artificial (a tela mostra um exemplo de resultado), os simulados com tempo
e o envio do e-mail de recuperação de senha.

## Problemas comuns

| Mensagem | O que fazer |
|---|---|
| Java 21 não encontrado | Instale com `winget install Microsoft.OpenJDK.21` e abra um novo terminal. |
| Nenhum SQL Server foi encontrado | Instale o SQL Server (edição Developer ou Express). |
| TCP/IP desligado | Execute `database\configurar-sqlserver.ps1` como administrador (ou peça ao técnico do laboratório). |
| Porta 8080 ocupada | Feche o programa que está usando a porta (por exemplo, outra API) e rode de novo. |
