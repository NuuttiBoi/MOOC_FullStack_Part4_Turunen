require('dotenv').config();

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.NODE_ENV_TEST
    : process.env.NODE_ENV_MONGODB_URI

module.exports = {
    PORT,
    MONGODB_URI
}