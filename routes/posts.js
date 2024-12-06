//import express
const express = require('express')
//define the router instance
const router = express.Router()
//imports the controller with all his functions
const postController = require('../controller/postController.js')
//define all routes here

//API CRUD

//Post API
 // (R) index shows all posts
router.get('/', postController.index) // /posts

// (R) show only the single(selected resources)
router.get('/:slug', postController.show) //posts/tortini-verdure

//(C) create a new resource inside of the array 
router.post('/', postController.store) // /posts

//(U) update an existing resource
router.put('/:slug', postController.update)

 //(D) delete an existing resource
 router.delete('/:slug', postController.destroy)




//export the router instance
module.exports = router