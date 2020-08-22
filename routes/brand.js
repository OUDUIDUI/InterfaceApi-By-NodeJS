const express = require('express');
const router = express.Router();
const { getBrands,createBrand,getBrand,updateBrand,deleteBrand } = require('../controllers/brands.js');
const advancedResults = require("../middleware/advancedResults");
const BrandSchema = require('../models/Brand.js');

// 路由鉴权 && 用户角色权限控制
const {protect,authorize} =require("../middleware/auth.js");

// 定向路由
const productRouter = require("./product.js");
const reviewRouter = require("./review.js");
router.use("/:brandId/product",productRouter);
router.use("/:brandId/review",reviewRouter);

router.route('/')
    .get(advancedResults(BrandSchema,'products'),getBrands)
    .post(protect,authorize("admin","visitor"),createBrand)

router.route('/:id')
    .get(getBrand)
    .put(protect,authorize("admin","visitor"),updateBrand)
    .delete(protect,authorize("admin"),deleteBrand)

module.exports = router;