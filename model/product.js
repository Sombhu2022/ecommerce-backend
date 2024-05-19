import mongoose, { Schema, model } from 'mongoose'
import express from 'express'


const productModel = new Schema({
    name: {
        type: String,
        maxLength: 60,
        required: true,
    },
    description: {
        type: String,
        maxLength: [2000 , "description must be under the 2000 charecter"],
    },
    
    price: {
        type: Number,
        required: true,
        maxLength: [5, "price can be under 5 digit"]

    },
    discount: {
        type: Number,
    },
    actualPrice:{
        type:Number
    },
    stock: {
        type:Number,
        required: true
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    images: [
        {
            url: {
                type: String,

            },
            image_id: {
                type: String,
            },

        },
    ],
    review: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true,
                
            },
            rating:{
                type : Number ,
                

            },
            feedback:{
                type:String
            }
        }
    ],
    totalReview:{
        type:Number
    },
    totalRating:{
        type:Number
    },
    
    // createAt:{
    //     type:Date,
    //     default:Date.now()
    // }

},
{ strictPopulate: false , timestamps:true }
)


export const Products = model("product", productModel)