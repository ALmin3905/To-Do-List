let express = require('express')
let bcrypt = require('bcrypt')                       // hash function
let loginAPI = express.Router()
require('./session')(loginAPI)

loginAPI.use(express.urlencoded({extended: false})) //中間件，撈取表單POST內容

let mysql = require('mysql2')                       // 建立mysql資料庫的連線池
let pool = mysql.createPool({
    host        : process.env.Mysql_host,
    user        : process.env.Mysql_user,
    password    : process.env.Mysql_password,
    database    : 'nodejs_user'
})

// 首頁，如果保持登入狀態就進留言板，若無就進登入頁面
loginAPI.get('/', (req, res) => {
    if(req.session.user_name && req.session.user_password) res.render('logout.html', { name: req.session.user_name })
    else res.render('login.html', { errInfo: req.query.errInfo })
})

// 登入
loginAPI.post('/login', (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            let name = req.body.user_name
            let password = req.body.user_password

            // 查詢帳號是否存在
            connection.query('SELECT * FROM userinfo WHERE user_name = (?)', name, (err, rows) => {
                if(rows[0]) {
                    if(bcrypt.compareSync(password, rows[0].user_password)) {  // 帳號存在就驗證密碼，若有就存進session，然後跳回首頁
                        req.session.uid = rows[0].id
                        req.session.user_name = name
                        req.session.user_password = rows[0].user_password
                        res.redirect('.')
                    }
                    else {
                        res.redirect('.?errInfo=密碼錯誤，請重新輸入!')
                    }
                }
                else {
                    res.redirect('.?errInfo=無此帳號，請重新輸入!')
                }
            })

            connection.release()
        })
    }
    catch(err) {
        console.log(err)
    }
})

// 登出
loginAPI.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('.')
})

// 註冊主頁
loginAPI.get('/signup', (req, res) => {
    if(req.query.isSuccessful == '0') res.render('signup.html', { isSuccessful: false })
    else res.render('signup.html', { isSuccessful: true })
})

// 註冊
loginAPI.post('/signup/create', (req, res) => {
    let name = req.body.user_name
    let password = req.body.user_password

    try {
        pool.getConnection((err, connection) => {
            // 查詢是否存在user name
            connection.query('SELECT user_name FROM userinfo WHERE user_name = (?)', name, (err, rows) => {

                // 如果存在就返回註冊主頁，否則hash密碼後存入資料庫
                if(rows[0]) res.redirect('.?isSuccessful=0')
                else {
                    let hash_password = bcrypt.hashSync(password, 2) //hash密碼
                    connection.query('INSERT INTO userinfo (user_name, user_password) VALUES (?, ?)', [name, hash_password])

                    // 將資料加進session
                    req.body.session.user_name = name
                    req.body.session.user_password = hash_password

                    res.redirect('/user')   // 回到user主頁
                }
            })

            connection.release()
        })
    }
    catch(err) {
        console.log(err)
    }
})

module.exports = loginAPI