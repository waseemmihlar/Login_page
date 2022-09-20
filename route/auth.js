const express=require('express');
const controlleruser=require("../controller/user");
const router =express.Router();

router.post("/register",controlleruser.register);
router.post("/login",controlleruser.login);
router.get("/logout",controlleruser.logout);

module.exports=router;


