const { test, describe, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const mongoose = require('mongoose')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        username: 'nuutti 123',
        name: 'admin',
        password: 'salaisuus'
    }

    await api.post('/api/users').send(newUser)

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: 'nuutti 123',
            password: 'salaisuus'
        })

    token = loginResponse.body.token
    for (let blog of helper.initialBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
    }
})

describe('blogs are returned as json', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('unique identifier property is named id', () => {
    test('blog has id field', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]

        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})

describe('adding a new blog', () => {
    test('succeeds with valid data and token', async () => {
        const newBlog = {
            title: 'new blog',
            author: 'nuutti',
            url: 'test',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(
            blogsAtEnd.length,
            helper.initialBlogs.length + 1
        )

        const titles = blogsAtEnd.map(b => b.title)
        assert(titles.includes('new blog'))
    })

    test('fails with 401 if token missing', async () => {
        const newBlog = {
            title: 'no token blog',
            author: 'nuutti',
            url: 'test'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('defaults likes to 0 if missing', async () => {
        const newBlog = {
            title: 'no likes blog',
            author: 'nuutti',
            url: 'test'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const blogs = await helper.blogsInDb()
        const addedBlog = blogs.find(b => b.title === 'no likes blog')

        assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with 400 if title missing', async () => {
        const blog = {
            author: 'nuutti',
            url: 'test'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(400)
    })

    test('fails with 400 if url missing', async () => {
        const blog = {
            title: 'missing url',
            author: 'test'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('succeeds with valid token and owner', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAfter = await helper.blogsInDb()
        assert.strictEqual(blogsAfter.length, blogs.length - 1)
    })

    test('fails with 401 if token missing', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })
})

describe('updating a blog', () => {
    test('succeeds updating likes', async () => {
        const blogs = await helper.blogsInDb()
        const blogToUpdate = blogs[0]

        const updatedData = {
            ...blogToUpdate,
            likes: 999
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)

        const updatedBlog = await api
            .get(`/api/blogs/${blogToUpdate.id}`)

        assert.strictEqual(updatedBlog.body.likes, 999)
    })
})

after(async () => {
    await mongoose.connection.close()
})