import { Products } from "../model/product.js";
import { v2 as cloudinary } from 'cloudinary';

export const getAllProduct = async (req, res) => {
    try {
        const product = await Products.find({});
        return res.status(200).json({
            message: "All products are here",
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Products not found, something went wrong",
            success: false,
            error
        });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findById({ _id: id })
            .populate('review.user')
            .populate({
                path: "review",
                populate: {
                    path: "user",
                    model: "user"
                }
            });

        return res.status(200).json({
            message: "Product is here",
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product not found, something went wrong",
            success: false,
            error
        });
    }
};

export const addProduct = async (req, res) => {
    const { name, descreption, price, discount, stock, brand, category, images, review } = req.body;
    console.log(req.body);

    try {
        const images = typeof req.body.images === "string" ? [req.body.images] : [...req.body.images];
        const tempImageStore = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: "ecommerce"
            });
            tempImageStore.push({
                image_id: result.public_id,
                url: result.secure_url
            });
        }

        req.body.images = tempImageStore;
        const product = await Products.create(req.body);
        return res.status(200).json({
            message: "New Product added",
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product not added",
            success: false,
            error
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    try {
        await Products.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        const product = await Products.find({});
        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product not updated, something went wrong",
            success: false,
            error
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Products.findByIdAndDelete({ _id: id });
        const data = await Products.find({});
        return res.status(200).json({
            message: "Product deleted",
            success: true,
            product: data
        });
    } catch (error) {
        return res.status(400).json({
            message: "Product not deleted, something went wrong",
            success: false,
            error
        });
    }
};

export const searchProductByName = async (req, res) => {
    const { name } = req.params;

    try {
        const product = await Products.find({
            name: { $regex: name, $options: "i" }
        });

        if (product.length > 0) {
            return res.status(200).json({
                message: "Product(s) found",
                success: true,
                product
            });
        } else {
            return res.status(404).json({
                message: "No product found with the given name",
                success: false
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error
        });
    }
};

export const searchProductByCategory = async (req, res) => {
    let { category } = req.params;
    console.log(req.params);
    category = category.toLowerCase();

    try {
        const product = category === 'all category'
            ? await Products.find({})
            : await Products.find({ category });

        return res.status(200).json({
            message: "Product searching by category",
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error
        });
    }
};

const reviewPresent = (product, userid) => {
    return product.review?.find((ele) => String(ele.user) === String(userid));
};

export const postReview = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { reting, feedback } = req.body;

        const product = await Products.findById({ _id: id });

        const review = reviewPresent(product, user._id);
        if (review) {
            if (reting) review.rating = reting;
            if (feedback) review.feedback = feedback;
        } else {
            product.review.push({
                user: user._id,
                rating: reting,
                feedback: feedback
            });
        }

        product.totalReview = product.review.length;
        product.totalRating = product.review.reduce((acc, ele) => acc + ele.rating, 0) / product.totalReview;

        await product.save({ validateBeforeSave: false });

        const data = await Products.find({})
            .populate('review.user')
            .populate({
                path: "review",
                populate: {
                    path: "user",
                    model: "user"
                }
            });

        return res.status(200).json({
            message: "Review added",
            product: data
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Review not added",
            error
        });
    }
};
