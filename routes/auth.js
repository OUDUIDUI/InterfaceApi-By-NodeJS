const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateDetails,
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.js');

// 路由鉴权
const {protect} =require("../middleware/auth.js");

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getMe);
router.put("/updateDetail",protect,updateDetails);
router.put("/updatePassword",protect,updatePassword);
router.post("/forgotPassword",forgotPassword);
router.put("/resetPassword/:resetToken",resetPassword)

module.exports = router;