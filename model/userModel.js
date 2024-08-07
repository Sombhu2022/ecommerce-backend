import mongoose from 'mongoose'

import bcrypt from 'bcrypt'

const userModel = new mongoose.Schema({
    name:{
        type:String,
        maxLength:60,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        maxLength:200
    },
    dp:  {
        url: {
            type: String,

        },
        image_id: {
            type: String,
        },

    },
    roal:{
        type:String,
        default:"user"
    },
    password:{
        type:String,
        minLength:[8 , "password must be 8 charecter or above"],
        required:true,
        select:false
    },
    otp:{
        type:Number
    },
    expireAt:{
        type:Date , 
        // default: () => Date.now() + 5 * 60 * 1000 
    },
    createAt:{
        type:Date ,
        default:Date.now()
    }

})





// Pre-save hook use to hash password ... change password to hashpassword
userModel.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
  
    try {
        this.password = await bcrypt.hash(this.password, 10);
  
    } catch (error) {
        next(error)
    }
  });
  
  userModel.methods.comparePassword= async function(password){
    console.log("this pass from model",password );
     return await bcrypt.compare(password , this.password)
  }
  


export const Users = mongoose.model('user',userModel);