// 백엔드 서버 시작점
const express = require("express"); //다운 받은 express 모듈을 가져옴
const app = express(); //function을 이용해 새로운 express app을 생성
const port = 5000; //서버로 둘 포트번호 지정
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//Client에서 오는 정보를 Server에서 분석해서
//가져오는 역할을 하는데 각각 해당 파일을 분석함

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
