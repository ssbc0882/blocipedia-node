const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");


router.get("/users/signup", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id/payment", userController.payment);

router.post("/users/signup", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.post("/users/:id/upgradePremium", userController.upgradePremium);
router.post("/users/:id/downgrade", userController.downgrade);


module.exports = router;