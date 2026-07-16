const express=require('express')
const router=express.Router()
const User=require('../models/User')
const { body, validationResult } = require('express-validator');

router.post("/createuser",[
    body('email').isEmail(),
    body('name').isLength
    ({min:5}),
    body('password','Incorrect password').isLength({min:5})],
    async(req,res)=>{

        const errors=validationResult(req);
        if(!errord.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
    try{
        await User.create({
            name:req.body.name,
            location:req.body.location,
            email:req.body.email,
            password:req.body.password,
            
        })
        res.json({success:true});
    } catch(error){
        console.log(error)
        res.json({success:false});
    }
})

router.post("/loginuser",async(req,res)=>{
    let email=req.body.email;
    try{
       let userData= await User.findOne({email});
       if(!userData) 
        return res.status(400).json({errors:"Incorrect credentials"})
    
       if(!req.body.password===userData.password){
        return res.stauts(400).json({errors:"Incorrect credentials"})
       }
         
      return res.json({success:true})
      } catch(error){
        console.log(error)
        res.json({success:false});
    }
})



module.exports=router;