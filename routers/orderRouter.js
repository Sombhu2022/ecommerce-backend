import express from 'express'
import { isAuthenticate } from '../middleware/Authentication.js'
import { addOrderIntoCart } from '../controller/orderController.js'

const router =  express.Router()

router
 .post('/' , isAuthenticate , addOrderIntoCart)

export const orderRouter = router