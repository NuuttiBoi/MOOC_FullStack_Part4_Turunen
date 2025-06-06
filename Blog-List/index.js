const express = require('express')
require('dotenv').config()

const app = express()

const Blog = require("./models/blog")
const {totalLikes} = require("./utils/list_helper");
const logger = require("./utils/logger")

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>hello</h1>')
})


app.get('/api/blogs', (request, response) => {
    Blog.find({}).then((blogs) => {
        logger.info(totalLikes(blogs))
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})