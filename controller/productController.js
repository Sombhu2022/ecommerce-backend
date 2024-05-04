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
        const product = await Products.findById({ _id: id })
            .populate('review.user')
            .populate(
                {
                    path: "review",
                    populate: {
                        path: "user",
                        model: "user"
                    }
                }
            )

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
    const { name, descreption, price, discount, stock, brand, category, images, review } = req.body
    console.log(req.body);
    try {
        const images = []
        console.log(typeof req.body.images, req.body.images.length);
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else {
            console.log("ok");
            req.body.images.forEach(element => {
                images.push(element)
            });
            //    images = req.body.images
            console.log(images.length);
        }

        const tempImageStore = []

        for (let i = 0; i < images.length; i++) {

            const result = await cloudinary.uploader.upload(images[i], {
                folder: "ecommerce"
            })

            tempImageStore.push({
                image_id: result.public_id,
                url: result.secure_url
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
    const { id } = req.params
    console.log(req.body);
    try {
        const product = await Products.findByIdAndUpdate(id, req.body, { new: true })
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
    const { id } = req.params
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
    const { name } = req.params;
    console.log(req.body);
    try {
        const product = await Products.find({ name: name })
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
    const { category } = req.params;
    console.log(req.body);
    try {
        const product = await Products.find({ category: category })
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



const reviewPresent = (product, userid) => {
    return product.review?.find((ele) => {
        if (String(ele.user) === String(userid)) {
            return ele
        } else {
            return ""
        }
    })
}


export const postReview = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { reting, feedback } = req.body

        const product = await Products.findById({ _id: id })

        if (reviewPresent(product, user._id)) {

            const review = reviewPresent(product, user._id)

            if (reting)  review.rating = reting
            if (feedback) review.feedback = feedback
            
        } else {
            product.review.push(
                {
                    user: user._id,
                    rating: reting,
                    feedback: feedback
                }
            )
            
        }
    
        const totalReview = product.review.length
        product.totalReview = totalReview
        
        let totalRating =0;
        product.review.map((ele)=>{
            totalRating += ele.rating
        })
        product.totalRating = totalRating / totalReview
        
        // save finding product with out schema varification 
        await product.save({ validateBeforeSave: false })

        // this call populate maping ...  
        const data = await Products.find({})
            .populate('review.user')
            .populate(
                {
                    path: "review",
                    populate: {
                        path: "user",
                        model: "user"
                    }
                }
            )

        // console.log(data);
        res.status(200).json({
            message: "review add",
            product: data
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "review not add",
            error
        })

    }
}

