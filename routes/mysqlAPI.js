let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()

let connection = mysql.createConnection({
    host    :'us-cdbr-east-04.cleardb.com',
    user    :'b375edcfa4c258',
    password:'1f384a41'
})

let schemas = 'heroku_b5ee5fdd85d064a'

connection.connect((err) =>{
    if(err) throw err
    else console.log('Connecting Mysql successfully.')
})

mysqlAPI.get('/', (req, res) => {
    connection.query('select id, msg from ?.todo', schemas, (err, rows) => {
        if(err) throw err
        else res.render('todolist.html', {
            data:rows
        })
    })
})

mysqlAPI.post('/post', (req, res) => {
    connection.query('insert into ?.todo (msg) values (?)', [schemas, req.body.text], (err) => {
        if(err) throw err
    })
    res.redirect('.')
})

mysqlAPI.post('/delete/:id', (req, res) => {
    connection.query('delete from ?.todo where id = ?', [schemas, req.params.id], (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

mysqlAPI.post('/modify/:id', (req, res) => {
    connection.query('update ?.todo set msg = ? where id = ?', [schemas, req.body.value, req.params.id], (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

module.exports = mysqlAPI