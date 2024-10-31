import express from 'express'
import { isAuthenticate } from '../middleware/Authentication.js'
import { addOrderIntoCart, findOrderRecipt, paymentVerification } from '../controller/orderController.js'

const router =  express.Router()

router
 .post('/' , isAuthenticate , addOrderIntoCart)
//  .post('/status/:merchantTransactionId' , orderStatus)
 .post('/pay/:id', isAuthenticate ,  paymentVerification)
 .get('/recipt/:razorpay_payment_id' , isAuthenticate , findOrderRecipt)
 
export const orderRouter = router