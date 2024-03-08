import express from 'express'
import { addCard, getProductInCardOfUser } from '../controller/cardController.js'
import { isAuthenticate } from '../middleware/Authentication.js'

const router = express.Router()

router
 .post('/' ,isAuthenticate, addCard )
 .get('/' , isAuthenticate, getProductInCardOfUser )



export const cardRoute = router