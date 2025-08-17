import logger from "../utils/logger";

const errorHandler = (err, req, res, next) => {
    //Log error details
    logger.error('Error occured', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    let status = err.status || err.statusCode || 500;
    let message = err.message || "Internal server Error";

    //Handle specific error types
    if(err.name === 'ValidationError'){
        status= 400;
        message = "Validation Error: " + err.message
    } else if( err.name === 'MulterError'){
        status = 400
        if (err.code === "LIMIT_FILE_SIZE"){
            message = 'File too large. Maximum size allowed is ' + Math.round(parseInt(process.env.MAX_FILE_SIZE) / 1024 / 1024) + 'MB';
        }else {
        message = "File upload error: " + err.message;
        }
    } else if (err.code === 'ENOENT'){
        status = 404;
        message = 'File not found';
    }


    //Don't expose internal errors in productions
    if(process.env.NODE_END === 'production' && status === 500){
        message = 'Internal Serval Error'
    }

    res.status(status).json({
        error: {
            message,
            status,
            timestamp: new Date().toISOString(),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    })
}

export default errorHandler