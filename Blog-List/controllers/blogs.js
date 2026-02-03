const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require("../utils/logger");
const {totalLikes} = require("../utils/list_helper");

blogsRouter.get('/', (request, response) => {
    response.send('<h1>hello</h1>')
})


blogsRouter.get('/api/blogs', (request, response) => {
    Blog.find({}).then((blogs) => {
        logger.info(totalLikes(blogs))
        response.json(blogs)
    })
})

blogsRouter.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

module.exports = blogsRouter