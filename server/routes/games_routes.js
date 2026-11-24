const router = require("express").Router();
const controller = require("../controllers/games_controllers");

router.get("/find", controller.get_game);
router.get("/", controller.hot_games);

module.exports = router;
