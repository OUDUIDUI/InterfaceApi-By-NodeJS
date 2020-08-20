/**
 * @desc   获取所有商品数据
 * @route  GET /api/v1/product
 * @access public
 */
exports.getProducts = (req,res,next) =>{
    res.status(200).json({success:true,msg:"获取所有商品数据"})
}

/**
 * @desc   创建商品数据
 * @route  POST /api/v1/product
 * @access public
 */
exports.createProduct = (req,res,next) =>{
    res.status(200).json({success:true,msg:"创建商品数据"})
}

/**
 * @desc   获取单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.getProduct = (req,res,next) =>{
    res.status(200).json({success:true,msg:`获取货号为${req.params.id}的商品数据`})
}

/**
 * @desc   更新单个商品数据
 * @route  PUT /api/v1/product:id
 * @access public
 */
exports.updateProduct = (req,res,next) =>{
    res.status(200).json({success:true,msg:`更新货号为${req.params.id}的商品数据`})
}

/**
 * @desc   删除单个商品数据
 * @route  GET /api/v1/product:id
 * @access public
 */
exports.deleteProduct = (req,res,next) =>{
    res.status(200).json({success:true,msg:`删除货号为${req.params.id}的商品数据`})
}