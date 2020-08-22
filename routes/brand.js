const express = require('express');
const router = express.Router();
const { getBrands,createBrand,getBrand,updateBrand,deleteBrand } = require('../controllers/brands.js')
const advancedResults = require("../middleware/advancedResults");
const BrandSchema = require('../models/Brand.js');

// 定向路由
const productRouter = require("./product.js");
router.use("/:brandId/product",productRouter);

router.route('/').get(advancedResults(BrandSchema,'products'),getBrands).post(createBrand)

router.route('/:id').get(getBrand).put(updateBrand).delete(deleteBrand)

module.exports = router;