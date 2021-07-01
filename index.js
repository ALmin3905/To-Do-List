let express = require('express')
let mysqlAPI = require('./routes/mysqlAPI')

let app = express()

//使用art-template模板引擎
app.engine('html', require('express-art-template'))

//開始監聽3000 port
app.listen(3000, () => {
    console.log('App is listening at localhost:3000.')
})

//將public資料夾內的檔案變成靜態檔案
app.use(express.static(__dirname + '/public'))

//使用router
app.use('/todolist', mysqlAPI)

//首頁
app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('*', (req, res) => {
    res.render('nopage.html')
})