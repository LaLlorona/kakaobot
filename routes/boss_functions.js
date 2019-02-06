var database;
var UserSchema_memwar;
var UserModel;
const blockidList1 = "5c5af3bd5f38dd5839234cd3";
const blockidList2 = "5c5af3c75f38dd5839234cd5";
const blockidShowBoss = "5c5af3e85f38dd5839234cd7";

const mongoose = require('mongoose');


var init = function(db,schema,model){

    console.log('init 호출됨');

    database = db;
    UserSchema_memwar = schema;
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

var showBoss = function(req,res){
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

                //res_string = res_string + "기본 참고 링크\n"+ "http://gall.dcinside.com/mgallery/board/view/?id=kawai3&no=948278&exception_mode=recommend&page=1"
                //res_string = res_string + "\n\n";
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

};

var showBossList1 = function(req,res){
  const responseBody={
      "version": "2.0",
      "template": {
          outputs: [
              {
                  simpleText: {
                      text: "기억전장 보스를 골라주세요."
                  }
              }
          ],
          "quickReplies": [
              {
                  "label": "율자",
                  "action": "block",
                  "messageText": "율자 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "율자"
                  }
              },
              {
                  "label": "호무천왕",
                  "action": "block",
                  "messageText": "호무천왕 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "호무천왕"
                  }
              },
              {
                  "label": "비옥환",
                  "action": "block",
                  "messageText": "비옥환 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "비옥환"
                  }
              },
              {
                  "label": "베나레스",
                  "action": "block",
                  "messageText": "베나레스 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "베나레스"
                  }
              },
              {
                  "label": "지장어혼",
                  "action": "block",
                  "messageText": "지장어혼 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "지장어혼"
                  }
              },
              {
                  "label": "저주받은 영령",
                  "action": "block",
                  "messageText": "저주받은 영령를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "영령"
                  }
              },
              {
                  "label": "월륜",
                  "action": "block",
                  "messageText": "월륜 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "월륜"
                  }
              },
              {
                  "label": "아슈빈",
                  "action": "block",
                  "messageText": "아슈빈 정보를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "아슈빈"
                  }
              },
              {
                  "label": "인멸침령",
                  "action": "block",
                  "messageText": "인멸침령를 보고싶어요",
                  "blockId": blockidShowBoss,
                  "extra": {
                      "boss": "침령"
                  }
              },
              {
                  "label": "다음으로",
                  "action": "block",
                  "messageText": "다른 보스를 보고 싶어요",
                  "blockId": blockidList2,

              }


          ]
      }
  }
  res.status(200).send(responseBody);
};

var showBossList2 = function(req,res){
    const responseBody={
        "version": "2.0",
        "template": {
            outputs: [
                {
                    simpleText: {
                        text: "기억전장 보스를 골라주세요."
                    }
                }
            ],
            "quickReplies": [
                {
                    "label": "갓파더",
                    "action": "block",
                    "messageText": "갓파더 정보를 보고싶어요",
                    "blockId": blockidShowBoss,
                    "extra": {
                        "boss": "갓파더"
                    }
                },
                {
                    "label": "rpc",
                    "action": "block",
                    "messageText": "rpc 정보를 보고싶어요",
                    "blockId": blockidShowBoss,
                    "extra": {
                        "boss": "rpc"
                    }
                },
                {
                    "label": "파르바티",
                    "action": "block",
                    "messageText": "파르바티 정보를 보고싶어요",
                    "blockId": blockidShowBoss,
                    "extra": {
                        "boss": "파르바티"
                    }
                },
                {
                    "label": "흑헌원",
                    "action": "block",
                    "messageText": "흑헌원 정보를 보고싶어요",
                    "blockId": blockidShowBoss,
                    "extra": {
                        "boss": "흑헌원"
                    }
                },
                {
                    "label": "카렌",
                    "action": "block",
                    "messageText": "카렌 정보를 보고싶어요",
                    "blockId": blockidShowBoss,
                    "extra": {
                        "boss": "카렌"
                    }
                },

                {
                    "label": "이전으로",
                    "action": "block",
                    "messageText": "이전 보스를 보고 싶어요",
                    "blockId": blockidList1,

                }


            ]
        }
    }
    res.status(200).send(responseBody);
};

var showBoss2 = function(req,res){
    UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함
    console.log(req.body.action.clientExtra.boss);

    if(database){
        UserModel.findbyname(req.body.action.clientExtra.boss,function(err,results){
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

                //res_string = res_string + "기본 참고 링크\n"+ "http://gall.dcinside.com/mgallery/board/view/?id=kawai3&no=948278&exception_mode=recommend&page=1"
                //res_string = res_string + "\n\n";
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

};

var showBoss_closer = function(req,res){
    UserModel = mongoose.model('users',UserSchema_memwar); //UserModel 이라는 변수에 UserSchema_memwar 를 사용하는 'user' 라는 이름의 db connect 함

    if(database){
        UserModel.findbyname(req.body.boss,function(err,results){
            if(err){
                console.error('리스트 조회중 에러 발생' + err.stack);
                res.status(200).send("에러 발생");
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

                //res_string = res_string + "기본 참고 링크\n"+ "http://gall.dcinside.com/mgallery/board/view/?id=kawai3&no=948278&exception_mode=recommend&page=1"
                //res_string = res_string + "\n\n";
                for (var j =0;j<res_string_list.length;j++){
                    res_string = res_string + res_string_list[j].score+'점'+'\n'+res_string_list[j].char1_comb+'\n'+res_string_list[j].char2_comb+'\n'+res_string_list[j].char3_comb+'\n';
                    res_string = res_string + res_string_list[j].url_info + '\n' + '\n';

                }
                res.status(200).send(res_string);





            } else {  // 결과 객체가 없으면 실패 응답 전송
                res.status(200).send("아직 아무도 보스 정보를 등록하지 않았어요!");
            }

        });


    }
    else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        sendMessage(res,"데이터 베이스가 죽어있어요 ㅠㅠ");
    }

};

var addBoss = function(req,res){
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

};
module.exports.init = init;
module.exports.addUser = addUser;
module.exports.showBoss = showBoss;
module.exports.addBoss=addBoss;
module.exports.showBoss_closer = showBoss_closer;
module.exports.showBossList1 = showBossList1;
module.exports.showBossList2 = showBossList2;
module.exports.showBoss2 = showBoss2;


