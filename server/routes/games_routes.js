const router = require("express").Router();
const controller = require("../controllers/games_controllers");

router.get("/find", controller.get_game);
router.get("/hot", controller.get_hot);
router.get("/filtered", controller.get_filtered);

module.exports = router;
