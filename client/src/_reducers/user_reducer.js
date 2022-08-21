import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

//변경전 state와 user_action에서 전달받은 action 값으로 변경된 state return 해줌
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      
    //action.payload -> Server index.js 함수 리턴값 ({ loginSuccess: true, userId: user._id })
    return { ...state, userSuccess: action.payload }; 

    case REGISTER_USER:
      
    //action.payload -> Server index.js 함수 리턴값 ({ success: true })
    return { ...state, registerSuccess: action.payload };

    case AUTH_USER:
      
    //action.payload -> Server index.js 함수 리턴값 ({ 유저 정보 불러옴 })
    return { ...state, userData: action.payload };
      

    default:
      return state;
  }
}