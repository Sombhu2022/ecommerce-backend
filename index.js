
import express from "express"
import "dotenv/config"
import { dbConection } from "./db/dbConection.js"
import bodyParser from "body-parser"
import fileUpload from 'express-fileupload';
import { productRouter } from "./routers/productRouter.js"
import { userRouter } from "./routers/userRouter.js"
import cors from "cors"
import { v2 as cloudinary } from 'cloudinary';
import { cardRoute } from "./routers/cardRouter.js";
import cookieParser from "cookie-parser";

export const app = express()

app.use(bodyParser.json({limit:"50mb"}))
app.use(express.json({ limit: '50mb' }))

// Increase the request size limit for URL-encoded data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload(
    {
     limits: { fileSize: 50 * 1024 * 1024 }, // 100 MB (adjust this as needed)
    }
))
app.use(cookieParser())


app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    exposedHeaders: ['X-Total-Count'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}
))


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_DB,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
 
dbConection();

app.use("/product", productRouter)
app.use('/user' , userRouter)
app.use('/card' , cardRoute )

app.listen(process.env.PORT, () => {
    console.log(`port :- http://localhost:${process.env.PORT}/`)

});