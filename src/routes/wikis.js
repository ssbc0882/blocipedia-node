const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");
const validation = require("./validation");

router.get("/wiki", wikiController.index);
router.get("wiki/new", wikiController.new);
router.get("/wiki/:id", wikiController.show);
router.get("/wiki/:id/edit", wikiController.edit);

router.post("/wiki/create", validation.validateWikis, wikiController.create);
router.post("/wiki/destroy", wikiController.destroy);
router.post("/wiki/:id/update", validation.validateWikis, wikiController.update);

module.exports = router;