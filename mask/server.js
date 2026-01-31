const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Specific routes for the game files (optional since express.static covers it, but ensures they are served)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/map.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'map.json'));
});

// Game state
const players = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Create a new player object
    players[socket.id] = {
        id: socket.id,
        x: 0,
        y: 100, // Start high like the local player
        z: 0,
        rotation: 0
    };

    // Send the current players to the new player
    socket.emit('currentPlayers', players);

    // Broadcast the new player to all other players
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Handle player movement updates
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].z = movementData.z;
            players[socket.id].rotation = movementData.rotation;

            // Broadcast the movement to all other players
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove player from the players object
        delete players[socket.id];
        // Emit a message to all players to remove this player
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to play.`);
});
