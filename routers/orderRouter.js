import express from 'express'
import { isAuthenticate } from '../middleware/Authentication.js'
import { addOrderIntoCart, paymentVerification } from '../controller/orderController.js'

const router =  express.Router()

router
 .post('/' , isAuthenticate , addOrderIntoCart)
//  .post('/status/:merchantTransactionId' , orderStatus)
 .post('/pay/:id' ,  paymentVerification)
 
export const orderRouter = router