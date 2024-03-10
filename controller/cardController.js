import { Cards } from "../model/cardModel.js";

export const addCard = async(req , res)=>{
    try {
        const { userId , productId} = req.body;
        const data = await Cards.create( req.body)

        const product = await data.populate('product')
        res.status(200).json({
            message:" product add in card",
            product
        })
        
    } catch (error) {
        res.status(400).json({
            message:"product not add",
            error
        })
    }
}

export const getProductInCardOfUser = async(req, res)=>{
     
    try {
        const { userId } = req.body
        const product = await Cards.find({userId}).populate('product').exec()
        console.log(product);
        
        // const data = await product.populate('product').exec()

        res.status(200).json({
            product
                    })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"product not find",
            error
        })
    }

}