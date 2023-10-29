const express = require("express");
const router = express.Router();
const usersControl = require("../controllers/users.controller");
const usersController = new usersControl();

router.post("/", (req, res) => {
   usersController.login(req, res);
});

router.post("/signup", (req, res) => {
   usersController.signup(req, res);
});

router.get("/validation/:token", async (req, res) => {
   usersController.confirmEmail(req, res);
});

router.get("/validation/resend", async (req, res) => {
   usersController.resendConfirmationMail(req, res);
});

module.exports = router;
