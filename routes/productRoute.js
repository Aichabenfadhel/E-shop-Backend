import  express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getAllProductsController, getProductController, productPhotoController, updateProductController } from "../controllers/productControllers.js";
import formidable from 'express-formidable'
const router =express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
router.get('/allproducts',getAllProductsController)
router.get('/singleproduct/:slug',getProductController)
router.get('/product-photo/:pid',productPhotoController)
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)
router.delete('/delete-product/:pid',requireSignIn,isAdmin,deleteProductController)

export default router;