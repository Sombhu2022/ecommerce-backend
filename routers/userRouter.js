import express from 'express'
import { createUser, deleteUser, logInUser, logOutUser, updateUser , getUser, forgotPassword, changePassWithOtp } from '../controller/userController.js';
import { isAuthenticate } from '../middleware/Authentication.js';

const router = express.Router();

router
   .get('/' , isAuthenticate , getUser)
   .post('/sendOtp' , forgotPassword)
   .post('/forgotPass',changePassWithOtp )
   .post('/register' , createUser)
   .post('/login' , logInUser )
   .get('/logout' ,isAuthenticate, logOutUser)
   .patch('/:id',isAuthenticate , updateUser)
   .delete('/:id', isAuthenticate ,deleteUser)

export const userRouter = router;