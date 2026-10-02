const express = require("express");
const router = express.Router();
const isLoggedIn=require("../middleware");

const { logout } = require("../controllers/loginsignup");

router.post("/", isLoggedIn, logout);

module.exports = router;
