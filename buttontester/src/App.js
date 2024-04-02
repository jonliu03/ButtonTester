import React, { useState } from 'react';
import Button from './Button';

const App = () => {
  const [buttonText, setButtonText] = useState('Button 1');

  // Function to handle button press request from Python script
  const handleButtonPress = async () => {
    try {
      const response = await fetch('/api/button_press');
      if (response.ok) {
        setButtonText('Button 1 Pressed');
      } else {
        throw new Error('Failed to process button press');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <Button onClick={handleButtonPress} buttonText={buttonText} />
    </div>
  );
};

export default App;
