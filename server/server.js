const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');
const WebSocket = require('ws');
const vosk = require('vosk');
const { Model, KaldiRecognizer } = vosk;
const fs = require('fs');
const mic = require('mic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Allow requests from your React frontend
    methods: ["GET", "POST"] // Allow only GET and POST methods
  }
});

const wss = new WebSocket.Server({ noServer: true });
const modelPath = "./vosk-model-small-en-us-0.15";

// Load the Vosk model
let model = new Model(modelPath);
if (!model) {
  console.error("Model not found or failed to load. Please check the model path:", modelPath);
  process.exit(1);
} else {
  console.log("Model loaded successfully");
}
let recognizer;
let micInstance;

const setupMic = () => {
  micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false,
    device: 'default'
  });
};

const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for Express routes

app.post('/api/button_press', (req, res) => {
  const { buttonNumber } = req.body;
  console.log(`Button pressed: ${buttonNumber}`);
  io.emit('buttonPress', buttonNumber); // Emit an event to all connected clients with buttonNumber
  res.status(200).send('Button press received');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Upgrade HTTP server to WebSocket server to handle Vosk speech recognition
server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = new URL(request.url, `http://localhost:${PORT}`).pathname;

  if (pathname === '/speech') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const command = message.toString();

    if (command === 'start') {
      console.log('Starting recording');
      audioChunks = []; // Reset the audio buffer

      micInstance = mic({
        rate: '16000',
        channels: '1',
        debug: false,
        exitOnSilence: 6
      });

      const micInputStream = micInstance.getAudioStream();

      micInputStream.on('data', (data) => {
        audioChunks.push(data);
      });

      micInstance.start();
    } else if (command === 'stop' && micInstance) {
      console.log('Stopping recording');
      micInstance.stop();

      // Concatenate the audio chunks into a single Buffer
      const audioBuffer = Buffer.concat(audioChunks);

      // Initialize the Vosk recognizer
      const recognizer = new vosk.Recognizer({ model: model, sampleRate: 16000 });
      recognizer.acceptWaveform(audioBuffer);
      const result = recognizer.result();
      recognizer.free();

      // Send the transcription result back to the client
      ws.send(JSON.stringify(result));

      console.log('Transcription sent:', result.text);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (micInstance) {
      micInstance.stop();
      micInstance = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
