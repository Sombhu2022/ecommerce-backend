import express from 'express'
import { isAuthenticate } from '../middleware/Authentication.js'
import { addOrder } from '../controller/orderController.js'

const router =  express.Router()

router
 .post('/' , isAuthenticate , addOrder)

export const orderRouter = router