//import the db file
const posts = require('../db/db.js')
//integrazione per bonus
//method fs per leggere e modificare i file di sistema
const fs = require('fs')
const connection = require('../db/connection.js')
const { error } = require('console')

//(R) index metodo che restituisce tutti gli oggetti presenti nel db
const index = (req, res) => {

    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const responseData = {
            data: results,
            counter: results.length
        }

        res.status(200).json(responseData)
    })
}

//(R) show metodo che restituisce un singolo oggetto presente nel db
//tramite il suo slug
const show = (req, res) => {
    const id = req.params.id


    //prepare the sql query
    const sql = 'SELECT * FROM posts WHERE id=?'

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (!results[0]) return res.status(404).json({ error: 'Post not found' })

        const responseData = {
            data: results[0],
        }

        res.status(200).json(responseData)
    })
}


//(C) create metodo che aggiunge un oggetto al db
const store = (req, res) => {
    //Crea un nuovo oggetto all'interno del db
    const post = {
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
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)

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
    if (!post) {
        return res.status(404).json({ error: `No post found with this slug: ${req.params.slug}!` })
    }
    //update the post object
    post.title = req.body.title
    post.slug = req.body.slug
    post.content = req.body.content
    post.image = req.body.image
    post.tags = req.body.tags

    //controlla se ci sono campi vuoti
    if (!post.title || !post.slug || !post.content || !post.image || !post.tags) {
        return res.status(400).json({ error: "Missing required fields" })
    }
    //update the js file
    fs.writeFileSync('./db/db.js', `module.exports = ${JSON.stringify(posts, null, 4)}`)


    //return the update posts list
    return res.status(201).json({ status: 201, data: posts })
}

//(D) delete metodo che cancella un oggetto presente nel db
const destroy = (req, res) => {

    //take the resource id from the request
    const id = req.params.id

    //prepare the sql query to delete the record from the db
    const sql = 'DELETE FROM posts WHERE id=?'

    //perform the prepared statement query
    connection.query(sql, [id], (err, results) => {
        console.log(err, results);
        if (err) return res.status(500).json({ error: err })
        //handle a 404 error if the record is not found
        if (results.affectedRows === 0) return res.status(404).json({ error: `404! no post found with this ${id}` })

        return res.json({ status: 204, affectedRows: results.affectedRows })

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