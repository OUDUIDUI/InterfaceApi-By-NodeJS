class ErrorResponse extends Error{
    // 构造函数
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;