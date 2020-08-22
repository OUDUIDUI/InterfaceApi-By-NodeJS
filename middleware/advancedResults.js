/**
 * $eq：equal 等于
 * $gt:greater than 大于
 * $gte: greater  than or equal 大于等于
 * $lt: less than 小于
 * $lte: less than or equal 小于等于
 * $in：in 数组中存在
 * $ne：not equal 不等于
 * $nin：not in 数组中不存在
 */

const advancedResults = (model,populate) => async (req,res,next) =>{
    const reqQuery = {...req.query}
    // 清除关键字及值
    const removeFields = ["select","sort","page","limit"]; // 处理关键字
    removeFields.forEach((params)=> delete reqQuery[params])

    let queryStr = JSON.stringify(reqQuery);
    queryStr=queryStr.replace(
        /\b(eq|gt|gte|lt|lte|in|ne|nin)\b/g,
        (match)=> `$${match}`);


    let query = model.find(JSON.parse(queryStr));
    query = handleQuery(req,query,populate);

    // 分页
    const total = await model.countDocuments();
    const {pagination, startIndex, limit} = handlePagination(req,total);
    query.skip(startIndex).limit(limit);

    const result = await query;

    res.advancedResults = {
        success:true,
        total,
        count:result.length,
        pagination,
        data:result
    };

    next();
}

function handleQuery(req,query,populate){
    // 在query所有数据的基础上添加筛选条件
    if(req.query.select){
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    // 处理sort排序
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }else{
        // 默认排序
        query = query.sort("createAt");
    }

    // 是否关联
    if(populate){
        query = query.populate(populate)
    }

    return query;
}

function handlePagination(req,total){
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 2;
    const startIndex = (page - 1)*limit;
    const endIndex = page * limit;

    // 分页返回值
    const pagination = {};
    if(startIndex > 0){
        pagination.prev = {page:page-1,limit};
    }
    if(endIndex < total){
        pagination.next = {page:page+1, limit};
    }

    return {pagination, startIndex, limit};
}

module.exports = advancedResults;