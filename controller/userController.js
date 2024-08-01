import { Users } from "../model/userModel.js";
import bcrypt from 'bcrypt'
import { sendCookic } from "../utils/sendCookic.js";
import { sendEmail } from "../utils/sendMail.js";
import { v2 as cloudinary } from 'cloudinary';
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import { timeExpire } from "../utils/timeExpire.js";



export const createUser = async (req, res) => {

    try {
        const { name, password, email, dp } = req.body

        let user = await Users.findOne({ email })
        console.log("user=>",user);
        if (user){
            console.log("user exist");
         return res.status(400).json({ message: "email alrady exist" })
        }

       
        const profilePic = await cloudinary.uploader.upload(dp , {
            folder:"ecomUser"
        })
        const image = {
            url:profilePic.secure_url,
            image_id:profilePic.public_id,
        }
        user = await Users.create({ name, email, password , dp:image })
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
        //   .cookie("token", "" , {
        //       expires: new Date(Date.now()),
        //       httpOnly: true,
        //   })
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

export const forgotPassword = async(req , res)=>{
    const {email} = req.body
    console.log(req.body);
    try {
        let user = await Users.findOne({email})
        console.log(user);
        if(!user) return res.status(400).json({
            success:false,
            message:'user not found'
        });
        const otp = genarate6DigitOtp()
        console.log(otp);
        sendEmail(email , 'OTP for forgot password' , `this is your Otp ${otp} , not shear anywhere`)
     
        user.otp = otp ;
        user.expireAt = Date.now() + 5 * 60 * 1000 ; 
        await user.save({ validateBeforeSave : false})

        res.status(200).json({
            user ,
            message:'otp send successfully'
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            
            message:"somthing error"
        })
    }
}

export const changePassWithOtp = async(req , res)=>{
    try {
        const { otp , password } = req.body 

        console.log(req.body , typeof(otp));
        const user = await Users.findOne({otp}).select('+password')
        // console.log(user);
        const isOtpExpire = timeExpire(user.expireAt);
        if(isOtpExpire) {
            user.otp = null;
            user.expireAt = null;
            await user.save({ validateBeforeSave: false})
            return res.status(400).json({
                message:"otp is expired"
            })
        }


        console.log(user);
        if(!user) return res.status(400).json({
            message:'otp not corrct'
        });

        user.password = password;
        user.otp= null
        await user.save({ validateBeforeSave: false})
        
        res.status(200).json({
            user,
            message:'password changed'
        })
    } catch (error) {
        res.status(400).json({
            message:"error"
        })
    }
} 

export const ChangePasswordWithOldPassword = async(req , res)=>{
     
    const {id} = req.user
    const { oldPassword , newPassword } = req.body
    console.log("log password" , oldPassword);
    try {
        const user = await Users.findById(id).select("+password")
        const isMatch =await user.comparePassword(oldPassword)
       
        if(!isMatch) return res.status(400).json({
            message:" password not match"
        })

        user.password = newPassword;
        await user.save({validateBeforeSave: false})
        
        // res.status(200).json({ success:true , message:"password change successfully", user })
        sendCookic(user, res, " password chang successfully", 200)

    } catch (error) {
        console.log(error);
        res.status(400).json({ success:false , message:"password not change", error })
        
    }

}