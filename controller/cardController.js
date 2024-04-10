import { Products } from "../model/product.js";
import { Cards } from "../model/cardModel.js";

export const isProduct =( cart , productId)=>{
     return cart?.find((ele)=>{
        if (String(ele.product) === String(productId)) {
            return ele
        } else {
            return ""
        }     
    })
}



export const addCard = async(req , res)=>{

    try {
        const { id } = req.user
        const { price, productId } = req.body; 

        let totalAmmount ;
        let totalPrice;
        let quantityFull =null;
        console.log("add to cart section run");
        const card = await Cards.findOne({user:id})

        if(! card){
          
            const data =await Cards.create({user:id ,
                 cart:{product:productId , productQuantity:1 , totalPrice:price},
                 totalAmmount:price
                 }) 
           
            console.log(data);
        
        }else{
             
            if(!isProduct(card.cart , productId)){
              
                card.cart.push({
                    product:productId,
                    productQuantity:1,
                    totalPrice: price
                })
                totalAmmount =card.totalAmmount + Number(price)
                card.totalAmmount = totalAmmount.toFixed(2)
             

            }else{
                
                const cart = isProduct(card.cart , productId)
                const data = await Products.findById({_id:cart.product})
           
                console.log( data);

                if( Number(data.stock) > Number(cart.productQuantity) && Number(cart.productQuantity) < 5 ){
                    console.log("ok");
                
                    cart.productQuantity += 1
                    quantityFull = cart.productQuantity

                    totalPrice = cart.totalPrice + Number(price)
                    cart.totalPrice = totalPrice.toFixed(2)
                    totalAmmount = card.totalAmmount + Number(price)
                   card.totalAmmount = totalAmmount.toFixed(2)
            }else{
                quantityFull= " Quantity  stack full or not available aenough stock"
            }

            await card.save({ validateBeforeSave: false })
        }
    }
        
         const data =await Cards.find({user:id})
         .populate("cart.product")
         .populate({
            path: "cart",
            populate:{
                 path:"product",
                 module:"product"
            }
        })
    
       
        res.status(200).json({
            message:" product add in card",
            product:data,
            quantity:quantityFull
        })
    
    } catch (error) {
        console.log(error);
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