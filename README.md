# Influencers API

Este é um projeto construído usando Node.js e Express.js, com Knex.js para conexão com o banco de dados. Ele inclui nodemon para reinícios automáticos do servidor, Jest e superteste para teste de API e PostgreSQL como banco de dados.

## Installation

1. Clone o repositório:

   ```bash
   git clone git@github.com:alissonromaosantos/api-rest-influencers.git
   ```

2. Navegue até a pasta do diretório:

   ```bash
   cd api-rest-influencers
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

## Configuration

### Arquivo .env

Crie um arquivo `.env` e `.env.test` na raiz do diretório do projeto e configure as variáveis a seguir:

```plaintext
PORT=3000               # Porta que o servidor irá rodar
DB_HOST=localhost       # Host do banco de dados
DB_PORT=5432            # Número da porta que roda o banco de dados
DB_NAME=mydatabase      # Nome do banco de dados
DB_USER=myusername      # Nome do usuário do banco de dados
DB_PASSWORD=mypassword  # Senha do banco de dados
NODE_ENV=development # Nome do ambiente está por padrão o de desenvolvimento mas poderia ser test ou production por exemplo
```

Certifique-se de substituir os valores de espaço reservado por suas próprias credenciais de banco de dados.

### Knex.js Configuration

O projeto usa Knex.js para se conectar ao banco de dados PostgreSQL. A configuração para Knex.js pode ser encontrada no arquivo `knexfile.js` no diretório raiz. Modifique a seguinte seção no arquivo para corresponder às configurações do banco de dados:

```javascript
development: {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
},
```

## Migrations no Banco de dados

Para criar tabelas de banco de dados, você pode usar migrações Knex.js. Siga estas etapas para criar e executar migrações:

1. Crie um novo arquivo de migration:

   ```bash
   npx knex migrate:make migration_name
   ```

Substitua `migration_name` por um nome apropriado para sua migração.

2. Implemente a migração no arquivo recém-criado localizado no diretório `database/migrations`. Consulte a documentação do Knex.js para obter detalhes sobre como definir migrações.

3. Execute as migrations para criar as tabelas no banco de dados:

   ```bash
   npm run migrate
   ```

Este comando executará todas as migrações pendentes.

## Running Tests

O projeto usa Jest e supertest para testes de API. Os testes estão localizados no diretório `test` na raiz do projeto.

Para executar os testes, use o seguinte comando:

```bash
npm run test
```

O Jest executará os testes e exibirá os resultados.

## Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```

Isso iniciará o servidor usando o nodemon, que reiniciará automaticamente o servidor sempre que forem feitas alterações no código.

## Funcionalidades da API

1. Cadastrar um usuário gerando senha criptografada
2. Login de usuário e geração de token de autenticação
3. Listar Influenciadores cadastrados
4. Cadastrar influenciadores
5. Atualizar um registro de um influenciador
6. Deletar um registro de influenciador
7. Filtrar influenciadores por nome, categoria ou inscritos

## License

Este projeto está licenciado sob a [MIT License](LICENSE).

Feito com ❤️ por Alisson Romão Santos
