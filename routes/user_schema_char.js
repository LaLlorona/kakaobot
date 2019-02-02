var Schema ={};

Schema.createSchema = function(mongoose){



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

    console.log("스키마 모듈로 정의함.");
    return UserSchema_char
};

module.exports = Schema;