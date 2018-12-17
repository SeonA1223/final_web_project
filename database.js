var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'afglqtyp159$',
  database: 'truetrip'
});

/*
get
*/
exports.checkNickname = function(nickname, callback) {
  conn.query('SELECT * from truetrip.truetrip_users where user_nickname = ?', [nickname], function(error, result) {
    callback(error, result);
  });
};

exports.checkUserID = function(userID, callback) {
  conn.query('SELECT * from truetrip.truetrip_users where user_id = ?', [userID], function(error, result) {
    callback(error, result);
  });
};

exports.checkUserPW = function(userPW, callback) {
  conn.query('SELECT * from truetrip.truetrip_users where user_pw = ?', [userPW], function(error, result) {
    callback(error, result);
  });
};

/***************
post
***************/

exports.signup = function(userID, userPW, nickname, callback) {
  conn.query('INSERT INTO truetrip.truetrip_users (user_id, user_pw, user_nickname) VALUES(?, ?, ?)',
  [userID, userPW, nickname], function (error, result) {
        callback(error, result);
    });
};

exports.upload = function(title, content, img_path, userID, cat1, cat2, callback) {
  conn.query('INSERT INTO truetrip.truetrip_posts (post_title, post_content, post_picture_path, user_id, post_cat1, post_cat2) VALUES(?, ?, ?, ?, ?, ?)',
  [title, content, img_path, userID, cat1, cat2], function (error, result) {
        callback(error, result);
    });
};

exports.getPostListInfo = function(cat1, cat2, offset, cb) {
  offset = offset * 8;
  conn.query('select post_idx, post_title, post_hit_count, post_like_count, post_comment_count, post_picture_path from truetrip_posts where post_cat1 = ? and post_cat2 = ? limit ?, 8', [cat1, cat2, offset], cb);
}

exports.getPostListLength = function(cat1, cat2, cb) {
  conn.query('select count(*) as cnt from truetrip_posts where post_cat1 = ? and post_cat2 = ?', [cat1, cat2], cb)
}

exports.getPostInfo = function(idx, cb) {
  conn.query('select * from truetrip_posts where post_idx = ?', idx, cb);
}

exports.handleHitCount = function(pidx, cb) {
  conn.query('update truetrip_posts set post_hit_count = post_hit_count + 1 where post_idx = ?', pidx, cb)
}

exports.handleLikeCount = function(pidx, uid, cb) {
  conn.query('insert into truetrip_post_likes(user_id, post_idx) values(?, ?)', [uid, pidx], (err) => {
    if(!err){
      conn.query('update truetrip_posts set post_like_count = post_like_count + 1 where post_idx = ?', pidx);
      cb(true)
    }
    else {
      conn.query('delete from truetrip_post_likes where user_id = ? and post_idx = ?', [uid, pidx], () => {
        conn.query('update truetrip_posts set post_like_count = post_like_count - 1 where post_idx = ?', pidx);
        cb(false)
      })
    }
  })
}

exports.registerCommnet = function(pid, uid, comment, cb){
  conn.query('insert into truetrip_post_comments(post_idx, user_id, comment_content) values(?, ?, ?)', [pid, uid, comment],cb)
}

exports.getComment = function(pid, cb){
  conn.query('select * from truetrip_post_comments where post_idx = ?', pid, cb)
}

exports.deletepost = function(idx, cb) {
  conn.query('delete from truetrip_posts where post_idx = ?', idx, cb)
}
