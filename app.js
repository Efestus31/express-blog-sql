//import express
const express = require('express')
const app = express()
//import cors to pass policy
const cors = require('cors')
//import routes
const postRouter = require('./routes/posts.js')
//import middleware for error handling
const notFound = require('./middlewares/notFound.js')
//import middleware to log requests
const loggerMiddleware = require('./middlewares/loggerMiddleware.js')
app.use(express.json())
//middleware to handle CORS
app.use(cors())
app.use(express.static('public'));


//import HOST & PORT from .env file
const host = process.env.HOST;
const port = process.env.PORT;

//static page
app.get('/', (req, res) => {
    res.send(' Benvenuto nel mio blog!')
});

app.listen(port, (req, res) => {
    console.log(`Server is running at ${host}:${port}`);
});
// app.use('/posts', (req, res, next) =>{
//     throw new Error('everything is broken! :(');
// })
app.use('/posts', loggerMiddleware);

app.use('/posts', postRouter);

//this need to be placed after all the routes are defined
// so to be our last call.
app.use(notFound);

app.use((err, req, res, next) => {
    //console.log('Error: ', err.message);
    //this prints the stack trace of the error
    console.log(err.stack);
    res.status(500).send({
        message: 'Something went wrong!',
        error: err.message
    })
});
