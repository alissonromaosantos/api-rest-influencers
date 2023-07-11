const request = require("supertest");
const express = require("express");
const knex = require("knex");
const config = require("../knexfile");

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
    const userData = {
      name: "Duda Furtado",
      email: "Dudafurtado@example.com",
      age: 22,
      password: "12345"
    };

    const response = await request(server)
      .post("/sign-up")
      .send(userData);
    expect(response.status).toBe(201);
    expect(response.body.result.name).toBe(userData.name);
    expect(response.body.result.email).toBe(userData.email);
    expect(response.body.result.age).toBe(userData.age);
    
  });

  // it('Deve logar um usuário com sucesso', async (done) => {
  //   const response = await request(app)
  //     .post("/sign-in")
  //     .send({ name: "John Doe", password: "johndoe@example.com" });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty("token");

  //   done();
  // });

  // it("Deve cadastrar um influencer com sucesso", async (done) => {
  //   const influencer = { 
  //     id: 1,
  //     name: "Peter Schulz", 
  //     subscribers: 10000, 
  //     channel: "Peter Schulz", 
  //     plataform: "youtube.com", 
  //     category: "Entretenimento", 
  //     user_id: 1 
  //   };

  //   const response = await request(app)
  //     .post("/influencers")
  //     .send(influencer);

  //   expect(response.status).toBe(201);
  //   expect(response.body).toHaveProperty(influencer.id);
  //   expect(response.body.nome).toBe(influencer.name);

  //   done();
  // });

  // it("Deve listar os influencers", async (done) => {
  //   const response = await request(app).get("/influencers");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);

  //   done()
  // });

  // it("Deve atualizar um influencer existente", async () => {
  //   const user = { name: "Peter Schulz Sousa" };

  //   const response = await request(app)
  //     .put("/influencers/1")
  //     .send(user);

  //   expect(response.status).toBe(200);
  //   expect(response.body.nome).toBe(user.name);
  // });

  // it("Deve deletar um influencer existente", async () => {
  //   const response = await request(app).delete("/influencers/1");

  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe("Influenciador excluído com sucesso");
  // });

  // it("Deve filtrar influencers por nome, categoria e inscritos", async () => {
  //   const filter = { nome: "Peter", categoria: "Entretenimento", inscritos: 10000 };

  //   const response = await request(app)
  //     .get("/filter-influencers")
  //     .query(filter);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);

  //   const influencersFiltered = response.body;

  //   influencersFiltered.forEach(influencer => {
  //     expect(influencer.name).toBe(filter.name);

  //     expect(influencer.category).toBe(filter.category);

  //     expect(influencer.inscritos).toBeGreaterThanOrEqual(filter.subscribers);
  //   });
  // });
});
