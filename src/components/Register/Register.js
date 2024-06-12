import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Register/Register.css";
import { Button, Col, Container, Row } from 'react-bootstrap';
import AlfaazLogo from "../../assets/icon.png";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const payload = { username, email, password };

        try {
            const response = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dutuwkw/endpoint/Register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                window.alert('User registered successfully');
                setUsername('');
                setEmail('');
                setPassword('');
                navigate('/login'); // Navigate to login page after successful registration
            } else {
                window.alert(`Registration failed: ${result.error}`);
            }
        } catch (error) {
            window.alert(`An error occurred: ${error.message}`);
        }
    };

    return (
        <section className='regSection'>
            <Container className='regContainer'>
                <Row>
                    <Col sm={12} className='imgColReg'>
                        <img src={AlfaazLogo} className='iconimg' alt="Alfaaz Logo"></img>
                    </Col>
                    <Col sm={12} className='RegInputCol'>
                        <h3 className='regh3'>Create your account</h3>
                        <div className='regInputs'>
                            <input
                                className='reginputclass'
                                type="text"
                                placeholder='Username'
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            ></input>

                            <input
                                className='reginputclass'
                                type="email"
                                placeholder='Email'
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>

                            <input
                                type="password"
                                className='reginputclass'
                                placeholder='Password'
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>

                            <Button className="registerbutton" onClick={handleRegister}>Register</Button>
                            <p className='ToLoginBtn'>Already have an account? <span className='lgnSpan' onClick={() => navigate('/login')}>Login</span></p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>     
    );
};

export default Register;
