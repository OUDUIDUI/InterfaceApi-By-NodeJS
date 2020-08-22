const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db.js');
const errorHandler = require("./middleware/error.js");
const cookieParser = require('cookie-parser');

// 引入路由文件
const brand = require('./routes/brand.js');
const product = require('./routes/product.js');
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const review = require("./routes/review.js")

dotenv.config({
    path:"./config/config.env"
})

// 链接数据库
connectDB();

const app = express();

// 配置body解析
app.use(express.json())

// 使用morgan中间件
app.use(morgan("dev"));

// 使用cookie中间件
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.status(200).json({success:true,msg:"HelloWorld"});
})

// 挂载路由节点
app.use("/api/v1/brand",brand);
app.use("/api/v1/product",product);
app.use("/api/v1/auth",auth);
app.use("/api/v1/user",user);
app.use("/api/v1/review",review);

// error中间件 一定要写在挂载路由节点之后
app.use(errorHandler)

// 监听接口
const PORT = process.env.PORT || 3000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta.bold)
);

process.on("unhandledRejection",(err,promise) => {
    console.log(`Error:${err.message}`.red.bold);
    // 关闭服务器 & 退出进程
    server.close(()=>{
        process.exit(1);
    });
})