import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../ChatHistory/ChatHistory.css"

function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const email = localStorage.getItem('email'); // Assuming you have stored email in local storage
      try {
        const response = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dutuwkw/endpoint/FetchChatHistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.success) {
          setChatHistory(data.chatHistory);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <>
    <h3 className='ChatHistoryTitle'>Chat History</h3>
    <TableContainer component={Paper} className='ChatTable'>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="chat history table">
        <TableHead>
          <TableRow>
            <TableCell className='TitleX'>Input Sentence</TableCell >
            {chatHistory.length > 0 && chatHistory[0].payload.labels.map((label, index) => (
              <TableCell key={index} align="right" className='TitleX'>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className='DataX'>
          {chatHistory.map((chat, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" className='sentences'>
                {chat.inputSentence}
              </TableCell>
              {chat.payload.scores.map((score, index) => (
                <TableCell key={index} align="right" className='scores'>{(score * 100).toFixed(1)}%</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

export default ChatHistory;
