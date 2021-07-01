let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()

//由於req中不會含有json檔，所以註解掉了
//mysqlAPI.use(express.json())

//使用中間件將HTML form表單提交的數據取出
mysqlAPI.use(express.urlencoded({extended: false}))

//設定連線mysql資料庫的資訊
let connection = mysql.createConnection({
    host    :'localhost',
    user    :'root',
    password:'root'
})

//連上mysql資料庫
connection.connect((err) =>{
    if(err) throw err
    else console.log('Connecting Mysql successfully.')
})

//To-Do List的首頁，並且從資料庫查詢list，然後放入HTML
mysqlAPI.get('/', (req, res) => {
    connection.query(`select id, msg from todolist.todo`, (err, rows) => {
        if(err) throw err
        else res.render('todolist.html', {
            data:rows
        })
    })
})

//新增內容進資料庫
mysqlAPI.post('/post', (req, res) => {
    connection.query('insert into todolist.todo (msg) values (?)', req.body.text, (err) => {
        if(err) throw err
    })
    res.redirect('.')
})

//刪除內容，以id當作要刪除的依據
mysqlAPI.post('/delete/:id', (req, res) => {
    connection.query('delete from todolist.todo where id = ?', req.params.id, (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

//修改內容
mysqlAPI.post('/modify/:id', (req, res) => {
    connection.query('update todolist.todo set msg = ? where id = ?', [req.body.value, req.params.id], (err) => {
        if(err) throw err
    })
    res.redirect('..')
})

module.exports = mysqlAPI