var express = require('express')
var mongoose = require('mongoose')

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

require('./routes/api/user.js')(app)

var server = require('http').createServer(app)

server.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})