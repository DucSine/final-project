const express = require('express')
const socketIo = require('socket.io')

const app = express()
const http = require('http')

const server = http.createServer(app);

const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const {decodeAuthToken} = require('../config/general');
const Food = require('../models/Food');

const io = socketIo(server, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Has connection');

  socket.on(
    'ResManagementJoin',
    async ({ token }, callback) => {
      try {
        var decode = decodeAuthToken(token)
        var restaurantManagerId = decode.restaurant.id

        const restaurant = await Restaurant.findById(restaurantManagerId)
        if (!restaurant) throw new Error('Có lỗi xảy ra')
        console.log(`RestaurantManager joined ${restaurantManagerId}`)
        console.log('log id:' + socket.id)
        return socket.join(restaurantManagerId)
      } catch (error) {
        console.log(error)
        return callback(error.message)
      }
    },
  );

  socket.on(
    'UserJoin',
    async ( {token} , callback) => {
      try {
        console.log(token)
        var decode = decodeAuthToken(token)
        var userId = decode.user.id

        const user = await User.findById(userId)
        if (!user) throw new Error('Có lỗi xảy ra')
        console.log(`User joined ${userId}`)

        return socket.join(userId)
      } catch (error) {
        console.log(error)
        return callback(error.message)
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
