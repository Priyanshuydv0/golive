const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware");
const {getMeetingHistory, postMeetingHistory}= require("../controllers/history");

router.get("/",isLoggedIn, getMeetingHistory);
router.post("/",isLoggedIn, postMeetingHistory);

module.exports = router;