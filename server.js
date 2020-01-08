var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors')
var cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8080

mongoose.connect('mongodb://prince:prince123@ds155396.mlab.com:55396/chatappdb', (err, doc) => {
    if (err) {
        console.log('Can\'t connect to DB')
    } else {
        console.log('connected to DB')
    }
})

mongoose.Promise = global.Promise;

var app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'credentials': true,
    'origin': ['http://localhost:3000', 'http://192.168.0.86:3000', 'http://localhost:5000', 'http://192.168.0.86:5000'],
}))
app.use(cookieParser());

require('./routes/api/user.js')(app)
require('./routes/api/utils.js')(app)

var server = require('http').createServer(app)

server.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})