const ReviewSchema = require("../models/Review.js");
const BrandSchema = require("../models/Brand.js");
const ErrorResponse = require("../utils/errResponse.js");
const asyncHandler = require("../middleware/async.js");

/**
 * @desc    获取所有评论
 * @route   GET /api/v1/review
 * @route   GET /api/v1/brand/:brandId/review
 * @route   GET /api/v1/user/:userId/review
 * @access  public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.brandId) {
        const reviews = await ReviewSchema.find({ brand: req.params.brandId });
        return res
            .status(200)
            .json({ success: true, count: reviews.length, data: reviews });
    } else if(req.params.userId){
        const reviews = await ReviewSchema.find({ user: req.params.userId });
        console.log(reviews);
        return res
            .status(200)
            .json({ success: true, count: reviews.length, data: reviews });
    }else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @desc    根据ID获取某个评论
 * @route   GET /api/v1/review/:id
 * @access  public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await ReviewSchema.findById(req.params.id).populate({
        path: "brand",
        select: "name description",
    });

    if (!review) {
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: review });
});

/**
 * @desc    添加评论数据
 * @route   POST /api/v1/brand/:brandId/review
 * @access  private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.brand = req.params.brandId;
    req.body.user = req.user.id;
    // 先查询米修机构的数据是否存在
    const brand = await BrandSchema.findById(req.params.brandId);

    // 没查到,返回错误信息
    if (!brand) {
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.brandId}`,404)
        );
    }

    const review = await ReviewSchema.create(req.body);

    res.status(200).json({ success: true, data: review });
});

/**
 * @desc    根据id删除评论数据
 * @route   DELETE /api/v1/review/:id
 * @access  private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await ReviewSchema.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
    }

    // 确定当前的id和登录的用户id是一致的
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(`该用户${req.user.id}无权限删除此评论数据`, 401)
        );
    }

    review.remove();

    res.status(200).json({ success: true, data: {} });
});
