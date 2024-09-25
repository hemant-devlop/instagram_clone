import { Server } from "socket.io";
import express from "express";
import http from "http"
import { disconnect } from "process";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['get', 'post']
    }
})

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`userid is ${userId} and soketid is ${socket.id}`);
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    //when user offline
    socket.on('disconnect', () => {
        if (userId) {
            console.log('disconnected')
            console.log(`userid is ${userId} and soketid is ${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })

})


export { app, server, io }