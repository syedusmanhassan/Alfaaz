// Sidebar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ChatIcon from '@mui/icons-material/Chat';
import logo from '../../assets/icon.png'; 
import "../Sidebar/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate(); 
    
  const handleLogout = () => {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      navigate('/login'); 
  }

    return (
        <div className="sidebar">
            <div className="wrapper">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image" />
                </div>
                <div className='OptionWrapper'>
                    <Link to="/voice" className="sidebar-link">Voice Analysis <RecordVoiceOverIcon className="sideBarIcon" /></Link>
                    <Link to="/" className="sidebar-link">Text Analysis <ChatIcon className="sideBarIcon" /></Link>
                    <Link to="/ChatHistory" className="sidebar-link">Chat History <HistoryIcon className="sideBarIcon" /></Link>
                </div>
                <div className='logout'>
                    <div className="sidebar-link" onClick={handleLogout}>Logout <LogoutIcon className="sideBarIcon" /></div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
