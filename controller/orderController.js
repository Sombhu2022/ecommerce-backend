import NodeGeocoder from 'node-geocoder'
import request from 'request';
import { Cards } from '../model/cardModel.js';
import { Orders } from '../model/OrderModel.js';
import axios from 'axios'
import uniqid from 'uniqid'
import sha265 from 'sha256'

export const addOrderIntoCart = async (req, res) => {
  try {
    const { id } = req.user
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
      
      let merchantTransactionId = uniqid()
      console.log(merchantTransactionId);
      const payload ={
        "merchantId": `${process.env.MARCHENT_ID}`,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": 1234,
        "amount": 100,
        "redirectUrl": `https://localhost:${process.env.PORT}/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "callbackUrl": "https://webhook.site/callback-url",
        // "mobileNumber": "9999999999",
        "paymentInstrument": {
          "type": "PAY_PAGE"
        }
      }
      
     
     const base64 =  Buffer.from(JSON.stringify(payload)).toString("base64")
     const sha256 = sha265(base64 + `${process.env.PHONE_PAY_END_POINT}`+ process.env.SALT_KEY)
     const xVerify = sha256 + "###" + process.env.SALT_INDEX
     console.log("*****************************************\n",xVerify);
     //SHA256(Base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index

      const options = {
        method: 'post',
        url:`${process.env.PHONE_PAY_HOST_URL}${process.env.PHONE_PAY_END_POINT}`,
        headers: {
          'Content-Type': 'application/json',
          "X-VERIFY":xVerify
        },
        data: {
          request:base64
        }
      };

     await axios
        .request(options)
        .then(function (response) {
          console.log("data=>",response.data);
          res.status(200).json({
            success: true,
            data: data,
            payment: response.data
          })
        })
        .catch(function (error) {
          console.error(error);
          res.status(400).json({
           message:"payment not ",
           error
          })
        });
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