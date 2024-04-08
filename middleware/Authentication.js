import { Users } from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const isAuthenticate = async (req, res , next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "login first",
            });
        } else {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decode._id, "-password");
            console.log("not error");
            next();
        }

    } catch (error) {
        res.status(400).json({
            message: "user not authenticate",
            error
        });
    }
}

export const isAdmin =(req , res , next)=>{

        const {roal} = req.user
        console.log(roal);
        if(roal === 'admin'){
            console.log("admin ok");
            next();
        }
        else{
            console.log("admin not");
            res.status(400).json({
                message:"only admin can be chenge this section",
            })
        }
     
}