const Blog = require('../models/blog')


const initialBlogs = [
    {
        "title": "testi",
        "author": "nuutti",
        "url": "okok",
        "likes": 2
    },
    {
        "title": "testi 2",
        "author": "nuutti t",
        "url": "okok",
        "likes": 3
    }
]
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {blogsInDb, initialBlogs}