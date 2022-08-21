import React,{useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //양식이 제출되거나 특정 event가 발생할 때,  url을 조작할 수 있는 interface를 제공
import Auth from '../../../hoc/auth'

function LandingPage() {
    const navigate = useNavigate();
    //페이지 열리면 바로 실행됨 get request를 server(index.js)에 보냄
    //브라우저, Node.js를 위한 Promise API를 활용하는 HTTP 비동기 통신 라이브러리 
    //백엔드랑 프론트엔드랑 통신을 쉽게하기 위해 Ajax와 더불어 사용하며 Ajax보다 발전된 통신 라이브러리이
    useEffect(() => {
      axios.get('/api/hello')
      .then(response => console.log(response.data))
    }, []) //한번만 실행

    //server에 get방식으로 보내서 true값 받으면 로그인창
    const onClickHandler = () => {
      axios.get('/api/users/logout')
      .then(response => {
        if(response.data.success) {
          navigate("/login")
        } else {
          alert("로그아웃에 실패했습니다.")
        }
      })
    }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height:'100vh'}}>
        <h2>Start Page</h2>

        <button onClick={onClickHandler}>LogOut</button>
      </div>
  )
}

//auth 관련 wrapping 설정 (v6부터는 App.js 설정이 안되어서 각 페이지마다 넣어줌)
export default Auth(LandingPage, null)