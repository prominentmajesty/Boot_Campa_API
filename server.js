const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// const logger = require('./middleware/logger');

//Route Files
const bootcamps = require('./routes/bootcamps');

//Load env vars
dotenv.config({path : './config/config.env'});

const app = express();

const PORT = process.env.PORT || 5001;

//Mount Routers
// app.use(logger);

//Dev Logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);