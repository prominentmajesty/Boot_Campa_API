const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({path : './config/config.env'});

const app = express();

app.get('/', (req, res) => {
    res.send('<hi></h1>');
});

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);