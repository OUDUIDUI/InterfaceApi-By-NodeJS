const express = require('express');
const router = express.Router({mergeParams:true});   // 合并参数
const {getProducts} = require("../controllers/products.js");

router.route('/').get(getProducts);

module.exports = router;