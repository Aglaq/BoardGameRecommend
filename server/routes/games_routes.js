const router = require("express").Router();
const controller = require("../controllers/games_controllers.js");

router.get("/hot", controller.getHot);
router.post("/filter", controller.getFiltered);
router.get("/:id", controller.getGame);

module.exports = router;
