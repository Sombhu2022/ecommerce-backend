// import NodeGeocoder from 'node-geocoder'
import { Cards } from '../model/cardModel.js';
import { Orders } from '../model/orderModel.js';
import { Products } from '../model/product.js';

import crypto from 'crypto'

import axios from 'axios'
import uniqid from 'uniqid'
import sha265 from 'sha256'
import { request } from 'http';

import Razorpay from 'razorpay'


export const addOrderIntoCart = async (req, res) => {
  try {
    const { id , name } = req.user
    console.log(id);
    const { email, phone, city, state, district, pincode, cuntry, paymentType, totalAmmount, deliveryCharge, products } = req.body
     console.log(req.body);
    const product = await Cards.findById({ _id: products }).populate("cart.product")
      .populate({
        path: "cart",
        populate: {
          path: "product",
          module: "product"
        }
      })
    //  console.log(product);
    let productArray = []
    if(! product) res.status(400).json({success:false , message:'first select product' })
    product?.cart?.forEach(element => {
      // console.log(element);
      productArray.push({
        product: element.product._id,
        productName: element.product.name,
        productQuantity: element.productQuantity,
        totalPrice: element.totalPrice
      })
    })
    // console.log(productArray);

    const data = await Orders.create({ user: id, email, phone, products: productArray, totalAmmount, deliveryCharge:Number(deliveryCharge) , paymentType , address:{ city, state, district, pincode, cuntry } })
   
    await Cards.findByIdAndDelete({_id:products }).then((result)=>{
        console.log(result);
    }).catch((err)=>{ console.log(err); })
      
    if (paymentType === 'online') {
      
    // console.log(process.env.RAZORPAY_ID);

     const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_KEY,
    });

    const options = {
      amount: Number(totalAmmount * 100),
      currency: "INR",
    };

    try {
      
      const order = await instance.orders.create(options);
    
    return  res.status(200).json({
        success: true,
        order,
        key:process.env.RAZORPAY_ID,
        data
      });
    } catch (error) {
      console.log("this error",error);
    return  res.status(400).json({
        success: false,
        error,
      });

    }

    }else if(paymentType === 'offline'){
      console.log("offline payment");

      try {
        const product = await Products.findById({_id:ele.product})
        console.log(product , ele);
        if(product){

          product.stock -= ele.productQuantity
          await product.save({ validateBeforeSave:false })
        }
        
      } catch (error) {
        console.log(error);
      }

      console.log(data);
     return res.status(200).json({
      success: true,
      data,
      payment:"pending"
    });

   console.log("all ok");
    }

  } catch (error) {
    console.log(error);
   return res.status(400).json({
      error,
      message: "order not push"
    })
  }


}


export const paymentVerification = async (req, res) => {
  try {
    
    console.log("payment varifiy");
    const { id } = req.params
    console.log(id);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  console.log("payment Verification page " , req.body);
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY)
      .update(body.toString())
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
      // Database comes here
  
     const data = await Orders.findById({_id:id})
     
     if(data){
      data.razorpay_order_id = razorpay_order_id
      data.razorpay_payment_id = razorpay_payment_id
      data.razorpay_signature = razorpay_signature
      data.paymentStatus ='success'
      await data.save({ validateBeforeSave: false })

      data.products?.map(async(ele)=>{
        try {
          const product = await Products.findById({_id:ele.product})
          console.log(product , ele);
          if(product){

            product.stock -= ele.productQuantity
            await product.save({ validateBeforeSave:false })
          }
          
        } catch (error) {
          console.log(error);
        }
      })
      
     }
     console.log(data);
    //  const product = await Products.findById({}) 

    // delete cart ..
    // subtruct ordered product ..
      return res.redirect(
        `${process.env.FRONTEND_URL}/success/${razorpay_payment_id}`
      );
    } else {
     return res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:"something error , please try again",
      error
    })
  }

};


export const findOrderRecipt = async(req , res)=>{

    const {razorpay_payment_id} = req.params

    try {
      
      if(razorpay_payment_id){
         
          const data = await Orders.findOne({razorpay_payment_id})

          return res.status(200).json({
            message:"payment recipt ",
            data ,
            success:true
          })
      }
      return res.status(200).json({
        message:"order details not found "
      })

    } catch (error) {
      console.error(error)
      return res.status(400).json({
        message:"something error !"
      })
    }
}


export const findAllOrderDetails = async(req,res)=>{
  try {
    const { id } = req.user
    const order = await Orders.find({user:id})
    return res.status(200).json({
      message:"all orders are fetched ",
      data:order,
      success:true
    })
  } catch (error) {
    return res.status(400).json({
      message:"something error ! please try again",
      error
    })
  }
}


export const changeDeliveryStatus = async(req, res)=>{
  try {
    const {orderId} = req.params
    const {deliveryStatus } = req.body

    const order = await Orders.findById({_id:orderId})

    order.deliveryStatus = deliveryStatus

    await order.save()

    return res.status(200).json({
      message:"delivery status update success",
      data:order,
      success:true
    })
    
  } catch (error) {
    return res.status(400).json({
      message:"something error , please try again",
      error,
      success:false
    })
  }
}


export const fetchAllOrderForAdminSection = async(req , res)=>{

  try {
    const order =  await Orders.find({})

    return res.status(200).json({
      message:"all order fetched",
      data:order,
      success:true
    })
  } catch (error) {
    
    console.error(error)
    return res.status(400).json({
      message:"something error , please try again !",
      error
    })

  }

}


export const getOrderDetails = async(req , res)=>{
  try {
    const {orderId} = req.params

    const order = await Orders.findById(orderId)

    return res.status(200).json({
      message:"fetched order !",
      data:order,
      success:true
    })
    
  } catch (error) {
    return res.status(400).json({
      message:"something error , please try again !",
      success:false , 
      error
    })
  }
}