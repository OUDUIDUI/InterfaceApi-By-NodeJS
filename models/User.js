const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "请添加名字"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "请填写邮箱"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "请填写正确的邮箱地址",
        ],
    },
    password: {
        type: String,
        required: [true, "请添加密码"],
        minlength: 6,
        select: false,    // 不返回
    },
    role: {
        type: String,
        /* 当创建完管理员后可去除创建管理员权限 */
        enum: ["admin", "user", "visitor"],
        // enum: [ "user", "visitor"],
        default: "user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

// 密码加密
UserSchema.pre("save",async function (next) {
    const salt = await bcrypt.genSalt(10);   // 加密规则
    this.password = await bcrypt.hash(this.password,salt);
});

// 生成token
UserSchema.methods.getSignedJwtToken = function (){
    return jwt.sign(
        {id:this._id,name:this.name,email:this.email},     // token包含数据
        process.env.JWT_SECRET,                                    // secretOrPrivateKey
        {expiresIn:process.env.JWT_EXPIRE}                 // 过期时间
        )
}

// 密码匹配方法
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// 生成忘记密码Token
UserSchema.methods.getResetPasswordToken = async function(){
    const restToken = crypto.randomBytes(20).toString("hex");    // 随机生成一串十六进制数值
    // 加密
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(restToken)
        .digest("hex");
    // 设置过期时间
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10分钟过期

    return restToken;
}

module.exports = mongoose.model("User",UserSchema)
