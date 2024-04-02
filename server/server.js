const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Attach Socket.io to our server

const PORT = 3000;

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('New client connected');

  app.post('/api/button_press', (req, res) => {
    const { buttonNumber } = req.body;
    console.log(`Button pressed: ${buttonNumber}`);
    socket.emit('buttonPress', buttonNumber); // Emit an event to the client
    res.status(200).send('Button press received');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
