import httpStatus from 'http-status';
const ErrorHandler = (error, req, res, next)=>{
    return res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        status: error.status,
        stack: error.stack
    });
};

const NotFoundError = (req, res, next)=>{
    const error = new Error('Page Not Found...');
    error.status = httpStatus.NOT_FOUND;
    next(error);
}

module.exports = {ErrorHandler, NotFoundError};