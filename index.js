// 백엔드 서버 시작점
const express = require("express"); //다운 받은 express 모듈을 가져옴
const app = express(); //function을 이용해 새로운 express app을 생성
const port = 5000; //서버로 둘 포트번호 지정

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://hanbomzz:rw41333549!@monggodb.jq7tuy9.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
