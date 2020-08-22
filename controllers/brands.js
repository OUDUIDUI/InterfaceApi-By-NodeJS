// 引入模型
const BrandSchema = require('../models/Brand.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js')

/**
 * @desc   获取所有品牌数据
 * @route  GET /api/v1/brand
 * @access public
 */
exports.getBrands = asyncHandler(async (req,res,next) =>{
    res.status(200).json(res.advancedResults)
})

/**
 * @desc   创建品牌
 * @route  POST /api/v1/brand
 * @access public
 */
exports.createBrand = asyncHandler(async (req,res,next) =>{
    const brand = await BrandSchema.create(req.body);
    res.status(200).json({success:true,data:brand})
})  

/**
 * @desc   获取单个品牌
 * @route  GET /api/v1/brand:id
 * @access public
 */
exports.getBrand = asyncHandler(async (req,res,next) =>{
    const brand = await BrandSchema.findById(req.params.id);
        if(!brand){
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
            );
        }
        res.status(200).json({success:true,data:brand})
}) 

/**
 * @desc   更新单个品牌
 * @route  PUT /api/v1/brand:id
 * @access public
 */
exports.updateBrand = asyncHandler(async (req,res,next) =>{
    const brand = await BrandSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,              // 返回更新好的数据
        runValidators:true     // 新数据是否验证
    });
    if(!brand){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    res.status(200).json({success:true,data:brand})
}) 

/**
 * @desc   删除单个品牌
 * @route  GET /api/v1/brand:id
 * @access public
 */
exports.deleteBrand = asyncHandler(async (req,res,next) =>{
    const brand = await BrandSchema.findById(req.params.id);
    if(!brand){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    brand.remove();
    res.status(200).json({success:true,data:{}})
}) 