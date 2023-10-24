const express = require("express");
const router = express.Router();
const usersControl = require("../controllers/users.controller");
const usersController = new usersControl();

router.post("/", (req, res) => {
  usersController.login(req,res);
})

module.exports = router;

