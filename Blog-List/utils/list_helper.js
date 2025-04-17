const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}
const favoriteBlogs = (blogs) => {
    let favoriteBlog = null
    let maxLikes = 0
    blogs.map((blog) => {
        if(blog.likes >= maxLikes) {
            favoriteBlog = blog
            maxLikes = blog.likes
        }
    })
    return favoriteBlog
}
const mostBlogs = (blogs) => {
    const freq = {}
    let maxCount = 0
    let mostFreq = 0
    for(let blog of blogs) {
        freq[blog.author] = (freq[blog.author] || 0) + 1
        if(freq[blog.author] > maxCount) {
            maxCount = freq[blog.author]
            mostFreq = blog.author
        }
    }
    return JSON.parse(`{"author":"${mostFreq}","blogs":${maxCount}}`)
}
const mostLikes = (blogs) => {
    const authors = new Map()
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    for(let blog of blogs) {
        if(authors && authors.has(blog.author)) {
            authors.get(blog.author).likes += blog.likes
        } else {
            authors.set(blog.author, {likes: blog.likes})
        }
    }
    console.log(authors)
}
module.exports = {
    dummy, totalLikes, favoriteBlogs, mostBlogs, mostLikes
}