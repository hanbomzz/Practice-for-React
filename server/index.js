// 백엔드 서버 시작점
const express = require("express"); //다운 받은 express 모듈을 가져옴
const app = express(); //function을 이용해 새로운 express app을 생성
const port = 5000; //서버로 둘 포트번호 지정
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth"); //토큰을 이용한 인증 처리를 위함
const { User } = require("./models/User");

//Client에서 오는 정보를 Server에서 분석해서
//가져오는 역할을 하는데 각각 해당 파일을 분석함

//사용할 수 있도록 app.use 해줌

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//cliet(LandingPage.js)에서 req를 받아 res 보내줌
app.get('/api/hello', (req,res) =>{
  res.send("안녕하세요")
})

app.post("/api/users/register", (req, res) => {
  //회원 가입 할때 필요한 정보들을 Client에서 가져와 DB에 삽입함
  const user = new User(req.body); //bodyParser을 이용해 json형식으로 된 정보 파싱 후 req.body에 삽입됨
  //save - 몽고DB관련 메소드 user.save() -> user 모델에 req.body 정보가 저장됨
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  //User 객체를 DB에서 가져옴 -> User 객체 생성
  //요청된 이메일을 DB에서 찾기 (findOne : 몽고DB 메소드)
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }

    //req.body.password = plainPassword
    //이메일이 존재하면 비밀번호 확인
    console.log(req.body);
    user.comparePassword(req.body.password, (err, isMatch) => {
      //User.js의 메소드 실행 후 결과값 들어옴
      console.log(err);
      console.log(isMatch);

      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });

      //비밀번호도 맞으면 토큰 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        //토큰을 쿠키에 저장(쿠키, 로컬스토리지 등 여러가지 방법이 있다)
        return res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//auth기능 만들기
//매개변수의 auth - 미들웨어 endpoint에서 req를 받은 다음 cb실행 전 중간작업
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는것
  //이렇게 정보를 주면 어떤 페이지에서든 정보를 이용할 수 있어서 편해짐
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//로그아웃 기능 token을 지워줌
//endpoint 접속때는 로그인 상태기 때문에 auth 미들웨어로 적용
//(req, res) 순서 바뀌면 에러남
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
