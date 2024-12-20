
import mongoose from "mongoose";
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
    phone:{
        type:Number,
        maxLength:10
    },
    address:{
        coordinates:[
            {
                type:Number
            }
        ],
        pincode:{
           type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        district:{
            type:String
        },
        cuntry:{
            type:String
        }
    },
    products:[
        {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        } ,
        productName:{
             type:String
        },
        productQuantity: {
                type: Number,
                default: 0
        },
        totalPrice:{
            type:Number,
            default:0
        }

    }
    ],
    totalAmmount:{
        type:Number,
        default:0
    },
    deliveryCharge:{
        type:Number,
        default:0
    } ,
    paymentType:{
        type:String,
        default:"online"
    },
    paymentStatus:{
        type:String,
        enum:['panding' , 'success' , 'rejected'],
        default:'panding'
    },
    deliveryStatus:{
         type:String,
         default:"pending"
    },
    razorpay_order_id: {
        type: String,
        // required: true,
      },
      razorpay_payment_id: {
        type: String,
        // required: true,
      },
      razorpay_signature: {
        type: String,
        // required: true,
      },
} , {timestamps:true})

export const Orders = model('order' , orderSchema);
