// 引入模型
const BrandSchema = require('../models/Brand.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js')

/**
 * @desc   获取所有商品数据
 * @route  GET /api/v1/brand
 * @access public
 */
exports.getBrands = asyncHandler(async (req,res,next) =>{
    const reqQuery = {...req.query}
    // 清除关键字及值
    const removeFields = ["select","sort","page","limit"]; // 处理关键字
    removeFields.forEach((params)=> delete reqQuery[params])

    /**
     * $eq：equal 等于
     * $gt:greater than 大于
     * $gte: greater  than or equal 大于等于
     * $lt: less than 小于
     * $lte: less than or equal 小于等于
     * $in：in 数组中存在
     * $ne：not equal 不等于
     * $nin：not in 数组中不存在
    */

    let queryStr = JSON.stringify(reqQuery);
    queryStr=queryStr.replace(
        /\b(eq|gt|gte|lt|lte|in|ne|nin)\b/g,
        (match)=> `$${match}`);

    let query = BrandSchema.find(JSON.parse(queryStr)).populate("products");
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
    const total = await BrandSchema.countDocuments();
    query.skip(startIndex).limit(limit);

    const brands = await query;

    // 分页返回值
    const pagination = {};
    if(startIndex > 0){
        pagination,prev = {page:page -1,limt};
    }
    if(endIndex < total){
        pagination.next = {page:page+1, limit};
    }
    res.status(200).json({success:true,count:brands.length,pagination,data:brands})
})

/**
 * @desc   创建商品数据
 * @route  POST /api/v1/brand
 * @access public
 */
exports.createBrand = asyncHandler(async (req,res,next) =>{
    const brand = await BrandSchema.create(req.body);
    res.status(200).json({success:true,data:brand})
})  

/**
 * @desc   获取单个商品数据
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
 * @desc   更新单个商品数据
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
 * @desc   删除单个商品数据
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