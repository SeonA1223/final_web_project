exports.user = function(id, pw, nickname, callback){
  var user = {};
  user.id = id;
  user.pw = pw;
  user.nickname = nickname;
  callback(null, user);
  };
