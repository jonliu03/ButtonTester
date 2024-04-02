const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Allow requests from your React frontend
    methods: ["GET", "POST"] // Allow only GET and POST methods
  }
});

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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
