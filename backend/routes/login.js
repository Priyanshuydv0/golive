
const express = require("express");
const router = express.Router();
const {Login}=require("../controllers/loginsignup");
router.post("/",Login);
module.exports=router;


