const { Router } = require('express')
let express = require('express')
let mysqlAPI = require('./routes/mysqlAPI')

let app = express()

app.engine('html', require('express-art-template'))

app.listen(3000, () => {
    console.log('App is listening at localhost:3000.')
})

app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/todolist', mysqlAPI)

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('*', (req, res, next) => {
    res.render('nopage.html')
})