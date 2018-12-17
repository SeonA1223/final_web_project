var dao = require('./database.js');

/*************
회원가입
*************/

exports.checkId = function(request, response) {
  var id = request.body.id;
  dao.checkUserID(id, function(error, result) {
    if (error) {
      response.json({
        RESULT: "2"
      });
    } else if (result.length == 0) {
      response.json({
        RESULT: "1"
      });
    } else {
      response.json({
        RESULT: "0"
      });
    }
  });
};

exports.checkName = function(request, response) {
  var nname = request.body.nname;
  dao.checkNickname(nname, function(error, result) {
    if (error) {
      response.json({
        RESULT: "2"
      });
    } else if (result.length == 0) {
      response.json({
        RESULT: "1"
      });
    } else {
      response.json({
        RESULT: "0"
      });
    }
  });
};


exports.enr_signup = function(request, response) {
  var user_id = request.body.id;
  var user_pw = request.body.psw;
  var user_nickname = request.body.nname;

  dao.signup(user_id, user_pw, user_nickname, function(error, result) {
    if (error) {
    }
    else{
      response.send('<script>alert("회원가입이 완료되었습니다.");location.replace("/");</script>')
    }
  });
};


// /**********
// 로그인
// ***********/

exports.loginIdPw = function(request, response) {
  var user_id = request.body.uname;
  var user_pw = request.body.psw;
  dao.checkUserID(user_id, function(error, result) {
    if (error) {
    } else {
      if (result.length > 0) {
        if (user_pw == result[0].user_pw) {
          request.session.logined = true;
          request.session.user_id = user_id;
          request.session.user_idx = result[0].user_idx;
          response.send('<script>alert("성공적으로 로그인되었습니다."); location.replace("/");</script>')
          //response.redirect('/');
        } else {
            response.send('<script>alert("비밀번호가 정확하지 않습니다."); location.replace("/login");</script>')
        }
      } else {
        response.send('<script>alert("아이디가 존재하지 않습니다."); location.replace("/login");</script>')
      }
    }
  });
}

/**********
로그아웃
***********/
exports.logout = function(request, response) {
  request.session.logined = false;
  request.session.user_id = null;
  request.session.user_idx = null;
  response.send('<script>alert("로그아웃 되었습니다!"); location.replace("/");</script>');
};


/***********
업로드
************/

// async << 콜백 지옥 벗어나는 모듈
// async.whilst << 반복문
// async.waterfall << js의 then
// dao.test
//   dao.test1
//     dat.test2
//
// dao.test
// dao.test1
// dao.test2
//
