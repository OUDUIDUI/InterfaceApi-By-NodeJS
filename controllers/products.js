const ProductSchema = require('../models/Product.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js');
const e = require('express');

/**
 * @desc   获取所有课程数据
 * @route  GET /api/v1/product
 * @route  GET /api/v1/brand/:brandId/product
 * @access public
 */
exports.getProducts = asyncHandler(async (req,res,next) =>{
    let query;
    if(req.params.brandId){
        query = ProductSchema.find({brandId:req.params.brandId});
    }else{
        query = ProductSchema.find().populate({   // 关联数据
            path:"brandId",
            select:"name description",
            model:"Brand"
        });
    }

    const products = await query;
    res.status(200).json({success:true,count:products.length,data:products})
})

/**
 * @desc   根据ID获取某个课程数据
 * @route  GET /api/v1/product/:id
 * @access public
 */
exports.getProduct = asyncHandler(async (req,res,next) =>{
    const product = await (await ProductSchema.findById(req.params.id)).populated({
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