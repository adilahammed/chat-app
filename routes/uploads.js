const express=require('express')
const multer=require('multer')
const users=require('../models/users')
const router=express.Router()



const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/')
    },
    filename:function(req,file,cb){
        if(file.mimetype==="image/jpeg"){
            cb(null,req.user.id+".jpg")
        }else if(file.mimetype==="image/png"){
            cb(null,req.user.id+".PNG")

        }
    }
})

const fileFilter=(req,file,cb)=>{
   //console.log(file);
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true)
    }
    else{
        //console.log("kkk");
        (null,false)
    }
}

const upload=multer({storage:storage,
    fileFilter:fileFilter
})

router.post('/picture',upload.single("picture"),async (req,res)=>{
    try{
        const dbresult=await users.updateOne({_id:req.user.id},{picture:req.file.filename})
        //console.log(dbresult)
        //console.log(req.file.filename)
        res.status(200).json({msg:"upload success"})
    }catch(err){
        //console.log(err)
        res.status(205).json({msg:"upload unsuccess"})

    }
})


module.exports=router