const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require("../utils/logger");
const {totalLikes} = require("../utils/list_helper");
const {request, response} = require("express");

/*
blogsRouter.get('/', (request, response) => {
    response.send('<h1>hello</h1>')
})
 */


blogsRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs) => {
        //logger.info(totalLikes(blogs))
        response.json(blogs)
    })
})

blogsRouter.get(`/:id`, (request, response) => {
    Blog.findById(request.params.id)
        .then((blog) => {
            if(blog){
                response.json(blog)
            } else {
                response.status(404).end()
            }
    })
        .catch((error) => {
            console.log(error)
        })
})

blogsRouter.post('/', async(request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = blogsRouter