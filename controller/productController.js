import { Products } from "../model/product.js"
import { v2 as cloudinary } from 'cloudinary';

export const getAllProduct = async (req, res) => {
    try {
        const product = await Products.find({})
        res.status(200).json({
            message: "all products are here",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: "products not find , somthing wrong",
            success: false,
            error
        })
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await Products.findById({ id })
        res.status(200).json({
            message: "product are here",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: "product not find , somthing wrong",
            success: false,
            error
        })
    }
}

export const addProduct = async (req, res) => {
    // const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    console.log(req.body);
    try {
         const images =[]
         console.log(typeof req.body.images , req.body.images.length);
         if (typeof req.body.images === "string"){
             images.push(req.body.images)
         }
         else{
            console.log("ok");
            req.body.images.forEach(element => {
                images.push(element)
            });
        //    images = req.body.images
            console.log(images.length);
         }

        const tempImageStore =[]

         for(let i=0 ; i < images.length ; i++){

             const result = await cloudinary.uploader.upload(images[i] , {
                folder: "ecommerce"
             })
            
             tempImageStore.push({
                image_id:result.public_id,
                url:result.secure_url
             })
            //  console.log(images[i])
            console.log("working");
         }

        req.body.images = tempImageStore

        const product = await Products.create(req.body)
        res.status(200).json({
            message: "New Product added",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: "product not added",
            success: false,
            error
        })
    }
}

export const updateProduct = async (req, res) => {
    // const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    const {id } = req.params
    console.log(req.body);
    try {
        const product = await Products.findByIdAndUpdate(id , req.body , {new:true})
        res.status(200).json({
            message: "Product update successfully",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: "product not update , somthing error",
            success: false,
            error
        })
    }
}

export const deleteProduct = async (req, res) => {
    // const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    const {id } = req.params
    console.log(req.body);
    try {
        await Products.findByIdAndDelete(id)
        res.status(200).json({
            message: "Product deleted",
            success: true,
        })
    } catch (error) {
        res.status(400).json({
            message: "product not delet , somthing error",
            success: false,
            error
        })
    }
}

export const searchProductByName = async (req, res) => {
    // const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    const {name}=req.params;
    console.log(req.body);
    try {
        const product = await Products.find({name:name})
        res.status(200).json({
            message: "secrching product",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: " somthing error",
            success: false,
            error
        })
    }
}

export const searchProductByCategory = async (req, res) => {
    // const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    const {category } = req.params;
    console.log(req.body);
    try {
        const product = await Products.find({category:category})
        res.status(200).json({
            message: "product searching category",
            success: true,
            product
        })
    } catch (error) {
        res.status(400).json({
            message: "somthing error",
            success: false,
            error
        })
    }
}

