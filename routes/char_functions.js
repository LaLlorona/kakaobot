var database;
var UserSchema_char;
var UserModel;
const mongoose = require('mongoose');

var init = function(db,schema,model){

    console.log('init 호출됨');

    database = db;
    UserSchema_char = schema;
    UserModel = model;
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

var addChars = function(req,res){
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

};

var showChars = function(req,res){
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

};

module.exports.init = init;
module.exports.showChars = showChars;
module.exports.addChars=addChars;

