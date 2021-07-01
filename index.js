const { Router } = require('express')
let express = require('express')
let mysqlAPI = require('./routes/mysqlAPI')

let app = express()

//使用art-template模板引擎
app.engine('html', require('express-art-template'))

//開始監聽，由於server運行不知道會接上哪個port，所以要用"process.env.PORT"來設定
let port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`App is listening at port ${port}.`)
})

//將public資料夾內的檔案變成靜態檔案
app.use(express.static(__dirname + '/public'))

//使用router
app.use('/todolist', mysqlAPI)

//首頁
app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('*', (req, res, next) => {
    res.render('nopage.html')
})