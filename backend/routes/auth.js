const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware");

router.get("/", isLoggedIn , async (req,res)=>{
    console.log("auth called")
    console.log(req.user)
    const decoded =req.user;
    try {
         
        return res.status(200).json(decoded);
        
    } catch (error) {
        return res.status(500).json({message:"internal server error"});
    }
})
module.exports=router;

