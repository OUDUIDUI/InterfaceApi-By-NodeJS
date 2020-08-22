const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "请添加评论内容"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "请评分, 范围是1~10"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "Brand",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Review", ReviewSchema);
