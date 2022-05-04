const path = require('path')
const express = require('express') 
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()

const port = 3000

const session = require('express-session');
const FileStore = require('session-file-store')(session); // 1


const db = require('./models');



const { User } = require('./models');
const { Post } = require('./models');
const { ifError } = require('assert')

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize.sync()
.then(()=>{
  console.log('db 연결 성공 ')
})
.catch(console.error);



app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' ,'ejs');


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  }));  



app.get('/', (req, res) => {// 홈페이지 접속시 세션확인  1번
    uid = req.session.user_id;
    if(uid != null) {
      
      console.log('로그인중');
      res.render("logoutpage",{id : uid});
      

    } else {
      console.log('로그인중이 아님')
      res.render('index');
    }

    
  });


var uid = ""
app.post('/login',async (req, res) => { //로그인
  const id = req.body.id;
  const pw = req.body.pw;

  const user = await db.User.findOne({ where: { id: id }})
  const userpw = await db.User.findOne({ where: { password: pw }})

  if(user && userpw == user.pw) {
    // 세션기록
    
    console.log("로그인 성공");
    //아이디 비밀번호 확인후 로그인 성공시 세션저장

    req.session.user_id = id;
    uid = req.session.user_id;
    console.log('성공' + uid);

    req.session.save(function() {
      res.redirect('/');
    });
    
  
    //req.session.id = {id:123,pw:23}
    

  } else {
    // 아이디가 없거나 비번이 틀리다고 통지
    console.log("로그인 실패");
    res.send(
      `<script>
        alert('로그인 실패');
        location.href='${'/'}';
      </script>`
    );
  }
  
})


// app.post('/logincheck', async (req, res) => {      
//   let uid = req.body.id; //로그인할때 입력한 id
//   let upw = req.body.pw; //로그인할때 입력한 pw
  
//   const ucheck = await db.User.findOne({ where: { id: req.body.id } });

//   if(uid == ucheck.id && upw == ucheck.password){
//      req.session.id = ucheck.id;
//      const sid =  req.session.id
    
//     console.log("session:" + req.session.id);
//     res.render('logout',{ 
//       path: 'views',
//       id: ucheck.id,
//       email: ucheck.email,
//       nickname: ucheck.nickname,
//       password: ucheck.password,
//       session: sid
//     });
//   }
//   else{
//     console.log('로그인 실패');
//   }
// });

app.post('/logout', (req, res) => {//로그아웃 세션삭제

  req.session.destroy(function(err) { 
    
    if(err) {
      console.log('세션삭제실패')
      return
    }
    console.log('삭제성공')
    res.redirect('/')
  })

})

// app.post('/logout', (req, res) => {//로그아웃 버튼 클릭시
//   if (req.session.id) {
//     console.log('로그아웃 처리');
//     req.session.destroy(
//         function (err) {
//             if (err) {
//                 console.log('세션 삭제시 에러');
//                 return;
//             }
//             console.log('세션 삭제 성공');
//             res.redirect('/');
//         }
//     );          //세션정보 삭제

//   } else {
//     res.redirect('/');
//   }
// });


app.get('/createform',(req, res) => { //회원가입으로 이동
  res.render('create');
});



app.post('/store', async (req, res) => { //회원가입 insert
  const id = req.body.id;
  const pw = req.body.pw;

  const user = await db.User.findOne({ where: { id: id }})
  

  if(user){ //중복 회원
    res.send(
      `<script>
        alert('이미 존재하는 회원입니다');
        location.href='${'createform'}';
      </script>`
    );
  }
  else{
    const users = await db.User.create({
        id: req.body.id,
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password
    })

    res.redirect('/');
  }
});



app.get('/post', async (req, res) => { //시퀄라이즈 select

  uid = req.session.user_id;
  if(uid){
    const list = await db.Post.findAll({});
    res.render('board', {
        path: res.locals.path, //로컬 패스는 말그대로를 의미하나요?
        data: list,
    });
  }
  else{
    res.redirect('/');
  }
});


app.get('/write', async (req, res) => { //글 작성폼
  uid = req.session.user_id
  if(uid){
   res.render('writeform');
  }
  else{
    res.redirect('/');
  }
});




app.post('/b_store', async (req, res) => {//글 작성 insert
  uid = req.session.user_id
  const posts = await db.Post.create({
      id: uid,
      title: req.body.title,
      content: req.body.content
  })
  res.redirect('/post');
});


app.get('/boardinfo/:num', async (req, res) => {//게시판글 상세보기
  uid = req.session.user_id;
  const info = await db.Post.findOne({where: {num : req.params.num}});
    res.render('boardinfo', {
      path: 'views',
      id: info.id,
      title: info.title,
      num: info.num,
      content: info.content,
      sess : uid,
  });
});

app.post('/b_delete/:num', async (req, res) => {//게시판글 삭제
  const b_list = await db.Post.destroy({where: { num : req.params.num }});
  res.redirect('/');
});



app.get('/b_updateform/:num', async (req, res) => {//게시판 수정정보 상세보기
      const info = await db.Post.findOne({where: {num : req.params.num}});
      res.render('b_updateform', {
        path: 'views',
        id: info.id,
        title: info.title,
        num: info.num,
        content: info.content,
        sess : uid,
    });
});

app.post('/b_update/:num', async (req, res) => {//게시판 수정정보 입력창
  const board = await db.Post.update({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  }, {
    where: { num: req.params.num}
  });
res.redirect('/post');
});






app.listen(port , () => console.log(`Example app listening on port ${port}!`))//서버 실행







