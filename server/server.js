const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const players = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Initialize player state
    players[socket.id] = {
        id: socket.id,
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        vehicleType: 'hypercar', // Default
        vehicleColors: null, // Will be populated by client
        username: "",
        isPedestrian: false,
        pedestrianColors: null
    };

    // Send existing players to the new player
    socket.emit('currentPlayers', players);

    // Broadcast new player to others
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Handle player details update (colors, etc)
    socket.on('updatePlayerDetails', (data) => {
        if (players[socket.id]) {
            if (data.vehicleColors) players[socket.id].vehicleColors = data.vehicleColors;
            if (data.username !== undefined) players[socket.id].username = data.username;
            if (data.pedestrianColors) players[socket.id].pedestrianColors = data.pedestrianColors;

            // Broadcast update to others
            socket.broadcast.emit('playerDetailsUpdated', {
                id: socket.id,
                vehicleColors: players[socket.id].vehicleColors,
                username: players[socket.id].username,
                pedestrianColors: players[socket.id].pedestrianColors
            });
        }
    });

    // Handle player movement
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].z = movementData.z;
            players[socket.id].rotation = movementData.rotation;
            if (movementData.vehicleType) players[socket.id].vehicleType = movementData.vehicleType;
            if (movementData.isPedestrian !== undefined) players[socket.id].isPedestrian = movementData.isPedestrian;
            if (movementData.vehicleData) {
                players[socket.id].vehicleData = movementData.vehicleData;
            } else {
                players[socket.id].vehicleData = null;
            }

            // Broadcast movement to other players
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
const os = require('os');

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIpAddress();
    console.log(`Server running on port ${PORT}`);
    console.log(`- Local/LAN Access: http://${localIp}:${PORT}`);
    console.log(`- Internet Access:  http://YOUR_PUBLIC_IP:${PORT} (Requires Port Forwarding)`);
});
