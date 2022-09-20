const express=require('express');
const mysql=require('mysql');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const{promisify}=require('util');

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME
})

exports.register=(req,res)=>{
    
//   console.log(req.body)
  const{name,email,password,confirmpassword}=req.body;

//   const name=req.body.name;
//   const password=req.body.password;

        db.query("select email from user where email=?",[email],async(error,result)=>{
            if(error)
            {
                console.log(error)
            }
            if(!name || !email || !password || !confirmpassword)
            {
                res.render("register",{msg:"Please fill all required fields",msgtype:"error"})
            }
            else if(result.length>0)
                {
                    return res.render("register",{msg:"Entered email is already taken",msgtype:"error"})
                }
               
            else if(confirmpassword!==password)
                {
                     return res.render("register",{msg:"password does not match",msgtype:"error"})
                }
            else{
                     let hashpasword=await bcryptjs.hash(password,8)
                    //  console.log(hashpasword);

                    db.query("insert into user set ?",{name:name,email:email,password:hashpasword},(error,result)=>{
                        if(error)
                        {
                            console.log(error);
                        }
                        else{
                            return res.render("register",{msg:"registration succesfull",msgtype:"success"})
                        }
                    })
                }        
            
        })
    }   
    
exports.login=(req,res)=>{
    const{email,password}=req.body;
    try 
    {
        if(!email || !password)
        {
            return res.status(400).render("login",{msg:"Please fill all required fields",msgtype:"success"})
        }

        db.query("select * from user where email=?",[email],async(error,result)=>{
            if(error)
            {
                console.log(error)
            }
            if(result.length<=0)
            {
                return res.status(401).render("login",{msg:"Invalid email & password",msgtype:"success"})
            }
            else if(!(await bcryptjs.compare(password,result[0].password)))
            {
                return res.status(401).render("",{msg:"Invalid email & password",msgtype:"success"})
            }
            else
            {
                const id=result[0].id;
                const token=jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRED_IN});
                //console.log("Jwt token is : "+token)
                const cookieoption={expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                                    httpOnly:true}
                
                res.cookie("nibm",token,cookieoption)
                res.status(200).redirect("/home");                    
            }
        })
        
    }
     catch (error)
    {
        console.log(error)   
    }
}


exports.isLogedin=async(req,res,next)=>
{
    //req.name="NIBM";
    //console.log(req.cookies);
    if(req.cookies.nibm)
    {
    try{
    
        const decode=await promisify(jwt.verify)(req.cookies.nibm,process.env.JWT_SECRET);
        //console.log(decode);
        db.query("select * from user where id=?",[decode.id],(error,result)=>{
            if(!result)
            {
                return next()
            }
            console.log(result)
            req.user=result[0];
            return next();
        })
        }
      catch(error)
      {
        console.log(error);
      }  

    }
    else
    {
        return next();
    }

}



exports.logout=(req,res)=>{
    res.cookie("nibm","logout",{
        expires:new Date(Date.now()+2*1000)
    });

    res.status(200).redirect("/login")
}


