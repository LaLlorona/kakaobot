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

function connectDB(){
    var databaseUrl = 'mongodb://honkai3:8964coco@ds151614.mlab.com:51614/heroku_p0xkqq07';


    console.log('데이터 베이스 연결 시도중');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error',console.error.bind(console,'mongoose connection error'));

    database.on('open',function(){
        console.log('데이터 베이스에 연결되었습니다. : '+databaseUrl);

        UserSchema_memwar = mongoose.Schema({
            boss: {type: String},
            score: {type: String},
            url_info: {type: String},
            char1_comb: {type: String},
            char2_comb: {type: String},
            char3_comb: {type: String}

        });
        UserSchema_memwar.static('findbyname',function(name,callback){
            return this.find({boss:name},callback);
        });

        UserSchema_memwar.static('findAll',function(callback){
            return this.find({},callback);
        });

        UserSchema_char = mongoose.Schema({
            char_type: {type: String},
            char_name: {type: String},
            expl: {type: String},
            url_info: {type: String}

        });
        UserSchema_char.static('findbychar_type',function(name,callback){
            return this.find({char_type:name},callback);
        });

        UserSchema_char.static('findAll',function(callback){
            return this.find({},callback);
        });



        console.log('UserSchema_memwar 정의 완료');

        UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함
        console.log('UserModel 정의 완료');
    });

    database.on('disconnected',function(){
        console.log('연결이 끊겼습니다. 5초후 다시 연결합니다.');
        setInterval(connectDB,5000);
    });

}


var addUser = function(database,boss,score,url_info,char1_comb,char2_comb,char3_comb,callback){

    console.log('addUser 호출됨');

    var user = new UserModel({"boss":boss,"score":score,"url_info":url_info,"char1_comb":char1_comb,"char2_comb":char2_comb,"char3_comb":char3_comb});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("사용자 데이터 추가됨");
        callback(null,user);
    });
};

var addChar = function(database,char_type,char_name,expl,url_info,callback){

    console.log('addUser 호출됨');

    var user = new UserModel({"char_type":char_type,"char_name":char_name,'expl':expl,'url_info':url_info});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("사용자 데이터 추가됨");
        callback(null,user);
    });
};





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


apiRouter.post('/showBoss',function(req,res){
    UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함
    if(database){
        UserModel.findbyname(req.body.action.params.boss,function(err,results){
            if(err){
                console.error('리스트 조회중 에러 발생' + err.stack);
                sendMessage(res,"에러 발생");
            }

            if (results.length !=0) {  // 결과 객체 있으면 리스트 전송
                //console.dir(results);
                var res_string_list =new Array();
                var res_string ="";
                for (var i = 0; i < results.length; i++) {
                    var boss = results[i]._doc.boss;
                    var score = results[i]._doc.score;
                    var url_info = results[i]._doc.url_info;
                    var char1_comb = results[i]._doc.char1_comb;
                    var char2_comb = results[i]._doc.char2_comb;
                    var char3_comb = results[i]._doc.char3_comb;
                    res_string_list.push({"score":score,"url_info":url_info,"char1_comb":char1_comb,"char2_comb":char2_comb,"char3_comb":char3_comb});
                }
                res_string_list.sort(function(a,b){
                    return a.score< b.score ? 1 : a.score>b.score ? -1 : 0;
                });

                res_string = res_string + "기본 참고 링크\n"+ "http://gall.dcinside.com/mgallery/board/view/?id=kawai3&no=948278&exception_mode=recommend&page=1"
                res_string = res_string + "\n\n";
                for (var j =0;j<res_string_list.length;j++){
                    res_string = res_string + res_string_list[j].score+'점'+'\n'+res_string_list[j].char1_comb+'\n'+res_string_list[j].char2_comb+'\n'+res_string_list[j].char3_comb+'\n';
                    res_string = res_string + res_string_list[j].url_info + '\n' + '\n';

                }

                sendMessage(res,res_string);



            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"아직 아무도 보스 정보를 등록하지 않았어요!");
            }

        });


    }
    else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        sendMessage(res,"데이터 베이스가 죽어있어요 ㅠㅠ");
    }

});


apiRouter.post('/addBoss',function(req,res){
    UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함

    console.log(req.body);
    var body = req.body.action.params;
    var boss = body.boss;
    var score = body.score;
    var url_info = body.url_info;
    var comb1 = body.char1_comb;
    var comb2 = body.char2_comb;
    var comb3 = body.char3_comb;

    if (database) {
        addUser(database, boss,score,url_info,comb1,comb2,comb3, function(err, addedUser) {
            if (err) {throw err;}

            // 결과 객체 있으면 성공 응답 전송
            if (addedUser) {
                console.dir(addedUser);
                sendMessage(res,"보스 정보가 성공적으로 등록되었습니다!!");

            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"보스 정보 등록 실패...!");
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        sendMessage(res,"서버가 죽어있어요 ㅠㅠ 보스 정보 등록 실패...!");

    }

});


apiRouter.post('/addAbyss',function(req,res){
    UserModel = mongoose.model('abysses',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함


    console.log(req.body);
    var body = req.body.action.params;
    var boss = body.boss;
    var url_info = body.url_info;
    var comb1 = body.char1_comb;


    if (database) {
        addUser(database, boss,null,url_info,comb1,null,null, function(err, addedUser) {
            if (err) {throw err;}

            // 결과 객체 있으면 성공 응답 전송
            if (addedUser) {
                console.dir(addedUser);
                sendMessage(res,"심연 정보가 성공적으로 등록되었습니다!!");

            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"심연 정보 등록 실패...!");
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        sendMessage(res,"서버가 죽어있어요 ㅠㅠ 보스 정보 등록 실패...!");

    }

});

apiRouter.post('/addChars',function(req,res){
    UserModel = mongoose.model('chars',UserSchema_char); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함


    console.log(req.body);
    var body = req.body.action.params;
    var char_type = body.char_type;
    var char_name = body.char_name;
    var expl = body.expl;
    var url_info = body.url_info;


    if (database) {
        addChar(database, char_type,char_name,expl,url_info, function(err, addedUser) {
            if (err) {throw err;}

            // 결과 객체 있으면 성공 응답 전송
            if (addedUser) {
                console.dir(addedUser);
                sendMessage(res,"캐릭터 등록 성공 !!");

            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"캐릭터 정보 등록 실패...!");
            }
        });
    } else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        sendMessage(res,"서버가 죽어있어요 ㅠㅠ 보스 정보 등록 실패...!");

    }

});
apiRouter.post('/showAbyss',function(req,res){

    UserModel = mongoose.model('abysses',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함

    if(database){
        UserModel.findbyname(req.body.action.params.boss,function(err,results){
            if(err){
                console.error('리스트 조회중 에러 발생' + err.stack);
                sendMessage(res,"에러 발생");
            }

            if (results.length !=0) {  // 결과 객체 있으면 리스트 전송
                //console.dir(results);
                var res_string_list =new Array();
                var res_string ="";
                for (var i = 0; i < results.length; i++) {

                    var url_info = results[i]._doc.url_info; // url
                    var char1_comb = results[i]._doc.char1_comb; //description
                    res_string_list.push({"char1_comb":char1_comb,"url_info":url_info,});
                }

                for (var j =0;j<res_string_list.length;j++){
                    res_string = res_string + res_string_list[j].char1_comb + "\n"
                    res_string = res_string + res_string_list[j].url_info + '\n' + '\n';
                }

                sendMessage(res,res_string);



            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"아직 캐릭터 정보가 등록되지 않은 것 같아요!");
            }

        });


    }


});

apiRouter.post('/showChars',function(req,res){
    UserModel = mongoose.model('chars',UserSchema_char); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함

    if(database){
        UserModel.findbychar_type(req.body.action.params.char_type,function(err,results){
            if(err){
                console.error('리스트 조회중 에러 발생' + err.stack);
                sendMessage(res,"에러 발생");
            }

            if (results.length !=0) {  // 결과 객체 있으면 리스트 전송
                //console.dir(results);
                var res_string_list =new Array();
                var res_string ="";
                for (var i = 0; i < results.length; i++) {

                    var url_info = results[i]._doc.url_info; // url
                    var expl = results[i]._doc.expl; //description
                    res_string_list.push({"expl":expl,"url_info":url_info,});
                }

                for (var j =0;j<res_string_list.length;j++){
                    res_string = res_string + res_string_list[j].expl + "\n"
                    res_string = res_string + res_string_list[j].url_info + '\n' + '\n';
                }

                sendMessage(res,res_string);



            } else {  // 결과 객체가 없으면 실패 응답 전송
                sendMessage(res,"아직 캐릭터 정보가 등록되지 않은 것 같아요!");
            }

        });


    }

});

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