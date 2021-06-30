let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()

let connection = mysql.createConnection({
    host    :'localhost',
    user    :'root',
    password:'root'
})

let path

connection.connect((err) =>{
    if(err) throw err
    else console.log('Connecting Mysql successfully.')
})

mysqlAPI.get('/', (req, res) => {
    connection.query('select id, msg from todolist.todo', (err, rows) => {
        if(err) throw err
        else res.render('todolist.html', {
            data:rows
        })
    })
})

mysqlAPI.post('/post', (req, res) => {
    connection.query('insert into todolist.todo (msg) values (?)', req.body.text, (err) => {
        if(err) throw err
    })
    res.redirect('.')
})

mysqlAPI.post('/delete/:id', (req, res) => {
    connection.query('delete from todolist.todo where id = ?', req.params.id, (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

mysqlAPI.post('/modify/:id', (req, res) => {
    connection.query('update todolist.todo set msg = ? where id = ?', [req.body.value, req.params.id], (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

module.exports = mysqlAPI