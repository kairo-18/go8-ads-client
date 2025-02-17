import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // Use WebSocket for communication
});

export default socket;
