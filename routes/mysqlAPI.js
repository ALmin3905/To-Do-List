let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()

let pool = mysql.createPool({
    host    :'us-cdbr-east-04.cleardb.com',
    user    :'b375edcfa4c258',
    password:'1f384a41',
})

let schemas = 'heroku_b5ee5fdd85d064a'

mysqlAPI.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log("連線失敗")
            console.log("錯誤資訊:" + err)
        }
        else
        {
            connection.query(`select id, msg from ${schemas}.todo`, (err, rows) => {
                if(err) {
                    console.log("查詢失敗")
                    console.log("錯誤資訊:" + err)
                }
                else {
                    res.render('todolist.html', {data:rows})
                }
            })
        }
        connection.release()
    })
})

mysqlAPI.post('/post', (req, res) => {
    connection.query(`insert into  ${schemas}.todo (msg) values (?)`, req.body.text, (err) => {
        if(err) throw err
    })
    res.redirect('.')
})

mysqlAPI.post('/delete/:id', (req, res) => {
    connection.query(`delete from  ${schemas}.todo where id = ?`, req.params.id, (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

mysqlAPI.post('/modify/:id', (req, res) => {
    connection.query(`update  ${schemas}.todo set msg = ? where id = ?`, [req.body.value, req.params.id], (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

module.exports = mysqlAPI