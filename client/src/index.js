import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; //리덕스에 연결시키기 위한 라이브러리
import "antd/dist/antd.min.css";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers"; // /index.js를 붙이지 않아도 자동으로 처리해줌

//function과 promise도 받을수 있도록 매개변수에 추가해서 넣어줌
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        //Redux를 좀더 편하게 사용할 수 있는 툴 (redux extension)
        //툴 다운받고 어플리케이션 연결을 위한 코드 입력
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
    >
      <App />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
