class ErrorResponse extends Error{
    constructor(message, statusCode){
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;