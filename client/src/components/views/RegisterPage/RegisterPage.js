import React, { useState } from "react";
import { useDispatch } from "react-redux"; //dispatch를 이용해 action을 취할 것
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../_actions/user_action";
import Auth from '../../../hoc/auth'

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };
  const onSubmitHandler = (event) => {
    event.preventDefault(); //새로고침을 방지하고 작업 진행을 위해 설정함

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };
    //user_action에 body 객체 전달
    dispatch(registerUser(body)).then(response => {
      if (response.payload.success) {
        navigate('/login'); //성공하면 LoginPage로 이동(App.js에서 Router를 이용해서 경로 설정을 해놨기 때문에 가능)
      } else {
        alert("Error");
      } 
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}></input>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler}></input>
        <label>Password</label>
        <input
          type="password"
          value={Password}
          onChange={onPasswordHandler}
        ></input>
        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        ></input>
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}

//auth 관련 wrapping 설정 (v6부터는 App.js 설정이 안되어서 각 페이지마다 넣어줌)
export default Auth(RegisterPage, false); 
                            

