import express from 'express'
import { addCard, getProductInCartOfUser, updateQuantity } from '../controller/cardController.js'
import { isAuthenticate } from '../middleware/Authentication.js'

const router = express.Router()

router
 .post('/' ,isAuthenticate, addCard )
 .get('/' , isAuthenticate, getProductInCartOfUser )
 .post('/update-quantity' , isAuthenticate , updateQuantity)



export const cardRoute = router