const express = require('express');
const cryptoRoutes = require('./routes/cryptoRoute');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const cors = require('cors');
const server = express();

// middleware setup
server.use(express.json());

// cors setup :- Allow all origins with Default of cors(*)
server.use(cors());

// home route
server.get('/', (req,res) => {
    res.send('Welcome to Crypto currency converter app');
})

// API route setup
server.use('/crypto-api/v1', cryptoRoutes);

// Middleware setup for invalid route
server.use(notFound);

const portNo = process.env.PORT || 7272

server.listen(portNo, () => {
    console.log(`Server running on port: ${portNo}...`);
})

