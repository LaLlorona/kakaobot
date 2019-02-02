var Schema ={};

Schema.createSchema = function(mongoose){



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

    console.log("스키마 모듈로 정의함.");
    return UserSchema_memwar
};

module.exports = Schema;