const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    unique:true,
    required: [true, "请填写商品名称"],
  },
  tags: {
    type: Array,
    required: [true, "请添加商品标签"],
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true
  },
  price:{
    type:Number,
    required: [true, "请添加商品价格"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true},
});

module.exports = mongoose.model("Product", ProductSchema);
