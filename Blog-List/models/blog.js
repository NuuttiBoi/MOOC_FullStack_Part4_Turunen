const mongoose = require('mongoose')
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl).then(() => {
    console.log('MongoDB Connected!')
} )

const blogSchema =new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)