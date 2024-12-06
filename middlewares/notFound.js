const notFoundMiddleware = (req, res, next) => {
    res.status(404).send(`Sorry can't find that! ${req.url}`)
}

module.exports = notFoundMiddleware;