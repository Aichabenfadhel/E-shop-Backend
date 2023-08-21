import express from "express"
import formidable from "express-formidable"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { createProductController,deleteProductController, getProductBySlugController, getallProductsController,getProductPhotoController,updateProductController } from "../controllers/productControllers.js"

const router=express.Router()

//routes 

//create product 
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//update product
router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController)

//get all products
router.get('/allproducts',getallProductsController)

//get single product
router.get('/singleproduct/:slug',getProductBySlugController)

//get product photo
router.get('/product-photo/:id',getProductPhotoController)

//delete product
router.delete('/delete-product/:id',deleteProductController)

export default router