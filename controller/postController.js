//import the db file
const posts = require('../db/db.js')
//integrazione per bonus
//method fs per leggere e modificare i file di sistema
const fs = require('fs')

//(R) index metodo che restituisce tutti gli oggetti presenti nel db
const index = (req, res) => {

    console.log(posts);
    
    //send response with the 200 status
    res.status(200).json(
        {
            data: posts,
            counter: posts.length
        })
}
//(R) show metodo che restituisce un singolo oggetto presente nel db
//tramite il suo slug
const show = (req, res) => {
     const post = posts.find(post => post.slug === req.params.slug)

     console.log(post);
     if (!post){
        return res.status(404).json({
            error: `404! Not found`
        })
     }
     return res.json({
        data:post
     })
}

//(C) create metodo che aggiunge un oggetto al db
const store = (req, res) => {
    //Crea un nuovo oggetto all'interno del db
    const post ={
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
    }

    //validazione dei campi dell'oggetto
    if (!post.title || !post.slug || !post.content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    //aggiunge il nuovo post all'array
    posts.push(post)

    //aggiorna file db
    fs.writeFileSync('./db/db.js',`module.exports = ${JSON.stringify(posts, null, 4)}`)

    res.json({
        data: posts,
        status: 201,
        counter: posts.length
    })
}

//(U) update metodo che modifica un oggetto presente nel db
const update = (req, res) => {
    //find a post by slug
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)
    //check if the user is updating the correct post
    if(!post){
        return res.status(404).json({ error: `No post found with this slug: ${req.params.slug}!`})
    }
    //update the post object
    post.title = req.body.title
    post.slug = req.body.slug
    post.content = req.body.content
    post.image = req.body.image
    post.tags = req.body.tags

    //controlla se ci sono campi vuoti
    if(!post.title || !post.slug || !post.content || !post.image || !post.tags){ 
        return res.status(400).json({ error: "Missing required fields" })
        }
    //update the js file
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)


    //return the update posts list
    return res.status(201).json({status: 201, data: posts})
} 

//(D) delete metodo che cancella un oggetto presente nel db
const destroy =(req, res) => {

    //find the post by slug
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)

    //check if there is deleting the correct file 
    if(!post){
        return res.status(404).json({
            error: `No post found with the given slug: ${req.params.slug}`
        })
    }
    //remove the resource for the array
    const newPosts = posts.filter(post => post.slug.toLowerCase() !== req.params.slug)

    //save the js file
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(newPosts, null, 4)}`)
    //return the update posts list
    return res.status(200).json({
        status: 200,
        data: newPosts
    })

}

//export the methods
module.exports = {
    index,
    show,
    store,
    update,
    destroy
}