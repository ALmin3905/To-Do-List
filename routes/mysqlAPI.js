let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()
require('./session')(mysqlAPI)
require('dotenv').config()

mysqlAPI.use(express.urlencoded({extended: false})) //使用中間件將HTML form表單提交的數據取出

let pool = mysql.createPool({
    host        : process.env.Mysql_host,
    user        : process.env.Mysql_user,
    password    : process.env.Mysql_password,
    database    : 'todolist'
})

//連上mysql資料庫
pool.getConnection((err) =>{
    if(err) console.log(err)
    else console.log('Connecting Mysql successfully.')
})

//To-Do List的首頁，並且從資料庫查詢list，然後放入HTML
mysqlAPI.get('/', (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            connection.query(`SELECT id, msg FROM todo WHERE uid = ?`, req.session.uid || 0, (err, rows) => {
                res.render('todolist.html', { data: rows, name: req.session.user_name })
            })
            connection.release()
        })
    }
    catch(err) {
        console.log(err)
    }
})

//新增內容進資料庫
mysqlAPI.post('/post', (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            connection.query('INSERT INTO todo (uid, msg) VALUES (?, ?)', [req.session.uid || 0, req.body.text], (err) => {})
            connection.release()
        })
        res.redirect('.')
    }
    catch(err) {
        console.log(err)
    }
})

//刪除內容，以id當作要刪除的依據
mysqlAPI.post('/delete/:id', (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            connection.query('DELETE FROM todo WHERE id = ?', req.params.id, (err) => {})
            connection.release()
        })
        res.redirect('..')
    }
    catch(err) {
        console.log(err)
    }
})

//修改內容
mysqlAPI.post('/modify/:id', (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            connection.query('UPDATE todo SET msg = ? WHERE id = ?', [req.body.value, req.params.id], (err) => {})
            connection.release()
        })
        res.redirect('..')
    }
    catch(err) {
        console.log(err)
    }
})

module.exports = mysqlAPI