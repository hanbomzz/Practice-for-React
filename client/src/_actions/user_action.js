import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./types"; //action에서 reduce로 보내면 reduce는 타입을 지정해야하는데 타입만 따로 관리하도록 만듬

//Page에서 export로 값을 받아와서 해당 함수 처리함
export function loginUser(dataToSubmit) {
  //dispatch에서 전달받은 req값을 server로 보내고 로그인 처리 후 
  //해당 데이터 갖고있음 -> Server index.js 함수 리턴값 ({ loginSuccess: true, userId: user._id })
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then(response => response.data);

  //action인 request를 reducer에 넘겨주는 작업
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  //해당 데이터 갖고있음 -> Server index.js 함수 리턴값 ({ success: true })
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then(response => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  //해당 데이터 갖고있음 -> Server index.js 함수 리턴값 ({ 유저 정보 불러옴 })
  const request = axios
    .get("/api/users/auth")
    .then(response => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
