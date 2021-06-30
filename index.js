const { Router } = require('express')
let express = require('express')
let mysqlAPI = require('./routes/mysqlAPI')

let app = express()

app.engine('html', require('express-art-template'))

let port = process.env.port || 3000
app.listen(port, () => {
    console.log('App is listening.')
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