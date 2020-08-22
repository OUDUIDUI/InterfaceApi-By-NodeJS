const UserSchema = require('../models/User.js');
const ErrorResponse = require('../utils/errResponse.js');
const asyncHandler = require('../middleware/async.js');
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

/**
 * @desc   注册
 * @route  POST /api/v1/auth/register
 * @access public
 */
exports.register = asyncHandler(async (req,res,next)=>{
    const {name,email,role,password} = req.body;
    // 注册用户
    const user = await UserSchema.create({
        name,email,role,password
    })
    // 生成token
    sendTokenResponse(user,200,res);
})

/**
 * @desc   登录
 * @route  POST /api/v1/auth/login
 * @access public
 */
exports.login = asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body;
    // 验证邮箱密码是否为空
    if(!email || !password){
        return next(new ErrorResponse("请填写邮箱和密码"),400);
    }
    // 登录用户
    const user = await UserSchema.findOne({email}).select("+password");
    // 校验用户信息是否存在
    if (!user){
        return next(new ErrorResponse("找不到该用户"),401);
    }
    // 密码匹配
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse("密码错误"),401);
    }

    // 生成token
    sendTokenResponse(user,200,res);
})

/**
 * @desc   获取用户信息
 * @route  GET /api/v1/auth/me
 * @access private
 */
exports.getMe = asyncHandler(async (req,res,next)=>{
    const user = await UserSchema.findById(req.user.id);
    res.status(200).json({success:true,data:user});
})

/**
 * @desc   更新用户信息
 * @route  PUT /api/v1/auth/updateDetail
 * @access private
 */
exports.updateDetails = asyncHandler(async (req,res,next)=>{
    const fieldsToUpdate = {
        name : req.body.name || req.user.name,
        email : req.body.email || req.user.email
    }
    const user = await UserSchema.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        new:true,
        runValidators:true
    });
    res.status(200).json({success:true,data:user});
})

/**
 * @desc   更新用户密码
 * @route  PUT /api/v1/auth/updatePassword
 * @access private
 */
exports.updatePassword = asyncHandler(async (req,res,next)=>{
    // 判断旧密码是否匹配
    const user = await UserSchema.findById(req.user.id).select("+password");
    if(!await user.matchPassword(req.body.currentPassword)){
        return next(new ErrorResponse("密码错误"),401);
    }
   // 更新密码
    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user,200,res);
})

/**
 * @desc   忘记密码
 * @route  POST /api/v1/auth/forgotPassword
 * @access public
 */
exports.forgotPassword = asyncHandler(async (req,res,next)=>{
    const user = await UserSchema.findOne({email:req.body.email}).select("+password");
    // 校验用户
    if(!user){
        return next(new ErrorResponse("未找到该用户",404));
    }

    // 生成token
    const restToken = await user.getResetPasswordToken();
    await user.save();

    // 发送邮件 包含重置密码的网址
    const restUrl = `${req.protocol}://${req.get("host")}/api/v1/resetPassword/${restToken}`;
    const message = `收到该邮件的原因是你需要重置密码，请点击链接<a>${restUrl}</a>`;

    try{
        await sendEmail({
            email:user.email,
            subject:"重置密码",
            message
        })
    }catch (e) {
        // 发送失败
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorResponse("邮件发送失败"),500);
    }
    res.status(200).json({success:true,msg:"邮件发送成功"});
})

/**
 * @desc   重置密码
 * @route  PUT /api/v1/auth/resetPassword/:resetToken
 * @access public
 */
exports.resetPassword = asyncHandler(async (req,res,next)=>{
    // 获取token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");
    const user = await UserSchema.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorResponse("token不合法",400));
    }

    // 重置密码
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({success:true,msg:"密码重置成功"});
})

// 生成token并存储到cookie的方法
const sendTokenResponse = (user,statusCode,res) =>{
    const token = user.getSignedJwtToken();
    const options = {
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),  // cookie有效期30天
        httpOnly:true,    // 支持http请求
    };

    // 正式环境下不支持http
    if(process.env.NODE_ENV === "production"){
        options.httpOnly = false;
    }

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        token
    });
}