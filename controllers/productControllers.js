import productModel from "../models/productModel.js";
import slugify from "slugify"
import fs from "fs"

export const createProductController=async(req,res)=>{
    try {
        const {name,description,price,quantity,slug,category,shipping}=req.fields
        const {photo}=req.files

        switch (true) {
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'description is required'})
            case !quantity:
                return res.status(500).send({error:'quantity is required'})
            case !price:
                return res.status(500).send({error:'price is required'})
            case photo && photo.size >1000000 :
                return res.status(500).send({error:'photo is required and should be less then 1mb'})
               
        }

        const products = new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.Type
        }

        await products.save()

        res.status(200).send({
            success:true,
            message:"product was created successfuly !" ,
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating product '
        })
    }
}

export const getAllProductsController=async(req,res)=>{
    try {
        const products=await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt : -1})
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"Getting all products successfully !" ,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting all products '
        })
    }

}

export const getProductController= async(req,res)=>{
    try {

        const product =await productModel.findOne({slug:req.params.slug}).populate('category').select("-photo")
        res.status(200).send({
            success:true,
            message:"Getting  product successfully !" ,
            product
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting product '
        })
    }
}

export const productPhotoController= async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)

        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting product photo '
        })
    }
}

export const updateProductController= async(req,res) =>{
    try {
        const {name,description,price,quantity,slug,category,shipping}=req.fields
        const {photo}=req.files

        switch (true) {
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'description is required'})
            case !quantity:
                return res.status(500).send({error:'quantity is required'})
            case !price:
                return res.status(500).send({error:'price is required'})
            case photo && photo.size >1000000 :
                return res.status(500).send({error:'photo is required and should be less then 1mb'})
               
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.Type
        }

        await products.save()

        res.status(200).send({
            success:true,
            message:"product was updated successfuly !" ,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in updating product '
        })
    }
}

export const deleteProductController = async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:" product was deleted successfully !" ,
            
        })
    } catch (error) {
        console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:'Error in deleting product '
    })
}
    }  
    
export const productFilterController = async(req,res)=>{
    try {
        const {checked,radio}=req.body
        let args={}
        if(checked.length>0) args.category = checked
        if(radio.length) args.price={$gte: radio[0],$lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success:true,
            message:" product filtred successfully !" ,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while filtering products '
        })
    }
}
export const productListController = async(req,res)=>{
    try {
       const perPage=6
       const page = req.params.page? req.params.page : 1
       const products =await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:" products list getted successfully !" ,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting products list '
        })
    }
}
export const productCountController = async(req,res)=>{
    try {
       const total =await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            message:" products counted successfully !" ,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while counting products  '
        })
    }
}