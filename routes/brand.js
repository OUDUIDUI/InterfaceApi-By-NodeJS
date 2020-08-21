const express = require('express');
const router = express.Router();
const { getBrands,createBrand,getBrand,updateBrand,deleteBrand } = require('../controllers/brands.js')

// 定向路由
const productRouter = require("./product.js");
router.use("/:BrandId/product",productRouter);

router.route('/').get(getBrands).post(createBrand)

router.route('/:id').get(getBrand).put(updateBrand).delete(deleteBrand)

module.exports = router;