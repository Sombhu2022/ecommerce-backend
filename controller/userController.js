import { Users } from "../model/userModel.js";
import bcrypt from 'bcrypt'
import { sendCookic } from "../utils/sendCookic.js";
import { sendEmail } from "../utils/sendMail.js";
import { v2 as cloudinary } from 'cloudinary';



export const createUser = async (req, res) => {

    try {
        const { name, password, email, dp } = req.body

        let user = await Users.findOne({ email })
        console.log("user=>",user);
        if (user){
            console.log("user exist");
         return res.status(400).json({ message: "email alrady exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const profilePic = await cloudinary.uploader.upload(dp , {
            folder:"ecomUser"
        })
        const image = {
            url:profilePic.secure_url,
            image_id:profilePic.public_id,
        }
        user = await Users.create({ name, email, password: hashPassword , dp:image })
        sendCookic(user, res, "user created", 200)
        sendEmail(user.email, `wellcome ${user.name}`, "wellcome to our sabji bazar , harry up! showping now for your famaily health")

    } catch (error) {
        res.status(400).json({
            message: "user not create",
            success: false,
            error
        })

    }
}

export const getUser = async (req, res) => {
    try {
      const { id } = req.user;
      const user = await Users.findById({ _id: id });
      res.status(200).json({
        message: "user fetched",
        user,
      });
    } catch (error) {
      res.status(400).json({
        message: "somthing error",
        error,
      });
    }
  };

export const logInUser = async(req , res)=>{
   
    try {
        const {email , password} = req.body;
        const user = await Users.findOne({
            email
        })
        .select('+password')

        if(!user) return res.status(400).json({
            message:"email or password not match"
        })
        console.log(user);
        console.log(password);
        const isMatch =await bcrypt.compare(password , user.password)
        console.log(isMatch);

        if(!isMatch) return res.status(400).json({
            message:"email or password not match"
        })
        sendCookic(user , res , " login successfull" , 200)

    } catch (error) {
        res.status(400).json({
            message:"somthing error",
            error
        })
    }
}

export const logOutUser = (req, res) => {
  try {
      res
          .status(200)
          .cookie("token", "" , {
              expires: new Date(Date.now()),
              httpOnly: true,
          })
          .json({
              success: true,
              message: "Logout successfull",
          });

  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
}

export const deleteUser = async(req,res)=>{
    try {
        const {id} = req.params
        await Users.findByIdAndDelete({id})

        res
          .status(200)
          .cookie("token", "" , {
              expires: new Date(Date.now()),
              httpOnly: true,
          })
          .json({
              success: true,
              message: "user deleted",
          });
        
    } catch (error) {
        res.status(400).json({
            message:'user not delete',
            success:false,
            error
        })
    }
}

export const updateUser = async(req,res)=>{
    try {
        const {id} = req.params
        const user = Users.findByIdAndUpdate({id} , req.body , {new:true})
        res.status(200).json({
            message:"update user",
            success:true,
            user
        })
    } catch (error) {
        res.status(400).json({
            message:'user not update',
            success:false,
            error
        })
        
    }
}