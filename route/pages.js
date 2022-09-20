const express=require('express');
const controlleruser=require("../controller/user");
const router=express.Router();

router.get(["/","/login"],(req,res)=>{
    //res.send("<h2>Hello Nibm</h2>");
    res.render("login");
});

router.get("/register",(req,res)=>{

        res.render("register");
});

router.get("/home",controlleruser.isLogedin,(req,res)=>{
    //console.log(req.name);
    if(req.user)
    {
        res.render("home",{user:req.user});
    }

    else
    {
        res.redirect("/login")
    }
   
});

router.get("/profile",controlleruser.isLogedin,(req,res)=>{
    if(req.user)
    {
        res.render("profile",{user:req.user});
    }

    else
    {
        res.redirect("/login")
    }
});

module.exports=router;

