import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { Col, Row } from 'react-bootstrap';
import PieChart from '../Main/PieChart/PieChart';
import BarChart from '../Main/BarChart/BarChart';
import ContextAnalysis from '../Main/ContextAnalysis/ContextAnalysis';
import MicIcon from '@mui/icons-material/Mic';
import "../Voice/VocalAnalysis.css";

const VocalAnalysis = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
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

    useEffect(() => {
        const storedInput = localStorage.getItem('inputSentence');
        if (storedInput) setInputValue(storedInput);
        
        const storedTranscript = localStorage.getItem('transcript');
        if (storedTranscript) setInputValue(storedTranscript);
    }, []);

    useEffect(() => {
        if (!listening) {
            setInputValue(transcript);
            localStorage.setItem('transcript', transcript);
        }
    }, [listening, transcript]);

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
        localStorage.setItem('transcript', transcript);
    };

    const handleSubmit = async () => {
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

                setResponseLabels(labels);
                setIsAnalyzed(true);
                localStorage.setItem('inputSentence', inputValue);
                localStorage.setItem('payload', JSON.stringify(labels));
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
                resetTranscript();
            }
        }
    };

    const handleClear = () => {
        localStorage.removeItem('inputSentence');
        localStorage.removeItem('payload');
        localStorage.removeItem('transcript');
        setInputValue('');
        setResponseLabels([]);
        setIsAnalyzed(false);
    };

    if (!browserSupportsSpeechRecognition) {
        return <div>Browser doesn't support speech recognition.</div>;
    }

    const noHateFound = responseLabels.every(label => label.score < THRESHOLDS[label.label]);

    return (
        <>
            <div className={`voice-analysis-container ${isAnalyzed ? 'analyzed' : ''}`}>
                <Row>
                    <Col lg={12} className='startVocal'>
                        <button className="recordBtn" onMouseDown={startListening} onMouseUp={stopListening}>
                            <MicIcon />
                        </button>
                        <input
                            className='speaktext'
                            placeholder="Speak here..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </Col>
                </Row>
              
                <Row>
                    <Col lg={12} className='AnalyzeCol'>
                        <button className="analyzeBtn" onClick={handleSubmit}>Analyze</button>
                        <button className="analyzeBtn" onClick={handleClear}>Clear</button>
                    </Col>    
                </Row>  

                <Backdrop open={loading} style={{ color: '#fff', zIndex: 1000 }}>
                    <CircularProgress color="inherit" size={60} />
                </Backdrop>
            </div>

            {responseLabels.length > 0 && (
                <Row>
                    {noHateFound ? (
                        <Col lg={12} className="no-hate-message">
                            <h4 className='NoHateH4'>No hate speech detected based on the provided thresholds.</h4>
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

export default VocalAnalysis;
