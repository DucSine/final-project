const express = require('express')
const app = express()

const port = process.env.PORT||3000

app.use('/',(req,res)=> res.send('hello'))

app.listen(port, ()=>console.log(`run with http://localhost:${port}`))