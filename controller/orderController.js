import NodeGeocoder from 'node-geocoder'
import { Cards } from '../model/cardModel.js';
import { Orders } from '../model/OrderModel.js';
import axios from 'axios'
import uniqid from 'uniqid'
import sha265 from 'sha256'
import crypto from 'crypto'
import { request } from 'http';

import Razorpay from 'razorpay'
import { Products } from '../model/product.js';

export const addOrderIntoCart = async (req, res) => {
  try {
    const { id , name } = req.user
    console.log(id);
    const { email, phone, city, state, district, pincode, cuntry, paymentType, totalAmmount, delivaryFees, products } = req.body
    //  console.log(req.body);
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

    const data = await Orders.create({ user: id, email, phone, products: productArray, totalAmmount, delivaryCharge: delivaryFees, paymentType })

    if (paymentType === 'online') {
      
    console.log(process.env.RAZORPAY_ID);

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
    
      res.status(200).json({
        success: true,
        order,
        key:process.env.RAZORPAY_ID,
        data
      });
    } catch (error) {
      console.log("this error",error);
      res.status(400).json({
        success: false,
        error,
      });

    }

    }else if(paymentType === 'offline'){
       res.status(200).json({
      success: true,
      data: data,
      payment:"pending"
    })
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({
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
      await data.save({ validateBeforeSave: false })
     }
     console.log(data);
    //  const product = await Products.findById({}) 

    // delete cart ..
    // subtruct ordered product ..
      res.redirect(
        `${process.env.FRONTEND_URL}/success/${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }

};


