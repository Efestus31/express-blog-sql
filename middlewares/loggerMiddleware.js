const loggerMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    console.warn(`
       Date: ${now}
       Method: ${req.method}
       URL: ${req.baseUrl} 
        `);

    //we need to call next to avoid the request to be hanging forever.
    next();

}

//export the function created
module.exports = loggerMiddleware;