const fs = require('fs');  // 文件系统对象
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({
    path:"./config/config.env"
});

const BrandSchema = require('./models/Brand.js');
const ProductSchema = require('./models/Product.js');

// 连接数据库
mongoose.connect(process.env.NET_MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
});

// 读取本地json数据
const brands = JSON.parse(fs.readFileSync(`${__dirname}/_data/brands.json`,"utf-8"));
const products = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`,"utf-8"));

// 导入数据到数据库
const importData = async() =>{
    try {
        await BrandSchema.create(brands);
        await ProductSchema.create(products);
        console.log("数据存储成功".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

// 删除数据库中的数据
const deleteData = async() =>{
    try {
        await BrandSchema.deleteMany();
        await ProductSchema.deleteMany();
        console.log("数据删除成功".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error)
    }
}



if(process.argv[2] === '-i'){
    // node seeder -i
    importData();
}else if(process.argv[2] === '-d'){
    // node seeder -d
    deleteData();
}
