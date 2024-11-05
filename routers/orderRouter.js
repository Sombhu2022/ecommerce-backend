import express from 'express'
import { isAdmin, isAuthenticate } from '../middleware/Authentication.js'
import { addOrderIntoCart, changeDeliveryStatus, fetchAllOrderForAdminSection, findAllOrderDetails, findOrderRecipt, getOrderDetails, paymentVerification } from '../controller/orderController.js'

const router =  express.Router()

router
 .get('/' , isAuthenticate , isAdmin , fetchAllOrderForAdminSection)
 .get('/orderDetails/:orderId', isAuthenticate , getOrderDetails )
 .get('/all' , isAuthenticate  , findAllOrderDetails)
 .post('/' , isAuthenticate , addOrderIntoCart)
//  .post('/status/:merchantTransactionId' , orderStatus)
 .post('/pay/:id', isAuthenticate ,  paymentVerification)
 .get('/recipt/:razorpay_payment_id' , isAuthenticate , findOrderRecipt)
 .post('/deliveryStatus/:orderId', isAuthenticate , isAdmin , changeDeliveryStatus )
 
export const orderRouter = router