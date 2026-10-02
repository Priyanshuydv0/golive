
const express = require("express");
const router = express.Router();
const {Signup}=require("../controllers/loginsignup");

router.post("/",Signup);
module.exports=router;

