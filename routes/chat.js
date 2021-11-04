const socketauth =require('../middleware/socketauth')
const users =require("../models/users")
const chat=(socket)=>{
    socket.on("setstatus", (token)=>{
        socketauth(token, async (user)=>{
            //console.log(user)
            socket.join(user.username)
            try{

                const dbresult=await users.updateOne({_id:user.id},{status:socket.id})
                //console.log("========")
                const updatelist= await users.findById(user.id,{_id:0,friends:1})
                const updatelist2= await users.find({$and:[{username:updatelist.friends},{status:{$ne:"offline"}}]},{_id:0,status:1})
                // const status=updatelist2.map((a)=>{
                //     return a.status
                // })
                //console.log(updatelist.friends)
                if(updatelist.friends.length !==0){
                    //console.log("+++++")
                    socket.to(updatelist.friends).emit("update")
                }
            }catch(err){
                //console.log(err)
            }
        })
    })
    socket.on("disconnect",async()=>{
        //console.log("disconnected")
    })
    
    socket.on("setoffline",(token)=>{
        //console.log("setoffline")
        socketauth(token, async (user)=>{
            //console.log(user)
            try{
                const dbresult=await users.updateOne({_id:user.id},{status:"offline"})
                
            }catch(err){
                //console.log(err)
            }
        })
    })

    socket.on("send_message",(message)=>{
        //console.log(message)
        socket.to(message.to).emit("recieve_message",message)
    })
}

module.exports=chat