import { Cards } from "../model/cardModel.js";

export const isMatch =( exProduct , product)=>{
     return exProduct?.some((ele)=>{
        console.log( String(ele.product ) , product);
     return String(ele.product) === product })
}

export const addCard = async(req , res)=>{
    
    try {
        let quantityFull = null ;
        const { id } = req.user
        const { productQuantity , product } = req.body; 
        const exProduct =await Cards.find({user:id})
        if( ! isMatch( exProduct , product)){
            console.log("product not exist");
            await Cards.create({user:id , product , productQuantity}) 
        }else{
           let productData = await Cards.findOne({product:product}).populate("product")
           console.log(productData);
           if( Number(productData.product.stock) > Number(productData.productQuantity) && Number(productData.productQuantity) < 5 ){
              console.log("ok");
              const productQuantity =  Number(productData.productQuantity) + 1 ;
              quantityFull = productQuantity
              await Cards.findByIdAndUpdate({_id: productData._id} , { productQuantity} , {new:true} ) 
           }else{
            quantityFull= " Quantity  stack full or not available aenough stock" }
        }
        const data =await Cards.find({user:id}).populate("product")
        // console.log("ok populate" , data);
        res.status(200).json({
            message:" product add in card",
            product:data,
            quantity:quantityFull
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
        const { id } = req.user
        const product = await Cards.find({user:id}).populate('product').exec()
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