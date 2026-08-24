const mongoose =require('mongoose')
const { Schema }=mongoose ;  //desturing

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    favorites: {
        type: Array,
        default: []
    },
    date:{
        type:Date,
        default:Date.now
    }

    
});

module.exports=mongoose.model('user',UserSchema)