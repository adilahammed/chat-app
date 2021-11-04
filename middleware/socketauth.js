const jwt=require('jsonwebtoken')
privatekey=process.env.api_key
const socketauth=async(token,a)=>{
    try{
        const decode= await jwt.verify(token,privatekey)
        a(decode)
    }catch(err){
        //console.log(err)
    }
    //console.log("socketauth")
}

module.exports=socketauth
