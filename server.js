var express = require('express');
var fs = require('fs');
var path = require('path');
var controller = require('./controller.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var dao = require('./database.js');
var app = express(); //다른사람 모듈 쓰는 거라서 그냥 이 형식으로 쓴다.
app.use(express.static(__dirname + '/public/views')); //정적파일
app.use('/:id',express.static(__dirname + '/public/views'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

app.use(logger('dev'));
app.use(session({
  secret: '##@%SA#%&&!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 *1000
  }
}));

app.use(cookieParser());
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

app.get('/', function(req, res) {
  var login = req.session.logined;
  var userid = req.session.user_id;
  console.log(req.session.logined);
  res.render('ttmain.ejs', {
    login: login,
    userid: userid
  });
});

app.get('/login', function(req, res) {
  res.render('about.ejs');
});

app.get('/upload', function(req, res) {
  res.render('upload.ejs');
});
app.get('/showpost/:idx', function(req, res){
  var idx = req.params.idx;

  dao.getPostInfo(idx, (err, result) => {
    let imagebytes = fs.readFileSync(path.join(__dirname, 'public', 'views', 'photo', result[0].post_cat1, result[0].post_cat2, result[0].post_picture_path.split('/')[5]));
    result[0].post_picture = new Buffer(imagebytes).toString('base64');

    dao.getComment(idx, (err, comments) => {
      res.render('showpost.ejs', {info: result[0], comments: comments});
    })
    dao.handleHitCount(idx);
  })

});

app.post('/newcomment', (req, res) => {
  var pid = req.body.pid
  var uid = req.session.user_id
  var comment = req.body.comment

  console.log('데이터',pid, uid, comment)

  dao.registerCommnet(pid, uid, comment, (err, rows) => {
    res.redirect('/showpost/' + pid)
  })
})

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/views/photo/' + req.body.cat1 + '/' + req.body.cat2 + '/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})

var upload = multer({
  storage: storage
})

app.post('/upload', upload.single('myFile'), function(req, res){

  var title = req.body.title;
  var content = req.body.content;
  var img_path = req.file.destination + req.file.filename;
  var userID = req.session.user_id;
  var cat1 = req.body.cat1;
  var cat2 = req.body.cat2;

  dao.upload(title, content, img_path, userID, cat1, cat2, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("업로드 성공하였습니다");
      res.send('<script>alert("업로드 성공하였습니다.");location.replace("/")</script>');
    }
  });
});

app.get('/api/getPostListInfo/:cat1/:cat2/:offset', (req, res) => {
  var cat1 = req.params.cat1;
  var cat2 = req.params.cat2;
  var offset = req.params.offset;

  dao.getPostListInfo(cat1, cat2, offset, (err, lists) => {
    for(let i = 0; i < lists.length; i++){
      if(fs.existsSync(path.join(__dirname, 'public', 'views', 'photo', cat1, cat2, lists[i].post_picture_path.split('/')[5]))){
        let imagebytes = fs.readFileSync(path.join(__dirname, 'public', 'views', 'photo', cat1, cat2, lists[i].post_picture_path.split('/')[5]));
        lists[i].post_picture = new Buffer(imagebytes).toString('base64');
      }
    }
    dao.getPostListLength(cat1, cat2, (err, [length]) => {

      res.json({lists, length});
    })
  })
})

app.get('/api/handleLike/:idx', (req, res) => {
  var idx = req.params.idx
  var uid = req.session.user_id

  dao.handleLikeCount(idx, uid, (result) => {
    if(result == true){
      res.send(true);
    }
    else {
      res.send(false);
    }

  })
})

app.get('/deletepost/:idx', function(req, res) {
  var idx = req.params.idx;

  dao.deletepost(idx, () => {
    res.send("<script>location.href = '/'</script>")
  })
})

app.get('/signup', function(req, res) {
  res.render('service.ejs');
});

app.post('/signup_checkId', controller.checkId);

app.post('/signup_checkName', controller.checkName);

app.post('/signup', controller.enr_signup);


app.post('/login', controller.loginIdPw);

app.get('/logout', controller.logout);

app.listen(3000, function() {
  console.log('connected 3000 port!');
});
