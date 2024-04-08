import express from "express";
import { postReview, addProduct, deleteProduct, getAllProduct, getProduct, searchProductByCategory, searchProductByName, updateProduct } from "../controller/productController.js";
import { isAdmin, isAuthenticate } from "../middleware/Authentication.js";

const router = express.Router();

router
  .get("/" ,  getAllProduct)
  .get("/:id" , getProduct)
  .post("/", isAuthenticate , isAdmin, addProduct)
  .patch("/:id" , isAuthenticate , isAdmin ,updateProduct)
  .delete("/:id" ,isAuthenticate , isAdmin, deleteProduct)

  .post("/review/:id" , isAuthenticate,  postReview)

  //searchi data ....
  .get("/name/:name", searchProductByName)
  .get("/category/:category",searchProductByCategory)
    
export const productRouter = router;