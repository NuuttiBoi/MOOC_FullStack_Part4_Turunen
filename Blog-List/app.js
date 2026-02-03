const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const app = express()
const Blog = require("./models/blog")
const {totalLikes} = require("./utils/list_helper");
const logger = require("./utils/logger")

logger.info('Connecting to', config.MONGODB_URI)
mongoose
    .connect(config.MONGODB_URI, {family: 4})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app