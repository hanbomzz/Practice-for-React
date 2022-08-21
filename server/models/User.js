const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //비번 암호화를 위한 라이브러리
const saltRounds = 10; //salt 생성을 위함, salt자릿수를 의미
const jwt = require("jsonwebtoken"); //토큰 생성을 위한 라이브러리

//model : schema를 감싸주는 역할, schema : 구조
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//user.save가 되기 전에 비밀번호 암호화 함수 실행
userSchema.pre("save", function (next) {
  var user = this; //user안에 req.body로 정보가 들어있는 상태여서
  //userSchema의 password를 가져오면됨

  //user의 password가 변경될때만 암호화 해줌
  if (user.isModified("password")) {
    //암호화를 위한 salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); //err시에 index.js 쪽으로 다시 보내줌

      //user.password - 암호화전 비번
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; //암호화된 비번으로 변경
        user.salt = salt; //plainPassword와 암호화비번 비교할때 사용하기 위해 저장(김용호 선임님 추가해주심)
        next(); //index.js쪽으로 반환됨
      });
    });
  } else {
    next(); //password 변경이 아닐때 바로 이동
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword: 1234111(요청받은 req.body.password)  암호화된 패스워드: $2b$10$7V19AoHAM4NR7BH6agb2vencXYOyDzzZ1t3kfu84WZIcJQ4gLGT7G
  //this.password userSchema에서 가져온 암호화된 비밀번호 정보

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err); //비밀번호가 같지않을시 콜백 err 리턴
    cb(null, isMatch); //비밀번호가 같다면 err는 null, isMatch(true)
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebtoken을 이용해서 token 생성
  //payload는 string 형식이어야 하기때문에 형변환해준것
  //toHexString() : ObjectID 형태의 id를 24바이트의 hex 문자열로 바꾸어 리턴해주는 함수
  // user._id + 'secretToken' = token -> 'secretToken' = user._id
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token; //user 에 생성된 token 삽입
  user.save(function (err, user) {
    //user 저장
    if (err) return cb(err);
    cb(null, user); //user정보 반환
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode한다
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //Client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
