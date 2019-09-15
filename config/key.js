

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: "mongodb+srv://pinyin:inteligent@dzhavo-1bim4.mongodb.net/test?retryWrites=true&w=majority",
        security: 'love-lucifer-so-much',
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/hic",
        security: 'love-luciferDemon-so-much',
    }
}

// mongoURI: "mongodb://inteligent:text1234@ds149596.mlab.com:49596/rims"
