import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function UserRegister(){

    const [passwordRepeat,setPasswordRepeat]=React.useState(false);
    const [accountAlreadyExisted, setAccountAlreadyExisted]=React.useState(false);
    const [tooLong, setTooLong]=React.useState(false);
    const navigate=useNavigate();

    


    async function onFinish(e){
        if(e.repeat_password===e.password&&e.password.length<24&&e.repeat_password.length<24&&e.username.length<24){

            const code = await axios({
                headers:{
                    "Content-Type": "application/json"
                },
                method: "POST",
                url: 'http://47.251.46.15/users/register',
                data: {
                    username: e.username,
                    password: e.password,
                }
            })

            if(code.data.code!==200){
                setAccountAlreadyExisted(true);

            }
            else{
                navigate("../login")
            }

        }
        else if(e.repeat_password!==e.password){
            setPasswordRepeat(true);
        }
        else{
            setTooLong(true)
        }
    }


    function login(){
        navigate("../login")

    }

    function onFinishFailed(){

    }

    const warnStyle={
        color: "red"
    }



    const loginStyle={
        backgroundColor: "rgba(47, 255, 47, 0.568)",
        margin: "20px"
    }


    return(
        <div className="registerPage">
            <h2 className='registerText'>Register A New Account</h2>
            {accountAlreadyExisted &&<h3 style={warnStyle}>Username Already Exist</h3>}
            {passwordRepeat && <h4 style={warnStyle}>The repeat password do not match with your password</h4>}
            {tooLong && <h4 style={warnStyle}>Username, Password and repeat_password should within 24 characters</h4>}
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
                <Form.Item
                    name="repeat_password"
                    rules={[
                    {
                        required: true,
                        message: 'Please repeat your Password!',
                    },
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Repeat_Password"
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
                    Register
                    </Button>
                    Or <a onClick={login}>log in now!</a>
                </Form.Item>
            </Form>

        </div>

      );

}