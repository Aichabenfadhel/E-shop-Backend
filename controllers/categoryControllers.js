import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"


export const createCategoryController = async(req,res)=>{

    try {
        const {name}=req.body
        if(!name){
            return res.status(401).send({message:'name is required'})

        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category already exists'
            })
        }

        const category = await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'new category created',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating category'
        })
    }
}

export const updateCategoryController= async(req,res)=>{
    try {
        const {name}=req.body
        const {id}=req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:'category updated successfully',
            
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating category'    })
}}

export const getAllCategoriesController = async(req,res)=>{
    try {
        const categories= await categoryModel.find({});
        res.status(200).send({
            success:true,
            categories,
            message:"Getting all categories successfully !"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting all categories'    })
    }
}

export const getCategoryController = async(req,res)=>{
    try {
    //    const {id}=req.params
        const category= await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            category,
            message:"Getting category successfully !"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting  category'    })
    }
}

export const deleteCategoryController = async(req,res)=>{
    try {
        const {id}=req.params
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message: 'Category deleted successfully !'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Error in deleting category'
        })
    }
}