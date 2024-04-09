import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch, useSelector} from 'react-redux';
import { saveUserName } from '../store/slice/UserSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from "../store/slice/UserSlice"

export default function UserLogin(){

    const [incorrect,setIncorrect]=React.useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const token=useSelector((state)=>{return state.user.loginin_user});

    React.useEffect(()=>{
        
        if(token.length>0){
            navigate("../");
        }

    },[token]);

    async function getUserInfo(token){
        await axios({
            headers: {
                "Content-Type": "application/json",
                'Authorization': token
            },
            url: 'http://47.251.46.15/users',
            method: "GET",
            data: {

            }
        }).then((data)=>{
            dispatch(saveUserName(data.data.data.uid));

        })
    }

    async function onFinish(e){
        const code = await axios({
            headers: {
                "Content-Type": "application/json"
            },
            url: 'http://47.251.46.15/users/login',
            method: "POST",
            data: {
                username: e.username,
                password: e.password,
            }
        })

        if(code.data.code===200){
            dispatch(login(code.data));
            getUserInfo(code.data.data);
            navigate("../");
        }
        else{
            setIncorrect(true);

        }
    }

    function gotoGegister(){
        navigate("../register")

    }


    function onFinishFailed(){

    }
    const warnStyle={
        color: "red"
    }

    const registerStyle={
        backgroundColor: "rgba(47, 255, 47, 0.568)",
        margin: "20px"
    }
    
    return  (
        <div className='loginPage'>
            <h2 className='loginText'>Login</h2>
            {incorrect &&<h4 style={warnStyle}>The username or password is incorrent</h4>}
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                >
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    {/*<a className="login-form-forgot" href="">
                    Forgot password
                    </a>*/}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    Or <a onClick={gotoGegister}>register now!</a>
                </Form.Item>
            </Form>



        </div>
);

}

