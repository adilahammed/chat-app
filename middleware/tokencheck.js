const jwt=require('jsonwebtoken')
privatekey=process.env.api_key


const tokencheck=async (req,res,next)=>{
    // let token="" 
    token=req.headers.authorization
    token=token.slice(7)
    //console.log("token check");
    try{
        let decoded=await jwt.verify(token,privatekey)
        //console.log("verification succes++");
        // //console.log(decoded);

        req.user=decoded
        next()
    
    }
    catch(err){
        //console.log(err);
        res.status(401).json({status:"tokenerr",message:"token varification failed"})
        res.end()
    }
}


module.exports=tokencheck