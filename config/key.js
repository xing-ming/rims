

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: "mongodb://inteligent:text1234@ds149596.mlab.com:49596/rims",
        security: 'love-lucifer-so-much',
    }
} else {
    module.exports = {
        mongoURI: "mongodb://localhost:27017/hotel_ims_full",
        security: 'love-luciferDemon-so-much',
    }
}