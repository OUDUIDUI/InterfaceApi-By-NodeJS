const express = require('express');
const router = express.Router({mergeParams:true});   // 合并参数
const {getProducts,getProduct,addProduct,updateProduct,deleteProduct} = require("../controllers/products.js");
const advancedResults = require("../middleware/advancedResults");
const ProductSchema = require('../models/Product.js');

router.route('/')
    .get(advancedResults(ProductSchema,{path:"brandId",select:"name description"}),getProducts)
    .post(addProduct);

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;