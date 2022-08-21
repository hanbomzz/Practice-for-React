//reducer의 역할이 바뀐 state 값을 return 해주는 건데 store안에 많은 reducer가 존재함
//그 reducer들을 하나의 root로 합쳐주는 역할을 해줌
import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
