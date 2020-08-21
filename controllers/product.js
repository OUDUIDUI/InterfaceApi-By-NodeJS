// 引入模型
const ProductSchema = require('../models/Product.js');
const { findByIdAndUpdate } = require('../models/Product.js');

/**
 * @desc   获取所有商品数据
 * @route  GET /api/v1/product
 * @access public
 */
exports.getProducts = async (req,res,next) =>{
    try {
        const products = await ProductSchema.find();
        res.status(200).json({success:true,data:products})
    } catch (error) {
        res.status(400).json({success:false,error:error})
    }
    
}

/**
 * @desc   创建商品数据
 * @route  POST /api/v1/product
 * @access public
 */
exports.createProduct =  async (req,res,next) =>{
    try{
        const product = await ProductSchema.create(req.body);
        res.status(200).json({success:true,data:product})
    }catch(error){
        res.status(400).json({success:false,error:error})
    }
}

/**
 * @desc   获取单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.getProduct = async (req,res,next) =>{
    try {
        const product = await ProductSchema.findById(req.params.id);
        if(!product){
            return res.status(400).json({success:false,msg:"找不到该商品"})
        }

        res.status(200).json({success:true,data:product})
    } catch (error) {
        // res.status(400).json({success:false,error:error})
        next(error);

    }

}

/**
 * @desc   更新单个商品数据
 * @route  PUT /api/v1/product:id
 * @access public
 */
exports.updateProduct = async (req,res,next) =>{
    try {
        const product = await ProductSchema.findByIdAndUpdate(req.params.id,req.body,{
            new:true,              // 返回更新好的数据
            runValidators:true     // 新数据是否验证
        });
        if(!product){
            return res.status(400).json({success:false,msg:"找不到该商品"})
        }
        res.status(200).json({success:true,data:product})
    } catch (error) {
        res.status(400).json({success:false,error:error})
    }
}

/**
 * @desc   删除单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.deleteProduct = async (req,res,next) =>{
    try {
        const product = await ProductSchema.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(400).json({success:false,msg:"找不到该商品"})
        }
        res.status(200).json({success:true,data:{}})
    } catch (error) {
        res.status(400).json({success:false,error:error})
    }
}