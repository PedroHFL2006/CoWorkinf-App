# Co-Working API

Este projeto é uma API REST para gerenciamento de um espaço de Co-Working, desenvolvida durante o Bootcamp. A arquitetura foi desenhada com foco em boas práticas de mercado, como o Princípio de Responsabilidade Única (SRP) e o padrão MVC adaptado para APIs em camadas.

## Arquitetura em Camadas (SRP)

Para garantir que o código seja fácil de manter e escalar no longo prazo, dividimos a aplicação em camadas bem definidas. Nenhum arquivo faz "tudo". O fluxo de dados obedece a seguinte ordem:

1. **Rotas (`src/routes`)**:
   - Ponto de entrada da requisição. Mapeia as URLs para os controladores corretos.
   - O arquivo `index.js` serve como roteador central.
   - **Responsabilidade**: Dizer "quem atende" cada rota HTTP. Não tem lógica de negócios.

2. **Controladores (`src/controllers`)**:
   - Extrai parâmetros (como `req.body`, `req.params.id`, `req.query`).
   - Gerencia a requisição e a resposta HTTP (ex: decide se retorna 200 OK, 201 Created ou 400 Bad Request).
   - Aciona a camada de Serviços para executar a lógica.

3. **Serviços (`src/services`)**:
   - É o coração da aplicação. Concentra as **Regras de Negócio**.
   - Por exemplo: na criação de reservas, é aqui que verificamos se o usuário existe, se a sala existe e se o horário já está ocupado.
   - Comunica-se com o banco de dados utilizando o Prisma ORM.

4. **Banco de Dados (Prisma ORM + PostgreSQL)**:
   - A ferramenta que traduz o código JavaScript em comandos SQL (PostgreSQL) para leitura e persistência dos dados.
   - O banco roda em um container Docker isolado (veja `docker-compose.yml`).

## Ferramentas & Validação

- **Zod**: Biblioteca de validação e declaração de esquemas.
  Utilizamos o Zod nos middlewares para verificar os dados que chegam (ex: formato do CPF, tamanho da senha) antes mesmo deles chegarem aos controladores, evitando comandos condicionais complexos (vários IFs) na lógica de negócios.

- **Global Error Handling**:
  Todos os controladores usam a estrutura `try/catch`. Caso ocorra uma falha (como validação reprovada no Zod), a resposta retorna um erro `400` padrão, impedindo que a aplicação trave.

- **Postman / LiteClient (REST Client)**:
  Ferramentas padrão de mercado para simular o cliente e enviar requisições (`GET`, `POST`, `PUT`, `DELETE`) para a API, enviando JSONs através do `Body (Raw)`. O arquivo `api.http` na raiz do projeto já traz exemplos prontos.

## Autenticação

A API conta com autenticação via **JWT (JSON Web Token)**:

- `POST /auth/login` recebe `email` e `senha`, valida as credenciais e devolve um token.
- As senhas nunca são armazenadas em texto puro: usamos **bcrypt** para gerar o hash antes de salvar no banco, e o campo `senha` nunca é retornado nas respostas da API.
- Um middleware de autenticação (`src/middlewares/authMiddleware.js`) já está pronto para proteger rotas sensíveis, exigindo o header `Authorization: Bearer <token>`. Há também um `adminMiddleware` para restringir ações a usuários administradores.
- Para usar em rotas protegidas: `router.post("/", authMiddleware, ...)`.

## Funcionalidades Principais

- **Usuários**: Cadastro de clientes (Nome, E-mail, Senha com hash, Telefone, CPF validado).
- **Salas**: Cadastro e gerenciamento de salas (Capacidade, Preço).
- **Reservas**:
  - As reservas contêm lógicas como normalização de fuso horário (Data limpa em UTC) para não haver distorção do dia.
  - Utiliza-se `findFirst` para evitar duplicação de reserva para o mesmo Dia e Turno (Manhã, Tarde ou Noite) em uma mesma sala.
- **Filtros de Disponibilidade**:
  - O endpoint de listar salas (`GET /salas`) aceita _Query Parameters_ (`?dia=...&turno=...`).
  - A filtragem é executada no Prisma excluindo (subtração de conjuntos) as salas que já possuem reservas alocadas para esse momento.

## Tecnologias

- **Node.js + Express**: Servidor e infraestrutura web.
- **Prisma**: ORM e Migrations (versionamento do banco de dados).
- **PostgreSQL**: Banco de dados relacional, rodando via Docker.
- **JWT + bcrypt**: Autenticação e hash seguro de senhas.
- **Zod**: Validação de schemas.
- **Swagger**: Documentação visual acessível em `/api-docs`.

## Como rodar o projeto

1. Suba o banco de dados PostgreSQL via Docker:

   ```bash
   docker compose up -d
   ```

2. Configure o `.env` (baseado nas credenciais do `docker-compose.yml`):

   ```dotenv
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
   JWT_SECRET="sua-string-secreta-aleatoria"
   PORT=3000
   ```

3. Instale as dependências e aplique as migrations:

   ```bash
   npm install
   npx prisma migrate dev
   ```

4. Suba a API:

   ```bash
   npm run dev
   ```

5. Acesse a documentação em `http://localhost:3000/api-docs`.
