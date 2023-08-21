import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exist",
      });
    }
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created ",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating Category",
    });
  }
};

export const updateCategoryController = async(req,res)=>{
try {
  const {name}=req.body
  const {id}=req.params
  const category =await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
  res.status(200).send({
    success:true,
    message:"Category updated successfully"
  })
  
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error in updating Category",
  });
}
}

//Get all categories 

export const getAllCategoriesController= async (req,res) =>{
  try {
    const category= await CategoryModel.find({})
    res.status(200).send({
      success:true,
      message:"Geeting categories successfully",
      category,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Categories ",
    });
  }
}

//get single category

export const getCategoryController = async(req,res)=>{
  try {
    const {slug}=req.params
    const category= await CategoryModel.findOne({slug:req.params.slug})
    res.status(200).send({
      success:true,
      message:'Getting category successfully',
      category,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting  Category ",
    });
  }
}

//delete category

export const deleteCategoryController = async(req,res)=>{
  try {
    const {id}=req.params
    const category= await CategoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success:true,
      message:'category deleted successfully', 
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting Category ",
    });
  }
}