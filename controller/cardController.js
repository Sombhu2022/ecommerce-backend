import { Products } from "../model/product.js";
import { Cards } from "../model/cardModel.js";

export const isProduct =( cart , productId)=>{
    // console.log("..............",cart , "product id", productId);
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
        // console.log("add to cart section run");
        const card = await Cards.findOne({user:id}) 

        if(! card){
          
            const data =await Cards.create({user:id ,
                 cart:{product:productId , productQuantity:1 , totalPrice:price},
                 totalAmmount:price
                 }) 
           
            // console.log(data);
        
        }else{
             
            if(!isProduct(card.cart , productId)){
            //    console.log("ok");
                card.cart.push({
                    product:productId,
                    productQuantity:1,
                    totalPrice: price
                })
                totalAmmount = card.totalAmmount + Number(price)
                card.totalAmmount = totalAmmount.toFixed(2)

                // console.log("all ok");

            }else{
                
                const cart = isProduct(card.cart , productId)
                const data = await Products.findById({_id:cart.product})
           
                // console.log( data);

                if( Number(data.stock) > Number(cart.productQuantity) && Number(cart.productQuantity) < 5 ){
                    // console.log("ok");
                
                    cart.productQuantity += 1
                    quantityFull = cart.productQuantity

                    totalPrice = cart.totalPrice + Number(price)
                    cart.totalPrice = totalPrice.toFixed(2)
                    totalAmmount = card.totalAmmount + Number(price)
                   card.totalAmmount = totalAmmount.toFixed(2)
            }else{
                quantityFull= " Quantity  stack full or not available aenough stock"
            }

        }

        await card.save({ validateBeforeSave: false })
        console.log("last check");
    }
        
         const data =await Cards.findOne({user:id})
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


export const getProductInCartOfUser = async(req, res)=>{
     
    try {
        const { id } = req.user
        const data =await Cards.findOne({user:id})
        .populate("cart.product")
        .populate({
           path: "cart",
           populate:{
                path:"product",
                module:"product"
           }
       })

       
        res.status(200).json({
            product:data,
            message:" all product in your cart"
            })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"product not find",
            error
        })
    }

}

 const isProductInCart =( cart , productId)=>{
    // console.log("..............",cart , "product id", productId);
     return cart?.find((ele)=>{
        if (String(ele.product._id) === String(productId)) {
            return ele
        } else {
            return ""
        }     
    })
}

export const updateQuantity = async(req , res)=>{
    try {
         const { cartId , type , price } = req.body;
         let totalAmmount;
         let totalPrice;
         let quantityFull = null
         console.log(cartId , type , price);
         const { id } = req.user
         const product = await Cards.findOne({user:id})
         .populate("cart.product")
         .populate({
            path: "cart",
            populate:{
                 path:"product",
                 module:"product"
            }
        })
         const cart = isProductInCart(product.cart , cartId)
         console.log(cart);
         if(type === '+'){
            if(cart.productQuantity > Number(cart.product.stock) || cart.productQuantity >= 5 ){
                quantityFull= " Quantity  stack full or not available aenough stock"                 
            }else{
                cart.productQuantity +=1
   
                totalPrice = cart.totalPrice + cart.product.actualPrice
                cart.totalPrice = totalPrice.toFixed(2)
                totalAmmount = product.totalAmmount + cart.product.actualPrice
                product.totalAmmount = totalAmmount.toFixed(2)

            }
         }else{
            cart.productQuantity -=1
            
            totalPrice = cart.totalPrice - cart.product.actualPrice
            cart.totalPrice = totalPrice.toFixed(2)
            totalAmmount = product.totalAmmount - cart.product.actualPrice
            product.totalAmmount = totalAmmount.toFixed(2)
         }

         if(cart.productQuantity <= 0){
            product.cart = product.cart.filter((ele)=> ele != cart )
         }


         await product.save({ validateBeforeSave: false })

         const data =await Cards.findOne({user:id})
         .populate("cart.product")
         .populate({
            path: "cart",
            populate:{
                 path:"product",
                 module:"product"
            }
        })
 
        
         res.status(200).json({
             product:data,
             message:" all product in your cart",
             quantityFull:quantityFull
             })
            } catch (error) {
                
                res.status(400).json({
                   error,
                    message:" somthing error"
            })
    }
}