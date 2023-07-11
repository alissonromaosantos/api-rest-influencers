const express = require("express");
const router = express.Router();
const { createUsers, loggedUsers } = require("./controllers/users");
// const { createInfluencers, getInfluencers, updateInfluencers, deleteInfluencers, filterInfluencers } = require("./controllers/influencers");
// const authMiddleware = require("./middlewares/auth");

router.post("/sign-up", createUsers);
router.post("/sign-in", loggedUsers);

// router.post("/influencers", authMiddleware, createInfluencers);
// router.get("/influencers", authMiddleware, getInfluencers);
// router.put("/influencers/:id", authMiddleware, updateInfluencers);
// router.delete("/influencers/:id", authMiddleware, deleteInfluencers);
// router.get("/filter-influencers", authMiddleware, filterInfluencers);

module.exports = router;