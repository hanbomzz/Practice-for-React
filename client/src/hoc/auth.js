import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {auth} from '../_actions/user_action';

//App.js에 Route태그 element요소(페이지) : SpecificComponent
//option : 해당 페이지에 맞는 값 선택(null, true, false)
//adminRoute : 관리자 페이지, 값이 없으면 null처리
export default function (SpecificComponent, option, adminRoute = null) {

    //null  =>  아무나 출입이 가능한 페이지
    //true  =>  로그인한 유저만 출입이 가능한 페이지
    //false =>  로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            //user_action에 auth 보냄(get방식이라 parameter 없음)
            dispatch(auth()).then(response => {
                console.log(response)

                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    //로그인후 접근 가능 페이지에 접근 시도하면 로그인페이지로 보냄
                    if(option) {
                        navigate('/login');
                    }
                } else {

                    //로그인 상태
                    //isAdmin이 false인데 관리자페이지에 접근을 시도하면 첫 페이지로 보냄
                    if(adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } else {
                        //로그인한 유저는 출입 불가능한 페이지를 들어가려고 할 때 처리
                        if(option === false)
                            navigate('/')
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent /> //컴포넌트 리턴이 없으면 react 실행이 안
        )

    }

    return AuthenticationCheck //AuthenticationCheck 리턴 시 함수로 리턴하는 것이 아닌 JSX 컴포넌트로 리턴해야함
}