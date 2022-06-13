const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser')
const connectDB = require('./config/db');
//const errorHandler = require('./middleware/error');
var colors = require('colors');

// const logger = require('./middleware/logger');

// Mongoose JeoJSON
// If you want to get get coordinate(ie: longitude & latitude) of a client provided location, then google mongoose JeoJSON

// Vanessa Eustace: Search Engine Specialist
//https://www.linkedin.com/in/vanessa-eustace-700b40239/

//MongoDB Connection String for Compass
//mongodb+srv://majesty:<password>@dach.ixcx5.mongodb.net/test

//Load env vars
dotenv.config({path : './config/config.env'});

connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body Parser
app.use(express.json({extended : false}));
app.use(cookieParser());

//Dev Logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// File uploading..
app.use(fileUpload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5001;

//Mount Routers
// app.use(logger);

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
//app.use(errorHandler);

const server = app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    //Close Server & exit process
    server.close(() => process.exit(1));
})