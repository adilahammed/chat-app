const mongoose = require('mongoose')

const userschema= new mongoose.Schema({
    username:{type:String,min:3,max:20,unique:true,required:true},
    email:{type:String,max:50,unique:true,required:true},
    password:{type:String,min:6},
    picture:{type:String,default:"user.png"},
    description:{type:String},
    friends:{
        type:Array,
        default:[]
    },
    request:{
        type:Array,
        default:[]
    },
    status:{
        type:String,
        default:"offline"
    }
})

const users=mongoose.model('users',userschema)

module.exports=users