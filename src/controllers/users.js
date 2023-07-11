const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUsers = async (req, res) => {
  const { name, email, age, password } = req.body;

  if (!name || !email || !age || !password) {
    return res.status(400).json({ message: "Preencha todos campos!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await knex("users").insert({ name, email, age, password: hashedPassword });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar o usuário" });
  }
};

const loggedUsers = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Preencha o campo email e senha!" });
  }

  try {
    const user = await knex("users").where({ email }).first();
    
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    } 

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id }, "token", { expiresIn: "24h" });

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao autenticar o usuário" });
  }
};

module.exports = {
  createUsers,
  loggedUsers
};