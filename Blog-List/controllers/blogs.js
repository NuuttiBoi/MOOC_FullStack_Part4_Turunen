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

    if(!body.title || !body.url){
        response.status(400).end()
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0
        })
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const {title, author, url, likes} = request.body
    Blog.findById(request.params.id)
        .then(blog => {
            if(!blog){
                return response.status(400).end()
            }
            blog.title = title
            blog.author = author
            blog.url = url
            blog.likes = likes

            return blog.save().then((updatedBlog) => {
                response.json(updatedBlog)
            })
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = blogsRouter