import mongoose, { Mongoose, model } from "mongoose";
import { Schema } from "mongoose";

const cardModel =new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'user',
        required: true
    },
    product:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required:true
    },
    createAt:{
        type:Date ,
        default:Date.now()
    }
})


export const  Cards = model('card' , cardModel);