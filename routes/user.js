const express = require("express");
const router = express.Router();
// 引入控制器
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/user.js");

// 路由鉴权
const { protect, authorize } = require("../middleware/auth.js");

// 定向路由
const reviewRouter = require("./review.js");
router.use("/:userId/review",reviewRouter);

const advancedResults = require("../middleware/advancedResults.js");
const User = require("../models/User.js");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;