const knex = require("../database/connection");

const createInfluencers = async (req, res) => {
  const { name, subscribers, channel, plataform, category } = req.body;
  const userId = req.userId;

  if (!name || !subscribers || !channel || !plataform || !category) {
    return res.status(401).json({ message: "Preencha todos os campos!" });
  }

  try {
    await knex("influencers").insert({ name, subscribers, channel, plataform, category, user_id: userId });

    return res.status(201).json({ message: "Influenciador cadastrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar o influenciador" });
  }
};

const getInfluencers = async (req, res) => {
  const userId = req.userId;

  try {
    const influencers = await knex("influencers").where({ user_id: userId }).select("*");

    return res.status(200).json(influencers);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar os influenciadores" });
  }
};

const updateInfluencers = async (req, res) => {
  const { id } = req.params;
  const { name, subscribers, channel, plataform, category } = req.body;
  const userId = req.userId;

  try {
    const influencer = await knex("influencers").where({ id }).first();

    if (influencer.user_id === userId) {
      const influencerName = name ? name : influencer.name;
      const influencerSubscribers = subscribers ? subscribers : influencer.subscribers;
      const influencerChannel = channel ? channel : influencer.channel;
      const influencerPlataform = plataform ? plataform : influencer.plataform;
      const influencerCategory = category ? category : influencer.category;

      await knex("influencers").where({ id }).update({ name: influencerName, subscribers: influencerSubscribers, channel: influencerChannel, plataform: influencerPlataform, category: influencerCategory, user_id: userId });

      return res.status(200).json({ message: "Influenciador atualizado com sucesso" });
    } else {
      return res.status(403).json({ message: "Você não tem permissão para atualizar este influenciador" });
    }
  }catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar o influenciador" });
  }
};

const deleteInfluencers = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const influencer = await knex("influencers").where({ id }).first();

    if (influencer.user_id === userId) {
      await knex("influencers").where({ id }).del();

      return res.status(200).json({ message: "Influenciador excluído com sucesso" });
    } else {
      return res.status(403).json({ message: "Você não tem permissão para excluir este influenciador" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro ao excluir o influenciador" });
  }
};

const filterInfluencers = async (req, res) => {
  const { category, name, subscribers } = req.query;
  const userId = req.userId;

   if (!name && !category && !subscribers) {
    return res.status(401).json({ message: "Você deve informar nome, categoria ou inscritos para filtrar um influenciador" })
  }

  try {
    let query = knex("influencers").where({ user_id: userId });

    if (category) {
      query = query.where("category", "ilike", `%${category}%`);
    }

    if (name) {
      query = query.where("name", "ilike", `%${name}%`);
    }

    if (subscribers) {
      query = query.where("subscribers", "<=", subscribers);
    }

    const influencers = await query.select("*");

    if (influencers.length === 0) {
      return res.status(404).json({ message: "Nenhum influenciador foi encontrado" });
    }

    return res.status(200).json(influencers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao filtrar os influenciadores" });
  }
};

module.exports = {
  createInfluencers,
  getInfluencers, 
  updateInfluencers,
  deleteInfluencers,
  filterInfluencers
};