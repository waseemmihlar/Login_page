const express=require('express');
const mysql=require('mysql');
const hbs=require('hbs');
const path=require('path');
const dotenv=require('dotenv');
const bcryptjs=require('bcryptjs');
const cookieparser=require('cookie-parser');


const app=express();

dotenv.config({
    path:".env"
})

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME
})


db.connect((error)=>{
    if(error)
    {
        console.log(error);
    }
    else{
        console.log("Mysql connected succesfull");
    }
})

app.use(cookieparser());
app.use(express.urlencoded({extended:false}))
//console.log(__dirname); -show current directory path
const publicpath=path.join(__dirname,"./public")
app.use(express.static(publicpath));
app.set("view engine","hbs");

const partialpath=path.join(__dirname,"./views/partials");
hbs.registerPartials(partialpath);

app.use("/",require('./route/pages'))
app.use("/auth",require('./route/auth'));

app.listen(5000,()=>{
    console.log("Server started @ port 5000")
});

