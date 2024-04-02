// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

function App() {
  const [buttonNumber, setButtonNumber] = useState('');

  useEffect(() => {
    socket.on('buttonPress', (number) => {
      setButtonNumber(number);
    });

    return () => socket.off('buttonPress');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Button Pressed: {buttonNumber}</p>
      </header>
    </div>
  );
}

export default App;
