const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db.js');
const errorHandler = require("./middleware/error.js")

// 引入路由文件
const brand = require('./routes/brand.js');
const product = require('./routes/product.js');

dotenv.config({
    path:"./config/config.env"
})

// 链接数据库
connectDB();

const app = express();

// 配置body解析
app.use(express.json())

// 创建中间件
app.use(morgan("dev"));


app.get("/",(req,res)=>{
    res.status(200).json({success:true,msg:"HelloWorld"});
})

// 挂载路由节点
app.use("/api/v1/brand",brand);
app.use("/api/v1/product",product);

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