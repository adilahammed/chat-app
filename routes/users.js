const express= require("express")
const router=express.Router()
const users=require('../models/users')

router.get('/',(req,res)=>{
    res.send("userrpoute")
})

router.get('/search',async (req,res)=>{
    //console.log(req.query)
    let dbresult= await users.find({$and:[{username:{$regex:req.query.searchval}},{_id:{$ne:req.user.id}}]},{_id:0,username:1,email:1,picture:1}).limit(10)
    //console.log(dbresult)
    res.status(200).json(dbresult)
})

router.post('/sendreq',async(req,res)=>{
    try{
        const dbresult=await users.updateOne({username:req.body.username},{$addToSet:{request:req.user.username}})
        //console.log(dbresult)
        if(dbresult.modifiedCount===1){
           return res.status(200).json({msg:"request success"})
        }
        res.json({msg:"cant send request"})
        
    }catch(err){
        //console.log(err)
    }
})

router.get('/reqlist',async (req,res)=>{
    try {
        const dbresult= await users.find({_id:req.user.id},{_id:0,request:1})
        const dbresult2=await users.find({username:dbresult[0].request},{_id:0,username:1,email:1,picture:1})
        //console.log(dbresult)
        res.status(200).json({msg:dbresult2})
    } catch (error) {
        res.status(401).json({msg:"error"})
    }
})

router.post('/accept',async (req,res)=>{
    //console.log(req.body)
    try {
        const dbresult=await users.updateMany({_id:req.user.id},{$addToSet:{friends:req.body.username}})
        const dbresult3= await users.updateOne({username:req.body.username},{$addToSet:{friends:req.user.username}})
        const dbresult2=await users.updateOne({_id:req.user.id},{$pull:{request:req.body.username}})
        res.status(200).json({msg:"accpeted success"})
    } catch (error) {
        res.status(401).json({msg:"err"})
    }
})

router.get('/friendslist',async (req,res)=>{
    try{
        const dbresult= await users.findById(req.user.id,{_id:0,friends:1,username:1,email:1,picture:1})
        const dbresult2= await users.find({username:dbresult.friends},{_id:0,username:1,picture:1,status:1})
        res.status(200).json({msg:{friends:dbresult2,user:{username:dbresult.username,email:dbresult.email,picture:dbresult.picture}}})
        // //console.log(dbresult2)
    }catch(error){
        res.status(401).json({msg:"err"})
    }
})

router.post('/unfollow',async (req,res)=>{
    //console.log(req.body)
    try{
        const dbresult=await users.updateOne({_id:req.user.id},{$pull:{friends:req.body.name}})
        const dbresult2=await users.updateOne({username:req.body.name},{$pull:{friends:req.user.username}})
        res.status(200).json({msg:"unfriend success"})
        //console.log(dbresult)
    }catch(err){
        //console.log(err)
        res.status(401).json({msg:"err"})
    }
    
})






module.exports= router