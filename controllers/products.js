const ProductSchema = require('../models/Product.js');
const BrandSchema = require('../models/Brand.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js');
const e = require('express');

/**
 * @desc   获取所有商品
 * @route  GET /api/v1/product
 * @route  GET /api/v1/brand/:brandId/product
 * @access public
 */
exports.getProducts = asyncHandler(async (req,res,next) =>{
    if(req.params.brandId){
        const products = await ProductSchema.find({brandId:req.params.brandId});
        res.status(200).json({success:true,count:products.length,data:products})
    }else{
        res.status(200).json(res.advancedResults);
    }
})

/**
 * @desc   根据ID获取某个商品
 * @route  GET /api/v1/product/:id
 * @access public
 */
exports.getProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.findById(req.params.id).populate({
        path:"brand",
        select:"name description"
    });
    if(!product){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    res.status(200).json({success:true,data:product})
})

/**
 * @desc   创建商品
 * @route  POST /api/v1/brand/:brandId/courses
 * @access private
 */
exports.addProduct = asyncHandler(async (req,res,next) =>{
    console.log(req.params);
    const brand = await BrandSchema.findById(req.params.brandId);
    if(!brand){
        // 查不到对应品牌
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.brandId}`,404)
        );
    }

    const product = await ProductSchema.create(req.body)

    res.status(200).json({success:true,data:product})
})

/**
 * @desc   更新单个商品
 * @route  PUT /api/v1/product:id
 * @access private
 */
exports.updateProduct = asyncHandler(async (req,res,next) =>{
    let product = await ProductSchema.findById(req.params.id);
    if(!product){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    product = await ProductSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,              // 返回更新好的数据
        runValidators:true     // 新数据是否验证
    });

    res.status(200).json({success:true,data:product})
})

/**
 * @desc   删除单个商品
 * @route  GET /api/v1/product:id
 * @access private
 */
exports.deleteProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.findById(req.params.id);
    if(!product){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    product.remove();
    res.status(200).json({success:true,data:{}})
})