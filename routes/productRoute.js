import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductBySlugController,
  getallProductsController,
  getProductPhotoController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  similarProductController,
  productCategoryController
} from "../controllers/productControllers.js";

const router = express.Router();

//routes

//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get all products
router.get("/allproducts", getallProductsController);

//get single product
router.get("/singleproduct/:slug", getProductBySlugController);

//get product photo
router.get("/product-photo/:id", getProductPhotoController);

//filter product
router.post('/product-filters',productFiltersController)

//product count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)

// similar product 
router.get('/similar-products/:pid/:cid',similarProductController)

// search product 
router.get('/search/:keyword',searchProductController)

// category - product 
router.get('/product-category/:slug',productCategoryController)

//delete product
router.delete("/delete-product/:id", deleteProductController);

export default router;
