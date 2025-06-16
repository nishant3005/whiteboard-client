import { io } from 'socket.io-client';

const socket = io('https://whiteboard-server-425a.onrender.com');

export default socket;
