const { User } = require("../models/User");

//인증 처리를 하는곳
let auth = (req, res, next) => {
  //클라이언트 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  //토큰을 decode(복호화)한후 유저를 찾는다 (secretToken->user._id (decode)  <-> user._id->secretToken (encode))
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); //실행다하고 갇히지 않게 내보내줌
  });
};

module.exports = { auth };
