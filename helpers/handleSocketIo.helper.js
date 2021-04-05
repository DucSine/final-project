const express = require('express');
const socketIo = require('socket.io');

const app = express();
const http = require('http');

const server = http.createServer(app);

const Restaurant = require('../models/Restaurant');

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Has connection');

  socket.on(
    'restaurantManagerJoin',
    async ({ restaurantManagerId }, callback) => {
      try {
        const restaurant = await Restaurant.findById(restaurantManagerId);
        if (!restaurant) throw new Error('Có lỗi xảy ra');
        console.log(`RestaurantManager joined ${restaurantManagerId}`);
        return socket.join(restaurantManagerId);
      } catch (error) {
        console.log(error);
        return callback(error.message);
      }
    },
  );

  socket.on('adminJoin', ({ adminName }) => {
    socket.join(adminName);
  });

  socket.on('disconnect', () => {
    console.log('User has left');
  });
});

module.exports = { app, server, io };
