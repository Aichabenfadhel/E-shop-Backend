import ProductModel from "../models/ProductModel.js";
import categorySchema from "../models/CategoryModel.js";
import slugify from "slugify";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(401).send({
          message: "Name is required",
        });
      case !description:
        return res.status(401).send({
          message: "description is required",
        });
      case !price:
        return res.status(401).send({
          message: "price is required",
        });
      case !quantity:
        return res.status(401).send({
          message: "quantity is required",
        });
      case !photo && photo.size > 1000000:
        return res.status(401).send({
          message: "Photo is required and should be less then 1mb",
        });
    }

    const Product = new ProductModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      Product.photo.data = fs.readFileSync(photo.path);
      Product.photo.contentType = photo.type;
    }
    await Product.save();
    res.status(201).send({
      success: true,
      message: "new Product created ",
      Product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating Product",
    });
  }
};

export const getallProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "Getting products successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting Product",
    });
  }
};

export const getProductBySlugController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Getting product successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting Product",
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting Product",
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModel.findByIdAndDelete(id).select("photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting product ",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(401).send({
          message: "Name is required",
        });
      case !description:
        return res.status(401).send({
          message: "description is required",
        });
      case !price:
        return res.status(401).send({
          message: "price is required",
        });
      case !quantity:
        return res.status(401).send({
          message: "quantity is required",
        });
      case !photo && photo.size > 1000000:
        return res.status(401).send({
          message: "Photo is required and should be less then 1mb",
        });
    }

    const Product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      Product.photo.data = fs.readFileSync(photo.path);
      Product.photo.contentType = photo.type;
    }
    await Product.save();
    res.status(201).send({
      success: true,
      message: "new Product updated ",
      Product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating Product",
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      message: "products filtered successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in filtering Products",
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in counting Products",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in per page Products",
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in searching Product",
    });
  }
};

export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in similar Product",
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categorySchema.findOne({ slug: req.params.slug });
    const product = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category wise Product",
    });
  }
};
