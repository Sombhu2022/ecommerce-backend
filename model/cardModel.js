import mongoose, { Mongoose, model } from "mongoose";
import { Schema } from "mongoose";

const cardModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    cart:[

        {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        } ,
        
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
       type:Number
    },
    
    createAt: {
        type: Date,
        default: Date.now()
    }
})


export const Cards = model('card', cardModel);