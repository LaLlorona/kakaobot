const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const logger = require('morgan');


const bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , static = require('serve-static')
    , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
const expressSession = require('express-session');

// mongoose 모듈 사용
const mongoose = require('mongoose');


var port = process.env.PORT || 8000;

const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

// cookie-parser 설정
app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
var database;
var UserSchema_memwar;
var UserSchema_char;
var UserModel;

var user_schema_memwar = require('./routes/user_schema_memwar');
var user_schema_char = require('./routes/user_schema_char');
var boss_funtions = require('./routes/boss_functions');
var char_functions = require('./routes/char_functions');
var abyss_functions = require('./routes/abyss_functions');

function connectDB(){
    var databaseUrl = 'mongodb://honkai3:8964coco@ds151614.mlab.com:51614/heroku_p0xkqq07';


    console.log('데이터 베이스 연결 시도중');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error',console.error.bind(console,'mongoose connection error'));

    database.on('open',function(){
        console.log('데이터 베이스에 연결되었습니다. : '+databaseUrl);


        UserSchema_memwar = user_schema_memwar.createSchema(mongoose);
        UserSchema_char = user_schema_char.createSchema(mongoose);



        console.log('UserSchema_memwar 정의 완료');

        UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함
        console.log('UserModel 정의 완료');
        boss_funtions.init(database,UserSchema_memwar,UserModel);
        abyss_functions.init(database,UserSchema_memwar,UserModel);
        char_functions.init(database,UserSchema_char,UserModel);

    });

    database.on('disconnected',function(){
        console.log('연결이 끊겼습니다. 5초후 다시 연결합니다.');
        setInterval(connectDB,5000);
    });

}


var sendMessage = function(res,message){
    const responseBody =
        {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: message
                        }
                    }
                ]
            }
        };
    res.status(200).send(responseBody);
};


app.use('/api', apiRouter);


apiRouter.post('/showBoss',boss_funtions.showBoss);
apiRouter.post('/addBoss',boss_funtions.addBoss);

apiRouter.post('/showAbyss',abyss_functions.showAbyss);
apiRouter.post('/addAbyss',abyss_functions.addAbyss);

apiRouter.post('/showChars',char_functions.showChars);
apiRouter.post('/addChars',char_functions.addChars);

process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
    console.log("express 서버 객체가 종료됩니다.");
    if (database) {
        database.close();
    }
});

app.listen(port, function() {
    console.log('Example skill server listening on port 8000!');
    connectDB();
});