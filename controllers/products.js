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
    const reqQuery = {...req.query}
    // 清除关键字及值
    const removeFields = ["select","sort","page","limit"]; // 处理关键字
    removeFields.forEach((params)=> delete reqQuery[params]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr=queryStr.replace(
        /\b(eq|gt|gte|lt|lte|in|ne|nin)\b/g,
        (match)=> `$${match}`);

    let query;
    if(req.params.brandId){
        query = ProductSchema.find({brandId:req.params.brandId,...JSON.parse(queryStr)});
    }else{
        query = ProductSchema.find(JSON.parse(queryStr)).populate({   // 关联数据
            path:"brandId",
            select:"name description"
        });
    }

    // 在query所有数据的基础上添加筛选条件
    if(req.query.select){
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    // 处理sort排序
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }else{
        // 默认排序
        query = query.sort("createAt");
    }

    // 分页
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 2;
    const startIndex = (page - 1)*limit;
    const endIndex = page * limit;
    const total = await ProductSchema.countDocuments();
    query.skip(startIndex).limit(limit);

    const products = await query;
    // 分页返回值
    const pagination = {};
    if(startIndex > 0){
        pagination,prev = {page:page -1,limt};
    }
    if(endIndex < total){
        pagination.next = {page:page+1, limit};
    }
    res.status(200).json({success:true,count:total,pagination,data:products})
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