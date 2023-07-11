const request = require("supertest");
const express = require("express");
const knex = require("knex");
const config = require("../knexfile");
const bcrypt = require("bcrypt");

const app = express();
const db = knex(config.test);
const routes = require("../src/routes");

app.use(express.json());
app.use(routes);

let server;

describe("POST /sign-up", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve cadastrar um novo usuário", async () => {
    const user = {
      name: "Duda Furtado",
      email: "dudafurtado@example.com",
      age: 22,
      password: "12345"
    };

    const response = await request(server)
      .post("/sign-up")
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuário cadastrado com sucesso!");
  });
});

describe("POST /sign-in", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve logar um usuário com sucesso", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const user = { email: "dudafurtado@example.com", password: "12345" };
    const response = await request(app)
      .post("/sign-in")
      .send(user);

    const isCorrectPassword = await bcrypt.compare(user.password, response.body.user.password);

    if (isCorrectPassword) {
      user.password = response.body.user.password;
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.password).toBe(user.password);
  });
});

describe("POST /influencers", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve cadastrar um influencer com sucesso", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const { body } = await request(app)
      .post("/sign-in")
      .send({ email: "dudafurtado@example.com", password: "12345" });

    const response = await request(app)
      .post("/influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ 
        name: "Peter Schulz", 
        subscribers: 10000, 
        channel: "Peter Schulz", 
        plataform: "youtube.com", 
        category: "Entretenimento"    
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Influenciador cadastrado com sucesso");
  });
});

describe("GET /influencers", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve listar os influencers", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const { body } = await request(app)
      .post("/sign-in")
      .send({ email: "dudafurtado@example.com", password: "12345" });

    await request(app)
      .post("/influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ 
        name: "Peter Schulz", 
        subscribers: 10000, 
        channel: "Peter Schulz", 
        plataform: "youtube.com", 
        category: "Entretenimento"    
      });

    const response = await request(app)
      .get("/influencers")
      .set("Authorization", `Bearer ${body.token}`)

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("PUT /influencers/:id", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve atualizar um influencer existente", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const { body } = await request(app)
      .post("/sign-in")
      .send({ email: "dudafurtado@example.com", password: "12345" });

    await request(app)
      .post("/influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ 
        name: "Peter Schulz", 
        subscribers: 10000, 
        channel: "Peter Schulz", 
        plataform: "youtube.com", 
        category: "Entretenimento"    
      });

    const user = { name: "Peter Schulz Sousa" };

    const response = await request(app)
      .put("/influencers/1")
      .set("Authorization", `Bearer ${body.token}`)
      .send(user);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Influenciador atualizado com sucesso");
  });
});

describe("DELETE /influencers/:id", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve deletar um influencer existente", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const { body } = await request(app)
      .post("/sign-in")
      .send({ email: "dudafurtado@example.com", password: "12345" });

    await request(app)
      .post("/influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ 
        name: "Peter Schulz", 
        subscribers: 10000, 
        channel: "Peter Schulz", 
        plataform: "youtube.com", 
        category: "Entretenimento"    
      });

    const response = await request(app)
      .delete("/influencers/1")
      .set("Authorization", `Bearer ${body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Influenciador excluído com sucesso");
  });
});

describe("GET /filter-influencers", () => {
  beforeAll(async () => {
    server = app.listen();
    await db.migrate.latest()
  });

  afterAll(async () => {
    await db.migrate.rollback();
    server.close();
  });

  it("Deve filtrar influencers por nome, categoria ou inscritos", async () => {
    await request(server)
      .post("/sign-up")
      .send({
        name: "Duda Furtado",
        email: "dudafurtado@example.com",
        age: 22,
        password: "12345"
      });

    const { body } = await request(app)
      .post("/sign-in")
      .send({ email: "dudafurtado@example.com", password: "12345" });

    await request(app)
      .post("/influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .send({ 
        name: "Peter Schulz", 
        subscribers: 10000, 
        channel: "Peter Schulz", 
        plataform: "youtube.com", 
        category: "Entretenimento"    
      });

    const filter = { subscribers: 10000 };

    const response = await request(app)
      .get("/filter-influencers")
      .set("Authorization", `Bearer ${body.token}`)
      .query(filter);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const influencersFiltered = response.body;

    influencersFiltered.forEach(influencer => {
      if (filter.name && influencer.name.includes(filter.name)) {
        const name = filter.name;
        expect(name).toBe(filter.name);
      }

      if (filter.category && influencer.category.includes(filter.category)) {
        const category = filter.category;
        expect(category).toBe(filter.category);
      }

      if (filter.subscribers) {
        expect(filter.subscribers).toBeGreaterThanOrEqual(influencer.subscribers);
      }
    });
  });
});