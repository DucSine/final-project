const express = require('express')
const socketIo = require('socket.io')

const app = express()
const http = require('http')

const server = http.createServer(app);

const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const {decodeAuthToken} = require('../config/general')

const io = socketIo(server, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Has connection');
  var restaurant_id 
  socket.on('restaurantToken',(data)=>{
    console.log(data)
    var decode = decodeAuthToken(data)
    restaurant_id = decode.restaurant.id
    console.log(restaurant_id)
  })

  socket.on(
    'restaurantManagerJoin',
    async ({ restaurantManagerId }, callback) => {
      try {
        const restaurant = await Restaurant.findById(restaurantManagerId);
        if (!restaurant) throw new Error('Có lỗi xảy ra');
        console.log(`RestaurantManager joined ${restaurantManagerId}`);
        console.log(socket)
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

module.exports = { app, server, io }
