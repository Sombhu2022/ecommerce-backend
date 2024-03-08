import mongoose from "mongoose";

export const dbConection=async()=>{
 
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("database connect")
    } catch (error) {
        console.log(error)
    }
}