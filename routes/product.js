const express = require('express');
const router = express.Router({mergeParams:true});   // 合并参数
const {getProducts,getProduct,addProduct,updateProduct,deleteProduct} = require("../controllers/products.js");
const advancedResults = require("../middleware/advancedResults");
const ProductSchema = require('../models/Product.js');

// 路由鉴权
const {protect,authorize} =require("../middleware/auth.js");

router.route('/')
    .get(advancedResults(ProductSchema,{path:"brandId",select:"name description"}),getProducts)
    .post(protect,authorize("admin","visitor"),addProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect,authorize("admin","visitor"),updateProduct)
    .delete(protect,authorize("admin"),deleteProduct);

module.exports = router;