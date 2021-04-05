const express = require('express')
const app = express()

const port = 3000

app.use('/',(req,res)=> res.send('hello'))

app.listen(port, ()=>console.log(`run with http://localhost:${port}`))