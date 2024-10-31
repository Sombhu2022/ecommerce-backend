import { Users } from "../model/userModel.js";
import bcrypt from 'bcrypt';
import { sendCookic } from "../utils/sendCookic.js";
import { sendEmail } from "../utils/sendMail.js";
import { v2 as cloudinary } from 'cloudinary';
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import { timeExpire } from "../utils/timeExpire.js";

export const createUser = async (req, res) => {
    try {
        const { name, password, email, dp } = req.body;

        let user = await Users.findOne({ email });
        console.log("user=>", user);
        if (user) {
            console.log("user exists");
            return res.status(400).json({ message: "email already exists" });
        }

        const profilePic = await cloudinary.uploader.upload(dp, {
            folder: "ecomUser"
        });
        const image = {
            url: profilePic.secure_url,
            image_id: profilePic.public_id,
        };
        user = await Users.create({ name, email, password, dp: image });
        sendCookic(user, res, "user created", 200);
        sendEmail(user.email, `welcome ${user.name}`, "Welcome to our Sabji Bazar, hurry up! Shopping now for your family health");

    } catch (error) {
        return res.status(400).json({
            message: "user not created",
            success: false,
            error
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await Users.findById({ _id: id });
        return res.status(200).json({
            message: "user fetched",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: "something went wrong",
            error,
        });
    }
};

export const logInUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email }).select('+password');

        if (!user) return res.status(400).json({ message: "email or password do not match" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "email or password do not match" });

        sendCookic(user, res, "login successful", 200);

    } catch (error) {
        return res.status(400).json({
            message: "something went wrong",
            error
        });
    }
}

export const logOutUser = (req, res) => {
    try {
        return res
            .status(200)
            .json({
                success: true,
                message: "Logout successful",
            });

    } catch (error) {
        return res.json({
            success: false,
            message: error,
        });
    }
}

export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        await Users.findByIdAndDelete({ id });

        return res
            .status(200)
            .cookie("token", "", {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .json({
                success: true,
                message: "user deleted",
            });

    } catch (error) {
        return res.status(400).json({
            message: 'user not deleted',
            success: false,
            error
        });
    }
}

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByIdAndUpdate({ id }, req.body, { new: true });
        return res.status(200).json({
            message: "user updated",
            success: true,
            user
        });
    } catch (error) {
        return res.status(400).json({
            message: 'user not updated',
            success: false,
            error
        });
    }
}

export const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        let user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'user not found' });

        const otp = genarate6DigitOtp();
        sendEmail(email, 'OTP for password reset', `This is your OTP ${otp}. Do not share it with anyone.`);

        user.otp = otp;
        user.expireAt = Date.now() + 5 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            user,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        return res.status(400).json({ message: "something went wrong" });
    }
}

export const changePassWithOtp = async(req, res) => {
    try {
        const { otp, password } = req.body;
        const user = await Users.findOne({ otp }).select('+password');
        const isOtpExpired = timeExpire(user.expireAt);

        if (isOtpExpired) {
            user.otp = null;
            user.expireAt = null;
            await user.save({ validateBeforeSave: false });
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (!user) return res.status(400).json({ message: 'Incorrect OTP' });

        user.password = password;
        user.otp = null;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            user,
            message: 'Password changed successfully'
        });
    } catch (error) {
        return res.status(400).json({ message: "something went wrong" });
    }
}

export const ChangePasswordWithOldPassword = async(req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await Users.findById(id).select("+password");
        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) return res.status(400).json({ message: "Password does not match" });

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        sendCookic(user, res, "Password changed successfully", 200);

    } catch (error) {
        return res.status(400).json({ success: false, message: "Password change failed", error });
    }
}
