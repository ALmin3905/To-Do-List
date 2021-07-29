let session = require('express-session')            // session
let redisClient = require('redis').createClient(process.env.REDIS_URL)   // 建立redis資料庫的連線
let redisStore = require('connect-redis')(session)  // 引入session與redis連接的方法

// 連線失敗
redisClient.on('error', (err) => {
    console.log('could not establish a connection with redis. ' + err);
})

// 使用session中間件，搭配redis資料庫做儲存，然後變成一個模型方便各個routers使用
module.exports = function(app) {
    app.use(session({
        secret              : 'session',
        store               : new redisStore({ client: redisClient }),
        resave              : false,
        saveUninitialized   : true
    }))
}

// 查詢session儲存在redis裡面的方法
// redisClient.get(`sess:${req.session.id}`, (err, data) => {
//     console.log('session data in redis:', data)
// })