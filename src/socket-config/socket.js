import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Use WebSocket for communication
});

// Log connection status
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

export default socket;
