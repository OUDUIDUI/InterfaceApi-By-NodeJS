const express = require('express');
const router = express.Router({mergeParams:true});   // 合并参数
const {getProducts,getProduct,addProduct,updateProduct,deleteProduct} = require("../controllers/products.js");

router.route('/').get(getProducts).post(addProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;