const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "请填写品牌名"],
    maxlength: [50, "品牌名不能超过50个字"],
  },
  description: {
    type: String,
    required: [true, "请填写品牌介绍"],
    maxlength: [500, "品牌介绍不能超过500个字"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "请填写合法的网址",
    ],
  },
  country: {
    type: String,
    required: [true, "请填写品牌所在地"],
    maxlength: [50, "品牌所在地不能超过50个字"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true},
})

// 配置virtual
brandSchema.virtual('products',{
  ref:"Product",               // 关联的Schema名
  localField:"_id",            // 根据id关联
  foreignField:"brandId",      // 关联数据的对象key
  justOne:false
})

// 配置前置钩子
brandSchema.pre("remove",async function(next){
  await this.model("Product").deleteMany({brandId:this._id});
  next();
})

module.exports = mongoose.model("Brand",brandSchema)
