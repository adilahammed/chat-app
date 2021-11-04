const express =require('express')
const mongoose=require("mongoose")
const dotenv=require('dotenv')
const http=require('http')
const {Server}=require("socket.io")
const helmet=require("helmet")
const morgan=require("morgan")
const cors=require("cors")


dotenv.config()
// router
const tokencheck=require('./middleware/tokencheck')
const userRoute=require('./routes/users')
const authRoute=require('./routes/register')
const uploads=require('./routes/uploads')
const chat =require("./routes/chat")

const app= express()
const server=http.createServer(app)
const io=new Server(server,{
    cors: {
        origin: "*",
        methods:["GET","POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
})


mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        console.log("mongoose connected");
    }).catch((err)=>{
        //console.log(err);
    })


io.on("connection",(socket)=>{
    //console.log("socket connected"+ socket.id)
    chat(socket)
    
})

//middlewares
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(express.static('public'))

// route middleware
app.use('/api/auth/',authRoute)
app.use('/api/no',tokencheck)
app.use('/api/no/users',userRoute)
app.use('/api/no/uploads',uploads)


server.listen(8800,()=>{
    console.log("port 8800 is running");
})


