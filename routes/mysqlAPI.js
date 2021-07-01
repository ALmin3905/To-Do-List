let express = require('express')
let mysql = require('mysql2')
let mysqlAPI = express.Router()

//由於req中不會含有json檔，所以註解掉了
//mysqlAPI.use(express.json())

//使用中間件將HTML form表單提交的數據取出
mysqlAPI.use(express.urlencoded({extended: false}))

//雲端資料庫不能一直保持連線，所以改用pool，需要使用時才連線。
let pool = mysql.createPool({
    host    :'us-cdbr-east-04.cleardb.com',
    user    :'b375edcfa4c258',
    password:'1f384a41',
    database:'heroku_b5ee5fdd85d064a'
})

//To-Do List的首頁，並且從資料庫查詢list，然後放入HTML
mysqlAPI.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log("連線失敗!!")
            console.log("錯誤資訊:" + err)
        }
        else
        {
            connection.query('select id, msg from todo', (err, rows) => {
                if(err) {
                    console.log("查詢失敗!!")
                    console.log("錯誤資訊:" + err)
                }
                else {
                    res.render('todolist.html', {data:rows})
                }
            })
            connection.release()
        }
    })
})

//新增內容進資料庫
mysqlAPI.post('/post', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log("連線失敗!!")
            console.log("錯誤資訊:" + err)
        }
        else
        {
            connection.query('insert into todo (msg) values (?)', req.body.text, (err) => {
                if(err) {
                    console.log("新增失敗!!")
                    console.log("錯誤資訊:" + err)
                }
                else {
                    res.redirect('.')
                }
            })
            connection.release()
        }
    })
})

//刪除內容，以id當作要刪除的依據
mysqlAPI.post('/delete/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log("連線失敗!!")
            console.log("錯誤資訊:" + err)
        }
        else
        {
            connection.query('delete from todo where id = ?', req.params.id, (err) => {
                if(err) {
                    console.log("刪除失敗!!")
                    console.log("錯誤資訊:" + err)
                }
                else {
                    res.redirect('..')
                }
            })
            connection.release()
        }
    })
})

//修改內容
mysqlAPI.post('/modify/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log("連線失敗!!")
            console.log("錯誤資訊:" + err)
        }
        else
        {
            connection.query('update todo set msg = ? where id = ?', [req.body.value, req.params.id], (err) => {
                if(err) {
                    console.log("更新失敗!!")
                    console.log("錯誤資訊:" + err)
                }
                else {
                    res.redirect('..')
                }
            })
            connection.release()
        }
    })
})

module.exports = mysqlAPI
