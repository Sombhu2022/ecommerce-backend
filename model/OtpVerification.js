import { Schema, model } from "mongoose";

const OtpVerificationSchema =new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    email:{
        type:String ,
        required:true ,
        maxLength: [60, "price can be under 5 digit"]
    } ,
    isEmailVerify:{
        type:Boolean,
        default:false
    },
    createAtOtp:{
        type:Date ,
        default:Date.now()
    },
    expireAtOtp:{
        
        type:Date ,
        default:Date.now()+ 15 * 60 *1000
    }

})

export const OtpVerification = model(OtpVerificationSchema , 'OtpVerification')
