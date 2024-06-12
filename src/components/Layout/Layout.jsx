// Layout.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import "../Layout/Layout.css";
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../Sidebar/sidebar';
import VocalAnalysis from '../Voice/VocalAnalysis';
import TextAnalysis from '../Main/main';
import ChatHistory from '../ChatHistory/ChatHistory';

const Layout = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg={2} className="colSidebar">
                    <Sidebar />
                </Col>

                <Col lg={10} className="colMain">
                    <Routes>
                        <Route path="/voice" element={<VocalAnalysis />} />
                        <Route path="/" element={<TextAnalysis />} />
                        <Route path="/ChatHistory" element={<ChatHistory/>}/>
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
