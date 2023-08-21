import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js"

const router=express.Router()

//routes 
//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)

//update category 
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//get all categories
router.get('/allcategories',requireSignIn,isAdmin,getAllCategoriesController)

//get single category
router.get('/singlecategory/:slug',requireSignIn,isAdmin,getCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

export default router