import mongoose, { Schema, model } from 'mongoose'
import express from 'express'


const productModel = new Schema({
    name: {
        type: String,
        maxLength: 60,
        required: true,
    },
    descreption: {
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

    stock: {
        type:String,
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

    ],
    createAt:{
        type:Date,
        default:Date.now()
    }

},
{ strictPopulate: false }
)


export const Products = model("product", productModel)