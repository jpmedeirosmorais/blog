if (process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: 'mongodb+srv://joaopaulo:81143763.Jp@blogapp-prod.1n0kf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}