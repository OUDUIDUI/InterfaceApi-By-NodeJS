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
 * @access private
 */
exports.createBrand = asyncHandler(async (req,res,next) =>{
    req.body.user = req.user.id;

    // 非admin角色只能创建一个品牌信息
    const publishedBrand = await BrandSchema.findOne({user:req.user.id});
    if(publishedBrand && req.user.role !== "admin"){
        return next(
            new ErrorResponse("你已创建过品牌信息，请勿多次创建",404)
        );
    }

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
 * @access private
 */
exports.updateBrand = asyncHandler(async (req,res,next) =>{
    let brand = await BrandSchema.findById(req.params.id);
    // 找不到对应品牌
    if(!brand){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    // 确定当前的用户id和登录用户id一致
    if(brand.user.toString() !== req.user.id || req.user.role !== "admin"){
        return next(new ErrorResponse('该用户无权限更新此数据'),401)
    }

    brand = await BrandSchema.findByIdAndUpdate(req.params.id,req.body,{
        new:true,              // 返回更新好的数据
        runValidators:true     // 新数据是否验证
    });

    res.status(200).json({success:true,data:brand})
}) 

/**
 * @desc   删除单个品牌
 * @route  GET /api/v1/brand:id
 * @access private
 */
exports.deleteBrand = asyncHandler(async (req,res,next) =>{
    let brand = await BrandSchema.findById(req.params.id);
    // 找不到对应品牌
    if(!brand){
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`,404)
        );
    }
    // 确定当前的用户id和登录用户id一致
    if(brand.user.toString() !== req.user.id || req.user.role !== "admin"){
        return next(new ErrorResponse('该用户无权限删除此数据'),401)
    }
    brand.remove();
    res.status(200).json({success:true,data:{}})
}) 