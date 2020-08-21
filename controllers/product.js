// 引入模型
const ProductSchema = require('../models/Product.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js')

/**
 * @desc   获取所有商品数据
 * @route  GET /api/v1/product
 * @access public
 */
exports.getProducts = asyncHandler(async (req,res,next) =>{
    const products = await ProductSchema.find();
    res.status(200).json({success:true,data:products})
})

/**
 * @desc   创建商品数据
 * @route  POST /api/v1/product
 * @access public
 */
exports.createProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.create(req.body);
    res.status(200).json({success:true,data:product})
})  

/**
 * @desc   获取单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.getProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.findById(req.params.id);
        if(!product){
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
            );
        }
        res.status(200).json({success:true,data:product})
}) 

/**
 * @desc   更新单个商品数据
 * @route  PUT /api/v1/product:id
 * @access public
 */
exports.updateProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,              // 返回更新好的数据
        runValidators:true     // 新数据是否验证
    });
    if(!product){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    res.status(200).json({success:true,data:product})
}) 

/**
 * @desc   删除单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.deleteProduct = asyncHandler(async (req,res,next) =>{
    const product = await ProductSchema.findByIdAndDelete(req.params.id);
        if(!product){
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
            );
        }
    res.status(200).json({success:true,data:{}})
}) 