import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import WebSocketComponent from '../WebSocketComponent';

const Home = () => {
  const navigate = useNavigate();

  const handleRfidData = (rfid) => {
    fetch('http://localhost:8085/rfid/check-rfid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rfid }), 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          navigate('/'); 
        } else {
          alert('RFID ไม่ถูกต้อง');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <header>
      <WebSocketComponent onDataReceived={handleRfidData} />
      <h1>Scan your RFID</h1>
    </header>
  );
};

export default Home;
