import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import "../Main/main.css";
import { Col, Row } from 'react-bootstrap';
import PieChart from '../Main/PieChart/PieChart';
import BarChart from './BarChart/BarChart';
import ContextAnalysis from './ContextAnalysis/ContextAnalysis';

const Main = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseLabels, setResponseLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    const THRESHOLDS = {
        'toxic': 0.5,
        'severe_toxic': 0.4,
        'obscene': 0.3,
        'threat': 0.3,
        'insult': 0.4,
        'identity_hate': 0.3
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            setLoading(true);
            try {
                const response = await axios.post("https://api-inference.huggingface.co/models/unitary/toxic-bert", {
                    inputs: inputValue,
                    sentence: inputValue
                }, {
                    headers: {
                        "Authorization": "Bearer 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"
                    }
                });

                const labels = response.data.flat().map(item => ({
                    label: item.label,
                    score: item.score
                }));

                localStorage.setItem('inputSentence', inputValue);
                localStorage.setItem('payload', JSON.stringify(labels));

                setResponseLabels(labels);
                setInputValue('');
                setIsAnalyzed(true);

                const email = localStorage.getItem('email'); 
                const payload = {
                    email: email,
                    inputSentence: inputValue,
                    payload: {
                        labels: labels.map(item => item.label),
                        scores: labels.map(item => item.score)
                    }
                };

                await axios.post("https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dutuwkw/endpoint/ChatHistory", payload);

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const noHateFound = responseLabels.every(label => label.score < THRESHOLDS[label.label]);

    return (
        <>
            <div className={`chat-container ${isAnalyzed ? 'analyzed' : ''}`}>
                <form onSubmit={handleSubmit} className="chat-form">
                    <Row>
                        <Col lg={12}>
                            <input
                                type="text"
                                className='BertInput'
                                placeholder="Ask for response here"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col lg={12}>
                            <button type="submit" className='sendBtn'>Analyze</button>
                        </Col>
                    </Row>
                </form>

                <Backdrop open={loading} style={{ color: '#fff', zIndex: 1000 }}>
                    <CircularProgress color="inherit" size={60} />
                </Backdrop>
            </div>

            {responseLabels.length > 0 && (
                <Row>
                    {noHateFound ? (
                        <Col lg={12} className="no-hate-message">
                            <h4 className='NoHateH4'>No hate speech detected in the given input by user.</h4>
                        </Col>
                    ) : (
                        <>
                            <Col lg={12} className={`ContextAnalysis ${responseLabels.length > 0 ? 'active' : ''}`}>
                                <ContextAnalysis data={responseLabels} thresholds={THRESHOLDS} />
                            </Col>
                            <Col lg={4} className={`ChartPie ${responseLabels.length > 0 ? 'active' : ''}`}>
                                <PieChart data={responseLabels} />
                            </Col>
                            <Col lg={4} className={`BarChart ${responseLabels.length > 0 ? 'active' : ''}`}>
                                <BarChart data={responseLabels} />
                            </Col>
                        </>
                    )}
                </Row>
            )}
        </>
    );
};

export default Main;
