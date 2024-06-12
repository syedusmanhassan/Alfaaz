import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';

import AlfaazLogo from "../../assets/icon.png";
import "../Login/Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dutuwkw/endpoint/Login', {
                email,
                password
            });

            if (response.data.success) {
                console.log('Login successful');
                // Store email and password in localStorage
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                navigate('/'); // Navigate to layout page after successful login
            } else {
                console.log('Login failed');
                window.alert('Login failed: Incorrect email or password');
            }
        } catch (error) {
            console.error('Error logging in', error);
            window.alert('An error occurred during login. Please try again.');
        }
    };

    return (
        <section className='loginSection'>
            <Container className='loginContainer'>
                <Row>
                    <Col sm={12} className='imgCollogin'>
                        <img src={AlfaazLogo} className='iconimg' alt='Logo' />
                    </Col>
                    <Col sm={12} className='loginInputCol'>
                        <h3 className='loginh3'>Welcome, Sign in</h3>
                        <div className='loginInputs'>
                            <input
                                className='logininputclass'
                                type="text"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className='logininputclass'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button className="loginisterbutton" onClick={handleLogin}>Login</Button>
                            <p className='ToLoginBtn'>Don't have an account? <span className='lgnSpan' onClick={() => navigate('/register')}>  Register</span></p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>     
    );
};

export default Login;
