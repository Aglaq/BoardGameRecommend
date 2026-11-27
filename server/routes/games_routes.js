const router = require("express").Router();
const controller = require("../controllers/games_controllers");

router.get("/:id", controller.getGame);
router.get("/hot", controller.getHot);
router.post("/filtered", controller.getFiltered);

module.exports = router;
