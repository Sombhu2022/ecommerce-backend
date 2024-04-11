

import { Schema, model } from "mongoose";

const orderSchema =new Schema({
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
    phoneNo:{
        type:Number,
        maxLength:10
    },
    address:{
        city:{
            type:String
        },
        state:{
            type:String
        },
        pinCode:{
           type:String
        },
        location:{
            type:String
        }
    },
    product:[
        { 
           type:mongoose.Schema.Types.ObjectId,
           ref:'product',   
        }
    ],
    totalAmmount:{
        type:Number,
        default:0
    },
    delivaryCharge:{
        type:Number,
        default:0
    } ,
    paymentType:{
        type:String,
        default:"online"
    },
    
})

export const Orders = model('order' , orderSchema);
