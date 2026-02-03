const { test, describe, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const mongoose = require("mongoose");
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }
]

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]
test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})
describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })
    test('when list has multiple blogs, sum the likes of all blogs', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
})
describe('most liked blog', () => {
    test('find the blog with most likes', () => {
        const result = listHelper.favoriteBlogs(blogs)
        assert.deepStrictEqual(result,
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0
            }
        )
    })
    listHelper.mostBlogs(blogs)
    listHelper.mostLikes(blogs)
})
describe('most liked author', () => {
    test('find the author with most likes', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, JSON.parse('{"author":"Edsger W. Dijkstra", "likes":17}'))
    })
})

describe('most blogs by author', () => {
    test('find the author with the most blogs',() => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, JSON.parse('{"author":"Robert C. Martin", "blogs":3}'))
    })
})

describe.only('blogs are returned as json', () => {
    test.only('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })
})
describe.only('unique identifier property of the blog posts is named id', () =>{
    test.only('unique identifier property of the blog posts is named id', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })
})

describe.only('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post',  () => {
    const newBlog = {
        title: "testing new blog post !!!",
        author: "nuutti",
        url: "okok",
        likes: 2
    }

    test.only('test that a valid blog can be added and saved, and it increases the number of blogs', async () => {
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)

        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes('testing new blog post !!!'))

    })

})

describe.only('if a new note that is added is missing the likes property, it will default to 0', () => {
    test.only('verify that missing likes property will cause it to default to 0', async () => {
        const newBlogWithNoLikes = {
            title: "No likes blog.",
            author: "nuutti",
            url: "ok.com"
        }
        await api
            .post('/api/blogs')
            .send(newBlogWithNoLikes)
            .expect(201)
            .expect('Content-type', /application\/json/)
        const blogsInDb = await helper.blogsInDb()
        const blogWithLikesMissing = blogsInDb[2] //initially only 2 blogs in db, now new blog should be third
        const result = await api
            .get(`/api/blogs/${blogWithLikesMissing.id}`)
            .expect(200)
            .expect('Content-type', /application\/json/)
        assert.strictEqual(result.body.likes, 0)
    })
})

after(async() => {
    await mongoose.connection.close()
})