import express from "express";
import { addProduct, deleteProduct, getAllProduct, getProduct, searchProductByCategory, searchProductByName, updateProduct } from "../controller/productController.js";
import { isAdmin, isAuthenticate } from "../middleware/Authentication.js";

const router = express.Router();

router
  .get("/" ,  getAllProduct)
  .get("/:id" , getProduct)
  .post("/", isAuthenticate , isAdmin, addProduct)
  .patch("/:id" ,updateProduct)
  .delete("/:id" , deleteProduct)

  //searchi data ....
  .get("/name/:name", searchProductByName)
  .get("/category/:category",searchProductByCategory)
    
export const productRouter = router;