const express=require('express')
const route=express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const users=require('../models/users')


privatekey=process.env.api_key 

route.get("/",(req,res)=>{
    res.send("hizxzxi")
})

route.post('/create',async (req,res)=>{

    const {username,email,password}=req.body
    if(password.length<=6){
      return  res.json({status:"error"})
    }
    hashpassword= await bcrypt.hash(password,10)
    
    users.create({
        username,
        email,
        password:hashpassword,
        picture:"user.png"
    }).then((result)=>{
        //console.log(result);
        res.json({status:"created success fully"})
    }).catch((err)=>{
        if(err.code===11000){
            if(err.keyPattern.email===1){
                res.status(205).json({status:"email already taken"})
            }
            if(err.keyPattern.username===1){
                res.status(205).json({status:"username already taken"})
            }
            
        }else{
            res.status(500).json({err})
        }
        //console.log(err);
        //console.log(err.keyPattern);
    })

})

route.get('/login',async(req,res)=>{
    //console.log(privatekey)
    const {id,password}=req.query
    //console.log(req.query);
    let result=[]
    try{
        result= await users.find({$or:[{email:id},{username:id}]})
        //console.log(result);
    }catch(err){
        res.status(205).json({status:"usernot foundiii"})
        
        //console.log("=======");
        throw(err)
    }
     if(result===[]){
        res.status(205).json({status:"error",msg:"email or password doesnt match"})
    }
    else if(result!==[]){
        if(result[0]){
        const checkpass=result[0].password
        try{
            const passmatch= await bcrypt.compare(password,checkpass)
            if(passmatch){
                
                const token=await jwt.sign({
                    id:result[0].id,
                    username:result[0].username
                },privatekey)
                res.status(200).json({status:"login success",token})
            }else{
                res.status(205).json({status:"error",msg:"email or password doesnt match"})
            }
        }catch(err){
            //console.log(err);
                }
            }
            else{
                res.status(205).json({status:"error",msg:"email or password doesnt match"})

            }
            }

}

)


module.exports=route